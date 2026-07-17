"use client";

import { useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Thermometer, ShieldCheck, Droplets, Feather } from "lucide-react";

// Dynamic imports for client-only components
const CustomCursor = dynamic(() => import("@/components/CustomCursor"), { ssr: false });
const LiquidEther = dynamic(() => import("@/components/LiquidEther"), { ssr: false });
const PangkasScrolly = dynamic(() => import("@/components/PangkasScrolly"), { ssr: false });

export default function PangkasPage() {
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
      // 0. Smooth Scroll Progress Bar
      gsap.set(".scroll-bar-pangkas", { scaleX: 0, transformOrigin: "left center" });
      gsap.to(".scroll-bar-pangkas", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
        }
      });

      // Pangkas Cards slide in
      gsap.fromTo(".pangkas-diagram-card", 
        { y: 40, opacity: 0, scale: 0.98 },
        { 
          scrollTrigger: { trigger: ".pangkas-diagram-card", start: "top 85%" }, 
          y: 0, 
          opacity: 1, 
          scale: 1,
          duration: 1.0, 
          ease: "power3.out",
          force3D: true 
        }
      );
      gsap.fromTo(".pangkas-machine-card", 
        { y: 40, opacity: 0, scale: 0.98 },
        { 
          scrollTrigger: { trigger: ".pangkas-machine-card", start: "top 85%" }, 
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
      <div className="scroll-bar-pangkas fixed top-0 left-0 bg-coral z-[999] w-full origin-left-center" style={{ height: "2px", transform: "scaleX(0)" }}></div>

      {loaded && (
        <div className="relative w-full overflow-x-hidden bg-carbon text-frost font-roboto min-h-screen">
          <CustomCursor />
          <Navbar />

          {/* GLOBAL BACKGROUND ANIMATION (Shows at the bottom details section) */}
          <div className="global-bg-anim fixed inset-0 pointer-events-none z-0 opacity-100">
            <LiquidEther
              colors={['#dff122', '#114d43', '#aca7a9']}
              mouseForce={7}
              cursorSize={80}
              isViscous={false}
              resolution={0.4}
              autoDemo={true}
              autoSpeed={0.15}
              autoIntensity={0.9}
            />
          </div>

          {/* PANGKAS */}
          <div className="relative z-10 w-full bg-carbon pt-20">
            
            {/* 3D Scrollytelling Sequence */}
            <PangkasScrolly />

            {/* Normal Info Cards (revealed on scroll) */}
            <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32 border-t border-frost/5 bg-carbon/80 backdrop-blur-md">
              {/* Material Specs & End Product Showcase Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24 max-w-6xl mx-auto items-stretch">
                {/* Column 1: Material Specs (Characteristics with icons) */}
                <div className="pangkas-machine-card opacity-0 p-8 bg-frost/3 border border-frost/10 rounded-xl backdrop-blur-sm relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-lime/5 rounded-full filter blur-[50px] pointer-events-none" />
                  <div>
                    <div className="text-[11px] font-mono tracking-widest text-lime mb-4 uppercase font-bold">Material specs</div>
                    <h3 className="font-anton text-[26px] md:text-[32px] tracking-[0.05em] text-frost mb-6 uppercase">Characteristics</h3>
                    <div className="space-y-5">
                      {[
                        { label: "Heat Insulating", desc: "Reduces thermal transfer effectively", icon: Thermometer },
                        { label: "Crack Resistant", desc: "High flexural and impact tolerance", icon: ShieldCheck },
                        { label: "Suited for Wet Conditions", desc: "Zero decay or moisture degradation", icon: Droplets },
                        { label: "Lightweight & Durable", desc: "Easy to transport, engineered to last", icon: Feather }
                      ].map((item, idx) => (
                        <div key={idx} className="flex gap-4 border-b border-frost/5 pb-4 last:border-0">
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-lime/10 border border-lime/20 flex items-center justify-center text-lime mt-1">
                            <item.icon size={20} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[15px] text-frost font-medium uppercase font-roboto mb-0.5">{item.label}</span>
                            <span className="text-[13px] text-frost/50 font-light font-roboto leading-relaxed">{item.desc}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Column 2: End Product Image Card */}
                <div className="pangkas-diagram-card opacity-0 relative group overflow-hidden rounded-xl border border-frost/10 bg-carbon flex flex-col justify-between">
                  <div className="h-[420px] md:h-full relative overflow-hidden flex-grow min-h-[360px]">
                    <img 
                      src="/product-end.png" 
                      alt="End Product" 
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/20 to-transparent" />
                  </div>
                  <div className="p-6 relative z-10 bg-carbon/90 backdrop-blur-sm border-t border-frost/5">
                    <h4 className="font-anton text-[22px] text-frost uppercase tracking-wider mb-2">End Product</h4>
                    <p className="text-[13px] text-frost/50 font-light leading-relaxed">
                      Durable, crack-resistant modular floor tiles and circular construction pavers upcycled from local post-consumer plastic wastes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Footer />
        </div>
      )}
    </>
  );
}
