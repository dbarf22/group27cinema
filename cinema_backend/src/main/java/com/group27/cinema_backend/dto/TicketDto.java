package com.group27.cinema_backend.dto;

import java.math.BigDecimal;

public class TicketDto {
    private Integer id;
    private BigDecimal price;
    private String ticketType;

    public TicketDto(Integer id, BigDecimal price, String ticketType) {
        this.id = id;
        this.price = price;
        this.ticketType = ticketType;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getTicketType() { return ticketType; }
    public void setTicketType(String ticketType) { this.ticketType = ticketType; }
}