package com.movieticket.dto;

import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;

public class CouponValidationDTO {

    public static class Request {
        @NotBlank(message = "Coupon code is required")
        private String code;
        private BigDecimal orderAmount;

        public Request() {}
        public Request(String code, BigDecimal orderAmount) {
            this.code = code;
            this.orderAmount = orderAmount;
        }

        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }

        public BigDecimal getOrderAmount() { return orderAmount; }
        public void setOrderAmount(BigDecimal orderAmount) { this.orderAmount = orderAmount; }
    }

    public static class Response {
        private String code;
        private boolean valid;
        private Integer discountPercentage;
        private BigDecimal discountAmount;
        private String message;

        public Response() {}
        public Response(String code, boolean valid, Integer discountPercentage, BigDecimal discountAmount, String message) {
            this.code = code;
            this.valid = valid;
            this.discountPercentage = discountPercentage;
            this.discountAmount = discountAmount;
            this.message = message;
        }

        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }

        public boolean isValid() { return valid; }
        public void setValid(boolean valid) { this.valid = valid; }

        public Integer getDiscountPercentage() { return discountPercentage; }
        public void setDiscountPercentage(Integer discountPercentage) { this.discountPercentage = discountPercentage; }

        public BigDecimal getDiscountAmount() { return discountAmount; }
        public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }

        public static ResponseBuilder builder() { return new ResponseBuilder(); }

        public static class ResponseBuilder {
            private String code;
            private boolean valid;
            private Integer discountPercentage;
            private BigDecimal discountAmount;
            private String message;

            public ResponseBuilder code(String code) { this.code = code; return this; }
            public ResponseBuilder valid(boolean valid) { this.valid = valid; return this; }
            public ResponseBuilder discountPercentage(Integer discountPercentage) { this.discountPercentage = discountPercentage; return this; }
            public ResponseBuilder discountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; return this; }
            public ResponseBuilder message(String message) { this.message = message; return this; }

            public Response build() {
                return new Response(code, valid, discountPercentage, discountAmount, message);
            }
        }
    }
}
