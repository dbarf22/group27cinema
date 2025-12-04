package com.group27.cinema_backend.repository;

import java.time.Instant;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.group27.cinema_backend.model.Auditorium;
import com.group27.cinema_backend.model.Movie;
import com.group27.cinema_backend.model.Showtime;

public interface ShowtimeRepository extends JpaRepository<Showtime, Integer> {

    List<Showtime> findByMovie(Movie movie);

    List<Showtime> findByMovieAndAuditorium(Movie movie, Auditorium auditorium);

    List<Showtime> findByMovieAndShowtimeAfter(Movie movie, Instant after);

    Showtime getShowtimeById(Integer id);
}
