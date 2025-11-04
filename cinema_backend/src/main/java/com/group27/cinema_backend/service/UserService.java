package com.group27.cinema_backend.service;

import com.group27.cinema_backend.model.Card;
import com.group27.cinema_backend.model.User;
import com.group27.cinema_backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final EmailService emailService;

    // Constructor class that ensures dependency injection through spring
    public UserService(UserRepository userRepository, PasswordEncoder encoder,
                       EmailService emailService) {
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.emailService = emailService;
    }

    // Register User method, takes User
    public User registerUser(User user) throws Exception {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email is already in use");
        }
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Username is already in use");
        }

        user.setHashedPassword(encoder.encode(user.getHashedPassword()));
        user.setStatus("Inactive");
        user.setVerificationToken(UUID.randomUUID().toString());

        if (user.getCards() != null) {
            for (Card card : user.getCards()) {
                card.setCardNumber(encoder.encode(card.getCardNumber()));
                card.setUser(user);
            }
        }
        user.setAccountType("Customer");

        userRepository.save(user);

        String subject = "Verification Needed";
        String link = "http://localhost:8080/api/auth/verify?token=" + user.getVerificationToken();
        String body = "Please click the link in order to activate your account.\n" + link;
        emailService.sendEmail(user.getEmail(), subject, body);
        return user;
    }

    // Verify user method, takes a token
    public User verifyUser(String token) throws Exception {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new Exception("User not found"));
        user.setStatus("Active");
        user.setVerificationToken(null);
        userRepository.save(user);
        return user;
    }

    // Login user method, takes email and password to check against DB
    public User loginUser(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password."));

        if (!encoder.matches(password, user.getHashedPassword())) {
            throw new RuntimeException("Invalid email or password.");
        }

        if (!"Active".equals(user.getStatus())) {
            throw new RuntimeException("Account is not active.");
        }

        return user;
    }

    // Edit profile method takes an updated user and applies all changes to the DB
    public User editProfile(User updatedUser) {
        User user = userRepository.findByEmail(updatedUser.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found."));

        if (updatedUser.getFirstName() != null && !updatedUser.getFirstName().isBlank()) {
            user.setFirstName(updatedUser.getFirstName());
        }
        if (updatedUser.getLastName() != null && !updatedUser.getLastName().isBlank()) {
            user.setLastName(updatedUser.getLastName());
        }
        if (updatedUser.getPhoneNumber() != null && !updatedUser.getPhoneNumber().isBlank()) {
            user.setPhoneNumber(updatedUser.getPhoneNumber());
        }
        if (updatedUser.getUsername() != null && !updatedUser.getUsername().isBlank()) {
            user.setUsername(updatedUser.getUsername());
        }
        if (updatedUser.getStreet() != null && !updatedUser.getStreet().isBlank()) {
            user.setStreet(updatedUser.getStreet());
        }
        if (updatedUser.getCity() != null && !updatedUser.getCity().isBlank()) {
            user.setCity(updatedUser.getCity());
        }
        if (updatedUser.getState() != null && !updatedUser.getState().isBlank()) {
            user.setState(updatedUser.getState());
        }
        if (updatedUser.getZipCode() != null && !updatedUser.getZipCode().isBlank()) {
            user.setZipCode(updatedUser.getZipCode());
        }

        user.setWantsPromotions(updatedUser.isWantsPromotions());

        if (updatedUser.getCards() != null && !updatedUser.getCards().isEmpty()) {
            user.getCards().clear();
            for (Card card : updatedUser.getCards()) {
                card.setCardNumber(encoder.encode(card.getCardNumber()));
                card.setUser(user);
                user.getCards().add(card);
            }
        }
        userRepository.save(user);
        return user;
    }

}
