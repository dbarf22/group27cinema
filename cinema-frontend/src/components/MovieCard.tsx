import Image from "next/image";
import Link from "next/link";
import { Movie } from "@/types/movie";

function fmtShowtime(t: string) {
  const d = new Date(t);
  return isNaN(d.getTime())
    ? t
    : d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export default function MovieCard({ movie }: { movie: Movie }) {
  const posterSrc =
    movie.poster?.trim()
      ? movie.poster
      : "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='600'><rect width='100%' height='100%' fill='%23eee'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='20'>No Poster</text></svg>";

  return (
    <div className="flex flex-col items-center w-48">

      <Link href={`/movies/${movie.id}`} className="group w-full">
        <div className="relative w-48 h-72 rounded-xl overflow-hidden shadow-md transition group-hover:shadow-lg">
          <Image
            src={posterSrc}
            alt={`${movie.title} poster`}
            fill
            sizes="192px"
            className="object-cover"
          />
        </div>
        <h3 className="mt-3 text-center text-lg font-semibold text-gray-900 group-hover:text-blue-700">
          {movie.title}
        </h3>
      </Link>

      {/* Showtimes also navigate to details page */}
      {movie.showtimes?.length ? (
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          {movie.showtimes.map((t, i) => (
            <Link
              key={i}
              href={`/movies/${movie.id}?showtime=${encodeURIComponent(t)}`}
              className="px-3 py-1 rounded-full text-xs font-semibold
              text-blue-700 bg-white border border-blue-200 shadow-sm
              hover:bg-blue-50 transition opacity-100"
            >
              {fmtShowtime(t)}
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-xs text-gray-500">No showtimes</p>
      )}
    </div>
  );
}
