"use client";

import { useState, useEffect } from "react";

const navLinks = [
  { label: "HOME", href: "#home" },
  { label: "ABOUT", href: "#about" },
  { label: "PRODUCTS", href: "#services" },
  { label: "CONTACT", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href: string) => {
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-0.3 transition-all duration-500"
      style={{
        background: scrolled
          ? "rgba(10, 10, 15, 0.85)"
          : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "none",
      }}
    >
      {/* Logo */}
      <button
  onClick={() => scrollTo("#home")}
  className="transition-opacity duration-300 hover:opacity-70"
  aria-label="Go to home">
  <img src="/logo-new.png" alt="Stinablis" className="w-20 h-20 object-contain" />
</button>

      {/* Nav Links */}
      <div className="flex items-center gap-8 md:gap-12">
        {navLinks.map((link) => (
          <button
            key={link.label}
            onClick={() => scrollTo(link.href)}
            className="font-michroma text-[11px] tracking-[0.2em] text-white/60 hover:text-white transition-colors duration-300 relative group"
          >
            {link.label}
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white/60 group-hover:w-full transition-all duration-300" />
          </button>
        ))}
      </div>
    </nav>
  );
}
