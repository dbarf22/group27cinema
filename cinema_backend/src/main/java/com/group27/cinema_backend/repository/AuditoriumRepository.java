package com.group27.cinema_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.group27.cinema_backend.model.Auditorium;

public interface AuditoriumRepository extends JpaRepository<Auditorium, Integer> {
}
