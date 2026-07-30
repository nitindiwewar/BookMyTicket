package com.movieticket.controller;

import com.movieticket.dto.ApiResponse;
import com.movieticket.dto.BookingRequestDTO;
import com.movieticket.dto.BookingResponseDTO;
import com.movieticket.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }


    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponseDTO>> createBooking(
            @Valid @RequestBody BookingRequestDTO request,
            Authentication authentication
    ) {
        String userEmail = authentication != null ? authentication.getName() : null;
        BookingResponseDTO response = bookingService.createBooking(request, userEmail);
        return ResponseEntity.ok(ApiResponse.ok("Booking confirmed successfully!", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingResponseDTO>> getBooking(@PathVariable String id) {
        BookingResponseDTO response = bookingService.getBookingByCodeOrId(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<ApiResponse<List<BookingResponseDTO>>> getMyBookings(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Authentication required"));
        }
        List<BookingResponseDTO> bookings = bookingService.getUserBookings(authentication.getName());
        return ResponseEntity.ok(ApiResponse.ok(bookings));
    }

    @GetMapping("/user")
    public ResponseEntity<ApiResponse<List<BookingResponseDTO>>> getBookingsByUser(
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String phone,
            Authentication authentication
    ) {
        String queryUser = email != null && !email.trim().isEmpty() ? email : (phone != null && !phone.trim().isEmpty() ? phone : (authentication != null ? authentication.getName() : null));
        if (queryUser == null) {
            return ResponseEntity.ok(ApiResponse.ok(List.of()));
        }
        List<BookingResponseDTO> bookings = bookingService.getUserBookings(queryUser);
        return ResponseEntity.ok(ApiResponse.ok(bookings));
    }
}

