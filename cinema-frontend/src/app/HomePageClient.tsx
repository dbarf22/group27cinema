"use client";

import { useState } from "react";
import { Movie } from "@/types/movie";
import MovieSection from "@/components/MovieSection";
import MovieSearch from "@/components/MovieSearch";
import DatePicker from "@/components/DatePicker";

type HomePageClientProps = {
  nowPlaying: Movie[];
  comingSoon: Movie[];
};

export default function HomePageClient({
  nowPlaying,
  comingSoon,
}: HomePageClientProps) {
  const [selectedTime, setSelectedTime] = useState<Date | null>(new Date());

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 space-y-10">
      {/* Calendar / date picker at the top */}
      <div className="flex justify-center">
        <DatePicker
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
        />
      </div>

      {/* Sections that depend on the selected date */}
      <MovieSection
        title="Now Playing"
        movies={nowPlaying}
        selectedTime={selectedTime}
      />
      <MovieSection
        title="Coming Soon"
        movies={comingSoon}
        selectedTime={selectedTime}
      />

      <h1 className="text-2xl font-bold mb-4">Movie Search</h1>
      <MovieSearch />
    </main>
  );
}
