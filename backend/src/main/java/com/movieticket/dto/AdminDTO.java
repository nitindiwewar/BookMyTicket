package com.movieticket.dto;

import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class AdminDTO {

    public static class AdminStatsResponse {
        private long totalUsers;
        private long totalBookings;
        private BigDecimal totalRevenue;
        private long activeUsers;
        private long pendingBookings;
        private long completedBookings;
        private long cancelledBookings;
        private long totalMovies;
        private long totalTheaters;

        public AdminStatsResponse() {}

        public AdminStatsResponse(long totalUsers, long totalBookings, BigDecimal totalRevenue, long activeUsers, long pendingBookings, long completedBookings, long cancelledBookings, long totalMovies, long totalTheaters) {
            this.totalUsers = totalUsers;
            this.totalBookings = totalBookings;
            this.totalRevenue = totalRevenue;
            this.activeUsers = activeUsers;
            this.pendingBookings = pendingBookings;
            this.completedBookings = completedBookings;
            this.cancelledBookings = cancelledBookings;
            this.totalMovies = totalMovies;
            this.totalTheaters = totalTheaters;
        }

        public long getTotalUsers() { return totalUsers; }
        public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

        public long getTotalBookings() { return totalBookings; }
        public void setTotalBookings(long totalBookings) { this.totalBookings = totalBookings; }

        public BigDecimal getTotalRevenue() { return totalRevenue; }
        public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }

        public long getActiveUsers() { return activeUsers; }
        public void setActiveUsers(long activeUsers) { this.activeUsers = activeUsers; }

        public long getPendingBookings() { return pendingBookings; }
        public void setPendingBookings(long pendingBookings) { this.pendingBookings = pendingBookings; }

        public long getCompletedBookings() { return completedBookings; }
        public void setCompletedBookings(long completedBookings) { this.completedBookings = completedBookings; }

        public long getCancelledBookings() { return cancelledBookings; }
        public void setCancelledBookings(long cancelledBookings) { this.cancelledBookings = cancelledBookings; }

        public long getTotalMovies() { return totalMovies; }
        public void setTotalMovies(long totalMovies) { this.totalMovies = totalMovies; }

        public long getTotalTheaters() { return totalTheaters; }
        public void setTotalTheaters(long totalTheaters) { this.totalTheaters = totalTheaters; }
    }

    public static class CreateUserRequest {
        @NotBlank(message = "Name is required")
        private String name;

        @NotBlank(message = "Email is required")
        private String email;

        private String password;
        private String mobile;
        private String role;
        private Boolean emailVerified;
        private Boolean mobileVerified;

        public CreateUserRequest() {}

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }

        public String getMobile() { return mobile; }
        public void setMobile(String mobile) { this.mobile = mobile; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }

        public Boolean getEmailVerified() { return emailVerified; }
        public void setEmailVerified(Boolean emailVerified) { this.emailVerified = emailVerified; }

        public Boolean getMobileVerified() { return mobileVerified; }
        public void setMobileVerified(Boolean mobileVerified) { this.mobileVerified = mobileVerified; }
    }

    public static class UpdateUserRoleRequest {
        @NotBlank(message = "Role is required")
        private String role;

        public UpdateUserRoleRequest() {}
        public UpdateUserRoleRequest(String role) { this.role = role; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }

    public static class UpdateUserVerificationRequest {
        private Boolean emailVerified;
        private Boolean mobileVerified;

        public UpdateUserVerificationRequest() {}

        public Boolean getEmailVerified() { return emailVerified; }
        public void setEmailVerified(Boolean emailVerified) { this.emailVerified = emailVerified; }

        public Boolean getMobileVerified() { return mobileVerified; }
        public void setMobileVerified(Boolean mobileVerified) { this.mobileVerified = mobileVerified; }
    }

    public static class CreateMovieRequest {
        private String id;
        @NotBlank(message = "Title is required")
        private String title;
        private String synopsis;
        private String posterUrl;
        private String backdropUrl;
        private String trailerUrl;
        private Integer runtimeMins;
        private Double rating;
        private String certification;
        private String language;
        private List<String> genres;
        private List<String> format;
        private List<String> cast;
        private List<String> crew;

        public CreateMovieRequest() {}

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getSynopsis() { return synopsis; }
        public void setSynopsis(String synopsis) { this.synopsis = synopsis; }

        public String getPosterUrl() { return posterUrl; }
        public void setPosterUrl(String posterUrl) { this.posterUrl = posterUrl; }

        public String getBackdropUrl() { return backdropUrl; }
        public void setBackdropUrl(String backdropUrl) { this.backdropUrl = backdropUrl; }

        public String getTrailerUrl() { return trailerUrl; }
        public void setTrailerUrl(String trailerUrl) { this.trailerUrl = trailerUrl; }

        public Integer getRuntimeMins() { return runtimeMins; }
        public void setRuntimeMins(Integer runtimeMins) { this.runtimeMins = runtimeMins; }

        public Double getRating() { return rating; }
        public void setRating(Double rating) { this.rating = rating; }

        public String getCertification() { return certification; }
        public void setCertification(String certification) { this.certification = certification; }

        public String getLanguage() { return language; }
        public void setLanguage(String language) { this.language = language; }

        public List<String> getGenres() { return genres; }
        public void setGenres(List<String> genres) { this.genres = genres; }

        public List<String> getFormat() { return format; }
        public void setFormat(List<String> format) { this.format = format; }

        public List<String> getCast() { return cast; }
        public void setCast(List<String> cast) { this.cast = cast; }

        public List<String> getCrew() { return crew; }
        public void setCrew(List<String> crew) { this.crew = crew; }
    }

    public static class CreateTheaterRequest {
        private String id;
        @NotBlank(message = "Theater name is required")
        private String name;
        @NotBlank(message = "City is required")
        private String city;
        private String area;
        private Double latitude;
        private Double longitude;
        private List<String> facilities;

        public CreateTheaterRequest() {}

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getCity() { return city; }
        public void setCity(String city) { this.city = city; }

        public String getArea() { return area; }
        public void setArea(String area) { this.area = area; }

        public Double getLatitude() { return latitude; }
        public void setLatitude(Double latitude) { this.latitude = latitude; }

        public Double getLongitude() { return longitude; }
        public void setLongitude(Double longitude) { this.longitude = longitude; }

        public List<String> getFacilities() { return facilities; }
        public void setFacilities(List<String> facilities) { this.facilities = facilities; }
    }

    public static class CreateShowRequest {
        private String id;
        private String movieId;
        private String theaterId;
        private LocalDate date;
        private String time;
        private BigDecimal basePrice;

        public CreateShowRequest() {}

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getMovieId() { return movieId; }
        public void setMovieId(String movieId) { this.movieId = movieId; }

        public String getTheaterId() { return theaterId; }
        public void setTheaterId(String theaterId) { this.theaterId = theaterId; }

        public LocalDate getDate() { return date; }
        public void setDate(LocalDate date) { this.date = date; }

        public String getTime() { return time; }
        public void setTime(String time) { this.time = time; }

        public BigDecimal getBasePrice() { return basePrice; }
        public void setBasePrice(BigDecimal basePrice) { this.basePrice = basePrice; }
    }

    public static class UpdateBookingStatusRequest {
        @NotBlank(message = "Status is required")
        private String status;

        public UpdateBookingStatusRequest() {}
        public UpdateBookingStatusRequest(String status) { this.status = status; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    public static class AdminNotificationDTO {
        private String id;
        private String type; // USER_REGISTERED, BOOKING_CREATED, BOOKING_CANCELLED
        private String title;
        private String message;
        private String linkId;
        private String timestamp;
        private boolean read;

        public AdminNotificationDTO() {}

        public AdminNotificationDTO(String id, String type, String title, String message, String linkId, String timestamp, boolean read) {
            this.id = id;
            this.type = type;
            this.title = title;
            this.message = message;
            this.linkId = linkId;
            this.timestamp = timestamp;
            this.read = read;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }

        public String getLinkId() { return linkId; }
        public void setLinkId(String linkId) { this.linkId = linkId; }

        public String getTimestamp() { return timestamp; }
        public void setTimestamp(String timestamp) { this.timestamp = timestamp; }

        public boolean isRead() { return read; }
        public void setRead(boolean read) { this.read = read; }
    }
}
