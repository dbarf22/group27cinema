package com.group27.cinema_backend.controller;

import com.group27.cinema_backend.model.Card;
import com.group27.cinema_backend.model.User;
import com.group27.cinema_backend.repository.UserRepository;
import com.group27.cinema_backend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private PasswordEncoder cardEncoder;
    @Autowired
    private EmailService emailService;

    // REGISTRATION
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {

        // Check for duplicate email or username
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return new ResponseEntity<>("Email is already in use.", HttpStatus.BAD_REQUEST);
        }
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return new ResponseEntity<>("Username is already in use.", HttpStatus.BAD_REQUEST);
        }

        user.setHashedPassword(passwordEncoder.encode(user.getHashedPassword()));
        user.setStatus("Inactive");
        user.setVerificationToken(UUID.randomUUID().toString());

        if (user.getCards() != null) {
            for (Card card : user.getCards()) {
                card.setCardNumber(cardEncoder.encode(card.getCardNumber()));
                card.setUser(user);
            }
        }

        userRepository.save(user);

        String subject = "Verification Needed";
        String link = "http://localhost:8080/api/auth/verify?token=" + user.getVerificationToken();
        String body = "Please click the link in order to activate your account.\n" + link;
        emailService.sendEmail(user.getEmail(), subject, body);

        return new ResponseEntity<>("User registered successfully.", HttpStatus.CREATED);
    }

    // verification
    @GetMapping("verify")
    public ResponseEntity<?> verifyUser(@RequestParam("token") String token) {
        Optional<User> user = userRepository.findByVerificationToken(token);

        if (!user.isPresent()) {
            return new ResponseEntity<>("Verification token is invalid.", HttpStatus.BAD_REQUEST);
        }

        User user1 = user.get();
        user1.setStatus("Active");
        user1.setVerificationToken(null);
        userRepository.save(user1);

        return new ResponseEntity<>("Account successfully activated.", HttpStatus.OK);
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> payload) {


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

        Map<String, Object> userMap = new HashMap<>();
        userMap.put("email", user.getEmail());
        userMap.put("username", user.getUsername());
        userMap.put("phoneNumber", user.getPhoneNumber());
        userMap.put("firstName", user.getFirstName());
        userMap.put("lastName", user.getLastName());
        userMap.put("wantsPromotions", user.isWantsPromotions());
        userMap.put("cards", user.getCards());
        userMap.put("state", user.getState());
        userMap.put("zipCode", user.getZipCode());
        userMap.put("city", user.getCity());
        userMap.put("street", user.getStreet());

        Map<String, Object> responseData = Map.of(
                "message", "Login successful.",
                "user", userMap
        );

        return new ResponseEntity<>(responseData, HttpStatus.OK);
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
        if (!userOpt.isPresent()) {
            return new ResponseEntity<>("Invalid or expired token.", HttpStatus.BAD_REQUEST);
        }

        User user = userOpt.get();
        user.setHashedPassword(passwordEncoder.encode(payload.get("newPassword")));
        user.setVerificationToken(null);
        userRepository.save(user);

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
        Optional<User> userOpt = userRepository.findByEmail(updatedUser.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found.");
        }

        User user = userOpt.get();

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
                card.setUser(user);
                user.getCards().add(card);
            }
        }
        userRepository.save(user);
        return ResponseEntity.ok(
                Map.of("message", "Profile successfully edited.", "user", user)
        );
    }

}