package com.movieticket.controller;

import com.movieticket.dto.ApiResponse;
import com.movieticket.entity.Movie;
import com.movieticket.service.MovieService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }


    @GetMapping
    public ResponseEntity<ApiResponse<List<Movie>>> getMovies(
            @RequestParam(required = false) String language,
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String format,
            @RequestParam(required = false) String search
    ) {
        List<Movie> movies = movieService.getAllMovies(language, genre, format, search);
        return ResponseEntity.ok(ApiResponse.ok(movies));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Movie>> getMovieById(@PathVariable String id) {
        Movie movie = movieService.getMovieById(id);
        return ResponseEntity.ok(ApiResponse.ok(movie));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Movie>> createMovie(@RequestBody Movie movie) {
        Movie saved = movieService.saveMovie(movie);
        return ResponseEntity.ok(ApiResponse.ok("Movie created successfully", saved));
    }
}
