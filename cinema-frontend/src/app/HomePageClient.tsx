"use client";

import { useState, useEffect } from "react";
import { Movie } from "@/types/movie";
import MovieSection from "@/components/MovieSection";
import MovieSearch from "@/components/MovieSearch";

type HomePageClientProps = {
  nowPlaying: Movie[];
  comingSoon: Movie[];
};

const SLIDE_DURATION = 5000; //ms

const slides = [
  { id: "slide1", src: "/opening.jpg", alt: "Grand Opening for Cinema 27" },
  { id: "slide2", src: "/nowshowing.jpg", alt: "Now Showing" },
  { id: "slide3", src: "/promo.jpg", alt: "Sign up for promotions" },
];

export default function HomePageClient({
  nowPlaying,
  comingSoon,
}: HomePageClientProps) {
  const [selectedTime, setSelectedTime] = useState<Date | null>(new Date());
  const [currentIndex, setCurrentIndex] = useState(0);

  // autoscroll and loop through slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, SLIDE_DURATION);

    return () => clearInterval(timer);
  }, []);

  const goNext = () =>
    setCurrentIndex((prev) => (prev + 1) % slides.length);

  const goPrev = () =>
    setCurrentIndex((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 space-y-10">
      <div className="relative carousel w-full rounded-box overflow-hidden">
        <div className="relative w-full aspect-[2048/784]">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`
                carousel-item absolute inset-0 w-full
                transition-opacity duration-700 ease-in-out
                ${index === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none"}
              `}
            >
              <img src={slide.src} alt={slide.alt} className="w-full h-full object-cover" />

              <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                <button
                  type="button"
                  className="btn btn-circle"
                  onClick={goPrev}
                  aria-label="Previous slide"
                >
                  ❮
                </button>
                <button
                  type="button"
                  className="btn btn-circle"
                  onClick={goNext}
                  aria-label="Next slide"
                >
                  ❯
                </button>
              </div>
            </div>
          ))}
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
