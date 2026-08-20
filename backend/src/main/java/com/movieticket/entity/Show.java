package com.movieticket.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "shows", indexes = {
    @Index(name = "idx_shows_movie_date", columnList = "movie_id, date"),
    @Index(name = "idx_shows_theater_date", columnList = "theater_id, date"),
    @Index(name = "idx_shows_date", columnList = "date")
})
public class Show {

    @Id
    private String id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "theater_id", nullable = false)
    private Theater theater;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private String time;

    private BigDecimal basePrice;

    public Show() {}

    public Show(String id, Movie movie, Theater theater, LocalDate date, String time, BigDecimal basePrice) {
        this.id = id;
        this.movie = movie;
        this.theater = theater;
        this.date = date;
        this.time = time;
        this.basePrice = basePrice;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Movie getMovie() { return movie; }
    public void setMovie(Movie movie) { this.movie = movie; }

    public Theater getTheater() { return theater; }
    public void setTheater(Theater theater) { this.theater = theater; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public BigDecimal getBasePrice() { return basePrice; }
    public void setBasePrice(BigDecimal basePrice) { this.basePrice = basePrice; }

    public static ShowBuilder builder() { return new ShowBuilder(); }

    public static class ShowBuilder {
        private String id;
        private Movie movie;
        private Theater theater;
        private LocalDate date;
        private String time;
        private BigDecimal basePrice;

        public ShowBuilder id(String id) { this.id = id; return this; }
        public ShowBuilder movie(Movie movie) { this.movie = movie; return this; }
        public ShowBuilder theater(Theater theater) { this.theater = theater; return this; }
        public ShowBuilder date(LocalDate date) { this.date = date; return this; }
        public ShowBuilder time(String time) { this.time = time; return this; }
        public ShowBuilder basePrice(BigDecimal basePrice) { this.basePrice = basePrice; return this; }

        public Show build() {
            return new Show(id, movie, theater, date, time, basePrice);
        }
    }
}
