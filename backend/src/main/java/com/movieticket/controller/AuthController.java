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

    @PostMapping("/google")
    public ResponseEntity<ApiResponse<AuthDTO.AuthResponse>> googleLogin(@Valid @RequestBody AuthDTO.GoogleAuthRequest request) {
        AuthDTO.AuthResponse response = authService.googleLogin(request);
        return ResponseEntity.ok(ApiResponse.ok("Google OAuth login successful", response));
    }

    @PostMapping("/update-profile")
    public ResponseEntity<ApiResponse<AuthDTO.AuthResponse>> updateProfile(@Valid @RequestBody AuthDTO.UpdateProfileRequest request) {
        AuthDTO.AuthResponse response = authService.updateProfile(request);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", response));
    }

    @PostMapping("/send-email-otp")
    public ResponseEntity<ApiResponse<String>> sendEmailOtp(@Valid @RequestBody AuthDTO.SendEmailOtpRequest request) {
        String msg = authService.sendEmailOtp(request);
        return ResponseEntity.ok(ApiResponse.ok(msg));
    }

    @PostMapping("/verify-email-otp")
    public ResponseEntity<ApiResponse<AuthDTO.AuthResponse>> verifyEmailOtp(@Valid @RequestBody AuthDTO.VerifyEmailOtpRequest request) {
        AuthDTO.AuthResponse response = authService.verifyEmailOtp(request);
        return ResponseEntity.ok(ApiResponse.ok("Email verified successfully", response));
    }

    @PostMapping("/send-mobile-otp")
    public ResponseEntity<ApiResponse<String>> sendMobileOtp(@Valid @RequestBody AuthDTO.SendMobileOtpRequest request) {
        String msg = authService.sendMobileOtpForVerification(request);
        return ResponseEntity.ok(ApiResponse.ok(msg));
    }

    @PostMapping("/verify-mobile-otp")
    public ResponseEntity<ApiResponse<AuthDTO.AuthResponse>> verifyMobileOtp(@Valid @RequestBody AuthDTO.VerifyMobileOtpRequest request) {
        AuthDTO.AuthResponse response = authService.verifyMobileOtp(request);
        return ResponseEntity.ok(ApiResponse.ok("Mobile number verified successfully", response));
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
