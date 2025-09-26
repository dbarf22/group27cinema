import Image from "next/image";
import { Movie } from "@/types/movie";

function formatShowtime(t: string) {
  const d = new Date(t);
  return isNaN(d.getTime()) ? t : d.toLocaleString();
}

export default function MovieCard({ movie }: { movie: Movie }) {
  const posterSrc =
    movie.poster?.trim()
      ? movie.poster
      : "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='600'><rect width='100%' height='100%' fill='%23eee'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='20'>No Poster</text></svg>";

  return (
    <div className="rounded-2xl shadow p-4 flex gap-4 bg-white">
      <div className="relative w-28 h-40 shrink-0 overflow-hidden rounded-lg">
        <Image src={posterSrc} alt={`${movie.title} poster`} fill sizes="112px" className="object-cover" />
      </div>

      <div className="flex-1">
        <h3 className="text-xl font-bold text-gray-900">{movie.title}</h3>
        <p className="text-sm text-gray-600">
          {movie.genre ? `${movie.genre} · ` : ""}Rating: {movie.rating}/5
        </p>
        {movie.description && (
          <p className="mt-1 text-sm text-gray-700 line-clamp-3">{movie.description}</p>
        )}

        {movie.showtimes?.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {movie.showtimes.map((t, i) => (
              <span key={i} className="px-3 py-1 rounded-full text-sm font-medium bg-blue-600 text-white shadow" title={t}>
                {formatShowtime(t)}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-xs text-gray-500">No showtimes</p>
        )}
      </div>
    </div>
  );
}
