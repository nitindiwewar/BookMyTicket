package com.movieticket.controller;

import com.movieticket.dto.ApiResponse;
import com.movieticket.dto.AuthDTO;
import com.movieticket.entity.User;
import com.movieticket.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/send-otp")
    public ResponseEntity<ApiResponse<Map<String, String>>> sendOtp(@Valid @RequestBody AuthDTO.SendOtpRequest request) {
        String otp = authService.sendOtp(request);
        return ResponseEntity.ok(ApiResponse.ok("OTP sent successfully", Map.of(
                "mobile", request.getMobile(),
                "otp", otp
        )));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<AuthDTO.AuthResponse>> verifyOtp(@Valid @RequestBody AuthDTO.VerifyOtpRequest request) {
        AuthDTO.AuthResponse response = authService.verifyOtp(request);
        return ResponseEntity.ok(ApiResponse.ok("OTP verified successfully", response));
    }

    @PostMapping("/complete-profile")
    public ResponseEntity<ApiResponse<AuthDTO.AuthResponse>> completeProfile(@Valid @RequestBody AuthDTO.CompleteProfileRequest request) {
        AuthDTO.AuthResponse response = authService.completeProfile(request);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", response));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthDTO.AuthResponse>> register(@Valid @RequestBody AuthDTO.RegisterRequest request) {
        AuthDTO.AuthResponse response = authService.register(request);
        return ResponseEntity.ok(ApiResponse.ok("User registered successfully", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthDTO.AuthResponse>> login(@Valid @RequestBody AuthDTO.LoginRequest request) {
        AuthDTO.AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<User>> getCurrentUser(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Unauthorized"));
        }
        User user = authService.getUserByEmail(authentication.getName());
        return ResponseEntity.ok(ApiResponse.ok(user));
    }
}
