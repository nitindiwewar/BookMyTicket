package com.movieticket.service;

import com.movieticket.entity.*;
import com.movieticket.exception.ResourceNotFoundException;
import com.movieticket.repository.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TheaterService {

    private final TheaterRepository theaterRepository;
    private final MovieRepository movieRepository;
    private final ShowRepository showRepository;
    private final ShowSeatRepository showSeatRepository;

    public TheaterService(TheaterRepository theaterRepository, MovieRepository movieRepository, ShowRepository showRepository, ShowSeatRepository showSeatRepository) {
        this.theaterRepository = theaterRepository;
        this.movieRepository = movieRepository;
        this.showRepository = showRepository;
        this.showSeatRepository = showSeatRepository;
    }

    public void ensureShowsExist() {
        if (showRepository.count() == 0) {
            List<Movie> movies = movieRepository.findAll();
            List<Theater> theaters = theaterRepository.findAll();
            if (!movies.isEmpty() && !theaters.isEmpty()) {
                LocalDate today = LocalDate.now();
                List<LocalDate> dates = List.of(today, today.plusDays(1), today.plusDays(2), today.plusDays(3), today.plusDays(4), today.plusDays(5), today.plusDays(6));
                String[] times = {"11:00", "15:30", "19:15", "22:00"};

                List<Show> newShows = new ArrayList<>();
                for (Theater theater : theaters) {
                    for (Movie movie : movies) {
                        for (LocalDate date : dates) {
                            for (String time : times) {
                                String showId = "s-" + movie.getId() + "-" + theater.getId() + "-" + date.toString() + "-" + time.replace(":", "");
                                newShows.add(Show.builder()
                                        .id(showId)
                                        .movie(movie)
                                        .theater(theater)
                                        .date(date)
                                        .time(time)
                                        .basePrice(BigDecimal.valueOf(320))
                                        .build());
                            }
                        }
                    }
                }
                if (!newShows.isEmpty()) {
                    showRepository.saveAll(newShows);
                }
            }
        }
    }

    public void removeAllTheaters() {
        showSeatRepository.deleteAll();
        showRepository.deleteAll();
        theaterRepository.deleteAll();
    }

    public List<Theater> getAllTheaters() {
        return getAllTheaters(null);
    }

    public List<Theater> getAllTheaters(String city) {
        ensureShowsExist();

        if (city != null && !city.trim().isEmpty()) {
            String cleanCity = city.trim();
            String cLower = cleanCity.toLowerCase();
            List<String> tokens = Arrays.stream(cLower.split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList());

            List<Theater> matches = theaterRepository.findAll().stream()
                    .filter(t -> {
                        String tCity = t.getCity() != null ? t.getCity().toLowerCase() : "";
                        String tArea = t.getArea() != null ? t.getArea().toLowerCase() : "";
                        String tName = t.getName() != null ? t.getName().toLowerCase() : "";

                        return tokens.stream().anyMatch(token ->
                                tCity.contains(token) || token.contains(tCity) ||
                                tArea.contains(token) || token.contains(tArea) ||
                                tName.contains(token)
                        );
                    })
                    .collect(Collectors.toList());

            return matches;
        }

        return theaterRepository.findAll();
    }

    public List<Theater> getNearestTheaters(Double userLat, Double userLng, String city) {
        List<Theater> candidates = getAllTheaters(city);
        if (candidates.isEmpty()) {
            candidates = theaterRepository.findAll();
        }

        if (userLat == null || userLng == null) {
            return candidates;
        }

        final double uLat = userLat;
        final double uLng = userLng;

        return candidates.stream()
                .sorted(Comparator.comparingDouble(t -> {
                    if (t.getLatitude() == null || t.getLongitude() == null) return Double.MAX_VALUE;
                    return calculateHaversineDistance(uLat, uLng, t.getLatitude(), t.getLongitude());
                }))
                .collect(Collectors.toList());
    }

    private double calculateHaversineDistance(double lat1, double lon1, double lat2, double lon2) {
        double R = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    public Theater getTheaterById(String id) {
        return theaterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Theater not found with id: " + id));
    }
}
