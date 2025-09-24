package com.group27.cinema_backend.repository;

import com.group27.cinema_backend.model.Movie;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MovieRepository extends MongoRepository<Movie, String> {

    List<Movie> findByTitleContainingIgnoreCase(String title);
    List<Movie> findByGenre(String genre);

	public long count();
}
