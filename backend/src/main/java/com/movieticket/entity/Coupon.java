package com.movieticket.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "coupons")
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    private Integer discountPercentage;
    private BigDecimal maxDiscountAmount;
    private BigDecimal minOrderAmount;
    private boolean active = true;

    public Coupon() {}

    public Coupon(Long id, String code, Integer discountPercentage, BigDecimal maxDiscountAmount, BigDecimal minOrderAmount, Boolean active) {
        this.id = id;
        this.code = code;
        this.discountPercentage = discountPercentage;
        this.maxDiscountAmount = maxDiscountAmount;
        this.minOrderAmount = minOrderAmount;
        if (active != null) this.active = active;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public Integer getDiscountPercentage() { return discountPercentage; }
    public void setDiscountPercentage(Integer discountPercentage) { this.discountPercentage = discountPercentage; }

    public BigDecimal getMaxDiscountAmount() { return maxDiscountAmount; }
    public void setMaxDiscountAmount(BigDecimal maxDiscountAmount) { this.maxDiscountAmount = maxDiscountAmount; }

    public BigDecimal getMinOrderAmount() { return minOrderAmount; }
    public void setMinOrderAmount(BigDecimal minOrderAmount) { this.minOrderAmount = minOrderAmount; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public static CouponBuilder builder() { return new CouponBuilder(); }

    public static class CouponBuilder {
        private Long id;
        private String code;
        private Integer discountPercentage;
        private BigDecimal maxDiscountAmount;
        private BigDecimal minOrderAmount;
        private Boolean active = true;

        public CouponBuilder id(Long id) { this.id = id; return this; }
        public CouponBuilder code(String code) { this.code = code; return this; }
        public CouponBuilder discountPercentage(Integer discountPercentage) { this.discountPercentage = discountPercentage; return this; }
        public CouponBuilder maxDiscountAmount(BigDecimal maxDiscountAmount) { this.maxDiscountAmount = maxDiscountAmount; return this; }
        public CouponBuilder minOrderAmount(BigDecimal minOrderAmount) { this.minOrderAmount = minOrderAmount; return this; }
        public CouponBuilder active(Boolean active) { this.active = active; return this; }

        public Coupon build() {
            return new Coupon(id, code, discountPercentage, maxDiscountAmount, minOrderAmount, active);
        }
    }
}
