package com.movieticket.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class BookingResponseDTO {

    private Long bookingId;
    private String bookingCode;
    private String movieTitle;
    private String moviePoster;
    private String theaterName;
    private String theaterArea;
    private String showDate;
    private String showTime;
    private List<String> seats;
    private String seatTier;
    private Integer totalSeats;

    private BigDecimal ticketAmount;
    private BigDecimal snackAmount;
    private BigDecimal discountAmount;
    private BigDecimal convenienceFee;
    private BigDecimal totalAmount;

    private String paymentMethod;
    private String status;
    private String qrCodeUrl;
    private LocalDateTime createdAt;
    private List<SnackSummary> snacks;


    public BookingResponseDTO() {}

    public BookingResponseDTO(Long bookingId, String bookingCode, String movieTitle, String moviePoster, String theaterName, String theaterArea, String showDate, String showTime, List<String> seats, String seatTier, Integer totalSeats, BigDecimal ticketAmount, BigDecimal snackAmount, BigDecimal discountAmount, BigDecimal convenienceFee, BigDecimal totalAmount, String paymentMethod, String status, LocalDateTime createdAt, List<SnackSummary> snacks) {
        this.bookingId = bookingId;
        this.bookingCode = bookingCode;
        this.movieTitle = movieTitle;
        this.moviePoster = moviePoster;
        this.theaterName = theaterName;
        this.theaterArea = theaterArea;
        this.showDate = showDate;
        this.showTime = showTime;
        this.seats = seats;
        this.seatTier = seatTier;
        this.totalSeats = totalSeats;
        this.ticketAmount = ticketAmount;
        this.snackAmount = snackAmount;
        this.discountAmount = discountAmount;
        this.convenienceFee = convenienceFee;
        this.totalAmount = totalAmount;
        this.paymentMethod = paymentMethod;
        this.status = status;
        this.createdAt = createdAt;
        this.snacks = snacks;
    }

    public static class SnackSummary {
        private String id;
        private String name;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal totalPrice;

        public SnackSummary() {}

        public SnackSummary(String id, String name, Integer quantity, BigDecimal unitPrice, BigDecimal totalPrice) {
            this.id = id;
            this.name = name;
            this.quantity = quantity;
            this.unitPrice = unitPrice;
            this.totalPrice = totalPrice;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }

        public BigDecimal getUnitPrice() { return unitPrice; }
        public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

        public BigDecimal getTotalPrice() { return totalPrice; }
        public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }

        public static SnackSummaryBuilder builder() { return new SnackSummaryBuilder(); }

        public static class SnackSummaryBuilder {
            private String id;
            private String name;
            private Integer quantity;
            private BigDecimal unitPrice;
            private BigDecimal totalPrice;

            public SnackSummaryBuilder id(String id) { this.id = id; return this; }
            public SnackSummaryBuilder name(String name) { this.name = name; return this; }
            public SnackSummaryBuilder quantity(Integer quantity) { this.quantity = quantity; return this; }
            public SnackSummaryBuilder unitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; return this; }
            public SnackSummaryBuilder totalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; return this; }

            public SnackSummary build() {
                return new SnackSummary(id, name, quantity, unitPrice, totalPrice);
            }
        }
    }

    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public String getBookingCode() { return bookingCode; }
    public void setBookingCode(String bookingCode) { this.bookingCode = bookingCode; }

    public String getMovieTitle() { return movieTitle; }
    public void setMovieTitle(String movieTitle) { this.movieTitle = movieTitle; }

    public String getMoviePoster() { return moviePoster; }
    public void setMoviePoster(String moviePoster) { this.moviePoster = moviePoster; }

    public String getTheaterName() { return theaterName; }
    public void setTheaterName(String theaterName) { this.theaterName = theaterName; }

    public String getTheaterArea() { return theaterArea; }
    public void setTheaterArea(String theaterArea) { this.theaterArea = theaterArea; }

    public String getShowDate() { return showDate; }
    public void setShowDate(String showDate) { this.showDate = showDate; }

    public String getShowTime() { return showTime; }
    public void setShowTime(String showTime) { this.showTime = showTime; }

    public List<String> getSeats() { return seats; }
    public void setSeats(List<String> seats) { this.seats = seats; }

    public String getSeatTier() { return seatTier; }
    public void setSeatTier(String seatTier) { this.seatTier = seatTier; }

    public Integer getTotalSeats() { return totalSeats; }
    public void setTotalSeats(Integer totalSeats) { this.totalSeats = totalSeats; }

    public BigDecimal getTicketAmount() { return ticketAmount; }
    public void setTicketAmount(BigDecimal ticketAmount) { this.ticketAmount = ticketAmount; }

    public BigDecimal getSnackAmount() { return snackAmount; }
    public void setSnackAmount(BigDecimal snackAmount) { this.snackAmount = snackAmount; }

    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }

    public BigDecimal getConvenienceFee() { return convenienceFee; }
    public void setConvenienceFee(BigDecimal convenienceFee) { this.convenienceFee = convenienceFee; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getQrCodeUrl() { return qrCodeUrl; }
    public void setQrCodeUrl(String qrCodeUrl) { this.qrCodeUrl = qrCodeUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<SnackSummary> getSnacks() { return snacks; }
    public void setSnacks(List<SnackSummary> snacks) { this.snacks = snacks; }

    public static BookingResponseDTOBuilder builder() { return new BookingResponseDTOBuilder(); }

    public static class BookingResponseDTOBuilder {
        private Long bookingId;
        private String bookingCode;
        private String movieTitle;
        private String moviePoster;
        private String theaterName;
        private String theaterArea;
        private String showDate;
        private String showTime;
        private List<String> seats;
        private String seatTier;
        private Integer totalSeats;
        private BigDecimal ticketAmount;
        private BigDecimal snackAmount;
        private BigDecimal discountAmount;
        private BigDecimal convenienceFee;
        private BigDecimal totalAmount;
        private String paymentMethod;
        private String status;
        private String qrCodeUrl;
        private LocalDateTime createdAt;
        private List<SnackSummary> snacks;

        public BookingResponseDTOBuilder bookingId(Long bookingId) { this.bookingId = bookingId; return this; }
        public BookingResponseDTOBuilder bookingCode(String bookingCode) { this.bookingCode = bookingCode; return this; }
        public BookingResponseDTOBuilder movieTitle(String movieTitle) { this.movieTitle = movieTitle; return this; }
        public BookingResponseDTOBuilder moviePoster(String moviePoster) { this.moviePoster = moviePoster; return this; }
        public BookingResponseDTOBuilder theaterName(String theaterName) { this.theaterName = theaterName; return this; }
        public BookingResponseDTOBuilder theaterArea(String theaterArea) { this.theaterArea = theaterArea; return this; }
        public BookingResponseDTOBuilder showDate(String showDate) { this.showDate = showDate; return this; }
        public BookingResponseDTOBuilder showTime(String showTime) { this.showTime = showTime; return this; }
        public BookingResponseDTOBuilder seats(List<String> seats) { this.seats = seats; return this; }
        public BookingResponseDTOBuilder seatTier(String seatTier) { this.seatTier = seatTier; return this; }
        public BookingResponseDTOBuilder totalSeats(Integer totalSeats) { this.totalSeats = totalSeats; return this; }
        public BookingResponseDTOBuilder ticketAmount(BigDecimal ticketAmount) { this.ticketAmount = ticketAmount; return this; }
        public BookingResponseDTOBuilder snackAmount(BigDecimal snackAmount) { this.snackAmount = snackAmount; return this; }
        public BookingResponseDTOBuilder discountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; return this; }
        public BookingResponseDTOBuilder convenienceFee(BigDecimal convenienceFee) { this.convenienceFee = convenienceFee; return this; }
        public BookingResponseDTOBuilder totalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; return this; }
        public BookingResponseDTOBuilder paymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; return this; }
        public BookingResponseDTOBuilder status(String status) { this.status = status; return this; }
        public BookingResponseDTOBuilder qrCodeUrl(String qrCodeUrl) { this.qrCodeUrl = qrCodeUrl; return this; }
        public BookingResponseDTOBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public BookingResponseDTOBuilder snacks(List<SnackSummary> snacks) { this.snacks = snacks; return this; }

        public BookingResponseDTO build() {
            BookingResponseDTO dto = new BookingResponseDTO(bookingId, bookingCode, movieTitle, moviePoster, theaterName, theaterArea, showDate, showTime, seats, seatTier, totalSeats, ticketAmount, snackAmount, discountAmount, convenienceFee, totalAmount, paymentMethod, status, createdAt, snacks);
            dto.setQrCodeUrl(qrCodeUrl);
            return dto;
        }
    }

}
