package com.group27.cinema_backend.dto;

import java.util.List;

public class CheckoutRequest {

    // which screening (showtime) is being booked
    private Integer screeningId;

    // which seats (by seat_id) are chosen
    private List<Integer> seatIds;

    private int cardID;

    private int userID;

    private int promoID;

    private int seniorTickets;

    private int childTickets;

    private int adultTickets;

    public void setPromoID(int promoID) {
        this.promoID = promoID;
    }

    public int getSeniorTickets() {
        return seniorTickets;
    }

    public void setSeniorTickets(int seniorTickets) {
        this.seniorTickets = seniorTickets;
    }

    public int getChildTickets() {
        return childTickets;
    }

    public void setChildTickets(int childTickets) {
        this.childTickets = childTickets;
    }

    public int getAdultTickets() {
        return adultTickets;
    }

    public void setAdultTickets(int adultTickets) {
        this.adultTickets = adultTickets;
    }

    public int getPromoID() {
        return promoID;
    }

    public void setPromoID() {
        this.promoID = promoID;
    }

    public int getCardID() {
        return cardID;
    }

    public void setCardID(int cardID) {
        this.cardID = cardID;
    }

    public int getUserID() {
        return userID;
    }

    public void setUserID(int userID) {
        this.userID = userID;
    }

    public Integer getScreeningId() {
        return screeningId;
    }

    public void setScreeningId(Integer screeningId) {
        this.screeningId = screeningId;
    }

    public List<Integer> getSeatIds() {
        return seatIds;
    }

    public void setSeatIds(List<Integer> seatIds) {
        this.seatIds = seatIds;
    }
}
