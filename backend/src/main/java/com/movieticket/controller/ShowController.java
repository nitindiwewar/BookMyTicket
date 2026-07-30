package com.movieticket.controller;

import com.movieticket.dto.ApiResponse;
import com.movieticket.dto.ShowSeatDTO;
import com.movieticket.entity.Show;
import com.movieticket.service.ShowService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/shows")
public class ShowController {

    private final ShowService showService;

    public ShowController(ShowService showService) {
        this.showService = showService;
    }


    @GetMapping
    public ResponseEntity<ApiResponse<List<Show>>> getShows(
            @RequestParam String movieId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        List<Show> shows = showService.getShowsByMovieAndDate(movieId, date);
        return ResponseEntity.ok(ApiResponse.ok(shows));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Show>> getShowById(@PathVariable String id) {
        Show show = showService.getShowById(id);
        return ResponseEntity.ok(ApiResponse.ok(show));
    }

    @GetMapping("/{id}/seats")
    public ResponseEntity<ApiResponse<List<ShowSeatDTO>>> getShowSeats(@PathVariable String id) {
        List<ShowSeatDTO> seats = showService.getShowSeats(id);
        return ResponseEntity.ok(ApiResponse.ok(seats));
    }
}
