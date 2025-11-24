package com.group27.cinema_backend.dto;

import java.time.LocalDate;

public record CreatePromotionRequest(
    String promoCode,
    Integer discount,
    LocalDate startDate,
    LocalDate endDate,
    String description
) {}