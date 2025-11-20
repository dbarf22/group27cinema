import Image from "next/image";
import Link from "next/link";
import { Movie } from "@/types/movie";

export default function MovieCard({ movie }: { movie: Movie }) {
  const posterSrc =
    movie.poster?.trim()
      ? movie.poster
      : "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='600'><rect width='100%' height='100%' fill='%23eee'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='20'>No Poster</text></svg>";

  const showtimes = movie.showtimes ?? [];

  return (
    <div className="flex flex-col w-48 mx-auto">
      {/* Poster + Title */}
      <Link href={`/movies/${movie.id}`} className="group">
        <div className="relative w-48 h-72 rounded-xl overflow-hidden shadow-md transition group-hover:shadow-xl">
          <Image
            src={posterSrc}
            alt={`${movie.title} poster`}
            fill
            sizes="192px"
            className="object-cover"
          />
        </div>
        <h3 className="mt-3 text-center text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition">
          {movie.title}
        </h3>
      </Link>

      {/* Showtimes Buttons */}
      {showtimes.length > 0 ? (
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {showtimes.map((st) => (
            <Link
              key={st.id}
              href={`/booking/${movie.id}?showtime=${encodeURIComponent(
                st.showtime
              )}`}
              className="px-4 py-2 rounded-full text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition"
            >
              {new Date(st.showtime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-center text-sm text-gray-500">
          No showtimes available
        </p>
      )}
    </div>
  );
}
