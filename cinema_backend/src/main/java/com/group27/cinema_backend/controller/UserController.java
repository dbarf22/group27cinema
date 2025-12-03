package com.group27.cinema_backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.group27.cinema_backend.dto.BookingHistoryDto;
import com.group27.cinema_backend.service.BookingService;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final BookingService bookingService;

    public UserController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<BookingHistoryDto>> getUserBookings(@RequestParam Integer userId) {
        // For testing pass as /api/user/bookings?userId=??)
        List<BookingHistoryDto> bookings = bookingService.getUserBookings(userId);
        return ResponseEntity.ok(bookings);
    }
}