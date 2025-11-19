package com.group27.cinema_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.group27.cinema_backend.model.Movie;

@Repository
public interface JpaMovieRepository extends JpaRepository<Movie, Integer> {
}