package com.movieticket.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "booking_snacks")
public class BookingSnack {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "snack_id", nullable = false)
    private Snack snack;

    private Integer quantity;
    private BigDecimal unitPrice;

    public BookingSnack() {}

    public BookingSnack(Long id, Booking booking, Snack snack, Integer quantity, BigDecimal unitPrice) {
        this.id = id;
        this.booking = booking;
        this.snack = snack;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Booking getBooking() { return booking; }
    public void setBooking(Booking booking) { this.booking = booking; }

    public Snack getSnack() { return snack; }
    public void setSnack(Snack snack) { this.snack = snack; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public static BookingSnackBuilder builder() { return new BookingSnackBuilder(); }

    public static class BookingSnackBuilder {
        private Long id;
        private Booking booking;
        private Snack snack;
        private Integer quantity;
        private BigDecimal unitPrice;

        public BookingSnackBuilder id(Long id) { this.id = id; return this; }
        public BookingSnackBuilder booking(Booking booking) { this.booking = booking; return this; }
        public BookingSnackBuilder snack(Snack snack) { this.snack = snack; return this; }
        public BookingSnackBuilder quantity(Integer quantity) { this.quantity = quantity; return this; }
        public BookingSnackBuilder unitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; return this; }

        public BookingSnack build() {
            return new BookingSnack(id, booking, snack, quantity, unitPrice);
        }
    }
}
