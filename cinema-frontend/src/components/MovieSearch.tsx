"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Movie = {
  id?: string;
  _id?: string;
  title: string;
  genre?: string[];
  year?: number;
};

export default function MovieSearch() {
  const [mode, setMode] = useState<"title" | "genre">("title");
  const [q, setQ] = useState("");
  const [items, setItems] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const debouncedQuery = useDebounce(q, 300);

  async function fetchMovies(query: string, by: "title" | "genre") {
    setLoading(true);
    setError(null);
    try {
      const param = query.trim() ? `?${by}=${encodeURIComponent(query)}` : "";
      const res = await fetch(`/api/movies${param}`, {cache: "no-store"});
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

  useEffect(() => {
    fetchMovies(debouncedQuery, mode);
  }, [debouncedQuery, mode]);

  return (
    <div className="max-w-screen-xl mx-auto space-y-4">
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
          className="btn px-2 py-2 bg-base-100"
        >
          <option value="title">Title</option>
          <option value="genre">Genre</option>
        </select>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Search by ${mode}…`}
          className="flex-1 input px-3 py-2"
        />

        <button
          type="submit"
          className="px-4 py-2 btn btn-neutral"
        >
          Search
        </button>
      </form>

      {loading && <p>Loading…</p>}
      {error && <p className="text-error">Error: {error}</p>}
      {!loading && !error && items.length === 0 && <p>No results.</p>}

      <ul className="space-y-2">
        {items.map((m, i) => {
          const key = (m.id ?? m._id ?? i) as React.Key;
          return (
          <li key={key} className="card bg-base-100 border-base-300 border p-3 shadow-sm">
            <Link href={`/movies/${m.id ?? m._id}`} className="block space-y-1">
             <div className="font-semibold text-balck-700 hover:underline">
              {m.title}
             </div>
             <div className="text-sm text-gray-600">
              {m.genre ?? "Unknown genre"} {m.year ? `${m.year}` : ""}
             </div>
             </Link>
          </li>
           );
        })}
      </ul>
    </div>
  );
}

function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
