import Image from "next/image";
import Link from "next/link";
import { Movie } from "@/types/movie";

type MovieCardProps = {
  movie: Movie;
  selectedTime: Date | null;
};

function isSameDay(a: Date, b: Date) { 
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function MovieCard({ movie, selectedTime }: MovieCardProps) {
  const posterSrc =
    movie.poster?.trim()
      ? movie.poster
      : "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='600'><rect width='100%' height='100%' fill='%23eee'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='20'>No Poster</text></svg>";

  const allShowtimes = movie.showtimes ?? [];

  const showtimes = 
    selectedTime == null ? allShowtimes : allShowtimes.filter((st) => {
      return isSameDay(new Date(st.showtime), selectedTime);
    });

    //sorts showtimes chronologically
    showtimes.sort((a, b) => new Date(a.showtime).getTime() - new Date(b.showtime).getTime());

  return (
      <div>
          <div className="card card-border overflow-hidden ">
              {/* Poster + Title */}
              <Link href={`/movies/${movie.id}`} className="group">
                  <figure className={"aspect-2/3"}>
                      <img
                          src={posterSrc}
                          alt={`${movie.title} poster`}
                          className="h-full w-full object-cover"
                      />
                  </figure>
              </Link>
                  <div className={"card-body text-center justify-center px-2"}>
                      <h3 className={"card-title text-center justify-center"}>
                          {movie.title}
                      </h3>
                      {showtimes.length > 0 ? (
                          <div className="text-center justify-center">
                              {showtimes.map((st) => (
                                  <Link
                                      key={st.id}
                                      href={`/booking/${movie.id}?showtime=${encodeURIComponent(
                                          st.showtime
                                      )}`}
                                      className="btn btn-xs btn-secondary ms-1"
                                  >
                                      {new Date(st.showtime).toLocaleTimeString([], {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                      })}
                                  </Link>
                              ))}
                          </div>
                      ) : (
                          <p>
                              No showtimes available
                          </p>
                      )}
                  </div>
          </div>
      </div>
  );
}
