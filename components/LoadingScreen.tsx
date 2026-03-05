"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const duration = 3000;
    const interval = 30;
    const steps = duration / interval;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const raw = step / steps;
      // Ease in-out curve
      const eased = raw < 0.5
        ? 2 * raw * raw
        : 1 - Math.pow(-2 * raw + 2, 2) / 2;
      setProgress(Math.min(eased * 100, 100));

      if (step >= steps) {
        clearInterval(timer);
        setTimeout(() => {
          setVisible(false);
          setTimeout(onComplete, 600);
        }, 200);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center"
          style={{ background: "linear-gradient(135deg, #0a0a0f 0%, #050508 50%, #0f0a15 100%)" }}
        >
          {/* Welcome text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12 text-center"
          >
            <p className="font-michroma text-xs tracking-[0.5em] text-white/40 mb-2">LOADING</p>
            <h1 className="font-michroma text-4xl md:text-5xl font-normal tracking-[0.3em] text-white/90">
              WELCOME
            </h1>
          </motion.div>

          {/* Progress bar container */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0.8 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-64 md:w-80"
          >
            {/* Progress percentage */}
            <div className="flex justify-between mb-3">
              <span className="font-michroma text-[10px] tracking-widest text-white/30">PROGRESS</span>
              <span className="font-michroma text-[10px] tracking-widest text-white/50">
                {Math.round(progress)}%
              </span>
            </div>

            {/* Bar track */}
            <div className="relative h-[1px] bg-white/10">
              {/* Fill */}
              <div
                className="absolute top-0 left-0 h-full bg-white/80 transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
              {/* Glow tip */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-1 h-3 bg-white rounded-full blur-sm transition-all duration-75"
                style={{ left: `calc(${progress}% - 2px)`, opacity: progress > 1 ? 1 : 0 }}
              />
            </div>

            {/* Tick marks */}
            <div className="flex justify-between mt-2">
              {[0, 25, 50, 75, 100].map((tick) => (
                <div
                  key={tick}
                  className="h-1 w-[1px] transition-all duration-300"
                  style={{
                    background: progress >= tick ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.1)"
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Bottom tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="font-ar-one text-[11px] tracking-[0.2em] text-white mt-16"
          >
            WHERE ENGINEERING MEETS SUSTAINABILITY
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
