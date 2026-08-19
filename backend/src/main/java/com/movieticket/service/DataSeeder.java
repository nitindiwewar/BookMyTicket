package com.movieticket.service;

import com.movieticket.entity.*;
import com.movieticket.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final ShowRepository showRepository;
    private final ShowSeatRepository showSeatRepository;
    private final BookingRepository bookingRepository;
    private final SnackRepository snackRepository;
    private final CouponRepository couponRepository;
    private final TheaterRepository theaterRepository;
    private final PasswordEncoder passwordEncoder;
    private final TmdbService tmdbService;

    public DataSeeder(UserRepository userRepository, MovieRepository movieRepository, ShowRepository showRepository, ShowSeatRepository showSeatRepository, BookingRepository bookingRepository, SnackRepository snackRepository, CouponRepository couponRepository, TheaterRepository theaterRepository, PasswordEncoder passwordEncoder, TmdbService tmdbService) {
        this.userRepository = userRepository;
        this.movieRepository = movieRepository;
        this.showRepository = showRepository;
        this.showSeatRepository = showSeatRepository;
        this.bookingRepository = bookingRepository;
        this.snackRepository = snackRepository;
        this.couponRepository = couponRepository;
        this.theaterRepository = theaterRepository;
        this.passwordEncoder = passwordEncoder;
        this.tmdbService = tmdbService;
    }

    @Override
    public void run(String... args) throws Exception {
        seedUsers();
        seedMovies();
        seedTheaters();
        seedSnacks();
        seedCoupons();
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            userRepository.save(User.builder()
                    .name("Admin User").email("admin@movieticket.com")
                    .password(passwordEncoder.encode("admin123"))
                    .mobile("9999988888").countryCode("+91")
                    .role(User.Role.ROLE_ADMIN)
                    .emailVerified(true)
                    .mobileVerified(true)
                    .build());
        } else {
            userRepository.findFirstByEmailOrderByCreatedAtDesc("admin@movieticket.com").ifPresent(u -> {
                u.setRole(User.Role.ROLE_ADMIN);
                userRepository.save(u);
            });
            userRepository.findFirstByEmailOrderByCreatedAtDesc("nitindiwewar0@gmail.com").ifPresent(u -> {
                u.setRole(User.Role.ROLE_ADMIN);
                userRepository.save(u);
            });
        }
    }

    private void seedMovies() {
        List<Movie> existing = movieRepository.findAll();
        if (existing.stream().anyMatch(m -> !m.getId().startsWith("tmdb-")) || existing.size() < 20) {
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
            snackRepository.saveAll(List.of(
                    Snack.builder().name("Salted Popcorn (Large)").category("POPCORN").price(BigDecimal.valueOf(280)).calories("450 kcal").description("Classic salted crunchy popcorn").build(),
                    Snack.builder().name("Cheese Popcorn (Jumbo)").category("POPCORN").price(BigDecimal.valueOf(320)).calories("580 kcal").description("Loaded with cheddar cheese powder").build(),
                    Snack.builder().name("Pepsi (750ml)").category("BEVERAGES").price(BigDecimal.valueOf(180)).calories("210 kcal").description("Chilled carbonated soft drink").build(),
                    Snack.builder().name("Nachos with Salsa & Cheese").category("COMBO").price(BigDecimal.valueOf(340)).calories("620 kcal").description("Crispy corn chips with warm cheese dip").build(),
                    Snack.builder().name("Chicken Burger").category("FOOD").price(BigDecimal.valueOf(260)).calories("520 kcal").description("Grilled patty with lettuce and mayo").build()
            ));
        }
    }

    private void seedTheaters() {
        if (theaterRepository.findAll().stream().noneMatch(t -> "Gondia".equalsIgnoreCase(t.getCity()))) {
            theaterRepository.saveAll(List.of(
                    Theater.builder().id("t-gondia-1").name("Gold Digital Cinema").city("Gondia").area("Civil Lines, Near Railway Station").latitude(21.4624).longitude(80.1963).build(),
                    Theater.builder().id("t-gondia-2").name("Raj Cinema & Multiplex").city("Gondia").area("Ganj Bazar, Main Road").latitude(21.4580).longitude(80.1920).build(),
                    Theater.builder().id("t-gondia-3").name("Chitralok Cinema").city("Gondia").area("Kudwa Road").latitude(21.4655).longitude(80.2012).build(),
                    Theater.builder().id("t-gondia-4").name("INOX City Mall").city("Gondia").area("Ring Road").latitude(21.4600).longitude(80.1980).build()
            ));
        }
    }

    private void seedCoupons() {
        if (couponRepository.count() == 0) {
            couponRepository.saveAll(List.of(
                    Coupon.builder().code("WELCOME50").discountPercentage(15).minOrderAmount(BigDecimal.valueOf(200)).maxDiscountAmount(BigDecimal.valueOf(50)).active(true).build(),
                    Coupon.builder().code("MOVIE20").discountPercentage(20).minOrderAmount(BigDecimal.valueOf(300)).maxDiscountAmount(BigDecimal.valueOf(100)).active(true).build()
            ));
        }
    }
}

