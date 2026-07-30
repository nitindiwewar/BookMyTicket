package com.movieticket.service;

import com.movieticket.config.JwtUtils;
import com.movieticket.dto.AuthDTO;
import com.movieticket.entity.User;
import com.movieticket.exception.BadRequestException;
import com.movieticket.exception.ResourceNotFoundException;
import com.movieticket.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);
    private static final SecureRandom random = new SecureRandom();

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    // In-memory OTP storage mapping mobile -> active OTP
    private final Map<String, String> otpStore = new ConcurrentHashMap<>();

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    public String sendOtp(AuthDTO.SendOtpRequest request) {
        if (request.getMobile() == null || request.getMobile().trim().length() != 10) {
            throw new BadRequestException("Invalid 10-digit mobile number");
        }

        String mobile = request.getMobile().trim();
        // Generate random 6-digit OTP
        int number = random.nextInt(900000) + 100000;
        String otp = String.valueOf(number);

        // Store OTP for validation
        otpStore.put(mobile, otp);

        log.info("[SMS GATEWAY SIMULATOR] Sent OTP code {} to mobile number {}{}", otp, request.getCountryCode(), mobile);
        System.out.println("=================================================");
        System.out.println(">>> OTP GENERATED FOR " + request.getCountryCode() + " " + mobile + " : " + otp + " <<<");
        System.out.println("=================================================");

        return otp;
    }

    @Transactional
    public AuthDTO.AuthResponse verifyOtp(AuthDTO.VerifyOtpRequest request) {
        if (request.getOtp() == null || request.getOtp().length() != 6) {
            throw new BadRequestException("Please enter a valid 6-digit OTP code");
        }

        String mobile = request.getMobile().trim();
        String storedOtp = otpStore.get(mobile);

        // Allow generated OTP or 123456 demo fallback
        boolean isValid = (storedOtp != null && storedOtp.equals(request.getOtp())) || "123456".equals(request.getOtp());
        if (!isValid) {
            throw new BadRequestException("Invalid OTP code. Please check and try again.");
        }

        // Clean up OTP after successful verification
        otpStore.remove(mobile);

        List<User> users = userRepository.findAllByMobile(mobile);
        boolean isNewUser = false;
        User user;

        if (!users.isEmpty()) {
            user = users.get(0);
        } else {
            isNewUser = true;
            user = User.builder()
                    .name("User_" + mobile.substring(Math.max(0, mobile.length() - 4)))
                    .email("user_" + mobile + "@movieticket.com")
                    .password(passwordEncoder.encode("otp_authenticated"))
                    .mobile(mobile)
                    .countryCode(request.getCountryCode() != null ? request.getCountryCode() : "+91")
                    .role(User.Role.ROLE_USER)
                    .build();
            userRepository.save(user);
        }

        String token = jwtUtils.generateToken(user.getEmail());

        return AuthDTO.AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .mobile(user.getMobile())
                .countryCode(user.getCountryCode())
                .dob(user.getDob())
                .age(user.getAge())
                .gender(user.getGender())
                .role(user.getRole().name())
                .isNewUser(isNewUser)
                .build();
    }

    @Transactional
    public AuthDTO.AuthResponse completeProfile(AuthDTO.CompleteProfileRequest request) {
        String mobile = request.getMobile().trim();
        List<User> users = userRepository.findAllByMobile(mobile);
        if (users.isEmpty()) {
            throw new ResourceNotFoundException("User not found with mobile: " + mobile);
        }

        User user = users.get(0);
        user.setName(request.getName().trim());
        user.setEmail(request.getEmail().trim());
        if (request.getDob() != null) user.setDob(request.getDob().trim());
        if (request.getAge() != null) user.setAge(request.getAge());
        if (request.getGender() != null) user.setGender(request.getGender().trim());

        userRepository.save(user);

        String token = jwtUtils.generateToken(user.getEmail());

        return AuthDTO.AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .mobile(user.getMobile())
                .countryCode(user.getCountryCode())
                .dob(user.getDob())
                .age(user.getAge())
                .gender(user.getGender())
                .role(user.getRole().name())
                .isNewUser(false)
                .build();
    }


    @Transactional
    public AuthDTO.AuthResponse register(AuthDTO.RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already in use");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .mobile(request.getMobile())
                .countryCode(request.getCountryCode() != null ? request.getCountryCode() : "+91")
                .role(User.Role.ROLE_USER)
                .build();

        userRepository.save(user);

        String token = jwtUtils.generateToken(user.getEmail());

        return AuthDTO.AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .mobile(user.getMobile())
                .countryCode(user.getCountryCode())
                .role(user.getRole().name())
                .isNewUser(false)
                .build();
    }

    public AuthDTO.AuthResponse login(AuthDTO.LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid email or password");
        }

        String token = jwtUtils.generateToken(user.getEmail());

        return AuthDTO.AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .mobile(user.getMobile())
                .countryCode(user.getCountryCode())
                .role(user.getRole().name())
                .isNewUser(false)
                .build();
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }
}
