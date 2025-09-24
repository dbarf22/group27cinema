package com.group27.cinema_backend.repository;

import com.group27.cinema_backend.model.Movie;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface MovieRepository extends MongoRepository<Movie, String> {

	@Query("{title:'?0'}")
	Movie findMovieByName(String name);

	public long count();
}
