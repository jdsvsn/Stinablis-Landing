"use client";

import { useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import ServicesGrid from "@/components/ServicesGrid";
import Footer from "@/components/Footer";

// Dynamic imports for client-only components
const CustomCursor = dynamic(() => import("@/components/CustomCursor"), { ssr: false });
const LiquidEther = dynamic(() => import("@/components/LiquidEther"), { ssr: false });

export default function ServicesPage() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Small delay to simulate loading screen state or ensure clean DOM mount
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
      gsap.set(".scroll-bar-services", { scaleX: 0, transformOrigin: "left center" });
      gsap.to(".scroll-bar-services", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
        }
      });

      // Products Section Header
      gsap.fromTo(".products-header", 
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

      // Service Category/Card Rows animated individually
      gsap.utils.toArray<HTMLElement>(".service-card").forEach((card) => {
        gsap.fromTo(card, 
          { y: 15, opacity: 0 },
          { 
            scrollTrigger: { trigger: card, start: "top 96%" }, 
            y: 0, 
            opacity: 1, 
            duration: 0.25, 
            ease: "power2.out",
            force3D: true 
          }
        );
      });

      // 3D Prototype Section
      gsap.fromTo(".prototype-left", 
        { x: -40, opacity: 0, scale: 0.98 },
        { 
          scrollTrigger: { trigger: "#prototype", start: "top 80%" }, 
          x: 0, 
          opacity: 1, 
          scale: 1,
          duration: 1.0, 
          ease: "power3.out",
          force3D: true 
        }
      );
      gsap.fromTo(".prototype-right", 
        { x: 40, opacity: 0, scale: 0.98 },
        { 
          scrollTrigger: { trigger: "#prototype", start: "top 80%" }, 
          x: 0, 
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
      <div className="scroll-bar-services fixed top-0 left-0 height-[2px] bg-coral z-[999] w-full origin-left-center" style={{ height: "2px", transform: "scaleX(0)" }}></div>
      
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

          {/* PRODUCTS & SERVICES HERO / ACCORDION */}
          <section id="products" className="py-32 md:py-40 px-6 md:px-12 relative z-10">
            <div className="max-w-7xl mx-auto">
              
              {/* Header */}
              <div className="products-header opacity-0 mb-20 mt-10">
                <div className="section-label mb-6 flex items-center gap-4">
                  <p className="text-[12px] tracking-[0.25em] uppercase text-mauve font-semibold">What we offer</p>
                </div>
                <h1 className="font-anton text-[50px] md:text-[6vw] lg:text-[80px] tracking-[0.02em] leading-[1.1] uppercase">
                  Products &<br /><span className="text-coral">Services</span>
                </h1>
              </div>

              {/* Accordion List */}
              <div className="mb-32">
                <ServicesGrid />
              </div>

            </div>
          </section>

          <Footer />
        </div>
      )}
    </>
  );
}
