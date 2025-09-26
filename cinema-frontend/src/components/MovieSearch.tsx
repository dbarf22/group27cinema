"use client";

import { useEffect, useMemo, useState } from "react";

type Movie = {
  id?: string;     // Your Spring serialization may be "id"
  _id?: string;    // or "_id" depending on your model
  title: string;
  genre?: string;
  year?: number;
};

export default function MovieSearch() {
  const [mode, setMode] = useState<"title" | "genre">("title");
  const [q, setQ] = useState("");
  const [items, setItems] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  // simple debounce so we don't spam the backend while typing
  const debouncedQuery = useDebounce(q, 300);

  async function fetchMovies(query: string, by: "title" | "genre") {
    setLoading(true);
    setError(null);
    try {
      const param = query.trim() ? `?${by}=${encodeURIComponent(query)}` : "";
      const res = await fetch(`/api/movies${param}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  // initial load: show all movies
  useEffect(() => {
    fetchMovies("", mode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // live update on debounced input
  useEffect(() => {
    fetchMovies(debouncedQuery, mode);
  }, [debouncedQuery, mode]);

  return (
    <div className="max-w-2xl space-y-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchMovies(q, mode);
        }}
        className="flex gap-2"
      >
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as "title" | "genre")}
          className="border rounded px-2 py-2"
        >
          <option value="title">Title</option>
          <option value="genre">Genre</option>
        </select>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Search by ${mode}…`}
          className="flex-1 border rounded px-3 py-2"
        />

        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white"
        >
          Search
        </button>
      </form>

      {loading && <p>Loading…</p>}
      {error && <p className="text-red-600">Error: {error}</p>}
      {!loading && !error && items.length === 0 && <p>No results.</p>}

      <ul className="space-y-2">
        {items.map((m, i) => {
          const key = (m.id ?? m._id ?? i) as React.Key;
          return (
            <li key={key} className="border rounded p-3">
              <div className="font-semibold">{m.title}</div>
              <div className="text-sm text-gray-600">
                {m.genre ?? "Unknown genre"} {m.year ? `• ${m.year}` : ""}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Small debounce hook */
function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
