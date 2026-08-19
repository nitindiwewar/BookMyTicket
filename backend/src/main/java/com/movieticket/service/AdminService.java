package com.movieticket.service;

import com.movieticket.dto.AdminDTO;
import com.movieticket.entity.*;
import com.movieticket.exception.BadRequestException;
import com.movieticket.exception.ResourceNotFoundException;
import com.movieticket.repository.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final TheaterRepository theaterRepository;
    private final ShowRepository showRepository;
    private final BookingRepository bookingRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminService(UserRepository userRepository, MovieRepository movieRepository, TheaterRepository theaterRepository, ShowRepository showRepository, BookingRepository bookingRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.movieRepository = movieRepository;
        this.theaterRepository = theaterRepository;
        this.showRepository = showRepository;
        this.bookingRepository = bookingRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // --- Dashboard Overview Statistics ---
    public AdminDTO.AdminStatsResponse getAdminStats() {
        long totalUsers = userRepository.count();
        long totalBookings = bookingRepository.count();
        long totalMovies = movieRepository.count();
        long totalTheaters = theaterRepository.count();

        List<Booking> allBookings = bookingRepository.findAll();
        BigDecimal totalRevenue = allBookings.stream()
                .filter(b -> b.getStatus() == Booking.BookingStatus.CONFIRMED && b.getTotalAmount() != null)
                .map(Booking::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long activeUsers = userRepository.findAll().stream()
                .filter(u -> Boolean.TRUE.equals(u.getEmailVerified()) || Boolean.TRUE.equals(u.getMobileVerified()))
                .count();

        long confirmedBookings = allBookings.stream()
                .filter(b -> b.getStatus() == Booking.BookingStatus.CONFIRMED)
                .count();

        long cancelledBookings = allBookings.stream()
                .filter(b -> b.getStatus() == Booking.BookingStatus.CANCELLED)
                .count();

        return new AdminDTO.AdminStatsResponse(
                totalUsers,
                totalBookings,
                totalRevenue,
                activeUsers > 0 ? activeUsers : totalUsers,
                0, // pending
                confirmedBookings,
                cancelledBookings,
                totalMovies,
                totalTheaters
        );
    }

    // --- User Management ---
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public User createUser(AdminDTO.CreateUserRequest req) {
        if (userRepository.existsByEmail(req.getEmail().trim().toLowerCase())) {
            throw new BadRequestException("User email already exists: " + req.getEmail());
        }
        User.Role role = User.Role.ROLE_USER;
        if (req.getRole() != null && req.getRole().toUpperCase().contains("ADMIN")) {
            role = User.Role.ROLE_ADMIN;
        }

        User user = User.builder()
                .name(req.getName().trim())
                .email(req.getEmail().trim().toLowerCase())
                .password(passwordEncoder.encode(req.getPassword() != null && !req.getPassword().isEmpty() ? req.getPassword() : "DefaultPassword123"))
                .mobile(req.getMobile() != null ? req.getMobile().trim() : null)
                .countryCode("+91")
                .role(role)
                .emailVerified(req.getEmailVerified() != null ? req.getEmailVerified() : true)
                .mobileVerified(req.getMobileVerified() != null ? req.getMobileVerified() : false)
                .build();

        return userRepository.save(user);
    }

    @Transactional
    public User updateUserRole(Long userId, String roleName, String currentAdminEmail) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        if (user.getEmail().equalsIgnoreCase(currentAdminEmail) && roleName.equalsIgnoreCase("ROLE_USER")) {
            throw new BadRequestException("Safety protection: You cannot demote your own admin account.");
        }

        try {
            User.Role role = User.Role.valueOf(roleName.toUpperCase().startsWith("ROLE_") ? roleName.toUpperCase() : "ROLE_" + roleName.toUpperCase());
            user.setRole(role);
        } catch (Exception e) {
            throw new BadRequestException("Invalid role: " + roleName);
        }

        return userRepository.save(user);
    }

    @Transactional
    public User updateUserVerification(Long userId, AdminDTO.UpdateUserVerificationRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        if (req.getEmailVerified() != null) user.setEmailVerified(req.getEmailVerified());
        if (req.getMobileVerified() != null) user.setMobileVerified(req.getMobileVerified());

        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long userId, String currentAdminEmail) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        if (user.getEmail().equalsIgnoreCase(currentAdminEmail)) {
            throw new BadRequestException("Safety protection: You cannot delete your own admin account.");
        }

        userRepository.deleteById(userId);
    }

    // --- Movies Management ---
    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    @Transactional
    public Movie createMovie(AdminDTO.CreateMovieRequest req) {
        String movieId = (req.getId() != null && !req.getId().trim().isEmpty()) 
                ? req.getId().trim() 
                : "movie-" + System.currentTimeMillis();

        Movie movie = Movie.builder()
                .id(movieId)
                .title(req.getTitle().trim())
                .synopsis(req.getSynopsis())
                .posterUrl(req.getPosterUrl())
                .backdropUrl(req.getBackdropUrl())
                .trailerUrl(req.getTrailerUrl())
                .runtimeMins(req.getRuntimeMins() != null ? req.getRuntimeMins() : 120)
                .rating(req.getRating() != null ? req.getRating() : 8.5)
                .certification(req.getCertification() != null ? req.getCertification() : "U/A")
                .language(req.getLanguage() != null ? req.getLanguage() : "Hindi")
                .genre(req.getGenres() != null ? new HashSet<>(req.getGenres()) : new HashSet<>())
                .format(req.getFormat() != null ? new HashSet<>(req.getFormat()) : new HashSet<>())
                .cast(req.getCast() != null ? req.getCast() : new ArrayList<>())
                .crew(req.getCrew() != null ? req.getCrew() : new ArrayList<>())
                .build();

        return movieRepository.save(movie);
    }

    @Transactional
    public Movie updateMovie(String id, AdminDTO.CreateMovieRequest req) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found: " + id));

        if (req.getTitle() != null) movie.setTitle(req.getTitle().trim());
        if (req.getSynopsis() != null) movie.setSynopsis(req.getSynopsis());
        if (req.getPosterUrl() != null) movie.setPosterUrl(req.getPosterUrl());
        if (req.getBackdropUrl() != null) movie.setBackdropUrl(req.getBackdropUrl());
        if (req.getTrailerUrl() != null) movie.setTrailerUrl(req.getTrailerUrl());
        if (req.getRuntimeMins() != null) movie.setRuntimeMins(req.getRuntimeMins());
        if (req.getRating() != null) movie.setRating(req.getRating());
        if (req.getCertification() != null) movie.setCertification(req.getCertification());
        if (req.getLanguage() != null) movie.setLanguage(req.getLanguage());
        if (req.getGenres() != null) movie.setGenre(new HashSet<>(req.getGenres()));
        if (req.getFormat() != null) movie.setFormat(new HashSet<>(req.getFormat()));
        if (req.getCast() != null) movie.setCast(req.getCast());
        if (req.getCrew() != null) movie.setCrew(req.getCrew());

        return movieRepository.save(movie);
    }

    @Transactional
    public void deleteMovie(String id) {
        if (!movieRepository.existsById(id)) {
            throw new ResourceNotFoundException("Movie not found: " + id);
        }
        movieRepository.deleteById(id);
    }

    // --- Theaters Management ---
    public List<Theater> getAllTheaters() {
        return theaterRepository.findAll();
    }

    @Transactional
    public Theater createTheater(AdminDTO.CreateTheaterRequest req) {
        String theaterId = (req.getId() != null && !req.getId().trim().isEmpty())
                ? req.getId().trim()
                : "theater-" + System.currentTimeMillis();

        Theater theater = Theater.builder()
                .id(theaterId)
                .name(req.getName().trim())
                .city(req.getCity().trim())
                .area(req.getArea())
                .latitude(req.getLatitude() != null ? req.getLatitude() : 19.076)
                .longitude(req.getLongitude() != null ? req.getLongitude() : 72.877)
                .facilities(req.getFacilities() != null ? req.getFacilities() : new ArrayList<>())
                .build();

        return theaterRepository.save(theater);
    }

    @Transactional
    public Theater updateTheater(String id, AdminDTO.CreateTheaterRequest req) {
        Theater theater = theaterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Theater not found: " + id));

        if (req.getName() != null) theater.setName(req.getName().trim());
        if (req.getCity() != null) theater.setCity(req.getCity().trim());
        if (req.getArea() != null) theater.setArea(req.getArea());
        if (req.getLatitude() != null) theater.setLatitude(req.getLatitude());
        if (req.getLongitude() != null) theater.setLongitude(req.getLongitude());
        if (req.getFacilities() != null) theater.setFacilities(req.getFacilities());

        return theaterRepository.save(theater);
    }

    @Transactional
    public void deleteTheater(String id) {
        if (!theaterRepository.existsById(id)) {
            throw new ResourceNotFoundException("Theater not found: " + id);
        }
        theaterRepository.deleteById(id);
    }

    // --- Showtimes Management ---
    public List<Show> getAllShows() {
        return showRepository.findAll();
    }

    @Transactional
    public Show createShow(AdminDTO.CreateShowRequest req) {
        Movie movie = movieRepository.findById(req.getMovieId())
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found: " + req.getMovieId()));
        Theater theater = theaterRepository.findById(req.getTheaterId())
                .orElseThrow(() -> new ResourceNotFoundException("Theater not found: " + req.getTheaterId()));

        String showId = (req.getId() != null && !req.getId().trim().isEmpty())
                ? req.getId().trim()
                : "show-" + System.currentTimeMillis();

        Show show = Show.builder()
                .id(showId)
                .movie(movie)
                .theater(theater)
                .date(req.getDate() != null ? req.getDate() : java.time.LocalDate.now())
                .time(req.getTime() != null ? req.getTime() : "19:30")
                .basePrice(req.getBasePrice() != null ? req.getBasePrice() : new BigDecimal("250.00"))
                .build();

        return showRepository.save(show);
    }

    @Transactional
    public Show updateShow(String id, AdminDTO.CreateShowRequest req) {
        Show show = showRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Showtime not found: " + id));

        if (req.getMovieId() != null) {
            Movie movie = movieRepository.findById(req.getMovieId())
                    .orElseThrow(() -> new ResourceNotFoundException("Movie not found: " + req.getMovieId()));
            show.setMovie(movie);
        }
        if (req.getTheaterId() != null) {
            Theater theater = theaterRepository.findById(req.getTheaterId())
                    .orElseThrow(() -> new ResourceNotFoundException("Theater not found: " + req.getTheaterId()));
            show.setTheater(theater);
        }
        if (req.getDate() != null) show.setDate(req.getDate());
        if (req.getTime() != null) show.setTime(req.getTime());
        if (req.getBasePrice() != null) show.setBasePrice(req.getBasePrice());

        return showRepository.save(show);
    }

    @Transactional
    public void deleteShow(String id) {
        if (!showRepository.existsById(id)) {
            throw new ResourceNotFoundException("Showtime not found: " + id);
        }
        showRepository.deleteById(id);
    }

    // --- Bookings Management ---
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Transactional
    public Booking createSampleBooking() {
        User user = userRepository.findAll().stream().findFirst().orElse(null);
        Show show = showRepository.findAll().stream().findFirst().orElse(null);

        Booking booking = Booking.builder()
                .bookingCode("BMS-" + (100000 + (int)(Math.random() * 899999)))
                .user(user)
                .customerEmail(user != null ? user.getEmail() : "nitindiwewar0@gmail.com")
                .customerPhone(user != null ? user.getMobile() : "9876543210")
                .show(show)
                .seatNumbers("E4, E5")
                .ticketAmount(BigDecimal.valueOf(400))
                .snackAmount(BigDecimal.valueOf(150))
                .totalAmount(BigDecimal.valueOf(550))
                .status(Booking.BookingStatus.CONFIRMED)
                .paymentStatus("SUCCESS")
                .paymentMethod("UPI / GPay")
                .razorpayPaymentId("pay_DB" + System.currentTimeMillis())
                .build();

        return bookingRepository.save(booking);
    }

    @Transactional
    public Booking updateBookingStatus(Long bookingId, String status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + bookingId));

        if (status.equalsIgnoreCase("CANCELLED")) {
            booking.setStatus(Booking.BookingStatus.CANCELLED);
            booking.setPaymentStatus("REFUNDED");
        } else {
            booking.setStatus(Booking.BookingStatus.CONFIRMED);
            booking.setPaymentStatus("SUCCESS");
        }

        return bookingRepository.save(booking);
    }

    @Transactional
    public void deleteBooking(Long bookingId) {
        if (!bookingRepository.existsById(bookingId)) {
            throw new ResourceNotFoundException("Booking not found: " + bookingId);
        }
        bookingRepository.deleteById(bookingId);
    }

    // --- Analytics ---
    public Map<String, Object> getAnalyticsData() {
        List<Booking> bookings = bookingRepository.findAll();

        Map<String, BigDecimal> monthlyRevenue = new LinkedHashMap<>();
        Map<String, Long> bookingStatusMap = new HashMap<>();
        Map<String, Long> movieBookingsMap = new HashMap<>();

        for (Booking b : bookings) {
            String month = b.getCreatedAt() != null ? b.getCreatedAt().getMonth().name() : "CURRENT";
            BigDecimal amt = b.getTotalAmount() != null ? b.getTotalAmount() : BigDecimal.ZERO;

            if (b.getStatus() == Booking.BookingStatus.CONFIRMED) {
                monthlyRevenue.put(month, monthlyRevenue.getOrDefault(month, BigDecimal.ZERO).add(amt));
            }

            String st = b.getStatus() != null ? b.getStatus().name() : "CONFIRMED";
            bookingStatusMap.put(st, bookingStatusMap.getOrDefault(st, 0L) + 1);

            String movieTitle = (b.getShow() != null && b.getShow().getMovie() != null) ? b.getShow().getMovie().getTitle() : "Unknown Movie";
            movieBookingsMap.put(movieTitle, movieBookingsMap.getOrDefault(movieTitle, 0L) + 1);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("monthlyRevenue", monthlyRevenue);
        result.put("bookingStatusDistribution", bookingStatusMap);
        result.put("popularMovies", movieBookingsMap);
        result.put("totalUsersCount", userRepository.count());
        result.put("totalBookingsCount", bookings.size());
        return result;
    }
}
