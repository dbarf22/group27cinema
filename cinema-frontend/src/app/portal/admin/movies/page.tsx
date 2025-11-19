"use client";
import {FormEvent, useState} from "react";

export default function ManageMoviesPage() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [reviewScore, setReviewScore] = useState("");
  const [description, setDescription] = useState("");
  const [poster, setPoster] = useState("");
  const [trailer, setTrailer] = useState("");

  const [genreInput, setGenreInput] = useState("");
  const [genres, setGenres] = useState<string[]>([]);

  const [showtimeInput, setShowtimeInput] = useState("");
  const [showtimes, setShowtimes] = useState<string[]>([]);

  const addGenre = () => {
    if (!genreInput.trim()) return;
    setGenres([...genres, genreInput.trim()]);
    setGenreInput("");
  };

  const removeGenre = (g: string) => setGenres(genres.filter((x) => x !== g));

  const addShowtime = () => {
    if (!showtimeInput.trim()) return;
    setShowtimes([...showtimes, showtimeInput.trim()]);
    setShowtimeInput("");
  };

  const removeShowtime = (s: string) => setShowtimes(showtimes.filter((x) => x !== s));

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        try {
            const res = await fetch("/api/admin/movies/add", {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json",
                },
                body: JSON.stringify({
                    title,
                    reviewScore,
                    description,
                    poster,
                    trailer,
                    genres
                })
            })
        } catch (err:any) {
            console.log("Error")
        }
    }

  return (
    <div>
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="flex items-center justify-between">
          <header>
            <h1 className="text-3xl font-bold text-gray-800">Manage Movies</h1>
            <p className="text-gray-600">
              Add new titles and manage showtimes, genres, and more.
            </p>
          </header>

          <a
            href="/portal"
            className="inline-flex items-center gap-2 rounded border border-gray-300 px-4 py-2 font-semibold text-gray-800 hover:bg-gray-50"
          >
            ← Back to Admin
          </a>
        </div>

        <section className="rounded-2xl border bg-white shadow-sm">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex w-full items-center justify-between px-6 py-4 text-left"
            aria-expanded={open}
            aria-controls="add-movie-content"
          >
            <div>
              <div className="text-lg font-semibold text-gray-900">Add Movie</div>
              <div className="text-sm text-gray-600">
                Click to {open ? "hide" : "show"} the form
              </div>
            </div>
            <svg
              className={`h-5 w-5 transition-transform ${
                open ? "rotate-180" : ""
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.173l3.71-2.94a.75.75 0 11.94 1.17l-4.2 3.33a.75.75 0 01-.94 0l-4.2-3.33a.75.75 0 01-.08-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <div
            id="add-movie-content"
            className={`grid overflow-hidden transition-all duration-300 ${
              open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="min-h-0">
              <div className="border-t px-6 py-6">

                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    className="mt-1 w-full rounded border p-2"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Avatar"
                  />
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700">
                    Rating (1–5)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    className="mt-1 w-full rounded border p-2"
                    value={reviewScore}
                    onChange={(e) => setReviewScore(e.target.value)}
                    placeholder="5"
                  />
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    className="mt-1 w-full rounded border p-2 min-h-24"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="A paraplegic Marine is dispatched to the moon Pandora..."
                  />
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700">Poster URL</label>
                  <input
                    className="mt-1 w-full rounded border p-2"
                    value={poster}
                    onChange={(e) => setPoster(e.target.value)}
                    placeholder="https://m.media-amazon.com/image.jpg"
                  />
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700">Trailer URL</label>
                  <input
                    className="mt-1 w-full rounded border p-2"
                    value={trailer}
                    onChange={(e) => setTrailer(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700">Genres</label>
                  <div className="mt-1 flex gap-2">
                    <input
                      className="flex-1 rounded border p-2"
                      value={genreInput}
                      onChange={(e) => setGenreInput(e.target.value)}
                      placeholder="Action"
                    />
                    <button
                      onClick={addGenre}
                      className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-500"
                    >
                      Add
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {genres.map((g) => (
                      <span
                        key={g}
                        className="flex items-center gap-2 rounded-full bg-gray-200 px-3 py-1"
                      >
                        {g}
                        <button
                          onClick={() => removeGenre(g)}
                          className="text-sm font-bold text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700">Showtimes</label>
                  <div className="mt-1 flex gap-2">
                    <input
                      className="flex-1 rounded border p-2"
                      value={showtimeInput}
                      onChange={(e) => setShowtimeInput(e.target.value)}
                      placeholder="9:00 AM"
                    />
                    <button
                      onClick={addShowtime}
                      className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-500"
                    >
                      Add
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {showtimes.map((s) => (
                      <span
                        key={s}
                        className="flex items-center gap-2 rounded-full bg-gray-200 px-3 py-1"
                      >
                        {s}
                        <button
                          onClick={() => removeShowtime(s)}
                          className="text-sm font-bold text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  className="mt-6 w-full rounded bg-blue-600 py-3 font-semibold text-white hover:bg-blue-500"
                >
                  Save Movie
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="text-lg font-semibold text-gray-900">Schedule Movie Times</div>
          <p className="mt-1 text-sm text-gray-600">
            Add new movie times and edit existing schedules.
          </p>
        </section>

        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="text-lg font-semibold text-gray-900">Manage Promotions</div>
          <p className="mt-1 text-sm text-gray-600">Promote people n stuff yo.</p>
        </section>

      </div>
    </div>
  );
}
