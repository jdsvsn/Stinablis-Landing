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
import ServicesGrid from "@/components/ServicesGrid";
import Footer from "@/components/Footer";
import { Instagram, Linkedin, Facebook } from "lucide-react";

// Dynamic imports for client-only components
const CustomCursor = dynamic(() => import("@/components/CustomCursor"), { ssr: false });
const CarPartModel = dynamic(() => import("@/components/CarPartModel"), { ssr: false });
const LiquidEther = dynamic(() => import("@/components/LiquidEther"), { ssr: false });
const PangkasScrolly = dynamic(() => import("@/components/PangkasScrolly"), { ssr: false });

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);

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

      // 2. ScrollTriggers for subsequent sections

      // About Section
      gsap.to(".about-ghost", {
        y: -150,
        ease: "none",
        scrollTrigger: { 
          trigger: "#about", 
          start: "top bottom", 
          end: "bottom top", 
          scrub: 1.5 
        }
      });

      // Card minimize effect on scroll enter & exit (floating card transition) with responsive matchMedia
      const mm = gsap.matchMedia();
      const aboutEl = document.getElementById("about");
      const contactEl = document.getElementById("contact");
      const vh = window.innerHeight;
      const aboutRatio = aboutEl ? Math.max(0.1, (aboutEl.offsetHeight - vh) / vh) : 1;
      const contactRatio = contactEl ? Math.max(0.1, (contactEl.offsetHeight - vh) / vh) : 1;

      // Mobile scale and borders
      mm.add("(max-width: 767px)", () => {
        const aboutScrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: "#about",
            start: "top bottom",
            end: "bottom top",
            scrub: 2.0,
          }
        });

        aboutScrollTl
          .fromTo("#about",
            {
              scale: 0.95,
              borderRadius: "20px",
              boxShadow: "0 15px 30px -10px rgba(0, 0, 0, 0.4)",
            },
            {
              scale: 1.0,
              borderRadius: "0px",
              boxShadow: "0 0px 0px 0px rgba(0, 0, 0, 0)",
              duration: 1.0,
              ease: "none"
            }
          )
          .to("#about", {
            scale: 1.0,
            borderRadius: "0px",
            boxShadow: "0 0px 0px 0px rgba(0, 0, 0, 0)",
            duration: aboutRatio,
            ease: "none"
          })
          .to("#about", {
            scale: 0.95,
            borderRadius: "20px",
            boxShadow: "0 15px 30px -10px rgba(0, 0, 0, 0.4)",
            duration: 1.0,
            ease: "none"
          });

        const contactScrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: "#contact",
            start: "top bottom",
            end: "bottom top",
            scrub: 2.0,
          }
        });

        contactScrollTl
          .fromTo("#contact",
            {
              scale: 0.95,
              borderRadius: "20px",
              boxShadow: "0 15px 30px -10px rgba(0, 0, 0, 0.4)",
            },
            {
              scale: 1.0,
              borderRadius: "0px",
              boxShadow: "0 0px 0px 0px rgba(0, 0, 0, 0)",
              duration: 1.0,
              ease: "none"
            }
          )
          .to("#contact", {
            scale: 1.0,
            borderRadius: "0px",
            boxShadow: "0 0px 0px 0px rgba(0, 0, 0, 0)",
            duration: contactRatio,
            ease: "none"
          })
          .to("#contact", {
            scale: 0.95,
            borderRadius: "20px",
            boxShadow: "0 15px 30px -10px rgba(0, 0, 0, 0.4)",
            duration: 1.0,
            ease: "none"
          });
      });

      // Desktop scale and borders
      mm.add("(min-width: 768px)", () => {
        const aboutScrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: "#about",
            start: "top bottom",
            end: "bottom top",
            scrub: 2.0,
          }
        });

        aboutScrollTl
          .fromTo("#about",
            {
              scale: 0.88,
              borderRadius: "40px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            },
            {
              scale: 1.0,
              borderRadius: "0px",
              boxShadow: "0 0px 0px 0px rgba(0, 0, 0, 0)",
              duration: 1.0,
              ease: "none"
            }
          )
          .to("#about", {
            scale: 1.0,
            borderRadius: "0px",
            boxShadow: "0 0px 0px 0px rgba(0, 0, 0, 0)",
            duration: aboutRatio,
            ease: "none"
          })
          .to("#about", {
            scale: 0.88,
            borderRadius: "40px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            duration: 1.0,
            ease: "none"
          });

        const contactScrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: "#contact",
            start: "top bottom",
            end: "bottom top",
            scrub: 2.0,
          }
        });

        contactScrollTl
          .fromTo("#contact",
            {
              scale: 0.88,
              borderRadius: "40px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            },
            {
              scale: 1.0,
              borderRadius: "0px",
              boxShadow: "0 0px 0px 0px rgba(0, 0, 0, 0)",
              duration: 1.0,
              ease: "none"
            }
          )
          .to("#contact", {
            scale: 1.0,
            borderRadius: "0px",
            boxShadow: "0 0px 0px 0px rgba(0, 0, 0, 0)",
            duration: contactRatio,
            ease: "none"
          })
          .to("#contact", {
            scale: 0.88,
            borderRadius: "40px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            duration: 1.0,
            ease: "none"
          });
      });

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

      // Process Section
      gsap.fromTo(".process-step", 
        { y: 40, opacity: 0, scale: 0.98 },
        { 
          scrollTrigger: { trigger: "#process", start: "top 80%" }, 
          y: 0, 
          opacity: 1, 
          scale: 1,
          stagger: 0.15, 
          duration: 1.0, 
          ease: "power3.out",
          force3D: true 
        }
      );

      // Products Section
      gsap.fromTo(".products-header", 
        { y: 30, opacity: 0, scale: 0.99 },
        { 
          scrollTrigger: { trigger: "#products", start: "top 85%" }, 
          y: 0, 
          opacity: 1, 
          scale: 1,
          duration: 1.0, 
          ease: "power3.out",
          force3D: true 
        }
      );

      // Service Cards animated individually
      gsap.utils.toArray<HTMLElement>(".service-card").forEach((card) => {
        gsap.fromTo(card, 
          { y: 45, opacity: 0, scale: 0.97 },
          { 
            scrollTrigger: { trigger: card, start: "top 92%" }, 
            y: 0, 
            opacity: 1, 
            scale: 1,
            duration: 0.8, 
            ease: "power3.out",
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

      // Pangkas Section Details
      gsap.fromTo(".pangkas-info-header", 
        { y: 30, opacity: 0, scale: 0.99 },
        { 
          scrollTrigger: { trigger: ".pangkas-info-header", start: "top 85%" }, 
          y: 0, 
          opacity: 1, 
          scale: 1,
          duration: 1.0, 
          ease: "power3.out",
          force3D: true 
        }
      );
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

      // Contact Section
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

      // Fade out global bg animation when scrolling into About section
      gsap.to(".global-bg-anim", {
        scrollTrigger: {
          trigger: "#about",
          start: "top top",
          end: "top -50%",
          scrub: true,
        },
        opacity: 0,
        ease: "none"
      });

      // Contact Card minimize effect handled by matchMedia above

    });

    return () => {
      ctx.revert(); // clean up GSAP animations on unmount
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
      <LoadingScreen onComplete={() => setLoaded(true)} />

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
                Engineering & Digital<br />Manufacturing Solutions
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

          {/* ABOUT */}
          <section id="about" className="bg-frost text-carbon py-24 md:py-32 px-6 md:px-12 relative z-10 overflow-hidden">
            <div className="about-ghost absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-anton text-[120px] md:text-[22vw] tracking-[0.05em] text-carbon/5 pointer-events-none whitespace-nowrap select-none uppercase">
              ABOUT
            </div>
            <div className="about-inner relative z-10 w-full max-w-7xl mx-auto">
              <div className="section-label reveal mb-10 flex items-center gap-4">
                <p className="text-[12px] tracking-[0.2em] uppercase text-mauve font-semibold font-roboto">Who we are</p>
              </div>
              
              <div className="about-pillars grid md:grid-cols-3 gap-0 mb-24 border border-carbon/10 bg-white/50 backdrop-blur-sm">
                <div className="pillar p-6 md:p-12 border-b md:border-b-0 md:border-r border-carbon/10 reveal">
                  <div className="pillar-label font-anton text-[32px] tracking-[0.05em] mb-6 text-coral uppercase">ENGINEERING</div>
                  <p className="text-[15px] leading-[1.8] text-carbon/70 font-light">Precision-first design philosophy rooted in real-world manufacturing constraints and structural integrity.</p>
                </div>
                <div className="pillar p-6 md:p-12 border-b md:border-b-0 md:border-r border-carbon/10 reveal">
                  <div className="pillar-label font-anton text-[32px] tracking-[0.05em] mb-6 text-teal uppercase">SOFTWARE</div>
                  <p className="text-[15px] leading-[1.8] text-carbon/70 font-light">Modern digital solutions that bridge CAD, simulation, and custom applications for industrial workflows.</p>
                </div>
                <div className="pillar p-6 md:p-12 reveal">
                  <div className="pillar-label font-anton text-[32px] tracking-[0.05em] mb-6 text-carbon uppercase">MANUFACTURING</div>
                  <p className="text-[15px] leading-[1.8] text-carbon/70 font-light">End-to-end production capability — from rapid prototyping to scalable composite and additive processes.</p>
                </div>
              </div>

              <div className="about-divider w-full h-[1px] bg-carbon/10 mb-20" />
              
              <div className="about-story grid md:grid-cols-[250px_1fr] gap-12 md:gap-24 items-start reveal">
                <div className="about-story-label font-anton text-[14px] tracking-[0.2em] uppercase text-mauve/80 pt-2">Our Story</div>
                <p className="about-story-text text-[20px] md:text-[22px] leading-[1.8] text-carbon/85 max-w-[750px] font-light">
                  Founded in <strong className="text-carbon font-semibold">Kuching, Sarawak, Malaysia</strong>, STINABLIS was born from the conviction that engineering precision and modern software belong together. We serve industries that need to <strong className="text-carbon font-semibold">design faster, prototype smarter, and produce more effectively</strong> — combining deep manufacturing expertise with digital innovation to solve problems others consider too complex. From pineapple-fiber composites to reverse-engineered automotive parts, we build solutions that are as elegant as they are functional.
                </p>
              </div>
            </div>
          </section>

          {/* PROCESS */}
          <section id="process" className="bg-carbon py-24 md:py-32 px-6 md:px-12 relative z-10 overflow-hidden">
            <div className="max-w-7xl mx-auto">
              <div className="section-label reveal mb-20 flex items-center gap-4">
                <p className="text-[12px] tracking-[0.2em] uppercase text-mauve font-semibold font-roboto">How we work</p>
              </div>

              <div className="grid md:grid-cols-4 gap-12 md:gap-8">
                {[
                  { 
                    step: "01", 
                    title: "Consultation", 
                    desc: "Deep dive into your engineering challenges and manufacturing goals.",
                    color: "text-coral"
                  },
                  { 
                    step: "02", 
                    title: "Design & Simulation", 
                    desc: "Precision CAD modeling followed by rigorous structural and functional testing.",
                    color: "text-teal"
                  },
                  { 
                    step: "03", 
                    title: "Prototyping", 
                    desc: "Rapid fabrication using advanced composites or additive manufacturing.",
                    color: "text-lime"
                  },
                  { 
                    step: "04", 
                    title: "Delivery & Scale", 
                    desc: "Final validation and seamless transition to production-ready solutions.",
                    color: "text-frost"
                  }
                ].map((item, i) => (
                  <div key={i} className="process-step reveal">
                    <div className={`font-anton text-[40px] tracking-tight mb-6 ${item.color}`}>
                      {item.step}
                    </div>
                    <div className="w-8 h-[1px] bg-frost/20 mb-6" />
                    <h3 className="font-anton text-[20px] tracking-[0.05em] mb-4 uppercase text-frost">
                      {item.title}
                    </h3>
                    <p className="text-[14px] leading-[1.8] text-frost/50 font-light">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
          {/* PRODUCTS & 3D PROTOTYPE */}
          <section id="products" className="bg-carbon py-24 md:py-32 px-6 md:px-12 border-t border-frost/5 relative z-10">
            <div className="max-w-7xl mx-auto">
              <div className="products-header reveal mb-20">
                <div className="section-label mb-6 flex items-center gap-4">
                  <p className="text-[12px] tracking-[0.25em] uppercase text-mauve font-semibold">What we do</p>
                </div>
                <h2 className="font-anton text-[50px] md:text-[6vw] lg:text-[80px] tracking-[0.02em] leading-[1.1] uppercase">
                  Products &<br /><span className="text-coral">Services</span>
                </h2>
              </div>
              
              <ServicesGrid />

              {/* 3D Prototype Sub-section */}
              <div id="prototype" className="mt-32 pt-24 border-t border-frost/5 grid lg:grid-cols-2 gap-16 items-center relative overflow-hidden">
                <div className="prototype-left reveal">
                  <div className="section-label mb-6 flex items-center gap-4">
                    <p className="text-[12px] tracking-[0.25em] uppercase text-mauve font-semibold">Interactive</p>
                  </div>
                  <h2 className="font-anton text-[40px] md:text-[5vw] lg:text-[60px] tracking-[0.02em] leading-[1.1] uppercase text-frost mb-8">
                    3D <span className="text-coral">Model</span>
                  </h2>
                  <p className="text-[16px] md:text-[18px] leading-[1.8] text-frost/60 mb-10 font-light max-w-lg">
                    Send us your car parts design and we&apos;ll get it done. Interact with the prototype model to explore the precision and complexity of our mechanical fabrication capabilities.
                  </p>
                  <a 
                    href="https://wa.me/601160915670?text=I%20would%20like%20to%20send%20a%20car%20part%20design%20for%20a%20quotation."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-coral text-white px-9 py-4 text-[13px] tracking-[0.2em] uppercase inline-flex items-center gap-3 transition-all hover:bg-white hover:text-coral font-bold shadow-[0_10px_30px_rgba(252,103,63,0.2)] hover:shadow-none hover:-translate-y-1"
                  >
                    Inquire Us
                  </a>
                </div>
                <div className="prototype-right reveal h-[400px] md:h-[500px] relative">
                  <CarPartModel />
                </div>
              </div>
            </div>
          </section>

          {/* PANGKAS */}
          <section id="pangkas" className="relative z-10 w-full bg-carbon">
            
            {/* 3D Scrollytelling Sequence */}
            <PangkasScrolly />

            {/* Normal Info Cards (revealed on scroll) */}
            <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32 border-t border-frost/5">
              
              {/* Material & Process Showcase Gallery */}
              <div className="pangkas-diagram-card reveal grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
                {/* Image 1: Process */}
                <div className="relative group overflow-hidden rounded-xl border border-frost/10 bg-carbon">
                  <div className="h-[220px] relative overflow-hidden">
                    <img 
                      src="/material.jpg" 
                      alt="Plastic Recycling Feedstock" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/30 to-transparent" />
                  </div>
                  <div className="p-6 relative z-10 -mt-10 bg-carbon/90 backdrop-blur-sm border-t border-frost/5">
                    <p className="text-[9px] font-mono text-coral uppercase tracking-widest mb-1.5">Stage 01 · Feedstock</p>
                    <h4 className="font-anton text-[18px] text-frost uppercase tracking-wider mb-2">Recycling Stream</h4>
                    <p className="text-[12px] text-frost/50 font-light leading-relaxed">Sourced locally, diverting post-consumer plastic directly from landfill wastes.</p>
                  </div>
                </div>

                {/* Image 2: Material */}
                <div className="relative group overflow-hidden rounded-xl border border-frost/10 bg-carbon">
                  <div className="h-[220px] relative overflow-hidden">
                    <img 
                      src="/plastic-recycling.webp" 
                      alt="Upcycled Composite Material" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/30 to-transparent" />
                  </div>
                  <div className="p-6 relative z-10 -mt-10 bg-carbon/90 backdrop-blur-sm border-t border-frost/5">
                    <p className="text-[9px] font-mono text-lime uppercase tracking-widest mb-1.5">Stage 02 · Processing</p>
                    <h4 className="font-anton text-[18px] text-frost uppercase tracking-wider mb-2">Shredded Materials</h4>
                    <p className="text-[12px] text-frost/50 font-light leading-relaxed">Processed into high-performance upcycled composite flakes.</p>
                  </div>
                </div>

                {/* Image 3: Product */}
                <div className="relative group overflow-hidden rounded-xl border border-frost/10 bg-carbon">
                  <div className="h-[220px] relative overflow-hidden">
                    <img 
                      src="/producthehe.jpg" 
                      alt="Manufactured Circular Products" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/40 to-transparent" />
                  </div>
                  <div className="p-6 relative z-10 -mt-10 bg-carbon/90 backdrop-blur-sm border-t border-frost/5">
                    <p className="text-[9px] font-mono text-teal uppercase tracking-widest mb-1.5">Stage 03 · Output</p>
                    <h4 className="font-anton text-[18px] text-frost uppercase tracking-wider mb-2">Manufactured Products</h4>
                    <p className="text-[12px] text-frost/50 font-light leading-relaxed">Durable, crack-resistant modular floor tiles and circular pavers.</p>
                  </div>
                </div>
              </div>

              {/* Material Specs Showcase (Centered 2-column layout) */}
              <div className="pangkas-machine-card reveal max-w-3xl mx-auto p-8 bg-frost/3 border border-frost/10 rounded-xl backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-lime/5 rounded-full filter blur-[50px] pointer-events-none" />
                <div className="text-[11px] font-mono tracking-widest text-lime mb-4 uppercase">Material specs</div>
                <h3 className="font-anton text-[26px] md:text-[32px] tracking-[0.05em] text-frost mb-6 uppercase">Characteristics</h3>
                <div className="grid sm:grid-cols-2 gap-6">
                  {[
                    { label: "Heat Insulating", desc: "Reduces thermal transfer effectively" },
                    { label: "Crack Resistant", desc: "High flexural and impact tolerance" },
                    { label: "Suited for Wet Conditions", desc: "Zero decay or moisture degradation" },
                    { label: "Lightweight & Durable", desc: "Easy to transport, engineered to last" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col border-b border-frost/5 pb-4 last:border-0 sm:last:border-b">
                      <span className="text-[15px] text-frost font-medium uppercase font-mono mb-1">{item.label}</span>
                      <span className="text-[13px] text-frost/50 font-light leading-relaxed">{item.desc}</span>
                    </div>
                  ))}
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
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
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
