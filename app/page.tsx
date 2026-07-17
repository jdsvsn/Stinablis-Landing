"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import emailjs from "@emailjs/browser";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Instagram, 
  Linkedin, 
  Facebook, 
  Thermometer, 
  ShieldCheck, 
  Droplets, 
  Feather, 
  Compass, 
  Layers, 
  Leaf, 
  Recycle, 
  Search, 
  Settings, 
  Terminal, 
  Zap 
} from "lucide-react";

// Dynamic imports for client-only components
const CustomCursor = dynamic(() => import("@/components/CustomCursor"), { ssr: false });
const CarPartModel = dynamic(() => import("@/components/CarPartModel"), { ssr: false });
const LiquidEther = dynamic(() => import("@/components/LiquidEther"), { ssr: false });
const PangkasScrolly = dynamic(() => import("@/components/PangkasScrolly"), { ssr: false });

// In-memory flag to persist load state across client-side page transitions
let hasLoadedBefore = false;

export default function Home() {
  const [loaded, setLoaded] = useState(hasLoadedBefore);
  const [isFirstLoad, setIsFirstLoad] = useState(!hasLoadedBefore);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);

  const handleComplete = () => {
    hasLoadedBefore = true;
    setIsFirstLoad(false);
    setLoaded(true);
  };

  useEffect(() => {
    if (!loaded) return;

    // Check if we need to scroll to a section from another page
    const section = sessionStorage.getItem("scrollToSection");
    if (section) {
      sessionStorage.removeItem("scrollToSection");
      setTimeout(() => {
        const id = section.replace("#", "");
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 600);
    }

    // Clean up URL hash in case of direct bookmarked link loads
    if (window.location.hash) {
      const hash = window.location.hash;
      setTimeout(() => {
        const el = document.getElementById(hash.replace("#", ""));
        if (el) el.scrollIntoView({ behavior: "smooth" });
        window.history.replaceState(null, "", window.location.pathname);
      }, 600);
    }

    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const updateRaf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateRaf);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      // 0. Smooth Scroll Progress Bar (GSAP optimized)
      gsap.set(".scroll-bar", { scaleX: 0, transformOrigin: "left center" });
      gsap.to(".scroll-bar", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
        }
      });

      // 1. Initial Load Timeline (Hero Section)
      const tl = gsap.timeline({ 
        defaults: { ease: "power3.out", duration: 1.2, force3D: true } 
      });

      tl.fromTo(".hero-eyebrow", { y: 20, opacity: 0 }, { y: 0, opacity: 1, delay: 0.2 })
        .fromTo(".hero-name", { y: 50, opacity: 0 }, { y: 0, opacity: 1 }, "-=0.9")
        .fromTo(".hero-tagline", { y: 20, opacity: 0 }, { y: 0, opacity: 1 }, "-=1.0")
        .fromTo(".hero-actions", { y: 20, opacity: 0 }, { y: 0, opacity: 1 }, "-=1.0");

      // Card minimize effect on scroll enter & exit (floating card transition) with responsive matchMedia
      const mm = gsap.matchMedia();
      const contactEl = document.getElementById("contact");
      const vh = window.innerHeight;
      const contactRatio = contactEl ? Math.max(0.1, (contactEl.offsetHeight - vh) / vh) : 1;

      // Mobile scale and borders
      mm.add("(max-width: 767px)", () => {
        const contactScrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: "#contact",
            start: "top bottom",
            end: "bottom top",
            scrub: 2.0
          }
        });

        contactScrollTl.fromTo("#contact", {
          scale: 0.95,
          borderRadius: "20px",
          boxShadow: "0 15px 30px -10px rgba(0, 0, 0, 0.4)"
        }, {
          scale: 1.0,
          borderRadius: "0px",
          boxShadow: "0 0px 0px 0px rgba(0, 0, 0, 0)",
          duration: 1.0,
          ease: "none"
        }).to("#contact", {
          scale: 1.0,
          borderRadius: "0px",
          boxShadow: "0 0px 0px 0px rgba(0, 0, 0, 0)",
          duration: contactRatio,
          ease: "none"
        }).to("#contact", {
          scale: 0.95,
          borderRadius: "20px",
          boxShadow: "0 15px 30px -10px rgba(0, 0, 0, 0.4)",
          duration: 1.0,
          ease: "none"
        });
      });

      // Desktop scale and borders
      mm.add("(min-width: 768px)", () => {
        const contactScrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: "#contact",
            start: "top bottom",
            end: "bottom top",
            scrub: 2.0
          }
        });

        contactScrollTl.fromTo("#contact", {
          scale: 0.88,
          borderRadius: "40px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
        }, {
          scale: 1.0,
          borderRadius: "0px",
          boxShadow: "0 0px 0px 0px rgba(0, 0, 0, 0)",
          duration: 1.0,
          ease: "none"
        }).to("#contact", {
          scale: 1.0,
          borderRadius: "0px",
          boxShadow: "0 0px 0px 0px rgba(0, 0, 0, 0)",
          duration: contactRatio,
          ease: "none"
        }).to("#contact", {
          scale: 0.88,
          borderRadius: "40px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          duration: 1.0,
          ease: "none"
        });
      });

      // 2. Showcase Grid Section animations
      gsap.fromTo(".grid-header", 
        { y: 30, opacity: 0, scale: 0.99 },
        { 
          scrollTrigger: { trigger: "#showcase-grid", start: "top 85%" }, 
          y: 0, 
          opacity: 1, 
          scale: 1,
          duration: 1.0, 
          ease: "power3.out",
          force3D: true 
        }
      );

      gsap.fromTo(".grid-card", 
        { y: 50, opacity: 0, scale: 0.98 },
        { 
          scrollTrigger: { trigger: "#showcase-grid", start: "top 75%" }, 
          y: 0, 
          opacity: 1, 
          scale: 1,
          stagger: 0.15, 
          duration: 1.0, 
          ease: "power3.out",
          force3D: true 
        }
      );

      gsap.fromTo(".showcase-ticker", 
        { y: 20, opacity: 0 },
        { 
          scrollTrigger: { trigger: ".showcase-ticker", start: "top 95%" }, 
          y: 0, 
          opacity: 1, 
          duration: 1.0, 
          ease: "power3.out",
          force3D: true 
        }
      );

      // 3. Contact Section
      gsap.fromTo(".contact-header", 
        { y: 30, opacity: 0, scale: 0.99 },
        { 
          scrollTrigger: { trigger: "#contact", start: "top 85%" }, 
          y: 0, 
          opacity: 1, 
          scale: 1,
          duration: 1.0, 
          ease: "power3.out",
          force3D: true 
        }
      );

      gsap.fromTo(".contact-col", 
        { y: 40, opacity: 0, scale: 0.98 },
        { 
          scrollTrigger: { trigger: ".contact-grid", start: "top 85%" }, 
          y: 0, 
          opacity: 1, 
          scale: 1,
          stagger: 0.12, 
          duration: 1.0, 
          ease: "power3.out",
          force3D: true 
        }
      );

      // Fade out global bg animation when scrolling into Showcase section
      gsap.to(".global-bg-anim", {
        scrollTrigger: {
          trigger: "#showcase-grid",
          start: "top top",
          end: "top -50%",
          scrub: true
        },
        opacity: 0,
        ease: "none"
      });
    });

    return () => {
      ctx.revert();
      gsap.ticker.remove(updateRaf);
      lenis.destroy();
    };
  }, [loaded]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setSending(true);
    setError(false);
    setSent(false);

    try {
      await emailjs.send(
        "service_z4refme",
        "template_2tz2nes",
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
        },
        "W4PxuH5Nidlqts1aJ"
      );
      setSent(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setError(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <div className="scroll-bar fixed top-0 left-0 bg-coral z-[999] w-full origin-left-center" style={{ height: "2px", transform: "scaleX(0)" }}></div>

      {isFirstLoad && <LoadingScreen onComplete={handleComplete} />}

      {loaded && (
        <div className="relative w-full overflow-x-hidden bg-carbon text-frost font-roboto">
          <CustomCursor />
          <Navbar />

          {/* GLOBAL BACKGROUND ANIMATION */}
          <div className="global-bg-anim fixed inset-0 pointer-events-none z-0 opacity-100">
            <LiquidEther
              colors={['#fc673f', '#dff122', '#114d43']}
              mouseForce={7}
              cursorSize={80}
              isViscous={false}
              resolution={0.4}
              autoDemo={true}
              autoSpeed={0.15}
              autoIntensity={0.9}
            />
          </div>

          {/* HERO */}
          <section id="hero" className="min-h-screen flex flex-col justify-center items-center px-6 md:px-12 relative z-10 text-center">
            <div className="hero-left relative z-10 max-w-4xl flex flex-col items-center">
              <div className="hero-eyebrow flex items-center gap-3.5 mb-7">
                <p className="text-[11px] tracking-[0.16em] uppercase text-mauve font-medium">Kuching, Sarawak · Malaysia</p>
              </div>
              <h1 className="hero-name font-anton text-[60px] md:text-[8vw] lg:text-[110px] tracking-[0.05em] leading-[1] text-frost uppercase">
                STINABLIS
              </h1>
              <div className="my-8" />
              <p className="hero-tagline text-[14px] md:text-[1.8vw] lg:text-[20px] tracking-[0.1em] uppercase text-mauve/80 leading-[1.6] font-light">
                Industrial Engineering & Digital<br />Manufacturing Solutions
              </p>
              <div className="hero-actions flex flex-wrap justify-center gap-5 mt-12">
                <a href="#products" className="btn-primary bg-coral text-white px-9 py-4 text-[13px] tracking-[0.15em] uppercase inline-flex items-center gap-3 transition-all hover:translate-y-[-2px] hover:shadow-[0_15px_45px_rgba(252,103,63,0.35)] font-medium">
                  Our Services
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
                <a href="#about" className="btn-ghost border border-frost/20 text-frost px-9 py-4 text-[13px] tracking-[0.15em] uppercase hover:border-coral transition-all font-medium">
                  Learn More
                </a>
              </div>
            </div>
          </section>

          {/* PHOTO GRID SHOWCASE (Replicating hahaha.jpg Layout) */}
          <section id="showcase-grid" className="bg-carbon relative z-10 overflow-hidden">

            {/* Ticker Tape Scrolling Capabilities Loop */}
            <div className="showcase-ticker opacity-0 w-full border-t border-b border-frost/10 py-7 relative overflow-hidden flex bg-carbon">
              <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-carbon to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-carbon to-transparent z-10 pointer-events-none" />
              
              <div className="animate-marquee flex gap-16 items-center">
                {[...Array(2)].map((_, listIdx) => (
                  <div key={listIdx} className="flex gap-16 items-center flex-shrink-0">
                    {[
                      { label: "Engineering", icon: Settings },
                      { label: "3D Printing", icon: Layers },
                      { label: "Software Tech", icon: Terminal },
                      { label: "Bio-Composites", icon: Leaf },
                      { label: "Rapid Prototyping", icon: Zap },
                      { label: "Reverse Eng.", icon: Search },
                      { label: "Mechanical CAD", icon: Compass },
                      { label: "Eco Materials", icon: Recycle }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 group cursor-pointer">
                        <div className="text-coral transition-transform duration-300 group-hover:scale-110">
                          <item.icon size={28} className="stroke-[1.25]" />
                        </div>
                        <span className="text-[12px] font-mono tracking-widest uppercase text-frost whitespace-nowrap font-roboto">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Main padded contents container restricted to desktop max-width */}
            <div className="max-w-7xl mx-auto py-24 md:py-32 px-6 md:px-12">
              
              {/* Section title */}
              <div className="grid-header opacity-0 mb-16">
                <div className="section-label mb-5 flex items-center gap-4">
                  <p className="text-[12px] tracking-[0.25em] uppercase text-mauve font-semibold font-roboto">Capabilities Showcase</p>
                </div>
                <h2 className="font-anton text-[45px] md:text-[5vw] lg:text-[72px] tracking-[0.02em] leading-[1.1] uppercase text-frost">
                  INVENT. BUILD. <span className="text-coral">SUSTAIN.</span>
                </h2>
              </div>

              {/* Grid Container */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
                
                {/* CARD 1: Main Highlight Card (Left, Large) - Now featuring Pangkas */}
                <div className="grid-card opacity-0 lg:col-span-2 lg:row-span-2 group relative rounded-2xl overflow-hidden border border-frost/10 bg-frost/2 backdrop-blur-sm flex flex-col justify-between transition-all duration-500 hover:border-lime/50 hover:shadow-[0_20px_50px_rgba(223,241,34,0.12)] min-h-[500px]">
                  {/* Background Image */}
                  <div className="absolute inset-0 z-0">
                    <img 
                      src="/product-end.png" 
                      alt="Pangkas Circular Pavers" 
                      className="w-full h-full object-cover transition-transform duration-[1000ms] ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/80 to-carbon/40 transition-opacity duration-500 group-hover:opacity-90" />
                  </div>

                  {/* Top content */}
                  <div className="relative z-10 p-8 md:p-10">
                    <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-lime bg-carbon/80 px-3.5 py-1.5 rounded border border-lime/20">
                      FEATURED INNOVATION
                    </span>
                  </div>

                  {/* Bottom Content */}
                  <div className="relative z-10 p-8 md:p-10">
                    <h3 className="font-anton text-[36px] md:text-[46px] tracking-[0.03em] leading-[1.05] uppercase text-frost mb-4">
                      PANGKAS<br /><span className="text-lime">CIRCULAR PAVERS</span>
                    </h3>
                    <p className="text-[14px] md:text-[15px] leading-relaxed text-frost/65 mb-8 max-w-lg font-light font-roboto">
                      Durable modular floor tiles and circular construction pavers upcycled from local post-consumer plastic wastes. High performance met with ecological responsibility.
                    </p>
                    <a 
                      href="/pangkas"
                      className="inline-flex items-center gap-3 bg-lime text-carbon text-[12px] tracking-[0.2em] uppercase font-bold py-4 px-8 transition-all duration-300 hover:bg-white hover:text-lime group-hover:translate-x-1"
                    >
                      Discover Pangkas
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform duration-300 group-hover:translate-x-1"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </a>
                  </div>
                </div>

                {/* CARD 2: Right Top Left */}
                <div className="grid-card opacity-0 lg:col-span-1 group relative rounded-2xl overflow-hidden border border-frost/10 bg-carbon flex flex-col justify-end transition-all duration-500 hover:border-lime/50 hover:shadow-[0_20px_50px_rgba(223,241,34,0.08)] min-h-[250px]">
                  <div className="absolute inset-0 z-0">
                    <img 
                      src="/scanning.png" 
                      alt="Reverse Engineering" 
                      className="w-full h-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/85 to-carbon/40 transition-opacity duration-500 group-hover:opacity-90" />
                  </div>
                  <div className="relative z-10 p-6">
                    <h4 className="font-anton text-[20px] md:text-[22px] tracking-[0.03em] uppercase text-frost mb-2">
                      REVERSE ENGINEERING
                    </h4>
                    <p className="text-[13px] text-frost/65 leading-relaxed mb-5 font-light font-roboto">
                      Precision digitization of obsolete or custom mechanical components.
                    </p>
                    <a href="/services" className="text-[11px] font-mono tracking-widest text-lime uppercase font-bold hover:text-frost transition-colors flex items-center gap-2">
                      Learn More →
                    </a>
                  </div>
                </div>

                {/* CARD 3: Right Top Right - Now featuring Engineering & Manufacturing */}
                <div className="grid-card opacity-0 lg:col-span-1 group relative rounded-2xl overflow-hidden border border-frost/10 bg-carbon flex flex-col justify-end transition-all duration-500 hover:border-lime/50 hover:shadow-[0_20px_50px_rgba(223,241,34,0.08)] min-h-[250px]">
                  <div className="absolute inset-0 z-0">
                    <img 
                      src="/about-image.jpg" 
                      alt="Engineering & Manufacturing" 
                      className="w-full h-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/85 to-carbon/40 transition-opacity duration-500 group-hover:opacity-90" />
                  </div>
                  <div className="relative z-10 p-6">
                    <h4 className="font-anton text-[20px] md:text-[22px] tracking-[0.03em] uppercase text-frost mb-2">
                      ENGINEERING & MFG
                    </h4>
                    <p className="text-[13px] text-frost/65 leading-relaxed mb-5 font-light font-roboto">
                      High-performance industrial solutions, simulation, and rapid composite fabrication.
                    </p>
                    <a href="/about" className="text-[11px] font-mono tracking-widest text-lime uppercase font-bold hover:text-frost transition-colors flex items-center gap-2">
                      Learn More →
                    </a>
                  </div>
                </div>

                {/* CARD 4: Right Bottom Left */}
                <div className="grid-card opacity-0 lg:col-span-1 group relative rounded-2xl overflow-hidden border border-frost/10 bg-carbon flex flex-col justify-end transition-all duration-500 hover:border-lime/50 hover:shadow-[0_20px_50px_rgba(223,241,34,0.08)] min-h-[250px]">
                  <div className="absolute inset-0 z-0">
                    <img 
                      src="/3dprint.jpg" 
                      alt="3D Printing Services" 
                      className="w-full h-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/85 to-carbon/40 transition-opacity duration-500 group-hover:opacity-90" />
                  </div>
                  <div className="relative z-10 p-6">
                    <h4 className="font-anton text-[20px] md:text-[22px] tracking-[0.03em] uppercase text-frost mb-2">
                      3D PRINTING & PROTOTYPING
                    </h4>
                    <p className="text-[13px] text-frost/65 leading-relaxed mb-5 font-light font-roboto">
                      Rapid additive fabrication using engineering polymers and composites.
                    </p>
                    <a href="/services" className="text-[11px] font-mono tracking-widest text-lime uppercase font-bold hover:text-frost transition-colors flex items-center gap-2">
                      View Services →
                    </a>
                  </div>
                </div>

                {/* CARD 5: Right Bottom Right */}
                <div className="grid-card opacity-0 lg:col-span-1 group relative rounded-2xl overflow-hidden border border-frost/10 bg-carbon flex flex-col justify-end transition-all duration-500 hover:border-lime/50 hover:shadow-[0_20px_50px_rgba(223,241,34,0.08)] min-h-[250px]">
                  <div className="absolute inset-0 z-0">
                    <img 
                      src="/bumper.png" 
                      alt="Automotive Components" 
                      className="w-full h-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/85 to-carbon/40 transition-opacity duration-500 group-hover:opacity-90" />
                  </div>
                  <div className="relative z-10 p-6">
                    <h4 className="font-anton text-[20px] md:text-[22px] tracking-[0.03em] uppercase text-frost mb-2">
                      AUTOMOTIVE FABRICATION
                    </h4>
                    <p className="text-[13px] text-frost/65 leading-relaxed mb-5 font-light font-roboto">
                      Custom structural composites and components for extreme utility.
                    </p>
                    <a href="/services" className="text-[11px] font-mono tracking-widest text-lime uppercase font-bold hover:text-frost transition-colors flex items-center gap-2">
                      View Services →
                    </a>
                  </div>
                </div>

              </div>

            </div>
          </section>

          {/* CONTACT */}
          <section id="contact" className="bg-frost text-carbon py-24 md:py-32 px-6 md:px-12 relative z-10 overflow-hidden">
            <div className="max-w-7xl mx-auto">
              <div className="contact-header reveal mb-20">
                <div className="section-label mb-6 flex items-center gap-4">
                  <p className="text-[12px] tracking-[0.25em] uppercase text-mauve font-semibold">Reach us</p>
                </div>
                <h2 className="font-anton text-[50px] md:text-[6vw] lg:text-[72px] tracking-[0.02em] leading-[1.1] uppercase">
                  Let&apos;s build<br /><span className="text-coral">something</span> together.
                </h2>
              </div>

              <div className="contact-grid grid lg:grid-cols-[1fr_1.3fr_1.3fr] border border-carbon/15 bg-white/40 backdrop-blur-sm">
                {/* Info */}
                <div className="contact-col p-6 md:p-12 border-b lg:border-b-0 lg:border-r border-carbon/15 reveal">
                  <div className="contact-col-label text-[12px] tracking-[0.25em] uppercase text-mauve mb-10 flex items-center gap-4 font-bold">
                    Contact Info
                  </div>
                  <div className="contact-info-block mb-9">
                    <div className="contact-info-label text-[11px] tracking-[0.15em] uppercase text-mauve/80 mb-2 font-bold font-roboto">Address</div>
                    <div className="contact-info-val text-[16px] text-carbon/80 leading-[1.6] font-light">
                      Lot 1324, No.856, 1st Floor Tabuan Jaya<br />93350 Kuching Sarawak Malaysia
                    </div>
                  </div>
                  <div className="contact-info-block mb-9">
                    <div className="contact-info-label text-[11px] tracking-[0.15em] uppercase text-mauve/80 mb-2 font-bold font-roboto">Phone</div>
                    <div className="contact-info-val text-[16px] text-carbon leading-[1.6] font-normal">
                      <a href="tel:+601160915670" className="hover:text-coral transition-colors underline decoration-coral/30 underline-offset-4">(+60) 11-6091 5670</a>
                    </div>
                  </div>
                  <div className="contact-info-block mb-9">
                    <div className="contact-info-label text-[11px] tracking-[0.15em] uppercase text-mauve/80 mb-2 font-bold font-roboto">Email</div>
                    <div className="contact-info-val text-[16px] text-carbon leading-[1.6] font-normal">
                      <a href="mailto:info@stinablis.com" className="hover:text-coral transition-colors underline decoration-coral/30 underline-offset-4">info@stinablis.com</a>
                    </div>
                  </div>
                  <div className="social-row flex gap-4 mt-12">
                    {[
                      { icon: Instagram, href: "https://www.instagram.com/stinablis/", label: "Instagram" },
                      { icon: Linkedin, href: "https://www.linkedin.com/company/stinablis/posts/?feedView=all", label: "LinkedIn" },
                      { icon: Facebook, href: "https://www.facebook.com/profile.php?id=61559570767870&locale=is_IS#", label: "Facebook" }
                    ].map((s, i) => (
                      <a 
                        key={i} 
                        href={s.href} 
                        aria-label={s.label}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 border border-carbon/15 flex items-center justify-center text-carbon hover:bg-coral hover:border-coral hover:text-white transition-all duration-300"
                      >
                        <s.icon size={18} />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Form */}
                <div className="contact-col p-6 md:p-12 border-b lg:border-b-0 lg:border-r border-carbon/15 reveal">
                  <div className="contact-col-label text-[12px] tracking-[0.25em] uppercase text-mauve mb-10 flex items-center gap-4 font-bold">
                    Send a Message
                  </div>
                  <form className="contact-form flex flex-col gap-6" onSubmit={handleSend}>
                    <div className="form-group relative">
                      <input 
                        type="text" 
                        placeholder="Your Name" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-transparent border-b border-carbon/15 py-4 outline-none focus:border-coral transition-colors font-light placeholder:text-mauve/40 text-[16px]"
                      />
                    </div>
                    <div className="form-group relative">
                      <input 
                        type="email" 
                        placeholder="Email Address" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-transparent border-b border-carbon/15 py-4 outline-none focus:border-coral transition-colors font-light placeholder:text-mauve/40 text-[16px]"
                      />
                    </div>
                    <div className="form-group relative">
                      <textarea 
                        placeholder="Tell us about your project..." 
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full bg-transparent border-b border-carbon/15 py-4 outline-none focus:border-coral transition-colors resize-none font-light placeholder:text-mauve/40 text-[16px]"
                      />
                    </div>
                    
                    {sent && <p className="text-teal text-sm font-medium">Message sent successfully!</p>}
                    {error && <p className="text-coral text-sm font-medium">Something went wrong.</p>}

                    <button type="submit" disabled={sending} className="form-submit bg-carbon text-frost px-10 py-4 text-[13px] tracking-[0.2em] uppercase transition-all hover:bg-coral hover:translate-y-[-2px] self-start inline-flex items-center gap-3 font-bold mt-4">
                      {sending ? "Sending..." : "Send Message"}
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  </form>
                </div>

                {/* Map */}
                <div className="contact-col p-0 min-h-[350px] md:min-h-[500px] relative reveal">
                  <div className="map-wrap h-full w-full relative overflow-hidden">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.4022511429835!2d110.3752064!3d1.5265680000000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31fba76d9a491405%3A0x2cd3d5711f3ebe42!2sStinablis!5e0!3m2!1sen!2smy!4v1772768822697!5m2!1sen!2smy"
                      className="w-full h-full border-0 grayscale-[0.5] contrast-[1.2] opacity-80"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                    <div className="map-overlay absolute inset-0 pointer-events-none bg-gradient-to-br from-teal/10 to-transparent" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <Footer />
        </div>
      )}
    </>
  );
}
