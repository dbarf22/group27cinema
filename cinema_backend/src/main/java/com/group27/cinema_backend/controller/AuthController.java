package com.group27.cinema_backend.controller;

import com.group27.cinema_backend.dto.LoginRequest;
import com.group27.cinema_backend.dto.LoginResponse;
import com.group27.cinema_backend.dto.RegisterRequest;
import com.group27.cinema_backend.model.User;
import com.group27.cinema_backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    // This class is strictly for managing http requests now, and we offload all the actual work into facades

    //Spring dependency injection. We made userService a bean in the service package, and now
    // we are injecting it into AuthController. Spring will manage the instance of this userservice
    private final UserService userService;

    AuthController(UserService userService) {
        this.userService = userService;
    }

    // REGISTRATION
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        try {
            userService.registerUser(registerRequest);
            return new ResponseEntity<>("User registered successfully. " + "Please check your email for a verification link.", HttpStatus.CREATED);
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
            return new ResponseEntity<>("There was an error creating the account.", HttpStatus.BAD_REQUEST);
        }
    }

    // Login uses a new dto to ensure stuff sent to the frontend doesn't include password
    // the loginresponse body is found in the dto package. frontend request for a login
    // includes username and password wrapped in loginrequest object
    // this method then
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            User user = userService.loginUser(loginRequest.email(), loginRequest.password());
            LoginResponse response = new LoginResponse("Login successful.", user);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return new ResponseEntity<>("There was an error logging in.", HttpStatus.UNAUTHORIZED);
        }
    }

    // FORGOT PASSWORD
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        try {
            userService.forgotPassword(email);
            return ResponseEntity.ok("If account exists, a reset password link has been sent.");
        } catch (Exception e) {
            return new ResponseEntity<>("There was an error trying to reset your password.", HttpStatus.BAD_REQUEST);
        }

    }

    // RESET PASSWORD
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam("token") String token, @RequestBody Map<String, String> payload) {
        try {
            userService.resetPassword(token, payload.get("newPassword"));
            return new ResponseEntity<>("Password reset successfully.", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("There was an error resetting your password.", HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> payload) throws Exception {
        if (payload.containsKey("newPassword") && payload.containsKey("email") && payload.containsKey("password")) {
            userService.changePassword(payload.get("email"), payload.get("newPassword"), payload.get("password"));
            return new ResponseEntity<>("Password changed successfully.", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Fill out all fields.", HttpStatus.BAD_REQUEST);
        }
    }


    // Edit Profile
    // uses loginresponse to ensure user is converted to a dto so we don't send password
    // back by accident
    @PostMapping("/edit-profile")
    public ResponseEntity<?> editProfile(@RequestBody User updatedUser) {
        try {
            User user = userService.editProfile(updatedUser);
            LoginResponse response = new LoginResponse("Profile successfully edited.", user);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return new ResponseEntity<>("There was an error trying to edit your profile.", HttpStatus.BAD_REQUEST);
        }
    }
}