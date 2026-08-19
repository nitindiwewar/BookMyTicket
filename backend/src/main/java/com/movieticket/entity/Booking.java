package com.movieticket.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String bookingCode;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"password", "hibernateLazyInitializer", "handler"})
    private User user;

    @Column(nullable = false)
    private String customerEmail;

    @Column(nullable = false)
    private String customerPhone;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "show_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Show show;

    @Column(nullable = false)
    private String seatNumbers;

    private String seatTier;
    private Integer totalSeats;
    private BigDecimal ticketAmount;
    private BigDecimal snackAmount;
    private BigDecimal discountAmount;
    private BigDecimal convenienceFee;
    private BigDecimal totalAmount;

    private String paymentMethod;
    private String paymentTransactionId;
    private String paymentStatus;
    private String paymentDetails;
    private LocalDateTime paidAt;

    private String couponCode;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"booking"})
    private List<BookingSnack> snacks = new ArrayList<>();

    public enum BookingStatus { CONFIRMED, CANCELLED }

    public Booking() {}

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = BookingStatus.CONFIRMED;
        }
        if (this.paidAt == null) {
            this.paidAt = LocalDateTime.now();
        }
        if (this.paymentStatus == null) {
            this.paymentStatus = "SUCCESS";
        }
    }

    public static BookingBuilder builder() {
        return new BookingBuilder();
    }

    public static class BookingBuilder {
        private final Booking booking = new Booking();

        public BookingBuilder bookingCode(String bookingCode) { booking.setBookingCode(bookingCode); return this; }
        public BookingBuilder user(User user) { booking.setUser(user); return this; }
        public BookingBuilder customerEmail(String email) { booking.setCustomerEmail(email); return this; }
        public BookingBuilder customerPhone(String phone) { booking.setCustomerPhone(phone); return this; }
        public BookingBuilder show(Show show) { booking.setShow(show); return this; }
        public BookingBuilder seatNumbers(String seatNumbers) { booking.setSeatNumbers(seatNumbers); return this; }
        public BookingBuilder seatTier(String seatTier) { booking.setSeatTier(seatTier); return this; }
        public BookingBuilder totalSeats(Integer totalSeats) { booking.setTotalSeats(totalSeats); return this; }
        public BookingBuilder ticketAmount(BigDecimal ticketAmount) { booking.setTicketAmount(ticketAmount); return this; }
        public BookingBuilder snackAmount(BigDecimal snackAmount) { booking.setSnackAmount(snackAmount); return this; }
        public BookingBuilder discountAmount(BigDecimal discountAmount) { booking.setDiscountAmount(discountAmount); return this; }
        public BookingBuilder convenienceFee(BigDecimal convenienceFee) { booking.setConvenienceFee(convenienceFee); return this; }
        public BookingBuilder totalAmount(BigDecimal totalAmount) { booking.setTotalAmount(totalAmount); return this; }
        public BookingBuilder paymentMethod(String paymentMethod) { booking.setPaymentMethod(paymentMethod); return this; }
        public BookingBuilder paymentTransactionId(String txnId) { booking.setPaymentTransactionId(txnId); return this; }
        public BookingBuilder paymentStatus(String status) { booking.setPaymentStatus(status); return this; }
        public BookingBuilder paymentDetails(String details) { booking.setPaymentDetails(details); return this; }
        public BookingBuilder paidAt(LocalDateTime paidAt) { booking.setPaidAt(paidAt); return this; }
        public BookingBuilder couponCode(String couponCode) { booking.setCouponCode(couponCode); return this; }
        public BookingBuilder razorpayOrderId(String id) { booking.setRazorpayOrderId(id); return this; }
        public BookingBuilder razorpayPaymentId(String id) { booking.setRazorpayPaymentId(id); return this; }
        public BookingBuilder razorpaySignature(String sig) { booking.setRazorpaySignature(sig); return this; }
        public BookingBuilder status(BookingStatus status) { booking.setStatus(status); return this; }

        public Booking build() {
            return booking;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBookingCode() { return bookingCode; }
    public void setBookingCode(String bookingCode) { this.bookingCode = bookingCode; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }

    public Show getShow() { return show; }
    public void setShow(Show show) { this.show = show; }

    public String getSeatNumbers() { return seatNumbers; }
    public void setSeatNumbers(String seatNumbers) { this.seatNumbers = seatNumbers; }

    public String getSeatTier() { return seatTier; }
    public void setSeatTier(String seatTier) { this.seatTier = seatTier; }

    public Integer getTotalSeats() { return totalSeats; }
    public void setTotalSeats(Integer totalSeats) { this.totalSeats = totalSeats; }

    public BigDecimal getTicketAmount() { return ticketAmount; }
    public void setTicketAmount(BigDecimal ticketAmount) { this.ticketAmount = ticketAmount; }

    public BigDecimal getSnackAmount() { return snackAmount; }
    public void setSnackAmount(BigDecimal snackAmount) { this.snackAmount = snackAmount; }

    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }

    public BigDecimal getConvenienceFee() { return convenienceFee; }
    public void setConvenienceFee(BigDecimal convenienceFee) { this.convenienceFee = convenienceFee; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getPaymentTransactionId() { return paymentTransactionId; }
    public void setPaymentTransactionId(String paymentTransactionId) { this.paymentTransactionId = paymentTransactionId; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getPaymentDetails() { return paymentDetails; }
    public void setPaymentDetails(String paymentDetails) { this.paymentDetails = paymentDetails; }

    public LocalDateTime getPaidAt() { return paidAt; }
    public void setPaidAt(LocalDateTime paidAt) { this.paidAt = paidAt; }

    public String getCouponCode() { return couponCode; }
    public void setCouponCode(String couponCode) { this.couponCode = couponCode; }

    public String getRazorpayOrderId() { return razorpayOrderId; }
    public void setRazorpayOrderId(String razorpayOrderId) { this.razorpayOrderId = razorpayOrderId; }

    public String getRazorpayPaymentId() { return razorpayPaymentId; }
    public void setRazorpayPaymentId(String razorpayPaymentId) { this.razorpayPaymentId = razorpayPaymentId; }

    public String getRazorpaySignature() { return razorpaySignature; }
    public void setRazorpaySignature(String razorpaySignature) { this.razorpaySignature = razorpaySignature; }

    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<BookingSnack> getSnacks() { return snacks; }
    public void setSnacks(List<BookingSnack> snacks) { this.snacks = snacks; }
}
