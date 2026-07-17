"use client";

import { useState, useEffect } from "react";
import { Home, Info, Box, Mail, Menu, X, Recycle, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";

const navLinks = [
  { label: "Home", href: "#hero", icon: Home },
  { label: "About", href: "#about", icon: Info },
  { label: "Services", href: "#products", icon: Box },
  { label: "3D Model", href: "#3d-model", icon: Layers },
  { label: "Pangkas", href: "#pangkas", icon: Recycle },
  { label: "Contact", href: "#contact", icon: Mail },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isLightBg, setIsLightBg] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);

      let overLight = false;
      if (pathname === "/") {
        const aboutEl = document.getElementById("about");
        const contactEl = document.getElementById("contact");
        const navbarHeight = 80;

        [aboutEl, contactEl].forEach((el) => {
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= navbarHeight && rect.bottom >= 0) {
              overLight = true;
            }
          }
        });
      }
      setIsLightBg(overLight);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // Run initially
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  const scrollTo = (href: string) => {
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavClick = (href: string) => {
    if (href === "#products") {
      if (pathname === "/services") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        router.push("/services");
      }
    } else if (href === "#3d-model") {
      if (pathname === "/3d-model") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        router.push("/3d-model");
      }
    } else if (href === "#pangkas") {
      if (pathname === "/pangkas") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        router.push("/pangkas");
      }
    } else if (href === "#about") {
      if (pathname === "/about") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        router.push("/about");
      }
    } else {
      if (pathname === "/") {
        scrollTo(href);
      } else {
        sessionStorage.setItem("scrollToSection", href);
        router.push("/");
      }
    }
  };

  const handleLogoClick = () => {
    if (pathname === "/") {
      scrollToTop();
    } else {
      router.push("/");
    }
  };

  const navClasses = scrolled
    ? `fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-5xl px-6 md:px-8 py-3 rounded-full border shadow-2xl backdrop-blur-md transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] z-[500] flex items-center justify-between ${
        isLightBg 
          ? "bg-white/80 border-carbon/10 text-carbon shadow-carbon/5" 
          : "bg-carbon/80 border-white/10 text-frost shadow-black/40"
      }`
    : `fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl px-6 md:px-12 py-5 bg-transparent border-b border-transparent transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] z-[500] flex items-center justify-between`;

  return (
    <>
      <nav className={navClasses}>
        {/* Logo */}
        <div className="flex items-center">
          <button
            onClick={handleLogoClick}
            className="group flex items-center"
            aria-label="Go to home"
          >
            <img 
              src="/logo-new.png" 
              alt="Stinablis" 
              className={`w-auto object-contain transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                scrolled 
                  ? "h-8 md:h-9" 
                  : "h-20 md:h-24"
              } ${isLightBg ? 'brightness-0' : 'brightness-0 invert'}`} 
            />
          </button>
        </div>

        {/* Navigation Links */}
        <ul className="hidden lg:flex items-center gap-9">
          {navLinks.map((link) => (
            <li key={link.label}>
              <button
                onClick={() => handleNavClick(link.href)}
                className={`flex items-center gap-2 font-roboto text-[13px] tracking-[0.12em] uppercase opacity-60 hover:opacity-100 transition-all duration-200 ${
                  isLightBg ? "text-carbon" : "text-frost"
                }`}
              >
                <link.icon size={14} className="opacity-70" />
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        {/* CTA and Burger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNavClick("#contact")}
            className={`hidden sm:block font-roboto text-[12px] tracking-[0.12em] uppercase px-6 py-2.5 border transition-all duration-200 rounded-full ${
              isLightBg 
                ? "text-carbon border-carbon/20 hover:border-coral hover:bg-coral/10" 
                : "text-frost border-frost/20 hover:border-coral hover:bg-coral/10"
            }`}
          >
            Get in touch
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`lg:hidden p-2.5 rounded-full border transition-all duration-200 ${
              isLightBg
                ? "text-carbon border-carbon/15 hover:bg-carbon/5"
                : "text-frost border-white/10 hover:bg-white/5"
            }`}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-carbon z-[600] lg:hidden flex flex-col justify-center px-8 md:px-24"
          >
            <div className="absolute top-6 left-6 md:left-12">
              <img 
                src="/logo-new.png" 
                alt="Stinablis" 
                className="h-10 w-auto object-contain brightness-0 invert" 
              />
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-6 right-6 md:right-12 p-3 text-frost hover:text-coral transition-colors"
              aria-label="Close Menu"
            >
              <X size={28} />
            </button>

            <ul className="flex flex-col gap-5 md:gap-7 mt-8">
              {navLinks.map((link, idx) => (
                <motion.li 
                  key={link.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  transition={{ delay: idx * 0.04 + 0.05, duration: 0.3, ease: "easeOut" }}
                >
                  <button
                    onClick={() => {
                      handleNavClick(link.href);
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-4 font-anton text-[24px] md:text-[32px] tracking-[0.05em] uppercase text-frost hover:text-coral transition-colors text-left"
                  >
                    <span className="text-[12px] text-mauve font-roboto tracking-widest font-normal">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    {link.label}
                  </button>
                </motion.li>
              ))}
            </ul>

            <div className="w-full h-[1px] bg-white/10 my-8" />

            <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-mauve mb-1 font-bold">Inquiries</p>
                <a href="mailto:info@stinablis.com" className="text-frost hover:text-coral text-sm font-light">info@stinablis.com</a>
              </div>
              <button
                onClick={() => {
                  handleNavClick("#contact");
                  setIsMenuOpen(false);
                }}
                className="bg-coral text-white font-roboto text-[12px] tracking-[0.15em] uppercase px-8 py-3.5 border border-coral hover:bg-transparent transition-all font-bold"
              >
                Get in touch
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
