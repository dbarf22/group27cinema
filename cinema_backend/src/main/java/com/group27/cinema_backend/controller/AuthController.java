package com.group27.cinema_backend.controller;

import com.group27.cinema_backend.model.User;
import com.group27.cinema_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // REGISTRATION
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> payload) {

        // Check for duplicate email or username
        if (userRepository.findByEmail(payload.get("email")).isPresent()) {
            return new ResponseEntity<>("Email is already in use.", HttpStatus.BAD_REQUEST);
        }
        if (userRepository.findByUsername(payload.get("username")).isPresent()) {
            return new ResponseEntity<>("Username is already in use.", HttpStatus.BAD_REQUEST);
        }

        User user = new User();
        user.setUsername(payload.get("username"));
        user.setFirstName(payload.get("firstName"));
        user.setLastName(payload.get("lastName"));
        user.setEmail(payload.get("email"));
        user.setPhoneNumber(payload.get("phoneNumber"));

        // store hashed password
        user.setHashedPassword(passwordEncoder.encode(payload.get("password")));
        // store if they want promotions
        user.setWantsPromotions(Boolean.parseBoolean(payload.get("wantsPromotions")));

        // todo: EMAIL VERIFICATION!
        user.setStatus("Active");

        userRepository.save(user);

        return new ResponseEntity<>("User registered successfully.", HttpStatus.CREATED);
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> payload) {
        // check db for email
        Optional<User> userOpt = userRepository.findByEmail(payload.get("email"));

        if (!userOpt.isPresent()) {
            return new ResponseEntity<>("Invalid email or password.", HttpStatus.UNAUTHORIZED);
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(payload.get("password"), user.getHashedPassword())) {
            return new ResponseEntity<>("Invalid email or password.", HttpStatus.UNAUTHORIZED);
        }

        if (!"Active".equals(user.getStatus())) {
            return new ResponseEntity<>("Account is not active.", HttpStatus.FORBIDDEN);
        }
        return ResponseEntity.ok(Map.of("message", "Login Successful"));
    }

    // FORGOT PASSWORD
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> payload) {
        Optional<User> userOpt = userRepository.findByEmail(payload.get("email"));

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String token = UUID.randomUUID().toString();
            user.setVerificationToken(token);
            userRepository.save(user);

            // todo: implement email and password reset
            System.out.println("PASSWORD RESET TOKEN for " + user.getEmail() + ": " + token);
        }

        return ResponseEntity.ok("If an account exists, a reset token has been generated.");
    }

    // RESET PASSWORD
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam("token") String token, @RequestBody Map<String, String> payload) {
        Optional<User> userOpt = userRepository.findByVerificationToken(token);
        if (!userOpt.isPresent()) {
            return new ResponseEntity<>("Invalid or expired token.", HttpStatus.BAD_REQUEST);
        }

        User user = userOpt.get();
        user.setHashedPassword(passwordEncoder.encode(payload.get("newPassword")));
        user.setVerificationToken(null);
        userRepository.save(user);

        return ResponseEntity.ok("Password has been reset successfully.");
    }
}