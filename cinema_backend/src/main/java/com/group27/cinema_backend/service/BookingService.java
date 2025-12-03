package com.group27.cinema_backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.group27.cinema_backend.dto.BookingHistoryDto;
import com.group27.cinema_backend.model.Booking;
import com.group27.cinema_backend.model.Showtime;
import com.group27.cinema_backend.model.User;
import com.group27.cinema_backend.repository.AuditoriumRepository;
import com.group27.cinema_backend.repository.BookingRepository;
import com.group27.cinema_backend.repository.MovieRepository;
import com.group27.cinema_backend.repository.UserRepository;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    public BookingService(BookingRepository bookingRepository, MovieRepository movieRepository, AuditoriumRepository auditoriumRepository, UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
    }

    public List<BookingHistoryDto> getUserBookings(Integer userId) {
        List<Booking> bookings = bookingRepository.findByUserId(userId);

        return bookings.stream().map(booking -> {
            Showtime screening = booking.getScreening();
            String movieTitle = screening.getMovie().getTitle();
            String screeningTime = screening.getShowtime().toString();
            String theaterName = screening.getAuditorium().getAuditoriumName();

            String cardLastFour = booking.getCard() != null ? booking.getCard().getLastFour() : "N/A";

            String promotionCode = null;
            Integer promotionDiscount = null;
            if (booking.getPromotion() != null) {
                promotionCode = booking.getPromotion().getPromoCode();
                promotionDiscount = booking.getPromotion().getDiscount();
            }

            String userEmail = userRepository.findById(booking.getUser().getId())
                    .map(User::getEmail)
                    .orElse("Unknown Email");

            return new BookingHistoryDto(
                booking.getId(),
                cardLastFour,
                booking.getNumberOfTickets(),
                booking.getTotalPrice(),
                movieTitle,
                screeningTime,
                theaterName,
                promotionCode,
                promotionDiscount,
                userEmail
            );
        }).collect(Collectors.toList());
    }
}