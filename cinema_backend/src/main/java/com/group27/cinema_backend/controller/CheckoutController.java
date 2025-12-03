package com.group27.cinema_backend.controller;

import com.group27.cinema_backend.dto.CheckoutRequest;
import com.group27.cinema_backend.dto.CheckoutResponse;
import com.group27.cinema_backend.model.Booking;
import com.group27.cinema_backend.model.Seat;
import com.group27.cinema_backend.model.Showtime;
import com.group27.cinema_backend.model.Ticket;
import com.group27.cinema_backend.repository.BookingRepository;
import com.group27.cinema_backend.repository.SeatRepository;
import com.group27.cinema_backend.repository.ShowtimeRepository;
import com.group27.cinema_backend.repository.TicketRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/checkout")
@CrossOrigin(origins = "http://localhost:3000")
public class CheckoutController {

    private final BookingRepository bookingRepo;
    private final SeatRepository seatRepo;
    private final TicketRepository ticketRepo;
    private final ShowtimeRepository showtimeRepo;

    public CheckoutController(
            BookingRepository bookingRepo,
            SeatRepository seatRepo,
            TicketRepository ticketRepo,
            ShowtimeRepository showtimeRepo
    ) {
        this.bookingRepo = bookingRepo;
        this.seatRepo = seatRepo;
        this.ticketRepo = ticketRepo;
        this.showtimeRepo = showtimeRepo;
    }

    // POST /api/checkout  → create a booking + tickets
    @PostMapping
    public ResponseEntity<CheckoutResponse> checkout(@RequestBody CheckoutRequest request) {
        CheckoutResponse resp = new CheckoutResponse();

        // 1) validate screening
        Optional<Showtime> screeningOpt = showtimeRepo.findById(request.getScreeningId());
        if (screeningOpt.isEmpty()) {
            resp.setSuccess(false);
            resp.setMessage("Invalid screening ID");
            return ResponseEntity.badRequest().body(resp);
        }
        Showtime screening = screeningOpt.get();

        // 2) validate seats list
        if (request.getSeatIds() == null || request.getSeatIds().isEmpty()) {
            resp.setSuccess(false);
            resp.setMessage("No seats selected");
            return ResponseEntity.badRequest().body(resp);
        }

        // 3) prevent double bookings
        for (Integer seatId : request.getSeatIds()) {
            boolean alreadyBooked =
                    ticketRepo.existsBySeat_IdAndBooking_Screening_Id(seatId, request.getScreeningId());
            if (alreadyBooked) {
                resp.setSuccess(false);
                resp.setMessage("Seat already booked: " + seatId);
                return ResponseEntity.badRequest().body(resp);
            }
        }

        // 4) create Booking row
        Booking booking = new Booking();
        booking.setScreening(screening);
        booking.setNumberOfTickets(request.getSeatIds().size());

        BigDecimal pricePerTicket = BigDecimal.valueOf(12.00); // TODO: plug in real pricing if needed
        booking.setTotalPrice(
                pricePerTicket.multiply(BigDecimal.valueOf(request.getSeatIds().size()))
        );

        booking = bookingRepo.save(booking);

        // 5) create Ticket rows (one per seat)
        List<Ticket> ticketsToSave = new ArrayList<>();
        for (Integer seatId : request.getSeatIds()) {
            Optional<Seat> seatOpt = seatRepo.findById(seatId);
            if (seatOpt.isEmpty()) {
                // skip invalid seats instead of crashing
                continue;
            }

            Seat seat = seatOpt.get();
            Ticket t = new Ticket();
            t.setBooking(booking);
            t.setSeat(seat);
            t.setPrice(pricePerTicket);
            t.setTicketType("STANDARD");

            ticketsToSave.add(t);
        }
        ticketRepo.saveAll(ticketsToSave);

        // 6) build response
        resp.setSuccess(true);
        resp.setMessage("Booking completed successfully");
        resp.setBookingId(booking.getId());
        resp.setTotalPrice(booking.getTotalPrice().doubleValue());
        resp.setBookedSeatIds(request.getSeatIds());

        return ResponseEntity.ok(resp);
    }

    // GET /api/checkout/screening/{screeningId}/seats  → all booked seat IDs
    @GetMapping("/screening/{screeningId}/seats")
    public ResponseEntity<List<Integer>> getBookedSeats(@PathVariable Integer screeningId) {
        List<Integer> seatIds = ticketRepo.findByBooking_Screening_Id(screeningId)
                .stream()
                .map(t -> t.getSeat().getId())
                .toList();

        return ResponseEntity.ok(seatIds);
    }
}
