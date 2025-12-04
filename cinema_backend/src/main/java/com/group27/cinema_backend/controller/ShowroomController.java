package com.group27.cinema_backend.controller;

import java.util.List;
import java.util.Set;

import com.group27.cinema_backend.model.Seat;
import org.springframework.web.bind.annotation.*;

import com.group27.cinema_backend.model.Auditorium;
import com.group27.cinema_backend.repository.AuditoriumRepository;

@RestController
@RequestMapping("/api/showrooms")
@CrossOrigin(origins = "http://localhost:3000")
public class ShowroomController {

    private final AuditoriumRepository auditoriumRepository;

    public ShowroomController(AuditoriumRepository auditoriumRepository) {
        this.auditoriumRepository = auditoriumRepository;
    }

    // GET /api/showrooms
    @GetMapping
    public List<Auditorium> getAllShowrooms() {
        return auditoriumRepository.findAll();
    }

    @GetMapping("/{id}/seats")
    public Set<Seat> getSeats(@PathVariable Integer id) {
        Auditorium a = auditoriumRepository.findAuditoriumById(id);
        return a.getSeats();
    }
}
