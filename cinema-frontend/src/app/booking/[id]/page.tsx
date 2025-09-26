import { notFound } from "next/navigation";
import Image from "next/image";
import { Movie } from "@/types/movie";

async function fetchMovie(id: string): Promise<Movie | null> {
  const res = await fetch(`http://localhost:8080/api/movies/${id}`, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  return res.json();
}

export default async function BookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ showtime?: string }>;
}) {
  const { id } = await params;
  const { showtime } = await searchParams;
  const movie = await fetchMovie(id);
  if (!movie) return notFound();

  const isValidShowtime = showtime ? movie.showtimes?.includes(showtime) : false;

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 space-y-8">
      <header className="flex items-center gap-4">
        <div className="relative w-16 h-24 rounded-md overflow-hidden shadow">
          <Image src={movie.poster || "/placeholder.png"} alt={movie.title} fill className="object-cover" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{movie.title}</h1>
          <p className="text-sm text-gray-600">
            Booking for: <strong>{showtime ?? "—"}</strong>
            {!isValidShowtime && showtime && (
              <span className="ml-2 text-amber-600">(not in listed showtimes)</span>
            )}
          </p>
        </div>
      </header>

      {/* SEAT SELECTION UI */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="font-semibold mb-3">Choose seats (UI only)</h2>
          <div className="grid grid-cols-8 gap-2">
            {Array.from({ length: 48 }).map((_, i) => (
              <button key={i} className="h-8 rounded bg-gray-100 hover:bg-blue-100" type="button" />
            ))}
          </div>
        </div>

        <aside className="rounded-xl border bg-white p-4 shadow-sm">
          <h3 className="font-semibold mb-3">Summary</h3>
          <ul className="text-sm space-y-1">
            <li>Movie: {movie.title}</li>
            <li>Showtime: {showtime ?? "Select from home page"}</li>
            <li>Seats: (TBD)</li>
            <li>Total: $—</li>
          </ul>
          <button
            type="button"
            className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Continue
          </button>
        </aside>
      </section>
    </main>
  );
}
