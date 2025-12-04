package com.group27.cinema_backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.EnableScheduling;

import com.group27.cinema_backend.service.EmailService;

import jakarta.annotation.PostConstruct;

@SpringBootApplication
@EnableScheduling
public class CinemaBackendApplication {
    @Autowired
    private JavaMailSender mailSender;
    @PostConstruct
    public void init() {
        EmailService.INSTANCE.setMailSender(mailSender);
    }

	public static void main(String[] args) {
		SpringApplication.run(CinemaBackendApplication.class, args);
	}

}
