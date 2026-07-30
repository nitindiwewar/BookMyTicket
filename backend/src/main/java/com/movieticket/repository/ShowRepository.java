package com.movieticket.repository;

import com.movieticket.entity.Show;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ShowRepository extends JpaRepository<Show, String> {
    List<Show> findByMovieIdAndDate(String movieId, LocalDate date);
    List<Show> findByMovieId(String movieId);
}
