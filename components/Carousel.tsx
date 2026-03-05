"use client";

import { useState, useEffect, useCallback } from "react";

const services = [
  {
    title: "Engineering Innovation",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
    description: "Cutting-edge solutions",
  },
  {
    title: "Sustainable Energy",
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&q=80",
    description: "Green future",
  },
  {
    title: "Modern Architecture",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
    description: "Visionary spaces",
  },
  {
    title: "Industrial Design",
    image: "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=800&q=80",
    description: "Form meets function",
  },
];

function getCardClass(index: number, active: number, total: number): string {
  const diff = ((index - active) % total + total) % total;
  if (diff === 0) return "center";
  if (diff === 1) return "right";
  if (diff === total - 1) return "left";
  if (diff === 2) return "hidden-right";
  return "hidden-left";
}

export default function Carousel() {
  const [active, setActive] = useState(0);
  const total = services.length;

  const next = useCallback(() => setActive((a) => (a + 1) % total), [total]);
  const prev = useCallback(() => setActive((a) => (a - 1 + total) % total), [total]);

  useEffect(() => {
    const timer = setInterval(next, 3500);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="flex flex-col items-center gap-10">
      {/* Carousel */}
      <div
        className="carousel-container relative w-full"
        style={{ height: "300px" }}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {services.map((service, i) => {
            const cardClass = getCardClass(i, active, total);
            return (
              <div
                key={i}
                className={`carousel-card rounded-lg overflow-hidden ${cardClass}`}
                onClick={() => {
                  if (cardClass === "right") next();
                  else if (cardClass === "left") prev();
                }}
                style={{ cursor: cardClass !== "center" ? "pointer" : "default" }}
              >
                {/* Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${service.image})` }}
                />

                {/* Gradient overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)",
                  }}
                />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-michroma text-white text-lg tracking-wider leading-snug">
                    {service.title}
                  </h3>
                  <p className="font-ar-one text-white/50 text-sm mt-1 tracking-wide">
                    {service.description}
                  </p>
                </div>

                {/* Border glow on active */}
                {cardClass === "center" && (
                  <div className="absolute inset-0 rounded-lg border border-white/10" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Dots */}
      <div className="flex items-center gap-2">
        {services.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="h-[4px] rounded-full transition-all duration-500"
            style={{
              width: i === active ? "32px" : "6px",
              background: i === active ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.3)",
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Arrow buttons */}
      <div className="flex gap-4">
        <button
          onClick={prev}
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-all duration-300 font-michroma text-xs"
          aria-label="Previous"
        >
          ←
        </button>
        <button
          onClick={next}
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-all duration-300 font-michroma text-xs"
          aria-label="Next"
        >
          →
        </button>
      </div>
    </div>
  );
}
