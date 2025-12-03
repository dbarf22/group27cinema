package com.group27.cinema_backend.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "users")
public class User {

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JoinColumn(name = "user_type_id")
    private UserType userType;

    @Column(name = "token_created_at")
    private Instant tokenCreatedAt;

    @OneToMany(mappedBy = "user")
    @JsonManagedReference
    private Set<Booking> bookings = new LinkedHashSet<>();

    public String getUserKey() {
        return userKey;
    }

    public void setUserKey(String userKey) {
        this.userKey = userKey;
    }

    @Column(name = "user_key")
    private String userKey;

    // default constructor is empty. use the builder to create instances
    public User() {
    }

    // BUILDER

    public static class Builder {
        private final String username;
        private final String email;
        private final String hashedPassword;

        // Optional stuff
        private String firstName;
        private String lastName;
        private String phoneNumber;
        private boolean wantsPromotions;

        private String street;
        private String city;
        private String state;
        private String zipCode;

        private String userKey;

        // these are important values so we set them internally instead of
        // through a json request
        private String verificationToken;
        private String accountType = "Customer";
        private String status = "Inactive";

        private List<Card> cards = new ArrayList<>();

        public Builder(String username, String email, String hashedPassword) {
            this.username = username;
            this.email = email;
            this.hashedPassword = hashedPassword;
        }

        public Builder firstName(String value) {
            this.firstName = value;
            return this;
        }

        public Builder userKey(String value){
            this.userKey = value;
            return this;
        }

        public Builder lastName(String value) {
            this.lastName = value;
            return this;
        }

        public Builder phoneNumber(String value) {
            this.phoneNumber = value;
            return this;
        }

        public Builder status(String value) {
            this.status = value;
            return this;
        }

        public Builder wantsPromotions(boolean value) {
            this.wantsPromotions = value;
            return this;
        }

        public Builder verificationToken(String value) {
            this.verificationToken = value;
            return this;
        }

        public Builder street(String value) {
            this.street = value;
            return this;
        }

        public Builder city(String value) {
            this.city = value;
            return this;
        }

        public Builder state(String value) {
            this.state = value;
            return this;
        }

        public Builder zipCode(String value) {
            this.zipCode = value;
            return this;
        }

        public Builder accountType(String value) {
            this.accountType = value;
            return this;
        }

        public Builder cards(List<Card> value) {
            if (value != null) {
                this.cards = value;
            }
            return this;
        }

        public User build() {
            return new User(this);
        }
    }

    // user constructor that takes everything from the builder
    public User(Builder builder) {
        this.username = builder.username;
        this.email = builder.email;
        this.hashedPassword = builder.hashedPassword;
        this.firstName = builder.firstName;
        this.lastName = builder.lastName;
        this.phoneNumber = builder.phoneNumber;
        this.status = builder.status;
        this.wantsPromotions = builder.wantsPromotions;
        this.verificationToken = builder.verificationToken;
        this.street = builder.street;
        this.city = builder.city;
        this.state = builder.state;
        this.zipCode = builder.zipCode;
        this.userKey = builder.userKey;
        this.accountType = builder.accountType;
        if (builder.cards != null) {
            this.cards = builder.cards;
        }
    }

    // SQL COLUMNS

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer id;

    @Column(name = "username", nullable = false, unique = true, length = 50)
    private String username;

    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "first_name", length = 50)
    private String firstName;

    @Column(name = "last_name", length = 50)
    private String lastName;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(name = "hashed_password", nullable = false)
    private String hashedPassword;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "wants_promotions", nullable = false)
    private boolean wantsPromotions;

    @Column(name = "verification_token")
    private String verificationToken;

    @Column(name = "street")
    private String street;

    @Column(name = "city")
    private String city;

    @Column(name = "state")
    private String state;

    @Column(name = "zip_code")
    private String zipCode;

    @Column(name = "account_type")
    private String accountType;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<Card> cards = new ArrayList<>();

    public Set<Booking> getBookings() {
        return bookings;
    }

    public void setBookings(Set<Booking> bookings) {
        this.bookings = bookings;
    }

    public Instant getTokenCreatedAt() {
        return tokenCreatedAt;
    }

    public void setTokenCreatedAt(Instant tokenCreatedAt) {
        this.tokenCreatedAt = tokenCreatedAt;
    }

    // GETTERS AND SETTERS

    public String getAccountType() {
        return accountType;
    }

    public void setAccountType(String accountType) {
        this.accountType = accountType;
    }

    public UserType getUserType() {
        return userType;
    }

    public void setUserType(UserType userType) {
        this.userType = userType;
    }

    public List<Card> getCards() {
        return cards;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getZipCode() {
        return zipCode;
    }

    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getHashedPassword() {
        return hashedPassword;
    }

    public void setHashedPassword(String hashedPassword) {
        this.hashedPassword = hashedPassword;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isWantsPromotions() {
        return wantsPromotions;
    }

    public void setWantsPromotions(boolean wantsPromotions) {
        this.wantsPromotions = wantsPromotions;
    }

    public String getVerificationToken() {
        return verificationToken;
    }

    public void setVerificationToken(String verificationToken) {
        this.verificationToken = verificationToken;
    }
}
