package com.group27.cinema_backend.controller;

import com.group27.cinema_backend.model.Movie;
import com.group27.cinema_backend.repository.MovieRepository;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.ResponseEntity;

import java.util.*;

@RestController
public class GetController {

    private final MovieRepository movieRepository;

    public GetController(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    // leave the parameters blank to list all movies
    // if you're searching by title make sure you don't include genre, and vice versa
    // Returns everything
    @GetMapping("/api/movies")
    public List<Movie> search(@RequestParam(required = false) String title,
                              @RequestParam(required = false) String genre) {
        if (title == null && genre == null) {
            return movieRepository.findAll();
        } else if (genre == null) {
            return movieRepository.findByTitleContainingIgnoreCase(title);
        } else if (title == null) {
            return movieRepository.findByGenreContainingIgnoreCase(genre);
        }
        return movieRepository.findAll();
    }

    @GetMapping("/api/movies/{id}")
    public Movie getById(@PathVariable Integer id) {
        Movie m = movieRepository.findById(id).orElse(null);
        Movie n = new Movie();
        n.setTitle("Movie not found");
        return Objects.requireNonNullElse(m, n);
    }

    @GetMapping("/api/movies/trailer")
    public Map<String, String> getTrailer(@RequestParam Integer id) {
        String trailer = movieRepository.findById(id)
                .map(Movie::getTrailer)
                .orElse("Movie not found");
        return Collections.singletonMap("trailer", trailer);
    }

    @GetMapping("/api/movies/poster")
    public Map<String, String> getPoster(@RequestParam Integer id) {
        String poster = movieRepository.findById(id)
                .map(Movie::getPoster)
                .orElse("Movie not found");
        return Collections.singletonMap("poster", poster);
    }

    // PUT endpoint for updating movies
    @PutMapping("/api/movies/{id}")
    public ResponseEntity<?> updateMovie(@PathVariable Integer id, @RequestBody Movie movie) {
        Optional<Movie> existingMovie = movieRepository.findById(id);
        if (existingMovie.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        movie.setId(id);        // use setter, not movie.id
        Movie saved = movieRepository.save(movie);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/api/movies/{id}")
    public ResponseEntity<?> deleteMovie(@PathVariable int id) {
        movieRepository.deleteById(id);
        return ResponseEntity.ok("Movie has been deleted.");
    }


}
