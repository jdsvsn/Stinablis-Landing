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
              
              {/* Circular Flow Diagram header */}
              <div className="pangkas-info-header reveal mb-16">
                <div className="section-label mb-6 flex items-center gap-4">
                  <p className="text-[12px] tracking-[0.25em] uppercase text-lime font-semibold">Technical Framework</p>
                </div>
                <h3 className="font-anton text-[32px] md:text-[40px] tracking-[0.03em] uppercase text-frost mb-4">
                  Circular Value Loop
                </h3>
              </div>

              {/* Replicated Circular Flow Diagram */}
              <div className="pangkas-diagram-card reveal relative w-full bg-frost/3 border border-frost/10 rounded-2xl p-6 md:p-8 flex flex-col justify-center min-h-[300px] md:min-h-[400px] backdrop-blur-sm overflow-hidden select-none mb-24">
                  {/* Subtle Grid overlay for technical/engineering vibe */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
                  
                  <div className="grid grid-cols-[1fr_1.2fr_1fr] gap-4 items-center relative z-10">
                    
                    {/* Left Column: Partner Communities */}
                    <div className="flex flex-col items-center text-center group">
                      <h4 className="font-anton text-[13px] md:text-[15px] tracking-wider uppercase text-frost mb-4">
                        Partner<br />Communities
                      </h4>
                      <div className="p-3 bg-white/5 border border-white/10 rounded-lg hover:border-coral transition-colors duration-300">
                        <img 
                          src="/partner-communities-icon.png" 
                          alt="Partner Communities" 
                          className="w-16 h-16 md:w-24 md:h-24 object-contain brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                        />
                      </div>
                    </div>

                    {/* Center Column: Arrows Flow */}
                    <div className="flex flex-col justify-center gap-6 h-full py-4">
                      {/* Top Arrow: Feedstock */}
                      <div className="flex flex-col items-center">
                        <span className="text-[11px] md:text-[12px] font-mono tracking-widest text-coral mb-2">
                          Feedstock
                        </span>
                        <div className="relative w-full flex items-center justify-center">
                          <div className="w-full h-[2px] bg-coral/40 relative">
                            <div className="absolute right-0 top-[-3px] border-solid border-l-coral border-l-[6px] border-y-transparent border-y-[4px] border-r-0" />
                          </div>
                        </div>
                      </div>

                      {/* Bottom Arrow: Compensation */}
                      <div className="flex flex-col items-center">
                        <div className="relative w-full flex items-center justify-center">
                          <div className="w-full h-[2px] bg-lime/40 relative">
                            <div className="absolute left-0 top-[-3px] border-solid border-r-lime border-r-[6px] border-y-transparent border-y-[4px] border-l-0" />
                          </div>
                        </div>
                        <span className="text-[10px] md:text-[11px] font-mono tracking-widest text-lime mt-2 text-center leading-snug">
                          RM 1/KG<br />+ Upskilling
                        </span>
                      </div>
                    </div>

                    {/* Right Column: Pangkas */}
                    <div className="flex flex-col items-center text-center group">
                      <h4 className="font-anton text-[13px] md:text-[15px] tracking-wider uppercase text-lime mb-4">
                        PANGKAS
                      </h4>
                      <div className="p-3 bg-white/5 border border-white/10 rounded-lg hover:border-lime transition-colors duration-300">
                        <img 
                          src="/pangkas-icon.png" 
                          alt="Pangkas" 
                          className="w-16 h-16 md:w-24 md:h-24 object-contain brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                        />
                      </div>
                    </div>

                  </div>
                </div>

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

              {/* Material Properties Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
                <div className="p-8 bg-frost/3 border border-frost/10 rounded-xl">
                  <div className="text-[11px] font-mono tracking-widest text-lime mb-4 uppercase">Material specs</div>
                  <h3 className="font-anton text-[22px] tracking-[0.05em] text-frost mb-6 uppercase">Characteristics</h3>
                  <ul className="space-y-3">
                    {[
                      { label: "Heat Insulating", desc: "Reduces thermal transfer effectively" },
                      { label: "Crack Resistant", desc: "High flexural and impact tolerance" },
                      { label: "Suited for Wet Conditions", desc: "Zero decay or moisture degradation" },
                      { label: "Lightweight & Durable", desc: "Easy to transport, engineered to last" }
                    ].map((item, idx) => (
                      <li key={idx} className="flex flex-col border-b border-frost/5 pb-2">
                        <span className="text-[14px] text-frost font-medium uppercase font-mono">{item.label}</span>
                        <span className="text-[12px] text-frost/50 font-light">{item.desc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-8 bg-frost/3 border border-frost/10 rounded-xl flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-mono tracking-widest text-lime mb-4 uppercase">Social impact</div>
                    <h3 className="font-anton text-[22px] tracking-[0.05em] text-frost mb-6 uppercase">Empowering Communities</h3>
                    <ul className="space-y-4 font-light text-[14px] text-frost/70">
                      <li className="flex gap-3 items-start">
                        <span className="text-lime font-bold">✓</span>
                        <span>Create new, localized income streams for partner communities (Feedstock collection).</span>
                      </li>
                      <li className="flex gap-3 items-start">
                        <span className="text-lime font-bold">✓</span>
                        <span>Divert tonnes of plastic waste directly from landfill to value-added production.</span>
                      </li>
                      <li className="flex gap-3 items-start">
                        <span className="text-lime font-bold">✓</span>
                        <span>Upskilling local TVET talents through micro-factory operator training.</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="mt-8 pt-4 border-t border-frost/5 text-[11px] font-mono uppercase text-mauve/80">
                    Inclusive Infrastructure Focus
                  </div>
                </div>

                <div className="p-8 bg-frost/3 border border-frost/10 rounded-xl">
                  <div className="text-[11px] font-mono tracking-widest text-lime mb-4 uppercase">Economics</div>
                  <h3 className="font-anton text-[22px] tracking-[0.05em] text-frost mb-6 uppercase">Feedstock Economy</h3>
                  <div className="space-y-6">
                    <div>
                      <p className="text-[12px] text-mauve/80 uppercase font-mono">Profit Margin</p>
                      <p className="text-[28px] font-anton text-frost">~40% MARGIN</p>
                      <p className="text-[12px] text-frost/50 font-light mt-1">Pricing at RM5 - 7 / sqft (Production cost ~RM0.90)</p>
                    </div>
                    <div>
                      <p className="text-[12px] text-mauve/80 uppercase font-mono">Feedstock Origin</p>
                      <p className="text-[20px] font-anton text-frost">RM0.80 - 1.00 / KG</p>
                      <p className="text-[12px] text-frost/50 font-light mt-1">Community sourced plastic bottles (~18-20 bottles per tile)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Traction & Project Accomplishments */}
              <div className="mb-24 p-8 md:p-12 bg-frost/3 border border-frost/10 rounded-xl">
                <div className="section-label mb-8 flex items-center gap-4">
                  <p className="text-[12px] tracking-[0.25em] uppercase text-lime font-semibold">Traction & Achievements</p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                  {[
                    { val: "3 Projects", label: "Sarawak Sites Installed (RM 60K)" },
                    { val: "200 KG", label: "Waste Diverted from Landfill" },
                    { val: "15 Talents", label: "Sarawak TVET Upskilled" },
                    { val: "100% UV Safe", label: "Stress & Resistance Tested" }
                  ].map((stat, sIdx) => (
                    <div key={sIdx} className="border-r border-frost/5 last:border-0 pr-4">
                      <div className="font-anton text-[32px] md:text-[40px] text-lime mb-2 uppercase">{stat.val}</div>
                      <div className="text-[12px] md:text-[13px] tracking-wider uppercase text-frost/60">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Roadmap Timeline */}
              <div className="pangkas-machine-card reveal bg-frost/3 border border-frost/10 p-8 md:p-12 relative overflow-hidden backdrop-blur-sm rounded-xl">
                {/* Visual Accent/Glow */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-lime/5 rounded-full filter blur-[80px] pointer-events-none" />
                
                <h3 className="font-anton text-[28px] md:text-[36px] tracking-[0.05em] uppercase text-frost mb-16 text-center">
                  PANGKAS ROADMAP
                </h3>
                
                {/* Horizontal Scroll wrapper for responsive mobile layout */}
                <div className="overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  <div className="min-w-[950px] lg:min-w-0 w-full relative z-10 py-8">
                    
                    {/* ROW 1: Time Labels */}
                    <div className="grid grid-cols-5 relative z-20 mb-6">
                      {[
                        "2026 june",
                        "2026 end",
                        "2027",
                        "2028",
                        "Goal"
                      ].map((time, idx) => (
                        <div key={idx} className="text-center font-anton text-[18px] md:text-[20px] text-frost uppercase tracking-[0.02em] px-4">
                          {time}
                        </div>
                      ))}
                    </div>

                    {/* ROW 2: Connector Line and Circle Dots */}
                    <div className="relative w-full h-12 flex items-center mb-8">
                      {/* Horizontal Connector Line (Perfect Centering) */}
                      <div className="absolute left-[10%] right-[10%] h-[2px] bg-white/10 z-0" />
                      
                      {/* Grid of Dots */}
                      <div className="grid grid-cols-5 w-full relative z-20">
                        {[
                          "bg-[#eab308] shadow-[0_0_20px_rgba(234,179,8,0.6)]",
                          "bg-[#3b82f6] shadow-[0_0_20px_rgba(59,130,246,0.6)]",
                          "bg-[#64748b] shadow-[0_0_20px_rgba(100,116,139,0.6)]",
                          "bg-[#ef4444] shadow-[0_0_20px_rgba(239,68,68,0.6)]",
                          "bg-[#22c55e] shadow-[0_0_20px_rgba(34,197,94,0.6)]"
                        ].map((colorClass, idx) => (
                          <div key={idx} className="flex justify-center">
                            <div className={`w-8 h-8 rounded-full ${colorClass} border-4 border-carbon transition-transform duration-300 hover:scale-125`} />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ROW 3: Descriptions */}
                    <div className="grid grid-cols-5 relative z-20">
                      {[
                        ["Run pilot projects and", "GTM across sarawak"],
                        ["Set up TWO", "processing hubs", "(Kapit and", "Semenggoh)"],
                        ["Prevent 5 tonnes", "from landfill", "disposal", "Bathroom/lighting", "line"],
                        ["SIRIM", "CIDB", "Endorsement /", "certification"],
                        ["5 Partner", "manufacturing sites", "10 tonnes Plastic", "waste diverted", "200 individuals", "upskilled and", "trained"]
                      ].map((desc, idx) => (
                        <div key={idx} className="flex flex-col items-center px-4">
                          <div className="text-center font-roboto text-[13px] md:text-[14px] leading-relaxed text-frost/70 font-light max-w-[170px] whitespace-normal">
                            {desc.map((line, lIdx) => (
                              <span key={lIdx} className="block">{line}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

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
