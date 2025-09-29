import MovieSection from "@/components/MovieSection";
import { Movie } from "@/types/movie";
import MovieSearch from "../components//MovieSearch";

export default async function HomePage() {
  const res = await fetch("http://localhost:8080/api/movies", {
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error("Failed to fetch movies");
  const allMovies: Movie[] = await res.json();

  const nowPlaying = allMovies.filter((m) => m.showtimes?.length > 0);
  const comingSoon = allMovies.filter((m) => !m.showtimes?.length);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 space-y-10">
      <h1 className="text-3xl font-bold">Cinema E-Booking System</h1>
      <MovieSection title="Now Playing" movies={nowPlaying} />
      <MovieSection title="Coming Soon" movies={comingSoon} />
      <h1 className="text-2xl font-bold mb-4">Movie Search</h1>
      <MovieSearch />
    </main>
  );
}
