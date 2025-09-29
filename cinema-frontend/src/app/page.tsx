import MovieSection from "@/components/MovieSection";
import { Movie } from "@/types/movie";
import MovieSearch from "../components/MovieSearch";

export default async function HomePage() {
  const res = await fetch("http://localhost:8080/api/movies", {
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error("Failed to fetch movies");
  const allMovies: Movie[] = await res.json();

  const nowPlaying = allMovies.filter((m) => m.showtimes?.length > 0);
  const comingSoon = allMovies.filter((m) => !m.showtimes?.length);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-gray-100">
      <div className="mx-auto max-w-6xl px-6 py-12 space-y-12">
        {/* Title */}
        <header>
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            Cinema E-Booking
          </h1>
          <p className="mt-2 text-gray-400">
            Browse movies, showtimes, and book your seats instantly.
          </p>
        </header>

        {/* Search */}
        <section className="bg-gray-800/70 border border-gray-700 rounded-xl shadow p-6">
          <h2 className="text-2xl font-semibold mb-4 text-white">Search</h2>
          <MovieSearch />
        </section>

        {/* Now Playing */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">
            Now Playing
          </h2>
          <MovieSection title="" movies={nowPlaying} />
        </section>

        {/* Coming Soon */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">
            Coming Soon
          </h2>
          <MovieSection title="" movies={comingSoon} />
        </section>
      </div>
    </main>
  );
}
