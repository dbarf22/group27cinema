package com.group27.cinema_backend.dto;

import com.group27.cinema_backend.model.Card;

import java.util.List;

public record RegisterRequest(
        String username,
        String email,
        String firstName,
        String lastName,
        String password,
        boolean wantsPromotions,
        String phoneNumber,
        String street,
        String city,
        String state,
        String zipCode,
        List<Card> cards
) {}
