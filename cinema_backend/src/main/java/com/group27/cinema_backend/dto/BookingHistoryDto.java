package com.group27.cinema_backend.dto;

import java.math.BigDecimal;

public class BookingHistoryDto {
    private Integer bookingId;
    private String cardLastFour;
    private Integer numberOfTickets;
    private BigDecimal totalPrice;
    private String movieTitle;
    private String screeningTime;
    private String theaterName;
    private String promotionCode;
    private Integer promotionDiscount;
    private String userEmail;

    public BookingHistoryDto(Integer bookingId, String cardLastFour, Integer numberOfTickets, BigDecimal totalPrice, String movieTitle, String screeningTime, String theaterName, String promotionCode, Integer promotionDiscount, String userEmail) {
        this.bookingId = bookingId;
        this.cardLastFour = cardLastFour;
        this.numberOfTickets = numberOfTickets;
        this.totalPrice = totalPrice;
        this.movieTitle = movieTitle;
        this.screeningTime = screeningTime;
        this.theaterName = theaterName;
        this.promotionCode = promotionCode;
        this.promotionDiscount = promotionDiscount;
        this.userEmail = userEmail;
    }

    public Integer getBookingId() { return bookingId; }
    public void setBookingId(Integer bookingId) { this.bookingId = bookingId; }

    public String getCardLastFour() { return cardLastFour; }
    public void setCardLastFour(String cardLastFour) { this.cardLastFour = cardLastFour; }

    public Integer getNumberOfTickets() { return numberOfTickets; }
    public void setNumberOfTickets(Integer numberOfTickets) { this.numberOfTickets = numberOfTickets; }

    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }

    public String getMovieTitle() { return movieTitle; }
    public void setMovieTitle(String movieTitle) { this.movieTitle = movieTitle; }

    public String getScreeningTime() { return screeningTime; }
    public void setScreeningTime(String screeningTime) { this.screeningTime = screeningTime; }

    public String getTheaterName() { return theaterName; }
    public void setTheaterName(String theaterName) { this.theaterName = theaterName; }

    public String getPromotionCode() { return promotionCode; }
    public void setPromotionCode(String promotionCode) { this.promotionCode = promotionCode; }

    public Integer getPromotionDiscount() { return promotionDiscount; }
    public void setPromotionDiscount(Integer promotionDiscount) { this.promotionDiscount = promotionDiscount; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
}