package com.group27.cinema_backend.service;

import java.time.Instant;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.group27.cinema_backend.model.Auditorium;
import com.group27.cinema_backend.model.Movie;
import com.group27.cinema_backend.model.Showtime;
import com.group27.cinema_backend.repository.AuditoriumRepository;
import com.group27.cinema_backend.repository.MovieRepository;
import com.group27.cinema_backend.repository.ShowtimeRepository;

@Service
@Transactional
public class ShowtimeService {

    private final ShowtimeRepository showtimeRepository;
    private final MovieRepository movieRepository;
    private final AuditoriumRepository auditoriumRepository;

    public ShowtimeService(ShowtimeRepository showtimeRepository,
                           MovieRepository movieRepository,
                           AuditoriumRepository auditoriumRepository) {
        this.showtimeRepository = showtimeRepository;
        this.movieRepository = movieRepository;
        this.auditoriumRepository = auditoriumRepository;
    }

    public List<Showtime> getShowtimesForMovie(Integer movieId) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new IllegalArgumentException("Movie not found: " + movieId));
        return showtimeRepository.findByMovie(movie);
    }

    public Showtime addShowtime(Integer movieId,
                                Integer auditoriumId,
                                Instant showtimeInstant,
                                Integer availableSeats) {

        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new IllegalArgumentException("Movie not found: " + movieId));

        Auditorium auditorium = null;
        if (auditoriumId != null) {
            auditorium = auditoriumRepository.findById(auditoriumId)
                    .orElseThrow(() -> new IllegalArgumentException("Auditorium not found: " + auditoriumId));
        }

        Showtime showtime = new Showtime();
        showtime.setMovie(movie);
        showtime.setAuditorium(auditorium);
        showtime.setShowtime(showtimeInstant);
        showtime.setAvailableSeats(availableSeats);

        return showtimeRepository.save(showtime);
    }

    public void deleteShowtime(Integer showtimeId) {
        showtimeRepository.deleteById(showtimeId);
    }

    public void replaceShowtimes(Integer movieId,
                                 List<Instant> showtimeInstants,
                                 Integer auditoriumId,
                                 Integer availableSeats) {

        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new IllegalArgumentException("Movie not found: " + movieId));

        // delete current showtimes
        List<Showtime> existing = showtimeRepository.findByMovie(movie);
        showtimeRepository.deleteAll(existing);

        Auditorium auditorium = null;
        if (auditoriumId != null) {
            auditorium = auditoriumRepository.findById(auditoriumId)
                    .orElseThrow(() -> new IllegalArgumentException("Auditorium not found: " + auditoriumId));
        }

        // add new ones
        for (Instant inst : showtimeInstants) {
            Showtime st = new Showtime();
            st.setMovie(movie);
            st.setAuditorium(auditorium);
            st.setShowtime(inst);
            st.setAvailableSeats(availableSeats);
            showtimeRepository.save(st);
        }
    }

    @Scheduled(fixedRate = 3600000) // updates every hour
    @Transactional
    public void updateAllScreeningStatuses() {
        List<Showtime> showtimes = showtimeRepository.findAll();
        for (Showtime st : showtimes) {
            st.setLastStatusCheck(Instant.now());  // update last_status_check to force trigger
            showtimeRepository.save(st);
        }
    }
}