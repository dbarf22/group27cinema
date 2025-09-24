package com.group27.cinema_backend;

import com.group27.cinema_backend.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;


@SpringBootApplication
@EnableMongoRepositories
public class CinemaBackendApplication implements CommandLineRunner {

    @Autowired
    MovieRepository movieRepository;

	public static void main(String[] args) {
		SpringApplication.run(CinemaBackendApplication.class, args);
	}

    @Override
    public void run (String... args) throws Exception{
        System.out.println(movieRepository.count());
        System.out.println("Hello");

    }

}
