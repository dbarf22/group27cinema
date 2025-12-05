"use client";

import { useEffect, useState } from "react";

type Movie = { id: number; title: string };

type ShowroomShowtime = {
  id: number;
  showtime: string;
  availableSeats: number;
  createdAt: string | null;
  bookings: any[];
};

type Showroom = {
  id: number;
  auditoriumName: string;
  numberOfSeats: number;
  showtimes: ShowroomShowtime[];
};

type ShowtimeRow = {
  id: number;
  showtime: string;
  auditoriumId: number | null;
};

export default function ManageShowtimesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showrooms, setShowrooms] = useState<Showroom[]>([]);
  const [showtimes, setShowtimes] = useState<ShowtimeRow[]>([]);

  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [selectedShowroomId, setSelectedShowroomId] = useState<number | null>(
    null
  );
  const [when, setWhen] = useState<string>("");

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/movies")
      .then((res) => res.json())
      .then(setMovies)
      .catch(() => { });
  }, []);

  useEffect(() => {
    refreshShowrooms();
  }, []);

  async function refreshShowrooms(): Promise<Showroom[] | null> {
    try {
      const res = await fetch("/api/showrooms");
      if (!res.ok) return null;
      const data = await res.json();
      const normalized: Showroom[] = data.map((r: any) => ({
        id: r.id,
        auditoriumName: r.auditoriumName,
        numberOfSeats: r.numberOfSeats,
        showtimes: r.showtimes ?? [],
      }));
      setShowrooms(normalized);
      return normalized;
    } catch {
      return null;
    }
  }

  function clearMessage() {
    setMessage(null);
  }

  function findAuditoriumIdForShowtime(
    showtimeId: number,
    rooms: Showroom[]
  ): number | null {
    for (const room of rooms) {
      if (room.showtimes?.some((st) => st.id === showtimeId)) {
        return room.id;
      }
    }
    return null;
  }

  async function loadShowtimesForMovie(
    movieId: number,
    roomsOverride?: Showroom[]
  ) {
    try {
      const res = await fetch(`/api/admin/movies/${movieId}/showtimes`);
      if (!res.ok) {
        setShowtimes([]);
        return;
      }
      const data = await res.json();
      const roomsToUse = roomsOverride ?? showrooms;
      const rows: ShowtimeRow[] = data.map((s: any) => {
        const auditoriumId = s.auditorium?.id ?? null;
        return {
          id: s.id,
          showtime: s.showtime ?? s.when,
          auditoriumId,
        };
      });
      setShowtimes(rows);
    } catch {
      setShowtimes([]);
    }
  }

  function handleMovieSelect(value: string) {
    clearMessage();
    if (!value) {
      setSelectedMovieId(null);
      setShowtimes([]);
      return;
    }
    const id = Number(value);
    setSelectedMovieId(id);
    loadShowtimesForMovie(id);
  }

  function hasConflict(auditoriumId: number, isoInstant: string) {
    const newTime = new Date(isoInstant).getTime();
    return showtimes.some(
      (s) =>
        s.auditoriumId === auditoriumId &&
        new Date(s.showtime).getTime() === newTime
    );
  }

  async function handleAddShowtime() {
    clearMessage();

    if (!selectedMovieId || !selectedShowroomId || !when) {
      setMessage({
        type: "error",
        text: "Please select a movie, showroom, and date/time.",
      });
      return;
    }

    const localDate = new Date(when);
    if (Number.isNaN(localDate.getTime())) {
      setMessage({ type: "error", text: "Invalid date/time." });
      return;
    }

    const isoInstant = localDate.toISOString();

    if (hasConflict(selectedShowroomId, isoInstant)) {
      setMessage({
        type: "error",
        text: "Conflict: this showroom already has a movie at that date/time.",
      });
      return;
    }

    try {
      const res = await fetch(
        `/api/admin/movies/${selectedMovieId}/showtimes`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            showtime: isoInstant,
            auditoriumId: selectedShowroomId,
            availableSeats: 0,
          }),
        }
      );

      if (!res.ok) {
        setMessage({ type: "error", text: "Failed to save showtime." });
        return;
      }

      await res.json();

      const latestRooms = (await refreshShowrooms()) ?? showrooms;
      await loadShowtimesForMovie(selectedMovieId, latestRooms);

      setMessage({ type: "success", text: "Showtime added successfully." });
      setWhen("");
    } catch {
      setMessage({
        type: "error",
        text: "Server error while saving showtime.",
      });
    }
  }

  async function handleRemoveShowtime(showtimeId: number) {
    clearMessage();
    if (!selectedMovieId) return;

    setShowtimes((prev) => prev.filter((s) => s.id !== showtimeId));

    try {
      await fetch(
        `/api/admin/movies/${selectedMovieId}/showtimes/${showtimeId}`,
        { method: "DELETE" }
      );

      const latestRooms = (await refreshShowrooms()) ?? showrooms;
      await loadShowtimesForMovie(selectedMovieId, latestRooms);
    } catch {
      setMessage({
        type: "error",
        text: "Failed to delete showtime from server.",
      });
    }
  }

  function formatLocal(iso: string) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString();
  }

  const selectedMovie = selectedMovieId
    ? movies.find((m) => m.id === selectedMovieId)
    : null;

  return (
    <div>
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold ">Schedule a Movie</h1>
            <p>
              Choose a movie, showroom, and time. Prevent double-booking
              automatically.
            </p>
          </div>
          <a
            href="/portal"
            className="inline-flex items-center gap-2  px-4 py-2 font-semibold btn btn-neutral"
          >
            ← Back to Admin
          </a>
        </div>

        {message && (
          <div
            className={`rounded-lg border px-4 py-3 text-sm ${message.type === "error"
              ? "border-red-300 bg-red-50 text-red-800"
              : "border-green-300 bg-green-50 text-green-800"
              }`}
          >
            {message.text}
          </div>
        )}

        <section className="collapse collapse-open bg-base-100 border border-base-300 p-6 shadow-sm">
          <h2 className="text-lg font-semibold ">Add Showtime</h2>
          <p className="text-sm  mb-4">
            Pick a movie, showroom, and date/time, then add the showtime.
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium">
                Movie
              </label>
              <select
                className="mt-1 w-full p-2 btn btn-neutral text-left"
                value={selectedMovieId ?? ""}
                onChange={(e) => handleMovieSelect(e.target.value)}
              >
                <option value="">Select a movie…</option>
                {movies.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Showroom
              </label>
              <select
                className="mt-1 w-full p-2 btn btn-neutral text-left"
                value={selectedShowroomId ?? ""}
                onChange={(e) =>
                  setSelectedShowroomId(
                    e.target.value === "" ? null : Number(e.target.value)
                  )
                }
                disabled={!selectedMovieId}
              >
                <option value="">Select a showroom…</option>
                {showrooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.auditoriumName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium ">
                Date & Time
              </label>
              <input
                type="datetime-local"
                className="mt-1 w-full btn btn-neutral p-2 text-left"
                value={when}
                onChange={(e) => setWhen(e.target.value)}
                disabled={!selectedMovieId}
              />
            </div>
          </div>

          <button
            onClick={handleAddShowtime}
            className="mt-5 px-4 py-2 font-semibold btn btn-neutral"
          >
            Add Showtime
          </button>
        </section>

        <section className="collapse collapse-open bg-base-100 border border-base-300 p-6 shadow-sm">
          <h2 className="text-lg font-semibold ">
            Showtimes for Selected Movie
          </h2>
          <p className="text-sm mb-2">
            {selectedMovie
              ? `Movie: ${selectedMovie.title}`
              : "Select a movie above to view its scheduled showtimes."}
          </p>

          {(!selectedMovieId || showtimes.length === 0) && (
            <p className="text-sm ">
              {selectedMovieId
                ? "No showtimes scheduled yet."
                : "Choose a movie to see its showtimes."}
            </p>
          )}

          {selectedMovieId && showtimes.length > 0 && (
            <div className="overflow-x-auto mt-3">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="text-left text-sm">
                    <th className="border-b px-3 py-2">Movie</th>
                    <th className="border-b px-3 py-2">Showroom</th>
                    <th className="border-b px-3 py-2">Date/Time</th>
                    <th className="border-b px-3 py-2 w-24">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {showtimes.map((s) => (
                    <tr key={s.id} className="text-sm">
                      <td className="border-b px-3 py-2">
                        {selectedMovie ? selectedMovie.title : "Unknown movie"}
                      </td>
                      <td className="border-b px-3 py-2">
                        {showrooms.find((r) => r.id === s.auditoriumId)
                          ?.auditoriumName ?? "Unknown showroom"}
                      </td>
                      <td className="border-b px-3 py-2">
                        {formatLocal(s.showtime)}
                      </td>
                      <td className="border-b px-3 py-2">
                        <button
                          onClick={() => handleRemoveShowtime(s.id)}
                          className="px-3 btn-error text-error-content py-1 text-xs font-semibold btn"
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
