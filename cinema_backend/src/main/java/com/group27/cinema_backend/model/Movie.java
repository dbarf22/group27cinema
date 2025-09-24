package com.group27.cinema_backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("movie")
public class Movie {

    @Id
    private String id;

    public String title;

    public int rating;

    public String description;

    public String poster;

    public String trailer;

    public String[] showtimes;

    public String genre;

    public Movie(String title, int rating, String description, String poster, String trailer, String genre, String[] showtimes) {
        this.title = title;
        this.rating = rating;
        this.description = description;
        this.poster = poster;
        this.trailer = trailer;
        this.showtimes = showtimes;
        this.genre = genre;
    }

    @Override
    public String toString() {
        return title;
    }

}
