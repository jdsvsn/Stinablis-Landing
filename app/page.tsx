"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import emailjs from "@emailjs/browser";
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
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);

  const handleSend = async () => {
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
              <h1 className="font-michroma text-6xl md:text-7xl lg:text-8xl font-normal text-white tracking-[0.1em] mb-6 leading-none">
                STINABLIS
              </h1>
              <div className="w-20 h-[1px] bg-white/20 mx-auto mb-6" />
              <p className="font-ar-one text-lg md:text-xl lg:text-2xl text-white/70 tracking-wide max-w-lg mx-auto">
                Digital Manufacturing Solutions in Malaysia
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
              <h2 className="font-michroma text-4xl md:text-5xl lg:text-6xl text-white tracking-wider mb-4 leading-tight">
                About Us
              </h2>
              <p className="font-ar-one text-base md:text-lg text-white/50 mb-8">
                Who we are 
              </p>
              <div className="w-16 h-[1px] bg-white/20 mx-auto mb-10" />
              <p className="font-ar-one text-base md:text-lg text-white/60 leading-relaxed mb-6">
                <strong className="text-white/80">Engineering</strong> <strong className="text-white/80">Software</strong> <strong className="text-white/80">Manufacturing</strong> 
              </p>
              <p className="font-ar-one text-base md:text-lg text-white/50 leading-relaxed">
                Born in Malaysia, we combine engineering precision, advanced manufacturing, and modern software to deliver high-performance digital manufacturing solutions. From system automation and custom platforms to precision-engineered components, we build reliable tools that help industries design, produce, and operate better.
              </p>
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
                  Our Products
                </h2>
                <div className="w-16 h-[1px] bg-white/20 mx-auto mt-8" />
              </div>

              <Carousel />
            </motion.div>
          </section>

          {/* CONTACT */}
          <section
            id="contact"
            className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-24"
          >
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              exit="exit"
              viewport={{ once: false, amount: 0.3 }}
              className="w-full max-w-6xl mx-auto"
            >
              {/* Heading */}
              <div className="text-center mb-12">
                <h2 className="font-michroma text-4xl md:text-5xl lg:text-6xl text-white tracking-wider mb-4">
                  Contact Us
                </h2>
                <p className="font-ar-one text-white/60 text-lg">
                  Tell us what you need. We&apos;ll reply fast.
                </p>
              </div>

              {/* Three columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">

                {/* Left — Info */}
                <div className="flex flex-col gap-6">
                  <p className="font-ar-one text-white/80 text-sm leading-relaxed">
                    Lot 1324, No.856, 1st Floor Tabuan Jaya<br />
                    93350 Kuching Sarawak Malaysia
                  </p>
                  <p className="font-ar-one text-white/60 text-sm">(+60) 11-6091 5670</p>
                  <p className="font-ar-one text-white/60 text-sm">info@stinablis.com</p>
                  <div className="flex flex-col gap-2">
                    <a
                      href="https://facebook.com/stinablis"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-michroma text-xs tracking-widest text-white/60 hover:text-white transition-colors duration-300"
                    >
                      STINABLIS FACEBOOK PAGE
                    </a>
                    <a
                      href="https://linkedin.com/company/stinablis"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-michroma text-xs tracking-widest text-white/60 hover:text-white transition-colors duration-300"
                    >
                      STINABLIS LINKEDIN PAGE
                    </a>
                  </div>
                </div>

                {/* Center — Form */}
                <div
                  className="flex flex-col gap-4 p-8 rounded-lg"
                  style={{ background: "rgba(30,30,30,0.95)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <input
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-transparent border border-white/10 rounded-md px-4 py-3 font-ar-one text-sm text-white/80 placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors duration-300"
                  />
                  <input
                    type="email"
                    placeholder="Your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-transparent border border-white/10 rounded-md px-4 py-3 font-ar-one text-sm text-white/80 placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors duration-300"
                  />
                  <textarea
                    placeholder="Your message"
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-transparent border border-white/10 rounded-md px-4 py-3 font-ar-one text-sm text-white/80 placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors duration-300 resize-none"
                  />

                  {sent && (
                    <p className="font-ar-one text-green-400 text-sm">Message sent successfully!</p>
                  )}
                  {error && (
                    <p className="font-ar-one text-red-400 text-sm">Something went wrong. Please try again.</p>
                  )}

                  <button
                    onClick={handleSend}
                    disabled={sending}
                    className="self-start font-michroma text-xs tracking-widest text-white hover:text-white/60 transition-colors duration-300 pt-1 disabled:opacity-40"
                  >
                    {sending ? "SENDING..." : "SEND"}
                  </button>
                </div>

                {/* Right — Map */}
                <div
                  className="rounded-lg overflow-hidden"
                  style={{ border: "1px solid rgba(255,255,255,0.08)", height: "380px" }}
                >
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.4022511429835!2d110.3752064!3d1.5265680000000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31fba76d9a491405%3A0x2cd3d5711f3ebe42!2sStinablis!5e0!3m2!1sen!2smy!4v1772768822697!5m2!1sen!2smy"
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

              </div>

              {/* Footer */}
              <div className="mt-20 pt-8 border-t border-white/5 text-center">
                <p className="font-michroma text-[10px] tracking-[0.3em] text-white/20">
                  © 2026 STINABLIS — ALL RIGHTS RESERVED.
                </p>
              </div>

            </motion.div>
          </section>

        </>
      )}
    </>
  );
}
