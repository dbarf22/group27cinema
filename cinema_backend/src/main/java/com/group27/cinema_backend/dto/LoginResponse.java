package com.group27.cinema_backend.dto;

import com.group27.cinema_backend.model.User;


public class LoginResponse {
    private String message;
    private UserProfileDto user;

    public LoginResponse(String message, User user) {
        this.message = message;
        this.user = new UserProfileDto(user);
    }


    public String getMessage() { return message; }
    public UserProfileDto getUser() { return user; }
}