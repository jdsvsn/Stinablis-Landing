"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import Carousel from "@/components/Carousel";
import ParticleBackground from "@/components/ParticleBackground";

// Dynamic imports for client-only components
const ThreeCube = dynamic(() => import("@/components/ThreeCube"), { ssr: false });
const CustomCursor = dynamic(() => import("@/components/CustomCursor"), { ssr: false });

const sectionVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
  exit: { opacity: 0, y: -50, scale: 0.9 },
};

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <LoadingScreen onComplete={() => setLoaded(true)} />

      {loaded && (
        <>
          <CustomCursor />

          {/* Fixed background gradient */}
          <div
            className="fixed inset-0 z-[-2]"
            style={{
              background: "linear-gradient(135deg, #0a0a0f 0%, #050508 50%, #0f0a15 100%)",
            }}
          />

          <ParticleBackground />

          {/* Orb: top left */}
          <div
            className="fixed z-[-1] pointer-events-none"
            style={{
              top: "-100px",
              left: "-100px",
              width: "600px",
              height: "600px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(88,28,135,0.05) 0%, transparent 70%)",
              filter: "blur(80px)",
            }}
          />

          {/* Orb: bottom right */}
          <div
            className="fixed z-[-1] pointer-events-none"
            style={{
              bottom: "-80px",
              right: "-80px",
              width: "500px",
              height: "500px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(30,58,138,0.05) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />

          {/* Three.js Cube */}
          <ThreeCube />

          {/* Navbar */}
          <Navbar />

          {/* HERO */}
          <section
            id="home"
            className="relative z-10 min-h-screen flex items-center justify-center px-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="text-center"
            >
              
              <h1
                className="font-michroma text-6xl md:text-7xl lg:text-8xl font-normal text-white tracking-[0.1em] mb-6 leading-none"
              >
                STINABLIS
              </h1>
              <div className="w-20 h-[1px] bg-white/20 mx-auto mb-6" />
              <p className="font-ar-one text-lg md:text-xl lg:text-2xl text-white/70 tracking-wide max-w-lg mx-auto">
                Where Engineering Meets Sustainability
              </p>

              
            </motion.div>
          </section>

          {/* ABOUT */}
          <section
            id="about"
            className="relative z-10 min-h-screen flex items-center justify-center px-6"
          >
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              exit="exit"
              viewport={{ once: false, amount: 0.3 }}
              className="max-w-3xl mx-auto text-center"
            >
              <p className="font-michroma text-[10px] tracking-[0.5em] text-white/30 mb-6">
                OUR STORY
              </p>
              <h2 className="font-michroma text-4xl md:text-5xl lg:text-6xl text-white tracking-wider mb-8 leading-tight">
                About Us
              </h2>
              <div className="w-16 h-[1px] bg-white/20 mx-auto mb-10" />
              <p className="font-ar-one text-base md:text-lg text-white/60 leading-relaxed mb-6">
                We are a team of visionary engineers, architects, and sustainability experts united
                by a singular purpose: to build a future where technological excellence and
                environmental responsibility are inseparable.
              </p>
              <p className="font-ar-one text-base md:text-lg text-white/50 leading-relaxed">
                Through immersive design and cutting-edge technology, we craft solutions that don&apos;t
                just meet today&apos;s demands — they anticipate tomorrow&apos;s possibilities. Every project
                is a bridge between innovation and stewardship.
              </p>

              {/* Stats row */}
              <div className="mt-16 grid grid-cols-3 gap-8 border-t border-white/5 pt-12">
                {[
                  { num: "150+", label: "Projects Delivered" },
                  { num: "12", label: "Countries Reached" },
                  { num: "98%", label: "Client Satisfaction" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="font-michroma text-2xl md:text-3xl text-white/90 mb-2">{stat.num}</p>
                    <p className="font-ar-one text-xs md:text-sm text-white/35 tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </section>

          {/* SERVICES */}
          <section
            id="services"
            className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-24"
          >
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              exit="exit"
              viewport={{ once: false, amount: 0.2 }}
              className="w-full max-w-5xl mx-auto"
            >
              <div className="text-center mb-16">
                <p className="font-michroma text-[10px] tracking-[0.5em] text-white/30 mb-6">
                  WHAT WE DO
                </p>
                <h2 className="font-michroma text-4xl md:text-5xl lg:text-6xl text-white tracking-wider leading-tight">
                  Our Services
                </h2>
                <div className="w-16 h-[1px] bg-white/20 mx-auto mt-8" />
              </div>

              <Carousel />
            </motion.div>
          </section>

          {/* CONTACT */}
          <section
            id="contact"
            className="relative z-10 min-h-screen flex items-center justify-center px-6"
          >
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              exit="exit"
              viewport={{ once: false, amount: 0.3 }}
              className="max-w-2xl mx-auto text-center"
            >
              <p className="font-michroma text-[10px] tracking-[0.5em] text-white/30 mb-6">
                REACH OUT
              </p>
              <h2 className="font-michroma text-4xl md:text-5xl lg:text-6xl text-white tracking-wider mb-8 leading-tight">
                Get In Touch
              </h2>
              <div className="w-16 h-[1px] bg-white/20 mx-auto mb-10" />
              <p className="font-ar-one text-base md:text-lg text-white/60 leading-relaxed mb-12">
                Ready to continue the journey toward a more sustainable future? Let&apos;s collaborate
                on solutions that leave a lasting impact — for your organization and for the world.
              </p>

              {/* Contact options */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:info@stinablis.com"
                  className="group inline-flex items-center gap-3 px-8 py-4 border border-white/20 rounded-sm font-michroma text-xs tracking-[0.2em] text-white/70 hover:text-white hover:border-white/40 transition-all duration-300"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                >
                  EMAIL US
                  <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </a>
                <a
                  href="tel:+1234567890"
                  className="group inline-flex items-center gap-3 px-8 py-4 border border-white/10 rounded-sm font-michroma text-xs tracking-[0.2em] text-white/40 hover:text-white/70 hover:border-white/20 transition-all duration-300"
                >
                  CALL US
                  <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </a>
              </div>

              {/* Footer */}
              <div className="mt-24 pt-12 border-t border-white/5">
                <p className="font-michroma text-[10px] tracking-[0.3em] text-white/20">
                  © 2026 STINABLIS — ALL RIGHTS RESERVED
                </p>
              </div>
            </motion.div>
          </section>
        </>
      )}
    </>
  );
}
