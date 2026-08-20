package com.movieticket.service;

import com.movieticket.entity.Movie;
import com.movieticket.exception.ResourceNotFoundException;
import com.movieticket.repository.MovieRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MovieService {

    private final MovieRepository movieRepository;

    public MovieService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    @Cacheable(value = "movies", key = "{#language, #genre, #format, #search}")
    public List<Movie> getAllMovies(String language, String genre, String format, String search) {
        String cleanLang = (language != null && !language.trim().isEmpty()) ? language.trim() : null;
        String cleanGenre = (genre != null && !genre.trim().isEmpty()) ? genre.trim() : null;
        String cleanFormat = (format != null && !format.trim().isEmpty()) ? format.trim() : null;
        String cleanSearch = (search != null && !search.trim().isEmpty()) ? search.trim() : null;
        return movieRepository.filterMovies(cleanLang, cleanGenre, cleanFormat, cleanSearch);
    }

    @Cacheable(value = "movie-by-id", key = "#id")
    public Movie getMovieById(String id) {
        return movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with ID: " + id));
    }

    @CacheEvict(value = {"movies", "movie-by-id"}, allEntries = true)
    public Movie saveMovie(Movie movie) {
        return movieRepository.save(movie);
    }
}
