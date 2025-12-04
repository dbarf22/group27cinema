package com.group27.cinema_backend.dto;

import java.math.BigDecimal;

public class TicketDto {
    private Integer id;
    private String rowLabel;
    private Integer seatNumber;
    private BigDecimal price;
    private String ticketType;

    public TicketDto(Integer id, String rowLabel, Integer seatNumber, BigDecimal price, String ticketType) {
        this.id = id;
        this.rowLabel = rowLabel;
        this.seatNumber = seatNumber;
        this.price = price;
        this.ticketType = ticketType;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getRowLabel() { return rowLabel; }
    public void setRowLabel(String rowLabel) { this.rowLabel = rowLabel; }

    public Integer getSeatNumber() { return seatNumber; }
    public void setSeatNumber(Integer seatNumber) { this.seatNumber = seatNumber; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getTicketType() { return ticketType; }
    public void setTicketType(String ticketType) { this.ticketType = ticketType; }
}