package com.group27.cinema_backend.dto;

import com.group27.cinema_backend.model.Card;
import com.group27.cinema_backend.model.User;
import java.util.List;

public class UserProfileDto {

    private String email;
    private String username;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private boolean wantsPromotions;
    private String street;
    private String city;
    private String state;
    private String zipCode;
    private List<Card> cards;


    public UserProfileDto(User user) {
        this.email = user.getEmail();
        this.username = user.getUsername();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.phoneNumber = user.getPhoneNumber();
        this.wantsPromotions = user.isWantsPromotions();
        this.street = user.getStreet();
        this.city = user.getCity();
        this.state = user.getState();
        this.zipCode = user.getZipCode();
        this.cards = user.getCards();
    }

    public String getEmail() {
        return email;
    }

    public String getUsername() {
        return username;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public boolean isWantsPromotions() {
        return wantsPromotions;
    }

    public String getStreet() {
        return street;
    }

    public String getCity() {
        return city;
    }

    public String getState() {
        return state;
    }

    public String getZipCode() {
        return zipCode;
    }

    public List<Card> getCards() {
        return cards;
    }
}