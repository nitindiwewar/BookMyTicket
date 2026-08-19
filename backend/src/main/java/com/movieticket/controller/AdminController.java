package com.movieticket.controller;

import com.movieticket.dto.AdminDTO;
import com.movieticket.dto.ApiResponse;
import com.movieticket.entity.*;
import com.movieticket.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // --- Overview Stats ---
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AdminDTO.AdminStatsResponse>> getAdminStats() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getAdminStats()));
    }

    // --- Movies ---
    @GetMapping("/movies")
    public ResponseEntity<ApiResponse<List<Movie>>> getAllMovies() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getAllMovies()));
    }

    @PostMapping("/movies")
    public ResponseEntity<ApiResponse<Movie>> createMovie(@Valid @RequestBody AdminDTO.CreateMovieRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Movie created successfully", adminService.createMovie(req)));
    }

    @PutMapping("/movies/{id}")
    public ResponseEntity<ApiResponse<Movie>> updateMovie(@PathVariable String id, @Valid @RequestBody AdminDTO.CreateMovieRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Movie updated successfully", adminService.updateMovie(id, req)));
    }

    @DeleteMapping("/movies/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMovie(@PathVariable String id) {
        adminService.deleteMovie(id);
        return ResponseEntity.ok(ApiResponse.ok("Movie deleted successfully", null));
    }

    // --- Theaters ---
    @GetMapping("/theaters")
    public ResponseEntity<ApiResponse<List<Theater>>> getAllTheaters() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getAllTheaters()));
    }

    @PostMapping("/theaters")
    public ResponseEntity<ApiResponse<Theater>> createTheater(@Valid @RequestBody AdminDTO.CreateTheaterRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Theater created successfully", adminService.createTheater(req)));
    }

    @PutMapping("/theaters/{id}")
    public ResponseEntity<ApiResponse<Theater>> updateTheater(@PathVariable String id, @Valid @RequestBody AdminDTO.CreateTheaterRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Theater updated successfully", adminService.updateTheater(id, req)));
    }

    @DeleteMapping("/theaters/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTheater(@PathVariable String id) {
        adminService.deleteTheater(id);
        return ResponseEntity.ok(ApiResponse.ok("Theater deleted successfully", null));
    }

    // --- Showtimes ---
    @GetMapping("/shows")
    public ResponseEntity<ApiResponse<List<Show>>> getAllShows() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getAllShows()));
    }

    @PostMapping("/shows")
    public ResponseEntity<ApiResponse<Show>> createShow(@Valid @RequestBody AdminDTO.CreateShowRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Showtime scheduled successfully", adminService.createShow(req)));
    }

    @PutMapping("/shows/{id}")
    public ResponseEntity<ApiResponse<Show>> updateShow(@PathVariable String id, @Valid @RequestBody AdminDTO.CreateShowRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Showtime updated successfully", adminService.updateShow(id, req)));
    }

    @DeleteMapping("/shows/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteShow(@PathVariable String id) {
        adminService.deleteShow(id);
        return ResponseEntity.ok(ApiResponse.ok("Showtime cancelled/deleted successfully", null));
    }

    // --- Users ---
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getAllUsers()));
    }

    @PostMapping("/users")
    public ResponseEntity<ApiResponse<User>> createUser(@Valid @RequestBody AdminDTO.CreateUserRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("User created successfully", adminService.createUser(req)));
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<ApiResponse<User>> updateUserRole(@PathVariable Long id, @Valid @RequestBody AdminDTO.UpdateUserRoleRequest req, Authentication auth) {
        String currentAdminEmail = auth != null ? auth.getName() : "";
        return ResponseEntity.ok(ApiResponse.ok("User role updated successfully", adminService.updateUserRole(id, req.getRole(), currentAdminEmail)));
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<ApiResponse<User>> updateUserVerification(@PathVariable Long id, @Valid @RequestBody AdminDTO.UpdateUserVerificationRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("User verification status updated successfully", adminService.updateUserVerification(id, req)));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id, Authentication auth) {
        String currentAdminEmail = auth != null ? auth.getName() : "";
        adminService.deleteUser(id, currentAdminEmail);
        return ResponseEntity.ok(ApiResponse.ok("User deleted successfully", null));
    }

    // --- Bookings ---
    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<List<Booking>>> getAllBookings() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getAllBookings()));
    }

    @PostMapping("/bookings/sample")
    public ResponseEntity<ApiResponse<Booking>> createSampleBooking() {
        return ResponseEntity.ok(ApiResponse.ok("Sample booking created in database", adminService.createSampleBooking()));
    }

    @PutMapping("/bookings/{id}/status")
    public ResponseEntity<ApiResponse<Booking>> updateBookingStatus(@PathVariable Long id, @Valid @RequestBody AdminDTO.UpdateBookingStatusRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Booking status updated successfully", adminService.updateBookingStatus(id, req.getStatus())));
    }

    @DeleteMapping("/bookings/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBooking(@PathVariable Long id) {
        adminService.deleteBooking(id);
        return ResponseEntity.ok(ApiResponse.ok("Booking deleted successfully", null));
    }

    // --- Analytics ---
    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAnalytics() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getAnalyticsData()));
    }
}
