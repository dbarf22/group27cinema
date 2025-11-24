"use client";
import { useMemo, useState, useEffect } from "react";
import DatePicker from "@/components/DatePicker";

type Movie = { id: string; title: string };
type Showroom = { id: string; name: string };
type Showtime = {
  id: string;
  movieId: string;
  showroomId: string;
  when: string; // ISO string
};

const TEST_SHOWROOMS: Showroom[] = [
  { id: "r1", name: "Showroom A" },
  { id: "r2", name: "Showroom B" },
  { id: "r3", name: "Showroom C" },
];

export default function ManageShowtimesPage() {
  const [movieId, setMovieId] = useState("");
  const [showroomId, setShowroomId] = useState("");
  const [when, setWhen] = useState(""); // still used by normalizeToIso
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(
    null
  );
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedTime, setSelectedTime] = useState<Date | null>(new Date());

  // Fetch movies from API when page is opened
  useEffect(() => {
    const getMovieList = async () => {
      try {
        const res = await fetch("/api/movies");
        const data = await res.json();
        setMovies(data);
      } catch (err) {
        console.error("Failed to fetch movie list:", err);
      }
    };

    getMovieList();
  }, []);

  useEffect(() => {
    console.log(movies);
  }, [movies]);

  const movieById = useMemo(
    () => Object.fromEntries(movies.map((m) => [m.id, m])),
    [movies] // ✅ needs movies as dependency
  );

  const roomById = useMemo(
    () => Object.fromEntries(TEST_SHOWROOMS.map((r) => [r.id, r])),
    []
  );

  const sortedShowtimes = useMemo(
    () => [...showtimes].sort((a, b) => a.when.localeCompare(b.when)),
    [showtimes]
  );

  function clearFeedback() {
    setFeedback(null);
  }

  function formatLocal(dtIso: string) {
    const d = new Date(dtIso);
    if (Number.isNaN(d.getTime())) return dtIso;
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function hasConflict(roomId: string, dtIso: string) {
    return showtimes.some((s) => s.showroomId === roomId && s.when === dtIso);
  }

  function normalizeToIso(datetimeLocal: string) {
    const [datePart, timePart] = datetimeLocal.split("T");
    if (!datePart || !timePart) return "";
    const [y, m, d] = datePart.split("-").map((n) => parseInt(n, 10));
    const [hh, mm] = timePart.split(":").map((n) => parseInt(n, 10));
    if ([y, m, d, hh, mm].some((n) => Number.isNaN(n))) return "";
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${y}-${pad(m)}-${pad(d)}T${pad(hh)}:${pad(mm)}:00`;
  }

  function addShowtime() {
    clearFeedback();

    if (!movieId || !showroomId || !when) {
      setFeedback({ type: "error", msg: "Please select a movie, showroom, and date/time." });
      return;
    }
    const iso = normalizeToIso(when);
    if (!iso) {
      setFeedback({ type: "error", msg: "Invalid date/time value." });
      return;
    }
    if (hasConflict(showroomId, iso)) {
      const roomName = roomById[showroomId]?.name ?? "this showroom";
      setFeedback({
        type: "error",
        msg: `Conflict: ${roomName} already has a showtime at ${formatLocal(iso)}.`,
      });
      return;
    }

    const newItem: Showtime = {
      id: crypto.randomUUID(),
      movieId,
      showroomId,
      when: iso,
    };
    setShowtimes((prev) => [...prev, newItem]);
    setFeedback({
      type: "success",
      msg: `Showtime scheduled: ${movieById[movieId].title} in ${
        roomById[showroomId].name
      } at ${formatLocal(iso)}.`,
    });

    setWhen("");
  }

  async function addShowtimeCall() {
    // Implement API call to add showtime to backend
    try {
      // TODO: Add showtime for a movie via API
    } catch (err) {
      console.error("Failed to add showtime:", err);
    }
  } // ✅ close function

  function removeShowtime(id: string) {
    clearFeedback();
    setShowtimes((prev) => prev.filter((s) => s.id !== id));
  }

  const [filterMovie, setFilterMovie] = useState<string>("all");
  const [filterRoom, setFilterRoom] = useState<string>("all");

  const filteredShowtimes = useMemo(() => {
    return sortedShowtimes.filter((s) => {
      const byMovie = filterMovie === "all" || s.movieId === filterMovie;
      const byRoom = filterRoom === "all" || s.showroomId === filterRoom;
      return byMovie && byRoom;
    });
  }, [sortedShowtimes, filterMovie, filterRoom]);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Showtimes</h1>
            <p className="text-gray-600">
              Add showtimes and review conflicts across showrooms.
            </p>
          </div>
          <a
            href="/portal"
            className="inline-flex items-center gap-2 rounded border border-gray-300 px-4 py-2 font-semibold text-gray-800 hover:bg-gray-50"
          >
            ← Back to Admin
          </a>
        </div>

        {feedback && (
          <div
            className={`rounded-lg border px-4 py-3 text-sm ${
              feedback.type === "error"
                ? "border-red-300 bg-red-50 text-red-800"
                : "border-green-300 bg-green-50 text-green-800"
            }`}
          >
            {feedback.msg}
          </div>
        )}

        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Schedule a Movie</h2>
          <p className="text-sm text-gray-600 mb-4">
            Choose a movie, showroom, and date/time. Conflicts are blocked automatically.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Movie</label>
              <select
                className="mt-1 w-full rounded border border-gray-300 p-2 bg-white"
                value={movieId}
                onChange={(e) => setMovieId(e.target.value)}
              >
                <option value="">Select a movie…</option>
                {movies.map((m) => (
                  <option key={m.title} value={m.title}>
                    {m.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Showroom</label>
              <select
                className="mt-1 w-full rounded border border-gray-300 p-2 bg-white"
                value={showroomId}
                onChange={(e) => setShowroomId(e.target.value)}
              >
                <option value="">Select a showroom…</option>
                {TEST_SHOWROOMS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Date & Time</label>
              {/* If you want DatePicker to actually drive `when`, you'll want to sync it here */}
              <DatePicker selectedTime={selectedTime} setSelectedTime={setSelectedTime} />
            </div>
          </div>

          <div className="mt-5 flex gap-3">
            <button
              onClick={addShowtime}
              className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-500"
            >
              Add Showtime
            </button>
            <button
              onClick={() => {
                setMovieId("");
                setShowroomId("");
                setWhen("");
                clearFeedback();
              }}
              className="rounded border border-gray-300 px-4 py-2 font-semibold hover:bg-gray-50"
            >
              Reset
            </button>
          </div>
        </section>

        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Filter by Movie</label>
              <select
                className="mt-1 w-56 rounded border border-gray-300 p-2 bg-white"
                value={filterMovie}
                onChange={(e) => setFilterMovie(e.target.value)}
              >
                <option value="all">All</option>
                {movies.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Filter by Showroom</label>
              <select
                className="mt-1 w-56 rounded border border-gray-300 p-2 bg-white"
                value={filterRoom}
                onChange={(e) => setFilterRoom(e.target.value)}
              >
                <option value="all">All</option>
                {TEST_SHOWROOMS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Scheduled Showtimes</h3>

          {filteredShowtimes.length === 0 ? (
            <p className="text-sm text-gray-600">No showtimes yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left text-sm text-gray-700">
                    <th className="border-b px-3 py-2">Movie</th>
                    <th className="border-b px-3 py-2">Showroom</th>
                    <th className="border-b px-3 py-2">Date/Time</th>
                    <th className="border-b px-3 py-2 w-24">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredShowtimes.map((s) => (
                    <tr key={s.id} className="text-sm">
                      <td className="border-b px-3 py-2">
                        {movieById[s.movieId]?.title ?? s.movieId}
                      </td>
                      <td className="border-b px-3 py-2">
                        {roomById[s.showroomId]?.name ?? s.showroomId}
                      </td>
                      <td className="border-b px-3 py-2">{formatLocal(s.when)}</td>
                      <td className="border-b px-3 py-2">
                        <button
                          onClick={() => removeShowtime(s.id)}
                          className="rounded border border-gray-300 px-3 py-1 text-xs font-semibold hover:bg-gray-50"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
