package com.movieticket.repository;

import com.movieticket.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findFirstByEmailOrderByCreatedAtDesc(String email);
    Optional<User> findFirstByMobileOrderByCreatedAtDesc(String mobile);
    List<User> findAllByMobile(String mobile);
    Boolean existsByEmail(String email);
}


