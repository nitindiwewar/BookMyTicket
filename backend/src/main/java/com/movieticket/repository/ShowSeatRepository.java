package com.movieticket.repository;

import com.movieticket.entity.ShowSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShowSeatRepository extends JpaRepository<ShowSeat, Long> {
    List<ShowSeat> findByShowId(String showId);
    Optional<ShowSeat> findByShowIdAndSeatNumber(String showId, String seatNumber);
    List<ShowSeat> findByShowIdAndSeatNumberIn(String showId, List<String> seatNumbers);
}

