package com.group27.cinema_backend.model;

import jakarta.persistence.*;

import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "movies")
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "movie_id", nullable = false)
    private Integer id;

    @Column(name = "title", length = 50)
    private String title;

    @Column(name = "cast_list", length = 500)
    private String castList;

    @Column(name = "producer", length = 50)
    private String producer;

    @Column(name = "duration")
    private Integer duration;

    @Column(name = "poster", nullable = false)
    private String poster;

    @Column(name = "trailer", nullable = false)
    private String trailer;

    @Column(name = "rating")
    private Float rating;

    @ManyToOne()
    @JoinColumn(name = "rating_id")
    private RatingCode rating1;

    @Column(name = "description")
    private String description;

    @Column(name = "genre", length = 50)
    private String genre;

    @OneToMany
    @JoinColumn(name = "movie_id")
    private Set<Showtime> showtimes = new LinkedHashSet<>();

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCastList() {
        return castList;
    }

    public void setCastList(String castList) {
        this.castList = castList;
    }

    public String getProducer() {
        return producer;
    }

    public void setProducer(String producer) {
        this.producer = producer;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public String getPoster() {
        return poster;
    }

    public void setPoster(String poster) {
        this.poster = poster;
    }

    public String getTrailer() {
        return trailer;
    }

    public void setTrailer(String trailer) {
        this.trailer = trailer;
    }

    public Float getRating() {
        return rating;
    }

    public void setRating(Float rating) {
        this.rating = rating;
    }

    public RatingCode getRating1() {
        return rating1;
    }

    public void setRating1(RatingCode rating1) {
        this.rating1 = rating1;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public Set<Showtime> getShowtimes() {
        return showtimes;
    }

    public void setShowtimes(Set<Showtime> showtimes) {
        this.showtimes = showtimes;
    }

}