package com.group27.cinema_backend.dto;

public record SendPromotionEmailRequest(
    String subject,
    String message,
    String promoCode,
    boolean subscribedOnly
) {}