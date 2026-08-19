package com.movieticket.service;

import com.movieticket.dto.CouponValidationDTO;
import com.movieticket.entity.Coupon;
import com.movieticket.repository.CouponRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Optional;

@Service
public class CouponService {

    private final CouponRepository couponRepository;

    public CouponService(CouponRepository couponRepository) {
        this.couponRepository = couponRepository;
    }



    public CouponValidationDTO.Response validateCoupon(String code, BigDecimal orderAmount) {
        if (code == null || code.trim().isEmpty()) {
            return CouponValidationDTO.Response.builder()
                    .code(code)
                    .valid(false)
                    .discountPercentage(0)
                    .discountAmount(BigDecimal.ZERO)
                    .message("Coupon code is empty")
                    .build();
        }

        Optional<Coupon> optionalCoupon = couponRepository.findByCodeIgnoreCaseAndActiveTrue(code.trim());

        if (optionalCoupon.isEmpty()) {
            return CouponValidationDTO.Response.builder()
                    .code(code)
                    .valid(false)
                    .discountPercentage(0)
                    .discountAmount(BigDecimal.ZERO)
                    .message("Invalid or expired coupon code")
                    .build();
        }

        Coupon coupon = optionalCoupon.get();

        if (orderAmount != null && coupon.getMinOrderAmount() != null && orderAmount.compareTo(coupon.getMinOrderAmount()) < 0) {
            return CouponValidationDTO.Response.builder()
                    .code(code)
                    .valid(false)
                    .discountPercentage(coupon.getDiscountPercentage())
                    .discountAmount(BigDecimal.ZERO)
                    .message("Minimum order amount of ₹" + coupon.getMinOrderAmount() + " required for this coupon")
                    .build();
        }

        BigDecimal discount = BigDecimal.ZERO;
        if (orderAmount != null && coupon.getDiscountPercentage() != null) {
            discount = orderAmount.multiply(BigDecimal.valueOf(coupon.getDiscountPercentage()))
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            if (coupon.getMaxDiscountAmount() != null && discount.compareTo(coupon.getMaxDiscountAmount()) > 0) {
                discount = coupon.getMaxDiscountAmount();
            }
        }

        return CouponValidationDTO.Response.builder()
                .code(coupon.getCode())
                .valid(true)
                .discountPercentage(coupon.getDiscountPercentage())
                .discountAmount(discount)
                .message("Coupon applied successfully!")
                .build();
    }
}
