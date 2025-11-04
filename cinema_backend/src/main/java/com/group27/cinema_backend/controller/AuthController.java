package com.group27.cinema_backend.controller;

import com.group27.cinema_backend.dto.LoginRequest;
import com.group27.cinema_backend.dto.LoginResponse;
import com.group27.cinema_backend.model.Card;
import com.group27.cinema_backend.model.User;
import com.group27.cinema_backend.repository.UserRepository;
import com.group27.cinema_backend.service.EmailService;
import com.group27.cinema_backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    //Spring dependency injection. We made userService a bean in the service package, and now
    // we are injecting it into AuthController. Spring will manage the instance of this userservice
    private final UserService userService;

    AuthController(UserService userService) {
        this.userService = userService;
    }

    // REGISTRATION
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            userService.registerUser(user);
            return new ResponseEntity<>("User registered successfully. " +
                    "Please check your email for a verification link.", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // verification
    @GetMapping("verify")
    public ResponseEntity<?> verifyUser(@RequestParam("token") String token) {
        try {
            userService.verifyUser(token);
            return new ResponseEntity<>("Account successfully activated.", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Login uses a new dto to ensure stuff sent to the frontend doesnt include password
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            User user = userService.loginUser(loginRequest.email(), loginRequest.password());
            LoginResponse response = new LoginResponse("Login successful.", user);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.UNAUTHORIZED);
        }
    }

    // FORGOT PASSWORD
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String token = UUID.randomUUID().toString();
            user.setVerificationToken(token);
            userRepository.save(user);

            String subject = "Verification Needed";
            String link = "http://localhost:3000/reset-password?token=" + user.getVerificationToken();
            String body = "Please click the link in order to change your password.\n" + link;
            emailService.sendEmail(user.getEmail(), subject, body);
        }

        return ResponseEntity.ok("If account exists, a reset password link has been sent.");
    }

    // RESET PASSWORD
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam("token") String token, @RequestBody Map<String, String> payload) {
        Optional<User> userOpt = userRepository.findByVerificationToken(token);
        if (userOpt.isEmpty()) {
            return new ResponseEntity<>("Invalid or expired token.", HttpStatus.BAD_REQUEST);
        }

        User user = userOpt.get();
        user.setHashedPassword(passwordEncoder.encode(payload.get("newPassword")));
        user.setVerificationToken(null);
        userRepository.save(user);

        String subject = "Password has been changed successfully";
        String body = "Your password has been changed successfully.\n";
        emailService.sendEmail(user.getEmail(), subject, body);

        return ResponseEntity.ok("Password has been reset successfully.");
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> payload) {
        if (payload.containsKey("newPassword") && payload.containsKey("email") && payload.containsKey("password")) {

            Optional<User> userOpt = userRepository.findByEmail(payload.get("email"));
            if (userOpt.isEmpty()) {
                return new ResponseEntity<>("User not found.", HttpStatus.NOT_FOUND);
            }

            User user = userOpt.get();

            String hashedNewPassword = passwordEncoder.encode(payload.get("newPassword"));

            if (passwordEncoder.matches(payload.get("password"), user.getHashedPassword())) {
                user.setHashedPassword(hashedNewPassword);
                userRepository.save(user);

                String subject = "Password has been changed successfully";
                String body = "Your password has been changed successfully.\n";
                emailService.sendEmail(user.getEmail(), subject, body);

                return new ResponseEntity<>(HttpStatus.OK);


            } else {
                return new ResponseEntity<>("Password is incorrect.", HttpStatus.BAD_REQUEST);
            }

        } else {
            return new ResponseEntity<>("Fill out all fields.", HttpStatus.BAD_REQUEST);
        }
    }


    // Edit Profile
    @PostMapping("/edit-profile")
    public ResponseEntity<?> editProfile(@RequestBody User updatedUser) {
        try {
            User user = userService.editProfile(updatedUser);
            LoginResponse response = new LoginResponse("Profile successfully edited.", user);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }
}