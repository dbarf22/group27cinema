package com.group27.cinema_backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
