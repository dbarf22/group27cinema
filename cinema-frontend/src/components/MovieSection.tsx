import MovieCard from "./MovieCard";
import { Movie } from "@/types/movie";

export default function MovieSection({
  title,
  movies,
}: {
  title: string;
  movies: Movie[];
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">{title}</h2>
      {movies.length === 0 ? (
        <p className="text-sm text-gray-600">Nothing to show here yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {movies.map((m) => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>
      )}
    </section>
  );
}
