"use client";

import MovieCard from "./MovieCard";
import { Movie } from "@/types/movie";
import {useMemo, useState} from "react";
import {text} from "node:stream/consumers";
import Form from "next/form";

export default function MovieSection({
  title,
  movies
}: {
  title: string;
  movies: Movie[];
}) {

  const [searchQuery, setSearchQuery] = useState("");

  function movieFilter(title: string) {
      return movies.filter(movie => movie.title.toLowerCase().includes(title.toLowerCase()));
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
  }

  const filteredMovies = useMemo(() =>{
      return movieFilter(searchQuery);},
      [searchQuery]
  )

  return (
    <section className="space-y-10">
      <input
          type="text"
          placeholder="Search movies by title..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="p-2 border border-gray-300 rounded-md flex-grow text-sm text-black"
        />
      <h2 className="text-2xl font-semibold">{title}</h2>
      {movies.length === 0 ? (
        <p className="text-sm text-gray-600">Nothing to show here yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMovies.map((m) => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>
      )}
    </section>
  );
}
