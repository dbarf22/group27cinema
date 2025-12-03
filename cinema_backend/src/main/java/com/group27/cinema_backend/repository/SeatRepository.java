package com.group27.cinema_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.group27.cinema_backend.model.Seat;

public interface SeatRepository extends JpaRepository<Seat, Integer> {
    
}
