"use client";
import { FormEvent, useState, useEffect } from "react";

export default function ManageMoviesPage() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [castList, setCastList] = useState("");
  const [producer, setProducer] = useState("");
  const [duration, setDuration] = useState<number | null>(null);
  const [poster, setPoster] = useState("");
  const [trailer, setTrailer] = useState("");
  const [reviewScore, setReviewScore] = useState("");
  const [ratingCode, setRatingCode] = useState("");
  const [description, setDescription] = useState("");
  const [genreInput, setGenreInput] = useState("");
  const [genres, setGenres] = useState<string[]>([]);
  const [director, setDirector] = useState("");

  const [showtimeInput, setShowtimeInput] = useState("");
  const [showtimes, setShowtimes] = useState<string[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  // --- PROMOTIONS STATE ---
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState("");
  const [promoStart, setPromoStart] = useState("");
  const [promoEnd, setPromoEnd] = useState("");
  const [promoDescription, setPromoDescription] = useState("");

  const [promoIsSubmitting, setPromoIsSubmitting] = useState(false);
  const [promoSuccessMessage, setPromoSuccessMessage] = useState("");
  const [promoErrors, setPromoErrors] = useState<Record<string, string>>({});

  const [promoOpen, setPromoOpen] = useState(false);

  const validateFields = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = "Title is required.";
    if (!castList.trim()) newErrors.castList = "Cast list is required.";
    if (!producer.trim()) newErrors.producer = "Producer is required.";
    if (duration === null || duration <= 0)
      newErrors.duration = "Duration is required.";
    if (!poster.trim()) newErrors.poster = "Poster URL is required.";
    if (!trailer.trim()) newErrors.trailer = "Trailer URL is required.";
    if (!reviewScore.trim())
      newErrors.reviewScore = "Review score is required.";
    if (!ratingCode.trim()) newErrors.ratingCode = "Rating code is required.";
    if (!description.trim()) newErrors.description = "Description is required.";
    if (genres.length === 0) newErrors.genres = "At least one genre required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    console.log(promoStart);
  }, [promoStart])

  const addGenre = () => {
    if (!genreInput.trim()) return;
    setGenres([...genres, genreInput.trim()]);
    setGenreInput("");
    setErrors((prev) => ({ ...prev, genres: "" }));
  };

  const removeGenre = (g: string) => {
    const updated = genres.filter((x) => x !== g);
    setGenres(updated);
    if (updated.length === 0)
      setErrors((prev) => ({ ...prev, genres: "At least one genre required." }));
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!validateFields()) return;

    if (isSubmitting) return;
    setIsSubmitting(true);
    setSuccessMessage("");

    try {
      const res = await fetch("/api/admin/movies/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          castList,
          producer,
          duration,
          poster,
          trailer,
          reviewScore,
          ratingCode,
          description,
          genres,
          director,
        }),
      });

      if (!res.ok) throw new Error("Failed to add movie");

      setSuccessMessage("Movie added successfully!");

      // Reset form
      setTitle("");
      setCastList("");
      setProducer("");
      setDuration(null);
      setPoster("");
      setTrailer("");
      setReviewScore("");
      setRatingCode("");
      setDescription("");
      setGenres([]);

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error", err);
      setSuccessMessage("Something went wrong.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } finally {
      setIsSubmitting(false);
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

        {/* ADD MOVIE CARD */}
        <section className="rounded-2xl border bg-white shadow-sm">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex w-full items-center justify-between px-6 py-4 text-left"
          >
            <div>
              <div className="text-lg font-semibold text-gray-900">
                Add Movie
              </div>
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
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* TITLE */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      className="mt-1 w-full rounded border p-2"
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        setErrors((prev) => ({ ...prev, title: "" }));
                      }}
                      placeholder="Interstellar"
                    />
                    {errors.title && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.title}
                      </p>
                    )}
                  </div>

                  {/* CAST */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Cast List
                    </label>
                    <input
                      className="mt-1 w-full rounded border p-2"
                      value={castList}
                      onChange={(e) => {
                        setCastList(e.target.value);
                        setErrors((prev) => ({ ...prev, castList: "" }));
                      }}
                      placeholder="Matthew McConaughey, Anne Hathaway"
                    />
                    {errors.castList && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.castList}
                      </p>
                    )}
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-gray-700">
                          Director
                      </label>
                      <input
                          className="mt-1 w-full rounded border p-2"
                          value={director}
                          onChange={(e) => {
                              setDirector(e.target.value);
                          }}
                          placeholder={"Christopher Nolan"}
                      />
                  </div>

                  {/* PRODUCER */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Producer *
                    </label>
                    <input
                      className="mt-1 w-full rounded border p-2"
                      value={producer}
                      onChange={(e) => {
                        setProducer(e.target.value);
                        setErrors((prev) => ({ ...prev, producer: "" }));
                      }}
                      placeholder="Christopher Nolan"
                    />
                    {errors.producer && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.producer}
                      </p>
                    )}
                  </div>

                  {/* DURATION */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Duration (minutes) *
                    </label>
                    <input
                      type="number"
                      className="mt-1 w-full rounded border p-2"
                      value={duration ?? ""}
                      onChange={(e) => {
                        const v = e.target.value;
                        setDuration(v === "" ? null : Number(v));
                        setErrors((prev) => ({ ...prev, duration: "" }));
                      }}
                      placeholder="169"
                    />
                    {errors.duration && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.duration}
                      </p>
                    )}
                  </div>

                  {/* REVIEW SCORE */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Review Score (1–5) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      className="mt-1 w-full rounded border p-2"
                      value={reviewScore}
                      onChange={(e) => {
                        setReviewScore(e.target.value);
                        setErrors((prev) => ({ ...prev, reviewScore: "" }));
                      }}
                      placeholder="4.7"
                    />
                    {errors.reviewScore && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.reviewScore}
                      </p>
                    )}
                  </div>

                  {/* RATING CODE */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Rating Code *
                    </label>

                    <select
                      className="mt-1 w-full rounded border p-2 bg-white"
                      value={ratingCode}
                      onChange={(e) => {
                        setRatingCode(e.target.value);
                        setErrors((prev) => ({ ...prev, ratingCode: "" }));
                      }}
                    >
                      <option value="">Select rating</option>
                      <option value="G">G – General Audiences</option>
                      <option value="PG">PG – Parental Guidance Suggested</option>
                      <option value="PG-13">
                        PG-13 – Parents Strongly Cautioned
                      </option>
                      <option value="R">R – Restricted</option>
                      <option value="NC-17">NC-17 – Adults Only</option>
                      <option value="Unrated">Unrated</option>
                      <option value="Not Rated">Not Rated</option>
                    </select>

                    {errors.ratingCode && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.ratingCode}
                      </p>
                    )}
                  </div>

                  {/* DESCRIPTION */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Description *
                    </label>
                    <textarea
                      className="mt-1 w-full rounded border p-2 min-h-24"
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                        setErrors((prev) => ({ ...prev, description: "" }));
                      }}
                      placeholder="A team of explorers travel through a wormhole..."
                    />
                    {errors.description && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  {/* POSTER URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Poster URL *
                    </label>
                    <input
                      className="mt-1 w-full rounded border p-2"
                      value={poster}
                      onChange={(e) => {
                        setPoster(e.target.value);
                        setErrors((prev) => ({ ...prev, poster: "" }));
                      }}
                      placeholder="https://image.jpg"
                    />
                    {errors.poster && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.poster}
                      </p>
                    )}
                  </div>

                  {/* TRAILER URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Trailer URL *
                    </label>
                    <input
                      className="mt-1 w-full rounded border p-2"
                      value={trailer}
                      onChange={(e) => {
                        setTrailer(e.target.value);
                        setErrors((prev) => ({ ...prev, trailer: "" }));
                      }}
                      placeholder="https://youtube.com/watch?v=..."
                    />
                    {errors.trailer && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.trailer}
                      </p>
                    )}
                  </div>

                  {/* GENRES */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Genres *
                    </label>
                    <div className="mt-1 flex gap-2">
                      <input
                        className="flex-1 rounded border p-2"
                        value={genreInput}
                        onChange={(e) => setGenreInput(e.target.value)}
                        placeholder="Action"
                      />
                      <button
                        type="button"
                        onClick={addGenre}
                        className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-500"
                      >
                        Add
                      </button>
                    </div>

                    {errors.genres && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.genres}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-2">
                      {genres.map((g) => (
                        <span
                          key={g}
                          className="flex items-center gap-2 rounded-full bg-gray-200 px-3 py-1"
                        >
                          {g}
                          <button
                            type="button"
                            onClick={() => removeGenre(g)}
                            className="text-sm font-bold text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* SUCCESS MESSAGE */}
                  {successMessage && (
                    <div className="rounded bg-green-100 text-green-800 px-4 py-2 text-sm mb-2">
                      {successMessage}
                    </div>
                  )}

                  {/* SUBMIT BUTTON */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`mt-2 w-full rounded py-3 font-semibold text-white ${
                      isSubmitting
                        ? "bg-blue-300 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-500"
                    }`}
                  >
                    {isSubmitting ? "Saving..." : "Save Movie"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
      </div>
  );
}


