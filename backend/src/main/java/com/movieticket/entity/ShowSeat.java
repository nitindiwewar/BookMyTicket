package com.movieticket.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "show_seats", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"show_id", "seat_number"})
})
public class ShowSeat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "show_id", nullable = false)
    private Show show;

    @Column(name = "seat_number", nullable = false)
    private String seatNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SeatTier tier;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SeatStatus status;

    private BigDecimal price;

    public enum SeatTier { VIP, PREMIUM, REGULAR }
    public enum SeatStatus { AVAILABLE, BOOKED, BLOCKED }

    public ShowSeat() {}

    public ShowSeat(Long id, Show show, String seatNumber, SeatTier tier, SeatStatus status, BigDecimal price) {
        this.id = id;
        this.show = show;
        this.seatNumber = seatNumber;
        this.tier = tier;
        this.status = status;
        this.price = price;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Show getShow() { return show; }
    public void setShow(Show show) { this.show = show; }

    public String getSeatNumber() { return seatNumber; }
    public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }

    public SeatTier getTier() { return tier; }
    public void setTier(SeatTier tier) { this.tier = tier; }

    public SeatStatus getStatus() { return status; }
    public void setStatus(SeatStatus status) { this.status = status; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public static ShowSeatBuilder builder() { return new ShowSeatBuilder(); }

    public static class ShowSeatBuilder {
        private Long id;
        private Show show;
        private String seatNumber;
        private SeatTier tier;
        private SeatStatus status;
        private BigDecimal price;

        public ShowSeatBuilder id(Long id) { this.id = id; return this; }
        public ShowSeatBuilder show(Show show) { this.show = show; return this; }
        public ShowSeatBuilder seatNumber(String seatNumber) { this.seatNumber = seatNumber; return this; }
        public ShowSeatBuilder tier(SeatTier tier) { this.tier = tier; return this; }
        public ShowSeatBuilder status(SeatStatus status) { this.status = status; return this; }
        public ShowSeatBuilder price(BigDecimal price) { this.price = price; return this; }

        public ShowSeat build() {
            return new ShowSeat(id, show, seatNumber, tier, status, price);
        }
    }
}
