"use client";

import MovieCard from "./MovieCard";
import { Movie } from "@/types/movie";
import {useState} from "react";
import {text} from "node:stream/consumers";
import Form from "next/form";

export default function MovieSection({
  title,
}: {
  title: string;
}) {

  const [searchQuery, setSearchQuery] = useState("");
  const [movies, filteredMovies] = useState<Movie[]>([]);

  function movieFilter(title: string) {
      return movies.filter(movie => movie.title.toLowerCase().includes(title.toLowerCase()));
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

  }

  return (
    <section className="space-y-10">
      <div>
          <Form className="mx-auto" action={""}>
            <input name ="query" className="bg-red-100"/>
            <button className="space-x-3">Submit</button>
          </Form>

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
