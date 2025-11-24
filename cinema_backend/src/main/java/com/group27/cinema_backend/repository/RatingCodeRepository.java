package com.group27.cinema_backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.group27.cinema_backend.model.RatingCode;

@Repository
public interface RatingCodeRepository extends JpaRepository<RatingCode, Integer> {
    Optional<RatingCode> findByRatingCode(String ratingCode);
}