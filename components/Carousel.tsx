"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const services = [
  {
    title: "Rapid Prototyping",
    description: "From ideation to tangible solution in record time. We accelerate the design-to-prototype cycle for complex engineering challenges.",
    type: "dots"
  },
  {
    title: "Sustainable Composites",
    description: "Pioneering material innovation with natural fibers including pineapple, kenaf and bio-composites — strong, lightweight, and ecologically responsible.",
    type: "fiber"
  },
  {
    title: "3D Printing",
    description: "Customized additive manufacturing for functional prototypes, jigs, fixtures, and end-use parts in a wide range of materials and tolerances.",
    type: "layers"
  },
  {
    title: "Automotive Parts",
    description: "Custom-specification parts production for automotive applications — from concept and CAD through fabrication to finished component delivery.",
    type: "circuit"
  },
  {
    title: "Reverse Engineering",
    description: "Problem-solving through analysis of existing components. We digitize, reconstruct, and improve parts with no original documentation.",
    type: "scan"
  },
  {
    title: "Software Solutions",
    description: "Custom development of websites, applications, and databases tailored to engineering and industrial workflows. Built to integrate with your operations.",
    type: "code"
  },
];

const Visual = ({ type }: { type: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const resize = () => {
      c.width = c.offsetWidth;
      c.height = c.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      animId = requestAnimationFrame(draw);
      t += 0.02;
      ctx.clearRect(0, 0, c.width, c.height);

      if (type === "dots") {
        const cols = 12, rows = 6;
        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            const x = (i / (cols - 1)) * c.width;
            const y = (j / (rows - 1)) * c.height;
            const wave = Math.sin(t + i * 0.4 + j * 0.3);
            const s = 2 + wave * 1.5;
            ctx.fillStyle = `rgba(252, 103, 63, ${0.3 + wave * 0.3})`;
            ctx.beginPath(); ctx.arc(x, y, s, 0, Math.PI * 2); ctx.fill();
          }
        }
      } else if (type === "fiber") {
        for (let i = 0; i < 20; i++) {
          const y = (i / 19) * c.height;
          ctx.strokeStyle = `rgba(17, 77, 67, ${0.4 + Math.sin(t * 0.75 + i * 0.2) * 0.2})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          for (let x = 0; x <= c.width; x += 4) {
            ctx.lineTo(x, y + Math.sin(x * 0.04 + t * 0.75 + i * 0.3) * 8);
          }
          ctx.stroke();
        }
        for (let i = 0; i < 20; i++) {
          const x = (i / 19) * c.width;
          ctx.strokeStyle = `rgba(223, 241, 34, ${0.25 + Math.sin(t * 0.75 + i * 0.15) * 0.15})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          for (let y = 0; y <= c.height; y += 4) {
            ctx.lineTo(x + Math.sin(y * 0.05 + t * 0.75 + i * 0.4) * 8, y);
          }
          ctx.stroke();
        }
      } else if (type === "layers") {
        const layers = 14;
        for (let i = 0; i < layers; i++) {
          const prog = i / layers;
          const active = Math.sin(t * 0.6 * 2 - i * 0.3) > 0.4;
          const y = c.height - prog * c.height;
          const w = (0.3 + prog * 0.5) * c.width;
          const x = (c.width - w) / 2;
          ctx.strokeStyle = active ? `rgba(252, 103, 63, 0.8)` : `rgba(172, 167, 169, 0.2)`;
          ctx.lineWidth = active ? 2 : 1;
          ctx.beginPath(); ctx.rect(x, y, w, (c.height / layers) * 0.6); ctx.stroke();
          if (active) {
            ctx.fillStyle = "rgba(252, 103, 63, 0.05)";
            ctx.fillRect(x, y, w, (c.height / layers) * 0.6);
          }
        }
      } else if (type === "circuit") {
        // Circuit visualization simplified
        ctx.strokeStyle = `rgba(17, 77, 67, 0.4)`;
        ctx.lineWidth = 1;
        for(let i=0; i<5; i++) {
           const y = (i+1) * (c.height/6);
           ctx.beginPath();
           ctx.moveTo(0, y);
           ctx.lineTo(c.width, y);
           ctx.stroke();
           const dotX = (t * 50 + i * 100) % c.width;
           ctx.fillStyle = "rgba(252, 103, 63, 0.9)";
           ctx.beginPath(); ctx.arc(dotX, y, 2.5, 0, Math.PI*2); ctx.fill();
        }
      } else if (type === "scan") {
        ctx.strokeStyle = 'rgba(172, 167, 169, 0.2)'; ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(c.width * 0.2, c.height * 0.2);
        ctx.lineTo(c.width * 0.8, c.height * 0.25);
        ctx.lineTo(c.width * 0.85, c.height * 0.75);
        ctx.lineTo(c.width * 0.15, c.height * 0.78);
        ctx.closePath(); ctx.stroke();
        const scanY = (Math.sin(t * 0.9) * 0.5 + 0.5) * c.height;
        const grad = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(0.5, 'rgba(223, 241, 34, 0.5)');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(0, scanY - 30, c.width, 60);
      } else if (type === "code") {
        ctx.font = '11px monospace';
        const lines = ["const apex = new Stinablis()", "  .connect('production')", "  .deploy({ region: 'my' })", "// ✓ Deployed in 1.4s"];
        lines.forEach((l, i) => {
           const y = (i * 20 + t * 20) % c.height;
           ctx.fillStyle = i === 0 ? "rgba(252, 103, 63, 0.8)" : "rgba(238, 244, 246, 0.5)";
           ctx.fillText(l, 20, y);
        });
      }
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [type]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default function Carousel() {
  const [idx, setIdx] = useState(0);
  const total = services.length;
  const trackRef = useRef<HTMLDivElement>(null);

  const getVisible = () => {
    if (typeof window === "undefined") return 3;
    return window.innerWidth < 900 ? 1 : 3;
  };

  const update = useCallback(() => {
    if (!trackRef.current) return;
    const card = trackRef.current.children[0] as HTMLElement;
    if (!card) return;
    const cardW = card.offsetWidth + 24;
    trackRef.current.style.transform = `translateX(-${idx * cardW}px)`;
  }, [idx]);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  return (
    <div className="carousel-wrap relative overflow-hidden">
      <div
        ref={trackRef}
        className="carousel-track flex gap-6 transition-transform duration-600 cubic-bezier(0.16, 1, 0.3, 1)"
      >
        {services.map((service, i) => (
          <div
            key={i}
            className="service-card flex-[0_0_calc(100%-16px)] md:flex-[0_0_calc(33.333%-16px)] bg-frost/3 border border-frost/7 p-0 relative overflow-hidden transition-colors duration-300 hover:border-coral group"
          >
            <div className="service-card-visual h-[220px] relative overflow-hidden bg-frost/3">
              <Visual type={service.type} />
              <div className="service-card-num absolute top-4 left-4 font-syne text-[11px] tracking-[0.15em] text-coral bg-carbon/80 px-2.5 py-1">
                {String(i + 1).padStart(2, "0")}
              </div>
            </div>
            <div className="service-card-body p-7 md:p-8 lg:p-9">
              <div className="service-card-title font-syne font-bold text-[18px] tracking-[0.02em] mb-3">
                {service.title}
              </div>
              <div className="service-card-desc text-[14px] line-height-[1.7] text-frost/50 mb-6">
                {service.description}
              </div>
              <div className="flex items-center gap-5">
                <a 
                  href={`https://wa.me/601160915670?text=${encodeURIComponent(`I would like to ask about the ${service.title}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-coral text-white px-4 py-2 text-[10px] tracking-[0.2em] uppercase transition-all hover:bg-white hover:text-coral font-bold"
                >
                  Ask Us
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-12">
        <div className="font-dm-sans text-[12px] tracking-[0.1em] text-mauve uppercase">
          {String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </div>
        <div className="carousel-controls flex gap-3">
          <button
            onClick={() => setIdx(Math.max(0, idx - 1))}
            className="w-12 h-12 border border-frost/15 flex items-center justify-center text-frost hover:border-coral hover:bg-coral/8 transition-all duration-200"
          >
            ←
          </button>
          <button
            onClick={() => setIdx(Math.min(total - getVisible(), idx + 1))}
            className="w-12 h-12 border border-frost/15 flex items-center justify-center text-frost hover:border-coral hover:bg-coral/8 transition-all duration-200"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
