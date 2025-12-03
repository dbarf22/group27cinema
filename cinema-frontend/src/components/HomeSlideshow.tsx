"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Slide = {
  id: string;
  src: string;
  alt: string;
};

const SLIDE_INTERVAL_MS = 6000;

const slides: Slide[] = [
  { id: "title-card", src: "/opening.jpg", alt: "Grand Opening" },
  { id: "now-playing", src: "/nowshowing.jpg", alt: "Now Showing" },
  { id: "promotions", src: "/promo.jpg", alt: "Sign Up" },
];

export default function SlideShow() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  const goPrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  const goNext = () =>
    setCurrentIndex((prev) => (prev + 1) % slides.length);

  const goTo = (i: number) => setCurrentIndex(i);

  return (
    <section className="w-full">
      <div className="relative mx-auto max-w-screen-xl overflow-hidden rounded-2xl shadow-lg">

        {/* FIXED 2048x784 ASPECT RATIO */}
        <div className="relative aspect-[2048/784] w-full">

          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
        </div>

        {/* Arrows */}
        <button
          onClick={goPrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 px-2 py-1 text-white text-sm hover:bg-black/60"
        >
          ‹
        </button>
        <button
          onClick={goNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 px-2 py-1 text-white text-sm hover:bg-black/60"
        >
          ›
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-2.5 w-2.5 rounded-full border border-white ${
                currentIndex === i ? "bg-white" : "bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
