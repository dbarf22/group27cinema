package com.group27.cinema_backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.group27.cinema_backend.dto.BookingHistoryDto;
import com.group27.cinema_backend.model.User;
import com.group27.cinema_backend.repository.UserRepository;
import com.group27.cinema_backend.service.BookingService;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final BookingService bookingService;
    private final UserRepository userRepository;

    public UserController(BookingService bookingService, UserRepository userRepository) {
        this.bookingService = bookingService;
        this.userRepository = userRepository;
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<BookingHistoryDto>> getUserBookings(@RequestParam String userKey) {
        User user = userRepository.findByUserKey(userKey)
                .orElseThrow(() -> new RuntimeException("User not found for userKey: " + userKey));

        Integer userId = user.getId();

        List<BookingHistoryDto> bookings = bookingService.getUserBookings(userId);
        return ResponseEntity.ok(bookings);
    }
}