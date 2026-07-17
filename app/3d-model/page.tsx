"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import dynamic from "next/dynamic";
import { Upload } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Dynamic imports for client-only components
const CustomCursor = dynamic(() => import("@/components/CustomCursor"), { ssr: false });
const CarPartModel = dynamic(() => import("@/components/CarPartModel"), { ssr: false });
const LiquidEther = dynamic(() => import("@/components/LiquidEther"), { ssr: false });

export default function ThreeDModelPage() {
  const [loaded, setLoaded] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };

  const handleDragLeave = () => {
    setIsDraggingFile(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.name.toLowerCase().endsWith('.stl')) {
      setUploadedFile(file);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loaded) return;

    gsap.registerPlugin(ScrollTrigger);

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

    const ctx = gsap.context(() => {
      // Entrance animations
      gsap.fromTo(".page-eyebrow", 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.0, ease: "power3.out", delay: 0.1 }
      );
      
      gsap.fromTo(".page-title", 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.0, ease: "power3.out", delay: 0.2 }
      );

      gsap.fromTo(".page-desc", 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.0, ease: "power3.out", delay: 0.3 }
      );

      gsap.fromTo(".uploader-box", 
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.0, ease: "power3.out", delay: 0.4 }
      );

      gsap.fromTo(".btn-quote", 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.0, ease: "power3.out", delay: 0.5 }
      );

      gsap.fromTo(".canvas-container", 
        { scale: 0.96, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.3 }
      );
    });

    return () => {
      ctx.revert();
      gsap.ticker.remove(updateRaf);
      lenis.destroy();
    };
  }, [loaded]);

  const inquiryText = uploadedFile 
    ? `I would like to get a quotation for my uploaded part: ${uploadedFile.name}`
    : "I would like to send a car part design for a quotation.";
  const waLink = `https://wa.me/601160915670?text=${encodeURIComponent(inquiryText)}`;

  return (
    <>
      <div className="scroll-bar fixed top-0 left-0 h-[2px] bg-coral z-[999] w-full origin-left-center" style={{ transform: "scaleX(0)" }}></div>
      
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

          <main className="relative z-10 pt-32 px-6 md:px-12 max-w-7xl mx-auto">

            <div className="grid lg:grid-cols-12 gap-16 items-center min-h-[calc(100vh-280px)] pb-24">
              
              {/* Controls Column */}
              <div className="lg:col-span-5 flex flex-col justify-center">
                <div className="page-eyebrow opacity-0 mb-6 flex items-center gap-4">
                  <p className="text-[12px] tracking-[0.25em] uppercase text-mauve font-semibold">Interactive Viewer</p>
                </div>
                
                <h1 className="page-title opacity-0 font-anton text-[40px] md:text-[50px] lg:text-[60px] tracking-[0.02em] leading-[1.1] uppercase text-frost mb-6">
                  3D Model <br className="hidden md:inline" /><span className="text-coral">Showcase</span>
                </h1>
                
                <p className="page-desc opacity-0 text-[15px] md:text-[16px] leading-[1.8] text-frost/60 mb-8 font-light max-w-lg">
                  Visualize your mechanical designs and components in real time. Upload your custom parts design in STL format to preview the precision, layout, and finish structure of our fabrication results.
                </p>

                {/* STL Drag & Drop Uploader */}
                <div className="uploader-box opacity-0 mb-8 w-full max-w-lg">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    accept=".stl" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setUploadedFile(file);
                    }} 
                    className="hidden" 
                  />
                  <div 
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`group/upload border-2 border-dashed rounded-xl cursor-pointer text-center transition-all duration-500 p-8 md:p-10 ${
                      isDraggingFile 
                        ? 'border-coral bg-coral/10 shadow-[0_0_30px_rgba(252,103,63,0.15)] scale-[1.02]' 
                        : 'border-frost/20 hover:border-coral/80 bg-carbon/60 hover:bg-coral/4 hover:shadow-[0_0_20px_rgba(252,103,63,0.08)]'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isDraggingFile 
                          ? 'bg-coral text-white' 
                          : 'bg-frost/5 text-coral group-hover/upload:bg-coral group-hover/upload:text-white'
                      }`}>
                        <Upload size={22} className="animate-pulse" />
                      </div>
                      {uploadedFile ? (
                        <div className="text-[15px] text-frost font-medium tracking-wide">
                          <span className="text-lime font-bold">✓</span> {uploadedFile.name}
                          <span className="block text-[11px] text-coral font-mono tracking-widest uppercase mt-2 font-bold group-hover/upload:underline">
                            Click or drop to replace
                          </span>
                        </div>
                      ) : (
                        <div className="text-frost/80 font-roboto font-light leading-relaxed">
                          <span className="block font-anton text-[16px] tracking-wider uppercase text-coral mb-1 group-hover/upload:scale-105 transition-transform duration-300">
                            Upload STL File
                          </span>
                          <span className="text-[13px] text-frost/40">
                            Drag & drop your 3D design here, <br className="hidden sm:inline" />or click to browse local files
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <a 
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-quote opacity-0 bg-coral text-white px-9 py-4 text-[13px] tracking-[0.2em] uppercase inline-flex items-center gap-3 transition-all hover:bg-white hover:text-coral font-bold shadow-[0_10px_30px_rgba(252,103,63,0.2)] hover:shadow-none hover:-translate-y-1 self-start"
                >
                  Get a Quote
                </a>
              </div>

              {/* 3D Canvas Column */}
              <div className="lg:col-span-7 canvas-container opacity-0 h-[450px] md:h-[600px] w-full relative">
                <CarPartModel uploadedFile={uploadedFile} />
              </div>

            </div>
          </main>

          <Footer />
        </div>
      )}
    </>
  );
}
