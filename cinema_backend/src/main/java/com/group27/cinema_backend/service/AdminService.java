package com.group27.cinema_backend.service;

import java.util.List;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import com.group27.cinema_backend.dto.AddMovieRequest;
import com.group27.cinema_backend.dto.CreatePromotionRequest;
import com.group27.cinema_backend.dto.SendPromotionEmailRequest;
import com.group27.cinema_backend.model.Movie;
import com.group27.cinema_backend.model.Promotion;
import com.group27.cinema_backend.model.RatingCode;
import com.group27.cinema_backend.model.User;
import com.group27.cinema_backend.repository.MovieRepository;
import com.group27.cinema_backend.repository.PromotionRepository;
import com.group27.cinema_backend.repository.RatingCodeRepository;
import com.group27.cinema_backend.repository.UserRepository;

@Service
public class AdminService {

    private final MovieRepository movieRepository;
    private final RatingCodeRepository ratingCodeRepository;
    private final PromotionRepository promotionRepository;
    private final UserRepository userRepository;

    public AdminService(MovieRepository movieRepository,
                        RatingCodeRepository ratingCodeRepository,
                        PromotionRepository promotionRepository,
                        UserRepository userRepository) {
        this.movieRepository = movieRepository;
        this.ratingCodeRepository = ratingCodeRepository;
        this.promotionRepository = promotionRepository;
        this.userRepository = userRepository;
    }

    public void addMovie(Movie movie) throws Exception {
        if (movieRepository.findByTitle(movie.getTitle()) != null) {
            throw new Exception("Movie already exists.");
        }
        movieRepository.save(movie);
    }

    public void deleteMovie(int id) throws Exception{
        if (!movieRepository.existsById(id)) {
            throw new Exception("Movie does not exist!");
        }
        movieRepository.deleteById(id);
    }

    public void createPromotion(CreatePromotionRequest req) {
        Promotion promo = new Promotion();
        promo.setPromoCode(req.promoCode());
        promo.setDiscount(req.discount());
        promo.setStartDate(req.startDate());
        promo.setEndDate(req.endDate());
        promo.setDescription(req.description());
        promotionRepository.save(promo);
    }

    public int sendPromotionEmail(SendPromotionEmailRequest req) {
        if (req.promoCode() != null && !req.promoCode().isBlank()) {
            promotionRepository.findByPromoCode(req.promoCode())
                .orElseThrow(() -> new IllegalArgumentException("Invalid promo code."));
        }
       
        List<User> recipients = userRepository.findByWantsPromotionsTrue();

        String finalMessage = req.message();
        if (req.promoCode() != null && !req.promoCode().trim().isEmpty()) {
            finalMessage += "\n\nUse promo code: " + req.promoCode();
        }

        for (User user : recipients) {
            EmailService.INSTANCE.sendEmail(user.getEmail(), req.subject(), finalMessage);
        }
        return recipients.size();
    }

    public List<Promotion> getAllPromotions() {
        return promotionRepository.findAll();
    }
}