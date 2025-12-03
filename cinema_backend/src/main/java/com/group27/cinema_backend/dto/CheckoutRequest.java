package com.group27.cinema_backend.dto;

import java.util.List;

public class CheckoutRequest {

    // which screening (showtime) is being booked
    private Integer screeningId;

    // which seats (by seat_id) are chosen
    private List<Integer> seatIds;

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
