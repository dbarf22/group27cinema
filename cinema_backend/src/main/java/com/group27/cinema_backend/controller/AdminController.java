package com.group27.cinema_backend.controller;

import com.group27.cinema_backend.model.Movie;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.group27.cinema_backend.dto.AddMovieRequest;
import com.group27.cinema_backend.dto.CreatePromotionRequest;
import com.group27.cinema_backend.dto.SendPromotionEmailRequest;
import com.group27.cinema_backend.service.AdminService;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/movies/add")
    public ResponseEntity<String> addMovie(@RequestBody Movie movie) {
        try {
            adminService.addMovie(movie);
            return ResponseEntity.ok("Movie added successfully!");
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/movies/{id}")
    public ResponseEntity<String> deleteMovie(@PathVariable Integer id) {
        try {
            adminService.deleteMovie(id);
            return ResponseEntity.ok("Movie deleted successfully!");
        }  catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/promotions/create")
    public ResponseEntity<String> createPromotion(@RequestBody CreatePromotionRequest request) {
        adminService.createPromotion(request);
        return ResponseEntity.ok("Promotion created successfully!");
    }

    @PostMapping("/promotions/send")
    public ResponseEntity<String> sendPromotionEmail(@RequestBody SendPromotionEmailRequest request) {
        int sent = adminService.sendPromotionEmail(request);
        return ResponseEntity.ok("Promotion email sent to " + sent + " users!");
    }
}