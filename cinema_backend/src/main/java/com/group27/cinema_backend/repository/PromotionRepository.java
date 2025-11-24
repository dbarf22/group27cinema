package com.group27.cinema_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.group27.cinema_backend.model.Promotion;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Integer> {
}