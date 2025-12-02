package com.group27.cinema_backend;

import com.group27.cinema_backend.service.EmailService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.mail.javamail.JavaMailSender;

@SpringBootApplication
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
