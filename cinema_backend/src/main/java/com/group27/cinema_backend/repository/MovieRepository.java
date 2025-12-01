package com.group27.cinema_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.group27.cinema_backend.model.Movie;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Integer> {

    List<Movie> findByTitleContainingIgnoreCase(String title);
    List<Movie> findByGenreContainingIgnoreCase(String genre);

    Movie findByTitle(String title);

	long count();
}
