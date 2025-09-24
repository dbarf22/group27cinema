package com.group27.cinema_backend.controller;

import com.group27.cinema_backend.model.Movie;
import com.group27.cinema_backend.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class GetController {

    private final MovieRepository movieRepository;

    public GetController(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    // leave the paramaters blank to list all movies
    // if you're searching by title make sure you don't include genre, and vice versa
    @GetMapping("/api/movies")
    public List<Movie> search(@RequestParam(required = false) String title,
                              @RequestParam(required = false) String genre) {
        if (title == null && genre == null) {
            return movieRepository.findAll();
        } else if (genre == null){
            return movieRepository.findByTitleContainingIgnoreCase(title);
        } else if (title == null) {
            return movieRepository.findByTitleContainingIgnoreCase(genre);
        }
        return movieRepository.findAll();
    }

}
