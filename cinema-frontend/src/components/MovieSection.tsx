"use client";

import MovieCard from "./MovieCard";
import { Movie } from "@/types/movie";
import {useState} from "react";
import {text} from "node:stream/consumers";
import Form from "next/form";

export default function MovieSection({
  title,
  movie
}: {
  title: string;
  movie: Movie;
}) {

  const [searchQuery, setSearchQuery] = useState("");
  const [movies, filteredMovies] = useState<Movie[]>([]);

  function movieFilter(title: string) {
      return movies.filter(movie => movie.title.toLowerCase().includes(title.toLowerCase()));
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Button hit!");
  }

  return (
    <section className="space-y-10">
      <div>
          <button onClick={handleSearch}>click me</button>

      </div>
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
