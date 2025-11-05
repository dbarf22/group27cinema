package com.group27.cinema_backend.model;

import jakarta.persistence.*;

import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "rating_codes")
public class RatingCode {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rating_id", nullable = false)
    private Integer id;

    @Column(name = "rating_code", length = 10)
    private String ratingCode;

    @OneToMany(mappedBy = "rating")
    private Set<Movie1> movies = new LinkedHashSet<>();

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getRatingCode() {
        return ratingCode;
    }

    public void setRatingCode(String ratingCode) {
        this.ratingCode = ratingCode;
    }

    public Set<Movie1> getMovies() {
        return movies;
    }

    public void setMovies(Set<Movie1> movies) {
        this.movies = movies;
    }

}