package com.group27.cinema_backend.model;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
//import com.group27.cinema_backend.repository.MovieRepository;

@SpringBootApplication
@EnableMongoRepositories
public class CinemaBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(CinemaBackendApplication.class, args);
	}




}
