package com.movieticket.controller;

import com.movieticket.dto.ApiResponse;
import com.movieticket.service.RazorpayService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final RazorpayService razorpayService;

    public PaymentController(RazorpayService razorpayService) {
        this.razorpayService = razorpayService;
    }

    @PostMapping("/create-order")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createRazorpayOrder(@RequestBody Map<String, Object> request) {
        try {
            Object amountObj = request.get("amount");
            BigDecimal amount = BigDecimal.ZERO;
            if (amountObj instanceof Number) {
                amount = BigDecimal.valueOf(((Number) amountObj).doubleValue());
            } else if (amountObj instanceof String) {
                amount = new BigDecimal((String) amountObj);
            }

            String receipt = (String) request.get("receipt");
            Map<String, Object> orderData = razorpayService.createOrder(amount, receipt);
            return ResponseEntity.ok(ApiResponse.ok("Razorpay order created successfully", orderData));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to create Razorpay order: " + e.getMessage()));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<Map<String, Object>>> verifyPayment(@RequestBody Map<String, String> request) {
        String orderId = request.get("razorpayOrderId");
        String paymentId = request.get("razorpayPaymentId");
        String signature = request.get("razorpaySignature");

        boolean isValid = razorpayService.verifyPaymentSignature(orderId, paymentId, signature);
        if (isValid) {
            return ResponseEntity.ok(ApiResponse.ok("Payment signature verified successfully", Map.of("verified", true)));
        } else {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid payment signature"));
        }
    }
}
