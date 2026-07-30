package com.movieticket.controller;

import com.movieticket.dto.ApiResponse;
import com.movieticket.dto.TmdbDTOs.TmdbMovieSummary;
import com.movieticket.entity.Movie;
import com.movieticket.service.TmdbService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tmdb")
public class TmdbController {

    private final TmdbService tmdbService;

    public TmdbController(TmdbService tmdbService) {
        this.tmdbService = tmdbService;
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<TmdbMovieSummary>>> searchMovies(@RequestParam(defaultValue = "") String query) {
        List<TmdbMovieSummary> results = tmdbService.searchMovies(query);
        return ResponseEntity.ok(ApiResponse.ok(results));
    }

    @GetMapping("/now-playing")
    public ResponseEntity<ApiResponse<List<TmdbMovieSummary>>> getNowPlaying() {
        List<TmdbMovieSummary> results = tmdbService.getNowPlaying();
        return ResponseEntity.ok(ApiResponse.ok(results));
    }

    @GetMapping("/popular")
    public ResponseEntity<ApiResponse<List<TmdbMovieSummary>>> getPopular() {
        List<TmdbMovieSummary> results = tmdbService.getPopular();
        return ResponseEntity.ok(ApiResponse.ok(results));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<ApiResponse<List<TmdbMovieSummary>>> getUpcoming() {
        List<TmdbMovieSummary> results = tmdbService.getUpcoming();
        return ResponseEntity.ok(ApiResponse.ok(results));
    }

    @GetMapping("/top-rated")
    public ResponseEntity<ApiResponse<List<TmdbMovieSummary>>> getTopRated() {
        List<TmdbMovieSummary> results = tmdbService.getTopRated();
        return ResponseEntity.ok(ApiResponse.ok(results));
    }

    @GetMapping("/bollywood")
    public ResponseEntity<ApiResponse<List<TmdbMovieSummary>>> getBollywood() {
        List<TmdbMovieSummary> results = tmdbService.getBollywoodMovies();
        return ResponseEntity.ok(ApiResponse.ok(results));
    }

    @GetMapping("/indian")
    public ResponseEntity<ApiResponse<List<TmdbMovieSummary>>> getIndian() {
        List<TmdbMovieSummary> results = tmdbService.getIndianMovies();
        return ResponseEntity.ok(ApiResponse.ok(results));
    }

    @PostMapping("/import/{tmdbId}")
    public ResponseEntity<ApiResponse<Movie>> importMovie(@PathVariable Long tmdbId) {
        Movie movie = tmdbService.importMovieByTmdbId(tmdbId);
        return ResponseEntity.ok(ApiResponse.ok("Movie imported successfully from TMDB", movie));
    }

    @PostMapping("/sync-popular")
    public ResponseEntity<ApiResponse<List<Movie>>> syncPopularMovies() {
        List<Movie> imported = tmdbService.syncPopularMovies();
        return ResponseEntity.ok(ApiResponse.ok("Synced top movies from TMDB successfully", imported));
    }
}
