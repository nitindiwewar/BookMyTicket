package com.movieticket.dto;

import java.math.BigDecimal;

public class ShowSeatDTO {
    private String seatNumber;
    private String tier;
    private String status;
    private BigDecimal price;

    public ShowSeatDTO() {}

    public ShowSeatDTO(String seatNumber, String tier, String status, BigDecimal price) {
        this.seatNumber = seatNumber;
        this.tier = tier;
        this.status = status;
        this.price = price;
    }

    public String getSeatNumber() { return seatNumber; }
    public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }

    public String getTier() { return tier; }
    public void setTier(String tier) { this.tier = tier; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public static ShowSeatDTOBuilder builder() { return new ShowSeatDTOBuilder(); }

    public static class ShowSeatDTOBuilder {
        private String seatNumber;
        private String tier;
        private String status;
        private BigDecimal price;

        public ShowSeatDTOBuilder seatNumber(String seatNumber) { this.seatNumber = seatNumber; return this; }
        public ShowSeatDTOBuilder tier(String tier) { this.tier = tier; return this; }
        public ShowSeatDTOBuilder status(String status) { this.status = status; return this; }
        public ShowSeatDTOBuilder price(BigDecimal price) { this.price = price; return this; }

        public ShowSeatDTO build() {
            return new ShowSeatDTO(seatNumber, tier, status, price);
        }
    }
}
