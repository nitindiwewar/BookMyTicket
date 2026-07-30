# 🎬 Movie Ticket Booking System - Spring Boot Backend

A modern, high-performance Java Spring Boot starter backend designed for the Movie Ticket Booking React frontend application.

---

## 🚀 Tech Stack

- **Java**: 17+ (Java 25 runtime compatible)
- **Framework**: Spring Boot 3.2.5 (Spring Web, Spring Data JPA, Spring Security, Validation)
- **Database**: H2 In-Memory DB (Pre-seeded with demo data) / MySQL compatible
- **Security**: JWT Authentication (Stateless `Bearer <token>`) & BCrypt Password Hashing
- **Build Tool**: Maven (`pom.xml`)

---

## 📂 Backend Architecture

```
backend/
├── pom.xml
└── src/
    ├── main/
    │   ├── java/com/movieticket/
    │   │   ├── MovieTicketApplication.java
    │   │   ├── config/               # Security, CORS & JWT filters
    │   │   │   ├── CorsConfig.java
    │   │   │   ├── JwtAuthenticationFilter.java
    │   │   │   ├── JwtUtils.java
    │   │   │   └── SecurityConfig.java
    │   │   ├── controller/           # REST Controllers
    │   │   │   ├── AuthController.java
    │   │   │   ├── BookingController.java
    │   │   │   ├── CouponController.java
    │   │   │   ├── MovieController.java
    │   │   │   ├── ShowController.java
    │   │   │   ├── SnackController.java
    │   │   │   └── TheaterController.java
    │   │   ├── dto/                  # Data Transfer Objects
    │   │   │   ├── ApiResponse.java
    │   │   │   ├── AuthDTO.java
    │   │   │   ├── BookingRequestDTO.java
    │   │   │   ├── BookingResponseDTO.java
    │   │   │   ├── CouponValidationDTO.java
    │   │   │   └── ShowSeatDTO.java
    │   │   ├── entity/               # JPA Entities
    │   │   │   ├── Booking.java
    │   │   │   ├── BookingSnack.java
    │   │   │   ├── Coupon.java
    │   │   │   ├── Movie.java
    │   │   │   ├── Show.java
    │   │   │   ├── ShowSeat.java
    │   │   │   ├── Snack.java
    │   │   │   ├── Theater.java
    │   │   │   └── User.java
    │   │   ├── exception/            # Global Exception Handling
    │   │   │   ├── BadRequestException.java
    │   │   │   ├── GlobalExceptionHandler.java
    │   │   │   └── ResourceNotFoundException.java
    │   │   ├── repository/           # Spring Data Repositories
    │   │   │   ├── BookingRepository.java
    │   │   │   ├── CouponRepository.java
    │   │   │   ├── MovieRepository.java
    │   │   │   ├── ShowRepository.java
    │   │   │   ├── ShowSeatRepository.java
    │   │   │   ├── SnackRepository.java
    │   │   │   ├── TheaterRepository.java
    │   │   │   └── UserRepository.java
    │   │   └── service/              # Core Business Logic & Seeding
    │   │       ├── AuthService.java
    │   │       ├── BookingService.java
    │   │       ├── CouponService.java
    │   │       ├── DataSeeder.java
    │   │       ├── MovieService.java
    │   │       ├── ShowService.java
    │   │       ├── SnackService.java
    │   │       └── TheaterService.java
    │   └── resources/
    │       └── application.yml
```

---

## 🔑 Key Features & Logic

1. **Authentication & Authorization**:
   - Register (`/api/auth/register`) & Login (`/api/auth/login`).
   - Generates stateless JWT tokens valid for 24 hours.

2. **Movie & Showtime Catalog**:
   - Movies catalog (`/api/movies`) supporting query parameters for `language`, `genre`, `format`, and title search `search`.
   - Theater listing (`/api/theaters`) and showtimes lookup (`/api/shows?movieId={id}&date={date}`).

3. **Smart Seat Selection & Locking**:
   - Real-time seat layout API (`/api/shows/{showId}/seats`) returning tiers (VIP, Premium, Regular) and status (`AVAILABLE` vs `BOOKED`).
   - Locks seats atomically when a booking is created to prevent double booking.

4. **Snack & Food Ordering**:
   - Movie snack list (`/api/snacks`) with price, category, calories, and description.
   - Computes snack subtotals and saves items linked to ticket bookings.

5. **Coupon & Discount Engine**:
   - Validates promo codes (`NOIR10`, `BMSLIKE`) via `/api/coupons/validate`.
   - Computes percentages, maximum discount caps, minimum order requirements.

6. **Booking & Fee Calculations**:
   - Automatically calculates subtotal, 6% convenience fee, discount deduction, and total payable amount.
   - Generates unique ticket codes (e.g. `BMS-8X92K`).

---

## 🛠️ REST API Specification

| Endpoint | Method | Public / Protected | Description |
|---|---|---|---|
| `/api/auth/register` | POST | Public | User Registration |
| `/api/auth/login` | POST | Public | User Login & JWT retrieval |
| `/api/auth/me` | GET | Protected | Get logged-in user profile |
| `/api/movies` | GET | Public | List & search movies (`language`, `genre`, `format`, `search`) |
| `/api/movies/{id}` | GET | Public | Get single movie details |
| `/api/theaters` | GET | Public | List all theaters |
| `/api/shows?movieId={id}&date={date}` | GET | Public | Get showtimes for movie |
| `/api/shows/{id}/seats` | GET | Public | Get interactive seat layout & status |
| `/api/snacks` | GET | Public | List movie snacks & combos |
| `/api/coupons/validate` | POST | Public | Validate coupon code & return discount amount |
| `/api/bookings` | POST | Public/Protected | Create a new ticket & snack booking |
| `/api/bookings/{id}` | GET | Public | Get booking confirmation details |
| `/api/bookings/my-bookings` | GET | Protected | Fetch user booking history |

---

## ⚙️ Running the Backend

### Prerequisites
- Java 17+ installed (`java -version`)
- Maven installed (`mvn -version`)

### Execution Command

```bash
cd backend
mvn spring-boot:run
```

The server will start at: `http://localhost:8080`

### H2 Database Console
Access the in-memory H2 database console at:
- **URL**: `http://localhost:8080/h2-console`
- **JDBC URL**: `jdbc:h2:mem:movieticketdb`
- **Username**: `sa`
- **Password**: *(leave empty)*

---

## 🧪 Demo Credentials

- **User Email**: `aarav@example.com`
- **Password**: `password123`
- **Admin Email**: `admin@movieticket.com`
- **Password**: `admin123`
- **Available Coupons**: `NOIR10` (10% off), `BMSLIKE` (20% off)
