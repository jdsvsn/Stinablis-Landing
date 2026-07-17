"use client";

import { useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Dynamic imports for client-only components
const CustomCursor = dynamic(() => import("@/components/CustomCursor"), { ssr: false });
const LiquidEther = dynamic(() => import("@/components/LiquidEther"), { ssr: false });

export default function AboutPage() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loaded) return;

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
      // Smooth Scroll Progress Bar
      gsap.set(".scroll-bar-about", { scaleX: 0, transformOrigin: "left center" });
      gsap.to(".scroll-bar-about", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
        }
      });

      // About Header
      gsap.fromTo(".about-header", 
        { y: 30, opacity: 0, scale: 0.99 },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1,
          duration: 1.2, 
          ease: "power3.out",
          delay: 0.2,
          force3D: true 
        }
      );

      // Pillars
      gsap.fromTo(".pillar", 
        { y: 40, opacity: 0, scale: 0.98 },
        { 
          scrollTrigger: { trigger: ".about-pillars", start: "top 85%" }, 
          y: 0, 
          opacity: 1, 
          scale: 1,
          stagger: 0.12, 
          duration: 1.0, 
          ease: "power3.out",
          force3D: true 
        }
      );

      // Story
      gsap.fromTo(".about-story", 
        { y: 30, opacity: 0, scale: 0.99 },
        { 
          scrollTrigger: { trigger: ".about-story", start: "top 90%" }, 
          y: 0, 
          opacity: 1, 
          scale: 1,
          duration: 1.0, 
          ease: "power3.out",
          force3D: true 
        }
      );
    });

    return () => {
      ctx.revert();
      gsap.ticker.remove(updateRaf);
      lenis.destroy();
    };
  }, [loaded]);

  return (
    <>
      <div className="scroll-bar-about fixed top-0 left-0 bg-coral z-[999] w-full origin-left-center" style={{ height: "2px", transform: "scaleX(0)" }}></div>

      {loaded && (
        <div className="relative w-full overflow-x-hidden bg-carbon text-frost font-roboto min-h-screen">
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

          {/* ABOUT SECTION FULL-PAGE */}
          <section id="about" className="py-32 md:py-40 px-6 md:px-12 relative z-10 overflow-hidden">
            <div className="about-ghost absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-anton text-[120px] md:text-[22vw] tracking-[0.05em] text-frost/3 pointer-events-none whitespace-nowrap select-none uppercase">
              ABOUT
            </div>
            
            <div className="relative z-10 w-full max-w-7xl mx-auto">
              
              {/* Header */}
              <div className="about-header opacity-0 mb-20 mt-10">
                <div className="section-label mb-6 flex items-center gap-4">
                  <p className="text-[12px] tracking-[0.2em] uppercase text-mauve font-semibold font-roboto">Who we are</p>
                </div>
                <h1 className="font-anton text-[50px] md:text-[6vw] lg:text-[80px] tracking-[0.02em] leading-[1.1] uppercase text-frost">
                  Corporate<br />Profile & <span className="text-coral">Identity</span>
                </h1>
              </div>

              {/* Pillars */}
              <div className="about-pillars grid md:grid-cols-3 gap-0 mb-24 border border-frost/10 bg-carbon/90 backdrop-blur-sm">
                <div className="pillar opacity-0 p-6 md:p-12 border-b md:border-b-0 md:border-r border-frost/10">
                  <div className="pillar-label font-anton text-[32px] tracking-[0.05em] mb-6 text-coral uppercase">ENGINEERING</div>
                  <p className="text-[15px] leading-[1.8] text-frost/70 font-light font-roboto">Precision-first design philosophy rooted in real-world manufacturing constraints and structural integrity.</p>
                </div>
                <div className="pillar opacity-0 p-6 md:p-12 border-b md:border-b-0 md:border-r border-frost/10">
                  <div className="pillar-label font-anton text-[32px] tracking-[0.05em] mb-6 text-coral uppercase">SOFTWARE</div>
                  <p className="text-[15px] leading-[1.8] text-frost/70 font-light font-roboto">Modern digital solutions that bridge CAD, simulation, and custom applications for industrial workflows.</p>
                </div>
                <div className="pillar opacity-0 p-6 md:p-12">
                  <div className="pillar-label font-anton text-[32px] tracking-[0.05em] mb-6 text-coral uppercase">MANUFACTURING</div>
                  <p className="text-[15px] leading-[1.8] text-frost/70 font-light font-roboto">End-to-end production capability — from rapid prototyping to scalable composite and additive processes.</p>
                </div>
              </div>

              <div className="about-divider w-full h-[1px] bg-frost/10 mb-20" />
              
              {/* Story */}
              <div className="about-story grid md:grid-cols-[250px_1fr] gap-12 md:gap-24 items-start opacity-0">
                <div className="about-story-label font-anton text-[14px] tracking-[0.2em] uppercase text-mauve/80 pt-2">Our Story</div>
                <p className="about-story-text text-[20px] md:text-[22px] leading-[1.8] text-frost/85 max-w-[750px] font-light font-roboto">
                  Founded in <strong className="text-frost font-semibold">Kuching, Sarawak, Malaysia</strong>, STINABLIS was born from the conviction that engineering precision and modern software belong together. We serve industries that need to <strong className="text-frost font-semibold">design faster, prototype smarter, and produce more effectively</strong> — combining deep manufacturing expertise with digital innovation to solve problems others consider too complex. From pineapple-fiber composites to reverse-engineered automotive parts, we build solutions that are as elegant as they are functional.
                </p>
              </div>

            </div>
          </section>

          <Footer />
        </div>
      )}
    </>
  );
}
