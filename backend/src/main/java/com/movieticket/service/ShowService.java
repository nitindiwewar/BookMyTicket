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

    public Show getShowById(String id) {
        return showRepository.findById(id).orElseGet(() -> {
            Theater theater = null;
            Movie movie = null;

            if (id != null && id.contains("-")) {
                String[] parts = id.split("-");
                for (int i = 0; i < parts.length - 1; i++) {
                    String candidateId = parts[i] + "-" + parts[i + 1];
                    Theater found = theaterRepository.findById(candidateId).orElse(null);
                    if (found != null) {
                        theater = found;
                        break;
                    }
                }
            }

            if (theater == null) {
                theater = theaterRepository.findAll().stream().findFirst().orElse(null);
            }

            if (movie == null) {
                movie = movieRepository.findAll().stream().findFirst().orElse(null);
            }

            Show newShow = Show.builder()
                    .id(id)
                    .movie(movie)
                    .theater(theater)
                    .date(LocalDate.now())
                    .time("18:00")
                    .basePrice(BigDecimal.valueOf(320))
                    .build();

            return showRepository.save(newShow);
        });
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

    private List<ShowSeat> initializeSeatsForShow(Show show) {
        List<ShowSeat> seats = new ArrayList<>();
        char[] rows = {'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'};

        for (char r : rows) {
            for (int col = 1; col <= 10; col++) {
                String seatNum = "" + r + col;
                ShowSeat.SeatTier tier;
                if (r == 'A' || r == 'B') tier = ShowSeat.SeatTier.VIP;
                else if (r >= 'C' && r <= 'F') tier = ShowSeat.SeatTier.PREMIUM;
                else tier = ShowSeat.SeatTier.REGULAR;

                seats.add(ShowSeat.builder()
                        .show(show)
                        .seatNumber(seatNum)
                        .tier(tier)
                        .status(ShowSeat.SeatStatus.AVAILABLE)
                        .price(show.getBasePrice() != null ? show.getBasePrice() : BigDecimal.valueOf(300))
                        .build());
            }
        }
        return showSeatRepository.saveAll(seats);
    }
}
