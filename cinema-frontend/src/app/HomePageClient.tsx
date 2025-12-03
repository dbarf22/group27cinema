"use client";

import { useState } from "react";
import { Movie } from "@/types/movie";
import MovieSection from "@/components/MovieSection";
import MovieSearch from "@/components/MovieSearch";
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

        <div className="carousel w-full rounded-box">
            <div id="slide1" className="carousel-item relative w-full">
                <img
                    src="opening.jpg"
                    className="w-full" />
                <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                    <a href="#slide4" className="btn btn-circle">❮</a>
                    <a href="#slide2" className="btn btn-circle">❯</a>
                </div>
            </div>
            <div id="slide2" className="carousel-item relative w-full">
                <img
                    src="nowshowing.jpg"
                    className="w-full" />
                <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                    <a href="#slide1" className="btn btn-circle">❮</a>
                    <a href="#slide3" className="btn btn-circle">❯</a>
                </div>
            </div>
            <div id="slide3" className="carousel-item relative w-full">
                <img
                    src="promo.jpg"
                    className="w-full" />
                <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                    <a href="#slide2" className="btn btn-circle">❮</a>
                    <a href="#slide4" className="btn btn-circle">❯</a>
                </div>
            </div>
        </div>

      <MovieSection
        title="Now Playing on: "
        movies={nowPlaying}
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
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
