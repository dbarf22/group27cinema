"use client";

import MovieCard from "./MovieCard";
import { Movie } from "@/types/movie";
import {useMemo, useRef, useState} from "react";


export default function MovieSection({
  title,
  movies
}: {
  title: string;
  movies: Movie[];
}) {

  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function movieFilter(title: string) {
      return movies.filter(movie => movie.title.toLowerCase().includes(title.toLowerCase()));
  }

  const handleSearchChange = () => {
      if(inputRef.current) {
          setSearchQuery(inputRef.current.value);
      }
  }

  const filteredMovies = useMemo(() =>{
      return movieFilter(searchQuery);},
      [searchQuery]
  )

  return (
    <section className="space-y-3">
      <h2 className="text-2xl font-semibold">{title}</h2>
        <input placeholder={"Search for a movie"} ref={inputRef} onChange={handleSearchChange} className={"border bg-gray-100 rounded"} />
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
