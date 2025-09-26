import Image from "next/image";
import { notFound } from "next/navigation";
import { Movie } from "@/types/movie";

async function fetchMovie(id: string): Promise<Movie | null> {
  const res = await fetch(`http://localhost:8080/api/movies/${id}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function MovieDetails(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const movie = await fetchMovie(id);
  if (!movie) return notFound();

  return (
    <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      {/* MOVIE POSTER */}
      <div className="flex justify-center">
        <div className="relative w-64 h-96 rounded-xl overflow-hidden shadow-lg">
          <Image
            src={movie.poster || "/placeholder.png"}
            alt={`${movie.title} poster`}
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* TITLE */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">{movie.title}</h1>
        <p className="text-gray-700">
          {movie.genre} · Rating: {movie.rating}/5
        </p>
      </div>

      {/* MOVIE DESCRIPTION */}
      {movie.description && (
        <p className="text-lg leading-7">{movie.description}</p>
      )}

      {/* SHOWTIMES */}
      {Array.isArray(movie.showtimes) && movie.showtimes.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-3">Showtimes</h2>
          <div className="flex flex-wrap gap-2">
            {movie.showtimes.map((t, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-sm font-semibold
                           text-blue-700 bg-white border border-blue-200 shadow-sm"
              >
                {t}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* TRAILER */}
      {movie.trailer && movie.trailer.trim() !== "" && (
        <section>
          <h2 className="text-xl font-semibold mb-3">Trailer</h2>
          <a
            href={movie.trailer}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-blue-600 underline font-medium"
          >
            Watch trailer
          </a>
        </section>
      )}
    </main>
  );
}
