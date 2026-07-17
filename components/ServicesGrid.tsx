"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowUpRight } from "lucide-react";

interface ServiceItem {
  title: string;
  image: string;
  description: string;
  link?: string;
  linkLabel?: string;
}

interface Category {
  id: string;
  name: string;
  color: string;      // Color hex
  borderColor: string; // Tailwind border hover/active class
  textColor: string;   // Tailwind text class
  glowColor: string;   // Shadow glow color
  services: ServiceItem[];
}

const categories: Category[] = [
  {
    id: "industrial",
    name: "Industrial & Manufacturing",
    color: "#fc673f",
    borderColor: "border-coral",
    textColor: "text-coral",
    glowColor: "rgba(252, 103, 63, 0.15)",
    services: [
      {
        title: "3D Printing",
        image: "/3d-printing-new.jpg",
        description: "Customized additive manufacturing for functional prototypes, jigs, fixtures, and end-use parts in a wide range of materials and tolerances.",
      },
      {
        title: "Automotive Parts",
        image: "/automotive-parts-new.jpg",
        description: "Custom-specification parts production for automotive applications — from concept and CAD through fabrication to finished component delivery.",
      },
      {
        title: "Reverse Engineering",
        image: "/reverse-engineering-new.jpg",
        description: "Problem-solving through analysis of existing components. We digitize, reconstruct, and improve parts with no original documentation.",
      },
    ]
  },
  {
    id: "sustainable",
    name: "Sustainable Material",
    color: "#fc673f",
    borderColor: "border-coral",
    textColor: "text-coral",
    glowColor: "rgba(252, 103, 63, 0.15)",
    services: [
      {
        title: "Sustainable Composites",
        image: "/sustainability-composite-new.jpg",
        description: "Pioneering material innovation with natural fibers including pineapple, kenaf and bio-composites — strong, lightweight, and ecologically responsible.",
      },
      {
        title: "Pangkas",
        image: "/product-end.png",
        description: "Durable, crack-resistant modular floor tiles and circular construction pavers upcycled from local post-consumer plastic wastes.",
        link: "/pangkas",
        linkLabel: "Discover",
      },
    ]
  },
  {
    id: "prototyping",
    name: "Rapid Prototyping",
    color: "#fc673f",
    borderColor: "border-coral",
    textColor: "text-coral",
    glowColor: "rgba(252, 103, 63, 0.15)",
    services: [
      {
        title: "Rapid Prototyping",
        image: "/rapid.jpg",
        description: "From ideation to tangible solution in record time. We accelerate the design-to-prototype cycle for complex engineering challenges.",
      },
    ]
  },
  {
    id: "software",
    name: "Software Technology",
    color: "#fc673f",
    borderColor: "border-coral",
    textColor: "text-coral",
    glowColor: "rgba(252, 103, 63, 0.15)",
    services: [
      {
        title: "Software Solutions",
        image: "/web.png",
        description: "Custom development of websites, applications, and databases tailored to engineering and industrial workflows. Built to integrate with your operations.",
      },
    ]
  }
];

export default function ServicesGrid() {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    industrial: true,
    sustainable: true,
    prototyping: true,
    software: true,
  });

  const toggleCategory = (id: string) => {
    setExpandedIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="w-full flex flex-col gap-6 max-w-6xl mx-auto">
      {categories.map((category, idx) => {
        const isExpanded = !!expandedIds[category.id];

        return (
          <div
            key={category.id}
            className="service-card opacity-0 w-full bg-frost/3 border border-frost/10 rounded-xl overflow-hidden transition-all duration-500"
            style={{
              borderColor: isExpanded ? category.color : undefined,
              boxShadow: isExpanded ? `0 10px 30px -10px ${category.glowColor}` : undefined
            }}
          >
            {/* Dropdown Header Trigger */}
            <button
              onClick={() => toggleCategory(category.id)}
              className="w-full text-left px-6 py-7 md:px-10 md:py-8 flex items-center justify-between gap-4 transition-colors duration-300 hover:bg-frost/2 group"
            >
              <div className="flex items-center gap-5 md:gap-8">
                <span 
                  className="font-mono text-[13px] tracking-widest font-semibold"
                  style={{ color: isExpanded ? category.color : "rgba(238, 244, 246, 0.4)" }}
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <h3 
                  className="font-anton text-[22px] md:text-[28px] tracking-[0.03em] uppercase transition-colors duration-300 text-frost"
                  style={{ color: isExpanded ? category.color : undefined }}
                >
                  {category.name}
                </h3>
                <span className="px-2.5 py-1 bg-frost/5 border border-frost/10 rounded-full text-[11px] font-mono text-frost/50 uppercase">
                  {category.services.length} {category.services.length === 1 ? "Service" : "Services"}
                </span>
              </div>

              <div 
                className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-frost/15 flex items-center justify-center text-frost/60 transition-all duration-300 group-hover:border-frost/40 group-hover:text-frost"
                style={{
                  borderColor: isExpanded ? category.color : undefined,
                  color: isExpanded ? category.color : undefined,
                  transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)"
                }}
              >
                <ChevronDown size={20} className="transition-transform duration-300" />
              </div>
            </button>

            {/* Dropdown Content */}
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="px-6 pb-8 md:px-10 md:pb-12 border-t border-frost/5 pt-8 bg-carbon/40">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {category.services.map((service, sIdx) => (
                        <div
                          key={sIdx}
                          className="inner-service-card group/card relative bg-frost/2 border border-frost/5 rounded-lg overflow-hidden transition-all duration-300 hover:border-frost/20 flex flex-col justify-between"
                        >
                          {/* Image Container */}
                          <div className="h-48 overflow-hidden relative">
                            <div 
                              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover/card:scale-108"
                              style={{ backgroundImage: `url(${service.image})` }}
                            />
                            <div className="absolute inset-0 bg-carbon/50 group-hover/card:bg-carbon/30 transition-colors duration-300" />
                            <div 
                              className="absolute top-4 left-4 font-mono text-[10px] tracking-[0.15em] bg-carbon/80 px-2 py-1 rounded"
                              style={{ color: category.color }}
                            >
                              {String(sIdx + 1).padStart(2, "0")}
                            </div>
                          </div>

                          {/* Details Content */}
                          <div className="p-6 flex-grow flex flex-col justify-between">
                            <div>
                              <h4 className="font-anton text-[18px] tracking-[0.03em] text-frost mb-3 uppercase">
                                {service.title}
                              </h4>
                              <p className="font-roboto text-[13.5px] leading-relaxed text-frost/50 mb-6 font-light">
                                {service.description}
                              </p>
                            </div>

                             <div className="flex items-center gap-3">
                              {service.link && (
                                <a 
                                  href={service.link}
                                  className="flex-1 text-center text-[11px] tracking-[0.15em] uppercase py-3 px-4 font-bold transition-all duration-300 hover:bg-white hover:text-carbon inline-flex items-center justify-center gap-2"
                                  style={{
                                    backgroundColor: category.color,
                                    color: "#eef4f6"
                                  }}
                                >
                                  {service.linkLabel || "Details"}
                                </a>
                              )}
                              <a 
                                href={`https://wa.me/601160915670?text=${encodeURIComponent(`I would like to ask about the ${service.title} service.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${service.link ? 'flex-1' : 'w-full'} text-center bg-frost/5 border border-frost/10 text-frost text-[11px] tracking-[0.15em] uppercase py-3 px-4 font-bold transition-all duration-300 hover:bg-frost hover:text-carbon inline-flex items-center justify-center gap-2`}
                              >
                                Inquiry
                                <ArrowUpRight size={14} />
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
