"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Sparkles, Terminal } from "lucide-react";
import { playMicroClick } from "@/utils/audio";
import { SectionLabel, Magnetic, DURATIONS, EASE_PREMIUM, VIEWPORT } from "@/lib/motion";

export function FinalCta({ onOpenDemo }: { onOpenDemo?: () => void }) {
  const prefersReduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  // Giant headline letters for stagger
  const headlineWords = ["STOP", "LOSING", "CONVERSIONS", "TO", "MICROSCOPIC", "FRICTION."];

  const handleCtaClick = () => {
    playMicroClick(1250);
    const element = document.getElementById("analyzer");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="final-cta"
      className="py-28 sm:py-40 bg-[#08080a] border-b border-white/[0.08] relative overflow-hidden"
    >
      {/* Background radial ambient glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#c8ff3d]/[0.04] blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <SectionLabel number="09" label="IMMEDIATE DISPATCH // PROTOLENS ENGINE" />

        {/* Giant Headline with Letter / Word Stagger Reveal */}
        <div className="mt-8 overflow-hidden">
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white leading-[1.05]">
            {headlineWords.map((word, wIdx) => (
              <span key={wIdx} className="inline-block mr-[0.24em] whitespace-nowrap">
                {word.split("").map((letter, lIdx) => {
                  const globalIdx = wIdx * 10 + lIdx;
                  return (
                    <motion.span
                      key={lIdx}
                      initial={prefersReduced ? false : { opacity: 0, y: 35 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={VIEWPORT}
                      transition={{
                        duration: 0.55,
                        delay: prefersReduced ? 0 : 0.08 + globalIdx * 0.015,
                        ease: EASE_PREMIUM,
                      }}
                      className={`inline-block ${
                        word === "FRICTION."
                          ? "text-[#c8ff3d] underline decoration-[#c8ff3d]/40 underline-offset-8"
                          : ""
                      }`}
                    >
                      {letter}
                    </motion.span>
                  );
                })}
              </span>
            ))}
          </h2>
        </div>

        <motion.p
          initial={prefersReduced ? false : { opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6, delay: 0.35, ease: EASE_PREMIUM }}
          className="mt-8 text-base sm:text-lg md:text-xl font-sans text-zinc-300 font-light max-w-2xl mx-auto leading-relaxed"
        >
          Drop your screen prototype into our autonomous intelligence layer. Get Nielsen heuristic violations, WCAG 2.2 contrast failures, and engineering-ready React diffs in under 2 seconds.
        </motion.p>

        {/* Magnetic Button with Lime Fill Sweep on Hover */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Magnetic intensity={0.25}>
            <button
              onClick={handleCtaClick}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              className="relative px-8 sm:px-10 py-5 rounded-2xl font-mono text-sm sm:text-base font-bold uppercase tracking-wider text-black bg-[#c8ff3d] overflow-hidden group cursor-pointer shadow-[0_0_30px_rgba(200,255,61,0.3)] transition-transform duration-200 active:scale-95"
            >
              {/* Lime fill sweep background animation on hover */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: hovered ? "0%" : "-100%" }}
                transition={{ duration: 0.35, ease: EASE_PREMIUM }}
                className="absolute inset-0 bg-[#d7ff6b] z-0 pointer-events-none"
              />

              <span className="relative z-10 flex items-center gap-2">
                <Sparkles className="w-4 h-4 fill-black" />
                <span>Launch Live Analyzer Now</span>
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </button>
          </Magnetic>

          {onOpenDemo && (
            <Magnetic intensity={0.15}>
              <button
                onClick={() => {
                  playMicroClick();
                  onOpenDemo();
                }}
                className="px-6 py-5 rounded-2xl border border-white/15 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/30 font-mono text-xs sm:text-sm text-zinc-300 hover:text-white uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2"
              >
                <Terminal className="w-4 h-4 text-zinc-400" />
                <span>Watch 90s Walkthrough</span>
              </button>
            </Magnetic>
          )}
        </div>

        <div className="mt-8 font-mono text-xs text-zinc-500 flex items-center justify-center gap-4">
          <span>NO CREDIT CARD</span>
          <span>✦</span>
          <span>100% IN-MEMORY AUDIT</span>
          <span>✦</span>
          <span>ZERO ARBITRARY CRITIQUES</span>
        </div>
      </div>
    </section>
  );
}
