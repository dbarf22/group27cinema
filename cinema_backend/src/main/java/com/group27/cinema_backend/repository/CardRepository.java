package com.group27.cinema_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.group27.cinema_backend.model.Card;

import java.util.Optional;


@Repository
public interface CardRepository extends JpaRepository<Card, Integer> {
    Optional<Card> findCardById(int id);

}
