export type Movie = {
    id: string;
    title: string;
    rating: number;
    description: string;
    poster: string;
    trailer: string;
    showtimes: {
        id: number;
        showtime: string;
        availableSeats: number;
        createdAt: number | null;
        bookings: [];
    }[];
    ratingCode: {
        id: number;
        ratingCode: string;
    };
    genre: string;
    producer: string;
    duration: number;
    director: string;
    castList: string;
};
