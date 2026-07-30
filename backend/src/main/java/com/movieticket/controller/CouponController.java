package com.movieticket.controller;

import com.movieticket.dto.ApiResponse;
import com.movieticket.dto.CouponValidationDTO;
import com.movieticket.service.CouponService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/coupons")
public class CouponController {

    private final CouponService couponService;

    public CouponController(CouponService couponService) {
        this.couponService = couponService;
    }


    @PostMapping("/validate")
    public ResponseEntity<ApiResponse<CouponValidationDTO.Response>> validateCoupon(
            @Valid @RequestBody CouponValidationDTO.Request request
    ) {
        CouponValidationDTO.Response response = couponService.validateCoupon(request.getCode(), request.getOrderAmount());
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
