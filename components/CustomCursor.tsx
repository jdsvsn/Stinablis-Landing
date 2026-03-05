"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let animId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.left = `${mouseX}px`;
        dotRef.current.style.top = `${mouseY}px`;
      }
    };

    const animate = () => {
      // Spring interpolation for ring
      const spring = 0.12;
      ringX += (mouseX - ringX) * spring;
      ringY += (mouseY - ringY) * spring;

      if (ringRef.current) {
        ringRef.current.style.left = `${ringX}px`;
        ringRef.current.style.top = `${ringY}px`;
      }

      animId = requestAnimationFrame(animate);
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], input, textarea, select, label')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);
    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      {/* Main dot */}
      <div
        ref={dotRef}
        className="fixed pointer-events-none z-[999999] -translate-x-1/2 -translate-y-1/2"
        style={{ mixBlendMode: "difference" }}
      >
        <div
          className="rounded-full bg-white transition-transform duration-150"
          style={{
            width: "6px",
            height: "6px",
            transform: isHovering ? "scale(2)" : "scale(1)",
          }}
        />
      </div>

      {/* Ring follower */}
      <div
        ref={ringRef}
        className="fixed pointer-events-none z-[999998] -translate-x-1/2 -translate-y-1/2"
        style={{ mixBlendMode: "difference" }}
      >
        <div
          className="rounded-full border border-white transition-all duration-300"
          style={{
            width: isHovering ? "60px" : "40px",
            height: isHovering ? "60px" : "40px",
            opacity: isHovering ? 0.6 : 0.4,
          }}
        />
      </div>
    </>
  );
}
