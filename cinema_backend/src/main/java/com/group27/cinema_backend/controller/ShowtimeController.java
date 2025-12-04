package com.group27.cinema_backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.group27.cinema_backend.model.Showtime;
import com.group27.cinema_backend.repository.ShowtimeRepository;

@RestController
@RequestMapping("/api/showtimes")
@CrossOrigin(origins = "http://localhost:3000")
public class ShowtimeController {

    private final ShowtimeRepository showtimeRepository;

    public ShowtimeController(ShowtimeRepository showtimeRepository) {
        this.showtimeRepository = showtimeRepository;
    }

    // GET ALL showtimes for ALL movies
    @GetMapping
    public List<Showtime> getAllShowtimes() {
        return showtimeRepository.findAll();
    }

    @GetMapping("/{id}")
    public Showtime getShowtimeByID(@PathVariable Integer id) {
        return showtimeRepository.getShowtimeById(id);
    }

}
