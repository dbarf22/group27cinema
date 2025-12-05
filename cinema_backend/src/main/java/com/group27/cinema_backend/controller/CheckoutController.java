package com.group27.cinema_backend.controller;

import com.group27.cinema_backend.dto.CheckoutRequest;
import com.group27.cinema_backend.dto.CheckoutResponse;
import com.group27.cinema_backend.model.*;
import com.group27.cinema_backend.repository.*;

import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.management.RuntimeMBeanException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
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
    private final CardRepository cardRepo;
    private final UserRepository userRepo;
    private final PromotionRepository promotionRepository;

    public CheckoutController(
            BookingRepository bookingRepo,
            SeatRepository seatRepo,
            TicketRepository ticketRepo,
            ShowtimeRepository showtimeRepo,
            CardRepository cardRepo,
            UserRepository userRepo,
            PromotionRepository promotionRepository
    ) {
        this.bookingRepo = bookingRepo;
        this.seatRepo = seatRepo;
        this.ticketRepo = ticketRepo;
        this.showtimeRepo = showtimeRepo;
        this.cardRepo = cardRepo;
        this.userRepo = userRepo;
        this.promotionRepository = promotionRepository;
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

        // validate card
        var cardOpt = cardRepo.findCardById(request.getCardID());
        if (cardOpt.isEmpty()) {
            resp.setSuccess(false);
            resp.setMessage("Invalid card ID");
            return ResponseEntity.badRequest().body(resp);
        }
        booking.setCard(cardOpt.get());

        // validate user
        var userOpt = userRepo.findById(request.getUserID());
        if (userOpt.isEmpty()) {
            resp.setSuccess(false);
            resp.setMessage("Invalid user ID");
            return ResponseEntity.badRequest().body(resp);
        }
        booking.setUser(userOpt.get());
        int adultCount = request.getAdultTickets();
        int childCount = request.getChildTickets();
        int seniorCount = request.getSeniorTickets();

        BigDecimal adultPrice = BigDecimal.valueOf(adultCount).multiply(BigDecimal.valueOf(12));
        BigDecimal childPrice = BigDecimal.valueOf(childCount).multiply(BigDecimal.valueOf(8));
        BigDecimal seniorPrice = BigDecimal.valueOf(seniorCount).multiply(BigDecimal.valueOf(9));

        BigDecimal finalPrice = adultPrice.add(childPrice).add(seniorPrice);

        if (!request.getPromoCode().isEmpty()) {
            Promotion promo = promotionRepository.findByPromoCode(request.getPromoCode())
                    .orElseThrow(() -> new RuntimeException("Promotion not found in DB"));
            BigDecimal discount = BigDecimal.valueOf(100 - promo.getDiscount())
                    .divide(BigDecimal.valueOf(100));

            finalPrice = finalPrice.multiply(discount);
        }

        finalPrice = finalPrice.setScale(2, RoundingMode.HALF_UP);


        booking.setTotalPrice(finalPrice);
        booking.setPurchasedAt(Instant.now());
        booking = bookingRepo.save(booking);

        int remainingAdult = adultCount;
        int remainingChild = childCount;
        int remainingSenior = seniorCount;

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
            if (remainingAdult > 0) {
                t.setPrice(BigDecimal.valueOf(12));
                t.setTicketType("adult");
                remainingAdult--;
            } else if (remainingChild > 0) {
                t.setPrice(BigDecimal.valueOf(8));
                t.setTicketType("child");
                remainingChild--;
            } else if (remainingSenior > 0) {
                t.setPrice(BigDecimal.valueOf(9)); 
                t.setTicketType("senior");
                remainingSenior--;
            } else {
                // Fallback – should not happen if counts match seatIds length
                t.setPrice(BigDecimal.ZERO);
                t.setTicketType("unknown");
            }
            ticketsToSave.add(t);
        }
        ticketRepo.saveAll(ticketsToSave);

        // 6) build response
        resp.setSuccess(true);
        resp.setMessage("Booking completed successfully");
        resp.setBookingId(booking.getId());
        resp.setTotalPrice(booking.getTotalPrice());
        resp.setBookedSeatIds(request.getSeatIds());

        return ResponseEntity.ok(resp);
    }


    @GetMapping("/discount/{code}")
    public Promotion getDiscountInfo(@PathVariable String code) {
        Promotion p = promotionRepository.findByPromoCode(code).orElseThrow(() -> new RuntimeException("Promotion not found."));
        return p;
    }

    // GET /api/checkout/screening/{screeningId}/seats
    @GetMapping("/screening/{screeningId}/seats")
    public ResponseEntity<List<String>> getBookedSeats(@PathVariable Integer screeningId) {
        List<Ticket> tickets = ticketRepo.findByBooking_Screening_Id(screeningId);
        List<String> bookedSeats = new ArrayList<>();

        for (Ticket t : tickets) {
            Seat seat = t.getSeat();
            bookedSeats.add(seat.getRowLabel() + seat.getSeatNumber().toString());
        }

        return ResponseEntity.ok(bookedSeats);
    }
}
