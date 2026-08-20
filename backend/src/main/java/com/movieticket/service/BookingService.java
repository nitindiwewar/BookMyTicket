package com.movieticket.service;

import com.movieticket.dto.BookingRequestDTO;
import com.movieticket.dto.BookingResponseDTO;
import com.movieticket.dto.CouponValidationDTO;
import com.movieticket.entity.*;
import com.movieticket.exception.BadRequestException;
import com.movieticket.exception.ResourceNotFoundException;
import com.movieticket.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ShowRepository showRepository;
    private final ShowSeatRepository showSeatRepository;
    private final SnackRepository snackRepository;
    private final UserRepository userRepository;
    private final CouponService couponService;
    private final RazorpayService razorpayService;
    private final ShowService showService;

    public BookingService(BookingRepository bookingRepository, ShowRepository showRepository, ShowSeatRepository showSeatRepository, SnackRepository snackRepository, UserRepository userRepository, CouponService couponService, RazorpayService razorpayService, ShowService showService) {
        this.bookingRepository = bookingRepository;
        this.showRepository = showRepository;
        this.showSeatRepository = showSeatRepository;
        this.snackRepository = snackRepository;
        this.userRepository = userRepository;
        this.couponService = couponService;
        this.razorpayService = razorpayService;
        this.showService = showService;
    }



    @Transactional
    public BookingResponseDTO createBooking(BookingRequestDTO request, String userEmail) {
        // Enforce strict payment verification for Razorpay payment method
        if ("RAZORPAY".equalsIgnoreCase(request.getPaymentMethod()) || request.getRazorpayPaymentId() != null) {
            if (request.getRazorpayOrderId() == null || request.getRazorpayPaymentId() == null || request.getRazorpaySignature() == null) {
                throw new BadRequestException("Razorpay payment details missing. Payment verification required before booking.");
            }
            boolean isValidSignature = razorpayService.verifyPaymentSignature(
                    request.getRazorpayOrderId(),
                    request.getRazorpayPaymentId(),
                    request.getRazorpaySignature()
            );
            if (!isValidSignature) {
                throw new BadRequestException("Payment verification failed! Invalid Razorpay signature.");
            }
        }

        Show show = showService.getOrCreateShow(
                request.getShowId(),
                request.getMovieId(),
                request.getTheaterId(),
                request.getShowDate(),
                request.getShowTime()
        );


        User user = null;
        if (userEmail != null) {
            user = userRepository.findFirstByEmailOrderByCreatedAtDesc(userEmail).orElse(null);
        }
        if (user == null && request.getCustomerEmail() != null && !request.getCustomerEmail().isEmpty()) {
            user = userRepository.findFirstByEmailOrderByCreatedAtDesc(request.getCustomerEmail()).orElse(null);
        }
        if (user == null && request.getCustomerPhone() != null && !request.getCustomerPhone().isEmpty()) {
            user = userRepository.findFirstByMobileOrderByCreatedAtDesc(request.getCustomerPhone()).orElse(null);
        }



        // Validate seats availability
        List<String> requestedSeatNums = request.getSeats();
        List<ShowSeat> showSeats = showSeatRepository.findByShowIdAndSeatNumberIn(show.getId(), requestedSeatNums);

        // Auto initialize seats if missing in DB
        if (showSeats.size() < requestedSeatNums.size()) {
            // trigger show seat generation
            List<ShowSeat> allSeats = showSeatRepository.findByShowId(show.getId());
            if (allSeats.isEmpty()) {
                showService.initializeSeatsForShow(show);
                showSeats = showSeatRepository.findByShowIdAndSeatNumberIn(show.getId(), requestedSeatNums);
            }
        }

        for (ShowSeat seat : showSeats) {
            if (seat.getStatus() == ShowSeat.SeatStatus.BOOKED) {
                throw new BadRequestException("Seat " + seat.getSeatNumber() + " is already booked.");
            }
        }

        // Calculate Ticket Price
        BigDecimal ticketPricePerSeat = show.getBasePrice() != null ? show.getBasePrice() : BigDecimal.valueOf(300);
        BigDecimal ticketAmount = ticketPricePerSeat.multiply(BigDecimal.valueOf(requestedSeatNums.size()));

        // Calculate Snack Price
        BigDecimal snackAmount = BigDecimal.ZERO;
        List<BookingSnack> bookingSnacks = new ArrayList<>();
        
        if (request.getSnacks() != null && !request.getSnacks().isEmpty()) {
            for (Map.Entry<String, Integer> entry : request.getSnacks().entrySet()) {
                String snackId = entry.getKey();
                Integer qty = entry.getValue();
                if (qty != null && qty > 0) {
                    Snack snack = snackRepository.findById(snackId)
                            .orElseThrow(() -> new ResourceNotFoundException("Snack not found: " + snackId));
                    BigDecimal itemTotal = snack.getPrice().multiply(BigDecimal.valueOf(qty));
                    snackAmount = snackAmount.add(itemTotal);

                    bookingSnacks.add(BookingSnack.builder()
                            .snack(snack)
                            .quantity(qty)
                            .unitPrice(snack.getPrice())
                            .build());
                }
            }
        }

        // Calculate Convenience Fee (6% of subtotal)
        BigDecimal subtotal = ticketAmount.add(snackAmount);
        BigDecimal convenienceFee = subtotal.multiply(BigDecimal.valueOf(0.06)).setScale(2, RoundingMode.HALF_UP);

        // Apply Coupon
        BigDecimal discountAmount = BigDecimal.ZERO;
        if (request.getCoupon() != null && !request.getCoupon().trim().isEmpty()) {
            CouponValidationDTO.Response couponResp = couponService.validateCoupon(request.getCoupon(), subtotal);
            if (couponResp.isValid()) {
                discountAmount = couponResp.getDiscountAmount();
            }
        }

        BigDecimal totalAmount = subtotal.add(convenienceFee).subtract(discountAmount);
        if (totalAmount.compareTo(BigDecimal.ZERO) < 0) {
            totalAmount = BigDecimal.ZERO;
        }

        // Generate unique booking code
        String bookingCode = "BMS-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        String txnId = request.getPaymentTransactionId() != null ? request.getPaymentTransactionId()
                : (request.getRazorpayPaymentId() != null ? request.getRazorpayPaymentId() : "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());

        Booking booking = Booking.builder()
                .bookingCode(bookingCode)
                .user(user)
                .customerEmail(request.getCustomerEmail() != null ? request.getCustomerEmail() : (user != null ? user.getEmail() : "guest@example.com"))
                .customerPhone(request.getCustomerPhone() != null ? request.getCustomerPhone() : (user != null ? user.getMobile() : "9876543210"))
                .show(show)
                .seatNumbers(String.join(", ", requestedSeatNums))
                .seatTier(request.getSeatTier() != null ? request.getSeatTier() : "Premium")
                .totalSeats(requestedSeatNums.size())
                .ticketAmount(ticketAmount)
                .snackAmount(snackAmount)
                .discountAmount(discountAmount)
                .convenienceFee(convenienceFee)
                .totalAmount(totalAmount)
                .paymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "UPI")
                .paymentTransactionId(txnId)
                .paymentStatus(request.getPaymentStatus() != null ? request.getPaymentStatus() : "SUCCESS")
                .paymentDetails(request.getPaymentDetails() != null ? request.getPaymentDetails() : "Verified Digital Payment")
                .paidAt(java.time.LocalDateTime.now())
                .couponCode(request.getCoupon())
                .status(Booking.BookingStatus.CONFIRMED)
                .build();

        booking.setRazorpayOrderId(request.getRazorpayOrderId());
        booking.setRazorpayPaymentId(request.getRazorpayPaymentId());
        booking.setRazorpaySignature(request.getRazorpaySignature());


        for (BookingSnack bs : bookingSnacks) {
            bs.setBooking(booking);
        }
        booking.setSnacks(bookingSnacks);

        // Mark seats as BOOKED
        for (ShowSeat seat : showSeats) {
            seat.setStatus(ShowSeat.SeatStatus.BOOKED);
        }
        showSeatRepository.saveAll(showSeats);

        Booking savedBooking = bookingRepository.save(booking);
        return mapToResponse(savedBooking);
    }

    public BookingResponseDTO getBookingByCodeOrId(String identifier) {
        Booking booking;
        try {
            Long id = Long.parseLong(identifier);
            booking = bookingRepository.findById(id)
                    .orElseGet(() -> bookingRepository.findByBookingCode(identifier)
                            .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + identifier)));
        } catch (NumberFormatException e) {
            booking = bookingRepository.findByBookingCode(identifier)
                    .orElseThrow(() -> new ResourceNotFoundException("Booking not found with code: " + identifier));
        }
        return mapToResponse(booking);
    }

    public List<BookingResponseDTO> getUserBookings(String userEmailOrPhone) {
        if (userEmailOrPhone == null || userEmailOrPhone.trim().isEmpty()) {
            return Collections.emptyList();
        }
        String query = userEmailOrPhone.trim();
        List<Booking> bookings = bookingRepository.findByCustomerEmailOrCustomerPhoneOrderByCreatedAtDesc(query, query);
        if (bookings.isEmpty()) {
            User user = userRepository.findFirstByEmailOrderByCreatedAtDesc(query)
                    .orElseGet(() -> userRepository.findFirstByMobileOrderByCreatedAtDesc(query).orElse(null));
            if (user != null) {
                bookings = bookingRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
            }
        }
        return bookings.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private BookingResponseDTO mapToResponse(Booking b) {
        List<String> seatList = Arrays.stream(b.getSeatNumbers().split(","))
                .map(String::trim)
                .collect(Collectors.toList());

        List<BookingResponseDTO.SnackSummary> snackSummaries = b.getSnacks().stream()
                .map(s -> BookingResponseDTO.SnackSummary.builder()
                        .id(s.getSnack().getId())
                        .name(s.getSnack().getName())
                        .quantity(s.getQuantity())
                        .unitPrice(s.getUnitPrice())
                        .totalPrice(s.getUnitPrice().multiply(BigDecimal.valueOf(s.getQuantity())))
                        .build())
                .collect(Collectors.toList());

        String qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" + b.getBookingCode();

        return BookingResponseDTO.builder()
                .bookingId(b.getId())
                .bookingCode(b.getBookingCode())
                .movieTitle(b.getShow().getMovie().getTitle())
                .moviePoster(b.getShow().getMovie().getPosterUrl())
                .theaterName(b.getShow().getTheater().getName())
                .theaterArea(b.getShow().getTheater().getArea())
                .showDate(b.getShow().getDate().toString())
                .showTime(b.getShow().getTime())
                .seats(seatList)
                .seatTier(b.getSeatTier())
                .totalSeats(b.getTotalSeats())
                .ticketAmount(b.getTicketAmount())
                .snackAmount(b.getSnackAmount())
                .discountAmount(b.getDiscountAmount())
                .convenienceFee(b.getConvenienceFee())
                .totalAmount(b.getTotalAmount())
                .paymentMethod(b.getPaymentMethod())
                .status(b.getStatus().name())
                .qrCodeUrl(qrCodeUrl)
                .createdAt(b.getCreatedAt())
                .snacks(snackSummaries)
                .build();
    }

}
