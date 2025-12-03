"use client";

import MovieCard from "./MovieCard";
import { Movie } from "@/types/movie";
import {useMemo, useRef, useState} from "react";
import DatePicker from "@/components/DatePicker"

export default function MovieSection({
  title,
  movies,
  selectedTime,
  setSelectedTime
}: {
  title: string;
  movies: Movie[];
  selectedTime: Date | null;
  setSelectedTime?: (newTime: Date | null) => void;
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
      [searchQuery, movies]
  )

  return (
    <div className="space-y-3">
      <div className="flex justify-between ">
          <label className={"flex text-2xl font-semibold items-center min-w-1/2"}>
              <label className={"mr-3"}>{title}</label>
              {setSelectedTime && selectedTime && (
                  <DatePicker
                      selectedTime={selectedTime}
                      setSelectedTime={setSelectedTime}
                  />
              )}
          </label>
          <label className={"input "}>
              <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <g
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      strokeWidth="2.5"
                      fill="none"
                      stroke="currentColor"
                  >
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.3-4.3"></path>
                  </g>
              </svg>
              <input placeholder={"Search for a movie"} ref={inputRef} onChange={handleSearchChange}/>
          </label>

      </div>

      {movies.length === 0 ? (
        <p>Nothing to show here yet.</p>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {filteredMovies.map((m) => (
            <MovieCard key={m.id} movie={m} selectedTime={selectedTime}/>
          ))}
        </div>
      )}
    </div>
  );
}
