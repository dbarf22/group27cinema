package com.group27.cinema_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.group27.cinema_backend.model.Ticket;

public interface TicketRepository extends JpaRepository<Ticket, Integer> {

    // is there already a ticket for this seat in this screening?
    boolean existsBySeat_IdAndBooking_Screening_Id(Integer seatId, Integer screeningId);

    // all tickets for a screening (to know which seats are taken)
    List<Ticket> findByBooking_Screening_Id(Integer screeningId);
}
