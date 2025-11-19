package com.group27.cinema_backend.service;

import java.util.List;

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
    private final EmailService emailService;

    public AdminService(MovieRepository movieRepository,
                        RatingCodeRepository ratingCodeRepository,
                        PromotionRepository promotionRepository,
                        UserRepository userRepository,
                        EmailService emailService) {
        this.movieRepository = movieRepository;
        this.ratingCodeRepository = ratingCodeRepository;
        this.promotionRepository = promotionRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    public void addMovie(AddMovieRequest req) {
        Movie movie = new Movie();
        movie.setTitle(req.title());
        movie.setCastList(req.castList());
        movie.setProducer(req.producer());
        movie.setDuration(req.duration());
        movie.setPoster(req.posterLink());
        movie.setTrailer(req.trailerLink());
        movie.setRating(req.reviewScore());
        movie.setDescription(req.description());
        movie.setGenre(String.join(", ", req.genres()));

        RatingCode rating = ratingCodeRepository.findByRatingCode(req.ratingCode())
                .orElseThrow(() -> new RuntimeException("Invalid rating code"));
        movie.setRating1(rating);

        movieRepository.save(movie);
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
        List<User> recipients = userRepository.findByWantsPromotionsTrue();

        String finalMessage = req.message();
        if (req.promoCode() != null && !req.promoCode().trim().isEmpty()) {
            finalMessage += "\n\nUse promo code: " + req.promoCode();
        }

        for (User user : recipients) {
            emailService.sendEmail(user.getEmail(), req.subject(), finalMessage);
        }
        return recipients.size();
    }
}