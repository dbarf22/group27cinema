package com.group27.cinema_backend.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Set;

public class BookingHistoryDto {
    private Integer bookingId;
    private String cardLastFour;
    private Integer numberOfTickets;
    private BigDecimal totalPrice;
    private String movieTitle;
    private String screeningTime;
    private String auditoriumName;
    private String theaterName;
    private String promotionCode;
    private Integer promotionDiscount;
    private Instant purchasedAt;
    private Set<TicketDto> tickets;

    public BookingHistoryDto(Integer bookingId, String cardLastFour, Integer numberOfTickets, BigDecimal totalPrice, String movieTitle, String screeningTime, String auditoriumName, String theaterName, String promotionCode, Integer promotionDiscount, Instant purchasedAt, Set<TicketDto> tickets) {
        this.bookingId = bookingId;
        this.cardLastFour = cardLastFour;
        this.numberOfTickets = numberOfTickets;
        this.totalPrice = totalPrice;
        this.movieTitle = movieTitle;
        this.screeningTime = screeningTime;
        this.auditoriumName = auditoriumName;
        this.theaterName = theaterName;
        this.promotionCode = promotionCode;
        this.promotionDiscount = promotionDiscount;
        this.purchasedAt = purchasedAt;
        this.tickets = tickets;
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

    public String getAuditoriumName() { return auditoriumName; }
    public void setAuditoriumName(String auditoriumName) { this.auditoriumName = auditoriumName; }

    public String getTheaterName() { return theaterName; }
    public void setTheaterName(String theaterName) { this.theaterName = theaterName; }

    public String getPromotionCode() { return promotionCode; }
    public void setPromotionCode(String promotionCode) { this.promotionCode = promotionCode; }

    public Integer getPromotionDiscount() { return promotionDiscount; }
    public void setPromotionDiscount(Integer promotionDiscount) { this.promotionDiscount = promotionDiscount; }

    public Instant getPurchasedAt() { return purchasedAt; }
    public void setPurchasedAt(Instant purchasedAt) { this.purchasedAt = purchasedAt; }

    public Set<TicketDto> getTickets() { return tickets; }
    public void setTickets(Set<TicketDto> tickets) { this.tickets = tickets; }
}