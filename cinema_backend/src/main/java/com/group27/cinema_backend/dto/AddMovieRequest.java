package com.group27.cinema_backend.dto;

import java.util.List;

public record AddMovieRequest(
    String title,
    String castList,
    String producer,
    Integer duration,
    String poster,
    String trailer,
    Float reviewScore,
    String ratingCode,
    String description,
    List<String> genres
) {}