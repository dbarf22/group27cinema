import Image from "next/image";
import Link from "next/link";
import { Movie } from "@/types/movie";

export default function MovieCard({ movie }: { movie: Movie }) {
  const posterSrc =
    movie.poster?.trim()
      ? movie.poster
      : "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='600'><rect width='100%' height='100%' fill='%23222'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23666' font-size='20'>No Poster</text></svg>";

  return (
    <div className="flex flex-col items-center w-48">
      {/* POSTER & TITLE AS LINK */}
      <Link href={`/movies/${movie.id}`} className="group w-full">
        <div className="relative w-48 h-72 rounded-xl overflow-hidden shadow-md transition-transform duration-300 group-hover:scale-105">
          <Image
            src={posterSrc}
            alt={`${movie.title} poster`}
            fill
            sizes="192px"
            className="object-cover"
          />
        </div>
        <h3 className="mt-3 text-center text-lg font-semibold text-white transition-colors duration-200 group-hover:text-blue-400">
          {movie.title}
        </h3>
      </Link>

      {/* SHOWTIMES - lead to specific booking page */}
      {movie.showtimes?.length ? (
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          {movie.showtimes.map((t, i) => (
            <Link
              key={i}
              href={`/booking/${movie.id}?showtime=${encodeURIComponent(t)}`}
              className="px-3 py-1 rounded-full text-xs font-semibold
              bg-gray-800 text-gray-200 border border-gray-700
              hover:bg-blue-600 hover:text-white transition-colors duration-200"
            >
              {t}
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-xs text-gray-500">No showtimes</p>
      )}
    </div>
  );
}
