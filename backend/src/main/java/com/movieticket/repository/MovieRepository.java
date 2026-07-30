package com.movieticket.repository;

import com.movieticket.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, String> {

    @Query("SELECT DISTINCT m FROM Movie m " +
           "LEFT JOIN m.genre g " +
           "LEFT JOIN m.format f " +
           "WHERE (:language IS NULL OR LOWER(m.language) = LOWER(:language)) " +
           "AND (:genre IS NULL OR LOWER(g) = LOWER(:genre)) " +
           "AND (:format IS NULL OR LOWER(f) = LOWER(:format)) " +
           "AND (:search IS NULL OR LOWER(m.title) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Movie> filterMovies(
            @Param("language") String language,
            @Param("genre") String genre,
            @Param("format") String format,
            @Param("search") String search
    );
}
