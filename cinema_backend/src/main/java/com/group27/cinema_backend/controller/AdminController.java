package com.group27.cinema_backend.controller;

import com.group27.cinema_backend.dto.AddMovieRequest;
import com.group27.cinema_backend.dto.CreatePromotionRequest;
import com.group27.cinema_backend.dto.SendPromotionEmailRequest;
import com.group27.cinema_backend.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/movies/add")
    public ResponseEntity<String> addMovie(@RequestBody AddMovieRequest request) {
        adminService.addMovie(request);
        return ResponseEntity.ok("Movie added successfully!");
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