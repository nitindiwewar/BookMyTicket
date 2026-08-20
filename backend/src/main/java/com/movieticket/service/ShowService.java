package com.movieticket.service;

import com.movieticket.dto.ShowSeatDTO;
import com.movieticket.entity.Movie;
import com.movieticket.entity.Show;
import com.movieticket.entity.ShowSeat;
import com.movieticket.entity.Theater;
import com.movieticket.repository.MovieRepository;
import com.movieticket.repository.ShowRepository;
import com.movieticket.repository.ShowSeatRepository;
import com.movieticket.repository.TheaterRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShowService {

    private final ShowRepository showRepository;
    private final ShowSeatRepository showSeatRepository;
    private final TheaterRepository theaterRepository;
    private final MovieRepository movieRepository;

    public ShowService(ShowRepository showRepository, ShowSeatRepository showSeatRepository, TheaterRepository theaterRepository, MovieRepository movieRepository) {
        this.showRepository = showRepository;
        this.showSeatRepository = showSeatRepository;
        this.theaterRepository = theaterRepository;
        this.movieRepository = movieRepository;
    }



    public List<Show> getShowsByMovieAndDate(String movieId, LocalDate date) {
        if (date != null) {
            List<Show> list = showRepository.findByMovieIdAndDate(movieId, date);
            if (!list.isEmpty()) {
                return list;
            }
        }
        return showRepository.findByMovieId(movieId);
    }

    public Show getOrCreateShow(String showId, String movieId, String theaterId, String showDateStr, String showTime) {
        if (showId != null && !showId.trim().isEmpty()) {
            java.util.Optional<Show> existing = showRepository.findById(showId.trim());
            if (existing.isPresent()) {
                return existing.get();
            }
        }

        Movie movie = null;
        if (movieId != null && !movieId.trim().isEmpty()) {
            movie = movieRepository.findById(movieId.trim()).orElse(null);
        }

        Theater theater = null;
        if (theaterId != null && !theaterId.trim().isEmpty()) {
            theater = theaterRepository.findById(theaterId.trim()).orElse(null);
        }

        LocalDate date = LocalDate.now();
        if (showDateStr != null && !showDateStr.trim().isEmpty()) {
            try {
                date = LocalDate.parse(showDateStr.trim());
            } catch (Exception ignored) {}
        }

        String time = (showTime != null && !showTime.trim().isEmpty()) ? showTime.trim() : "19:30";

        // Try extracting movie or theater from showId if still unresolved
        if (showId != null) {
            if (movie == null) {
                for (Movie m : movieRepository.findAll()) {
                    if (showId.contains(m.getId())) {
                        movie = m;
                        break;
                    }
                }
            }
            if (theater == null) {
                for (Theater t : theaterRepository.findAll()) {
                    if (showId.contains(t.getId())) {
                        theater = t;
                        break;
                    }
                }
            }
        }

        if (movie == null) {
            movie = movieRepository.findAll().stream().findFirst().orElse(null);
        }
        if (theater == null) {
            theater = theaterRepository.findAll().stream().findFirst().orElse(null);
        }

        String finalShowId = (showId != null && !showId.trim().isEmpty())
                ? showId.trim()
                : "s-" + (movie != null ? movie.getId() : "m1") + "-" + (theater != null ? theater.getId() : "t1") + "-" + date + "-" + time.replace(":", "");

        Show newShow = Show.builder()
                .id(finalShowId)
                .movie(movie)
                .theater(theater)
                .date(date)
                .time(time)
                .basePrice(BigDecimal.valueOf(300))
                .build();

        return showRepository.save(newShow);
    }

    public Show getShowById(String id) {
        return getOrCreateShow(id, null, null, null, null);
    }

    public List<ShowSeatDTO> getShowSeats(String showId) {
        Show show = getShowById(showId);
        List<ShowSeat> seats = showSeatRepository.findByShowId(show.getId());

        // If seats not initialized for this show yet, generate initial seat map
        if (seats.isEmpty()) {
            seats = initializeSeatsForShow(show);
        }

        return seats.stream().map(s -> ShowSeatDTO.builder()
                .seatNumber(s.getSeatNumber())
                .tier(s.getTier().name())
                .status(s.getStatus().name())
                .price(s.getPrice())
                .build()
        ).collect(Collectors.toList());
    }

    public List<ShowSeat> initializeSeatsForShow(Show show) {
        List<ShowSeat> seats = new ArrayList<>();
        char[] rows = {'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'};

        for (char r : rows) {
            for (int col = 1; col <= 14; col++) {
                String seatNum = "" + r + col;
                ShowSeat.SeatTier tier;
                BigDecimal price;

                if (r == 'A' || r == 'B' || r == 'C') {
                    tier = ShowSeat.SeatTier.REGULAR; // Silver
                    price = BigDecimal.valueOf(180);
                } else if (r >= 'D' && r <= 'H') {
                    tier = ShowSeat.SeatTier.PREMIUM; // Gold
                    price = BigDecimal.valueOf(250);
                } else {
                    tier = ShowSeat.SeatTier.VIP; // Recliner
                    price = BigDecimal.valueOf(450);
                }

                seats.add(ShowSeat.builder()
                        .show(show)
                        .seatNumber(seatNum)
                        .tier(tier)
                        .status(ShowSeat.SeatStatus.AVAILABLE)
                        .price(price)
                        .build());
            }
        }
        return showSeatRepository.saveAll(seats);
    }
}
