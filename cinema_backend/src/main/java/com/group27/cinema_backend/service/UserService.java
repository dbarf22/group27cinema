package com.group27.cinema_backend.service;

import com.group27.cinema_backend.dto.RegisterRequest;
import com.group27.cinema_backend.model.Card;
import com.group27.cinema_backend.model.User;
import com.group27.cinema_backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;

    // These methods all used to be in auth controller but I am separating them now so AuthController
    // is strictly for routing http requests

    // Constructor class that ensures dependency injection through spring
    public UserService(UserRepository userRepository, PasswordEncoder encoder) {
        this.userRepository = userRepository;
        this.encoder = encoder;
    }

    // Check if a user is an admin or not through their user key
    public boolean findUserAccountType(String userKey) throws Exception {
        User user = userRepository.findByUserKey(userKey).orElseThrow(() -> new Exception("User not found"));
        if (user.getAccountType().equals("Admin")) {
            return true;
        } else {
            return false;
        }
    }

    // Register User method, takes User
    public User registerUser(RegisterRequest request) throws Exception {

        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new RuntimeException("Email is already in use");
        }
        if (userRepository.findByUsername(request.username()).isPresent()) {
            throw new RuntimeException("Username is already in use");
        }

        String token = UUID.randomUUID().toString();
        String encodedPassword = encoder.encode(request.password());
        String userKey = UUID.randomUUID().toString();

        // builder for user takes 3 required fields: username, email, password
        // it then
        User newUser = new User.Builder(request.username(), request.email(), encodedPassword)
                .firstName(request.firstName())
                .lastName(request.lastName())
                .phoneNumber(request.phoneNumber())
                .wantsPromotions(request.wantsPromotions())
                .street(request.street())
                .city(request.city())
                .state(request.state())
                .zipCode(request.zipCode())
                .cards(request.cards())
                .userKey(userKey)
                .status("Inactive")
                .verificationToken(token)
                .accountType("Customer")

                .build();

        if (newUser.getCards() != null) {
            for (Card card : newUser.getCards()) {
                int length = card.getCardNumber().length();
                card.setLastFour(card.getCardNumber().substring(length-4));
                card.setCardNumber(encoder.encode(card.getCardNumber()));
                card.setUser(newUser);
            }
        }

        userRepository.save(newUser);

        String subject = "Verification Needed";
        String link = "http://localhost:8080/api/auth/verify?token=" + newUser.getVerificationToken();
        String body = "Please click the link in order to activate your account.\n" + link;
        EmailService.INSTANCE.sendEmail(newUser.getEmail(), subject, body);
        return newUser;
    }

    // Verify user method, takes a token
    public User verifyUser(String token) throws Exception {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new Exception("User not found"));
        user.setStatus("Active");
        user.setVerificationToken("");
        userRepository.save(user);
        return user;
    }

    // Login user method, takes email and password to check against DB
    public User loginUser(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password."));
        String hashedPassword = user.getHashedPassword();

        if (!encoder.matches(password, user.getHashedPassword())) {
            throw new RuntimeException("Invalid email or password.");
        }

        if (!"Active".equals(user.getStatus())) {
            throw new RuntimeException("Account is not active.");
        }

        return user;
    }

    // Edit profile method takes an updated user and applies all changes to the DB
    //todo: make user builder pattern
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
                int length = card.getCardNumber().length();
                card.setLastFour(card.getCardNumber().substring(length-4));
                if (card.getCardNumber() != null || card.getCardNumber().isBlank()) {
                    card.setCardNumber(encoder.encode(card.getCardNumber()));
                }
                card.setUser(user);
                user.getCards().add(card);
            }
        }
        userRepository.save(user);
        return user;
    }

    // PASSWORD METHODS

    public void forgotPassword(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String token = UUID.randomUUID().toString();
            user.setVerificationToken(token);
            userRepository.save(user);

            String subject = "Verification Needed";
            String link = "http://localhost:3000/reset-password?token=" + user.getVerificationToken();
            String body = "Please click the link in order to change your password.\n" + link;
            EmailService.INSTANCE.sendEmail(user.getEmail(), subject, body);
        }
    }

    public void resetPassword(String token, String newPassword) throws Exception {
        Optional<User> userOpt = userRepository.findByVerificationToken(token);
        if (userOpt.isEmpty()) {
            throw new Exception("Invalid token");
        }

        User user = userOpt.get();
        user.setHashedPassword(encoder.encode(newPassword));
        user.setVerificationToken(null);
        userRepository.save(user);

        String subject = "Password has been changed successfully";
        String body = "Your password has been changed successfully.\n";
        EmailService.INSTANCE.sendEmail(user.getEmail(), subject, body);
    }

    public void changePassword(String email, String newPassword, String oldPassword) throws Exception {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new Exception("User not found.");
        }
        User user = userOpt.get();
        String hashedNewPassword = encoder.encode(newPassword);
        if (encoder.matches(oldPassword, user.getHashedPassword())) {
            user.setHashedPassword(hashedNewPassword);
            userRepository.save(user);

            String subject = "Password has been changed successfully";
            String body = "Your password has been changed successfully.\n";
            EmailService.INSTANCE.sendEmail(user.getEmail(), subject, body);
        } else {
            throw new Exception("Password is incorrect.");
        }
    }

}
