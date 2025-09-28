package com.group27.cinema_backend.controller;

import com.group27.cinema_backend.model.Movie;
import com.group27.cinema_backend.repository.MovieRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.*;

@RestController
public class GetController {

    private final MovieRepository movieRepository;

    public GetController(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    // leave the paramaters blank to list all movies
    // if you're searching by title make sure you don't include genre, and vice versa
    // Returns everything
    @GetMapping("/api/movies")
    public List<Movie> search(@RequestParam(required = false) String title,
                              @RequestParam(required = false) String genre) {
        if (title == null && genre == null) {
            return movieRepository.findAll();
        } else if (genre == null){
            return movieRepository.findByTitleContainingIgnoreCase(title);
        } else if (title == null) {
            return movieRepository.findByGenreContainingIgnoreCase(genre);
        }
        return movieRepository.findAll();
    }

    @GetMapping("/api/movies/{id}")
    public Movie getById(@PathVariable String id) {
        Movie m = movieRepository.findById(id).orElse(null);
        Movie n = new Movie();
        n.setTitle("Movie not found");
        return Objects.requireNonNullElse(m, n);
    }

    @GetMapping("/api/movies/trailer")
    public Map<String,String> getTrailer(@RequestParam(required = true) String id) {
        String trailer = movieRepository.findById(id)
                                    .map(Movie::getTrailer)
                                    .orElse("Movie not found");
    return Collections.singletonMap("trailer", trailer);
    }

    @GetMapping("/api/movies/poster")
    public Map<String,String> getPoster(@RequestParam(required = true) String id) {
        String poster = movieRepository.findById(id)
                                    .map(Movie::getPoster)
                                    .orElse("Movie not found");
    return Collections.singletonMap("poster", poster);
    }

}
