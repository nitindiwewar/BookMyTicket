package com.movieticket.service;

import com.movieticket.entity.*;
import com.movieticket.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final ShowRepository showRepository;
    private final ShowSeatRepository showSeatRepository;
    private final BookingRepository bookingRepository;
    private final SnackRepository snackRepository;
    private final CouponRepository couponRepository;
    private final PasswordEncoder passwordEncoder;
    private final TmdbService tmdbService;

    public DataSeeder(UserRepository userRepository, MovieRepository movieRepository, ShowRepository showRepository, ShowSeatRepository showSeatRepository, BookingRepository bookingRepository, SnackRepository snackRepository, CouponRepository couponRepository, PasswordEncoder passwordEncoder, TmdbService tmdbService) {
        this.userRepository = userRepository;
        this.movieRepository = movieRepository;
        this.showRepository = showRepository;
        this.showSeatRepository = showSeatRepository;
        this.bookingRepository = bookingRepository;
        this.snackRepository = snackRepository;
        this.couponRepository = couponRepository;
        this.passwordEncoder = passwordEncoder;
        this.tmdbService = tmdbService;
    }

    @Override
    public void run(String... args) throws Exception {
        seedUsers();
        seedMovies();
        seedSnacks();
        seedCoupons();
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            User demoUser = User.builder()
                    .name("Aarav Sharma")
                    .email("aarav@example.com")
                    .password(passwordEncoder.encode("password123"))
                    .mobile("9876543210")
                    .countryCode("+91")
                    .role(User.Role.ROLE_USER)
                    .build();

            User adminUser = User.builder()
                    .name("Admin User")
                    .email("admin@movieticket.com")
                    .password(passwordEncoder.encode("admin123"))
                    .mobile("9999988888")
                    .countryCode("+91")
                    .role(User.Role.ROLE_ADMIN)
                    .build();

            userRepository.saveAll(List.of(demoUser, adminUser));
        }
    }

    private void seedMovies() {
        List<Movie> existing = movieRepository.findAll();
        boolean hasOldMockMovies = existing.stream().anyMatch(m -> !m.getId().startsWith("tmdb-"));
        if (hasOldMockMovies || existing.size() < 20) {
            try {
                bookingRepository.deleteAll();
                showSeatRepository.deleteAll();
                showRepository.deleteAll();
                movieRepository.deleteAll();
            } catch (Exception e) {
                System.err.println("Database cleanup warning: " + e.getMessage());
            }
        }

        if (movieRepository.count() == 0) {
            tmdbService.syncPopularMovies();
        }
    }

    private void seedSnacks() {
        if (snackRepository.count() == 0) {
            List<Snack> snacks = List.of(
                    Snack.builder().name("Salted Popcorn (Large)").category("POPCORN").price(BigDecimal.valueOf(280)).calories("450 kcal").description("Classic salted crunchy popcorn").build(),
                    Snack.builder().name("Cheese Popcorn (Jumbo)").category("POPCORN").price(BigDecimal.valueOf(320)).calories("580 kcal").description("Loaded with cheddar cheese powder").build(),
                    Snack.builder().name("Pepsi (750ml)").category("BEVERAGES").price(BigDecimal.valueOf(180)).calories("210 kcal").description("Chilled carbonated soft drink").build(),
                    Snack.builder().name("Nachos with Salsa & Cheese").category("COMBO").price(BigDecimal.valueOf(340)).calories("620 kcal").description("Crispy corn chips with warm cheese dip").build(),
                    Snack.builder().name("Chicken Burger").category("FOOD").price(BigDecimal.valueOf(260)).calories("520 kcal").description("Grilled patty with lettuce and mayo").build()
            );
            snackRepository.saveAll(snacks);
        }
    }

    private void seedCoupons() {
        if (couponRepository.count() == 0) {
            List<Coupon> coupons = List.of(
                    Coupon.builder().code("WELCOME50").discountPercentage(15).minOrderAmount(BigDecimal.valueOf(200)).maxDiscountAmount(BigDecimal.valueOf(50)).active(true).build(),
                    Coupon.builder().code("MOVIE20").discountPercentage(20).minOrderAmount(BigDecimal.valueOf(300)).maxDiscountAmount(BigDecimal.valueOf(100)).active(true).build()
            );
            couponRepository.saveAll(coupons);
        }
    }
}
