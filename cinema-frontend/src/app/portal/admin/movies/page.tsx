"use client";
import { FormEvent, useState, useEffect } from "react";

const MAX_TITLE = 50;
const MAX_CAST = 500;
const MAX_PRODUCER = 50;
const MAX_DESCRIPTION = 255;

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    if (title.length > MAX_TITLE)
      newErrors.title = `Title must be at most ${MAX_TITLE} characters.`;

    if (!castList.trim()) newErrors.castList = "Cast list is required.";
    if (castList.length > MAX_CAST)
      newErrors.castList = `Cast list must be at most ${MAX_CAST} characters.`;

    if (!producer.trim()) newErrors.producer = "Producer is required.";
    if (producer.length > MAX_PRODUCER)
      newErrors.producer = `Producer must be at most ${MAX_PRODUCER} characters.`;

    if (duration === null || duration <= 0)
      newErrors.duration = "Duration is required.";

    if (!poster.trim()) newErrors.poster = "Poster URL is required.";
    if (!trailer.trim()) newErrors.trailer = "Trailer URL is required.";

    if (!reviewScore.trim())
      newErrors.reviewScore = "Review score is required.";

    if (!ratingCode.trim()) newErrors.ratingCode = "Rating code is required.";

    if (!description.trim())
      newErrors.description = "Description is required.";
    if (description.length > MAX_DESCRIPTION)
      newErrors.description = `Description must be at most ${MAX_DESCRIPTION} characters.`;

    if (genres.length === 0)
      newErrors.genres = "At least one genre required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    console.log(promoStart);
  }, [promoStart]);

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
      setErrors((prev) => ({
        ...prev,
        genres: "At least one genre required.",
      }));
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!validateFields()) return;
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSuccessMessage("");

    const reviewScoreNumber =
      reviewScore.trim() === "" ? null : Number(reviewScore);

    try {
      const res = await fetch("http://localhost:8080/api/admin/movies/add", {
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
          reviewScore: reviewScoreNumber,
          ratingCode,
          description,
          genres,
          director,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Add movie failed:", res.status, text);
        throw new Error("Failed to add movie");
      }

      setSuccessMessage("Movie added successfully!");

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
      setDirector("");

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
          <div className="min-h-0">
              <div className="px-6 py-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      className="mt-1 w-full rounded border p-2"
                      value={title}
                      maxLength={MAX_TITLE}
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Cast List
                    </label>
                    <input
                      className="mt-1 w-full rounded border p-2"
                      value={castList}
                      maxLength={MAX_CAST}
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
                      placeholder="Christopher Nolan"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Producer *
                    </label>
                    <input
                      className="mt-1 w-full rounded border p-2"
                      value={producer}
                      maxLength={MAX_PRODUCER}
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
                        setErrors((prev) => ({
                          ...prev,
                          reviewScore: "",
                        }));
                      }}
                      placeholder="4.7"
                    />
                    {errors.reviewScore && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.reviewScore}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Rating Code *
                    </label>

                    <select
                      className="mt-1 w-full rounded border p-2 bg-white"
                      value={ratingCode}
                      onChange={(e) => {
                        setRatingCode(e.target.value);
                        setErrors((prev) => ({
                          ...prev,
                          ratingCode: "",
                        }));
                      }}
                    >
                      <option value="">Select rating</option>
                      <option value="G">G – General Audiences</option>
                      <option value="PG">
                        PG – Parental Guidance Suggested
                      </option>
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Description *
                    </label>
                    <textarea
                      className="mt-1 w-full rounded border p-2 min-h-24"
                      value={description}
                      maxLength={MAX_DESCRIPTION}
                      onChange={(e) => {
                        setDescription(e.target.value);
                        setErrors((prev) => ({
                          ...prev,
                          description: "",
                        }));
                      }}
                      placeholder="A team of explorers travel through a wormhole..."
                    />
                    {errors.description && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {description.length}/{MAX_DESCRIPTION} characters
                    </p>
                  </div>

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

                  {successMessage && (
                    <div className="rounded bg-green-100 text-green-800 px-4 py-2 text-sm mb-2">
                      {successMessage}
                    </div>
                  )}

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
    </div>
  );
}
