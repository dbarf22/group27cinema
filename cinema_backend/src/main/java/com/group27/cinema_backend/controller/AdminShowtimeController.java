package com.group27.cinema_backend.controller;

import java.time.Instant;
import java.util.List;
import java.util.Map;

import com.group27.cinema_backend.model.Auditorium;
import com.group27.cinema_backend.repository.AuditoriumRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.group27.cinema_backend.model.Showtime;
import com.group27.cinema_backend.service.ShowtimeService;

@RestController
@RequestMapping("/api/admin/movies/{movieId}/showtimes")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminShowtimeController {

    private final ShowtimeService showtimeService;
    private final AuditoriumRepository auditoriumRepository;

    public AdminShowtimeController(ShowtimeService showtimeService, AuditoriumRepository auditoriumRepository) {
        this.showtimeService = showtimeService;
        this.auditoriumRepository = auditoriumRepository;
    }

    // GET all showtimes for a movie
    @GetMapping
    public List<Showtime> getShowtimes(@PathVariable Integer movieId) {
        return showtimeService.getShowtimesForMovie(movieId);
    }

    // POST: add a single showtime
    // body: { "showtime": "2025-11-21T19:00:00Z", "auditoriumId": 3, "availableSeats": 120 }
    @PostMapping
    public ResponseEntity<Showtime> addShowtime(
            @PathVariable Integer movieId,
            @RequestBody Map<String, Object> body
    ) {
        String showtimeStr = (String) body.get("showtime");
        Integer auditoriumId = body.get("auditoriumId") == null ? null : (Integer) body.get("auditoriumId");
        Auditorium a = auditoriumRepository.findAuditoriumById(auditoriumId);
        int availableSeats = a.getNumberOfSeats();

        Instant inst = Instant.parse(showtimeStr);

        Showtime created = showtimeService.addShowtime(movieId, auditoriumId, inst, availableSeats);
        return ResponseEntity.ok(created);
    }

    // PUT: replace all showtimes for a movie
    // body: { "showtimes": ["2025-11-21T19:00:00Z", "2025-11-21T21:30:00Z"], "auditoriumId": 3, "availableSeats": 120 }
    @PutMapping
    public ResponseEntity<Void> replaceShowtimes(
            @PathVariable Integer movieId,
            @RequestBody Map<String, Object> body
    ) {
        @SuppressWarnings("unchecked")
        List<String> showtimeStrings = (List<String>) body.get("showtimes");
        Integer auditoriumId = body.get("auditoriumId") == null ? null : (Integer) body.get("auditoriumId");
        Integer availableSeats = body.get("availableSeats") == null ? 0 : (Integer) body.get("availableSeats");

        List<Instant> instants = showtimeStrings.stream()
                .map(Instant::parse)
                .toList();

        showtimeService.replaceShowtimes(movieId, instants, auditoriumId, availableSeats);
        return ResponseEntity.ok().build();
    }

    // DELETE one showtime
    @DeleteMapping("/{showtimeId}")
    public ResponseEntity<Void> deleteShowtime(@PathVariable Integer showtimeId) {
        showtimeService.deleteShowtime(showtimeId);
        return ResponseEntity.noContent().build();
    }
}
