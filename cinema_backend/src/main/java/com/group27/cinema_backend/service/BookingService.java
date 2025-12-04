package com.group27.cinema_backend.service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.group27.cinema_backend.dto.BookingHistoryDto;
import com.group27.cinema_backend.dto.TicketDto;
import com.group27.cinema_backend.model.Booking;
import com.group27.cinema_backend.model.Showtime;
import com.group27.cinema_backend.repository.BookingRepository;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public List<BookingHistoryDto> getUserBookings(Integer userId) {
        List<Booking> bookings = bookingRepository.findByUserId(userId);

        return bookings.stream().map(booking -> {
            Showtime screening = booking.getScreening();
            String movieTitle = screening.getMovie().getTitle();
            String screeningTime = screening.getShowtime().toString();
            String auditoriumName = screening.getAuditorium().getAuditoriumName();
            String theaterName = screening.getAuditorium().getTheater().getTheaterName();

            String cardLastFour = booking.getCard() != null ? booking.getCard().getLastFour() : "N/A";

            String promotionCode = null;
            Integer promotionDiscount = null;
            if (booking.getPromotion() != null) {
                promotionCode = booking.getPromotion().getPromoCode();
                promotionDiscount = booking.getPromotion().getDiscount();
            }

            Set<TicketDto> ticketDtos = booking.getTickets().stream().map(ticket -> {
                String rowLabel = String.valueOf(ticket.getSeat().getRowLabel());
                Integer seatNumber = ticket.getSeat().getSeatNumber();
                return new TicketDto(ticket.getId(), rowLabel, seatNumber, ticket.getPrice(), ticket.getTicketType());
            }).collect(Collectors.toSet());

            return new BookingHistoryDto(
                booking.getId(),
                cardLastFour,
                booking.getNumberOfTickets(),
                booking.getTotalPrice(),
                movieTitle,
                screeningTime,
                auditoriumName,
                theaterName,
                promotionCode,
                promotionDiscount,
                booking.getCreatedAt(),
                ticketDtos
            );
        }).collect(Collectors.toList());
    }
}