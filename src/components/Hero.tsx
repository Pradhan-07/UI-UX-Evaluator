"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Play, Sparkles, Zap, ArrowDown, CheckCircle2, ShieldCheck, AlertOctagon, AlertTriangle, Check } from "lucide-react";
import { playMicroClick, playPinSelect } from "@/utils/audio";
import { EASE_PREMIUM, Magnetic, ScrambleText } from "@/lib/motion";

// Mock phone pins for right-side visual (constant, stable reference)
const HERO_PINS = [
  { id: 1, x: 70, y: 32, severity: "high", color: "bg-amber-500", label: "Format Mask Missing", delay: 1.2 },
  { id: 2, x: 38, y: 52, severity: "critical", color: "bg-rose-500", label: "Tap Target 34px < 44px", delay: 1.5 },
  { id: 3, x: 50, y: 84, severity: "critical", color: "bg-[#c8ff3d]", label: "Missing CTA Feedback", delay: 1.8 },
] as const;

// Module-level guard: hero intro animation must play exactly once per page load
let hasHeroIntroPlayed = false;

interface HeroProps {
  onOpenDemo: () => void;
}

export function Hero({ onOpenDemo }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();
  const [activeHeroPin, setActiveHeroPin] = useState<number | null>(null);

  // Background faint lime glow following pointer (desktop only)
  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (prefersReduced || typeof window === "undefined" || window.innerWidth < 768) return;
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    sectionRef.current?.style.setProperty("--hx", `${x}px`);
    sectionRef.current?.style.setProperty("--hy", `${y}px`);
  };

  const scrollToAnalyzer = () => {
    playMicroClick(1100);
    const element = document.getElementById("analyzer");
    if (element) {
      const lenis = (window as unknown as { __lenis?: { scrollTo: (target: Element) => void } }).__lenis;
      if (lenis) {
        lenis.scrollTo(element);
      } else {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Intro runs once on initial page load; subsequent re-renders use initial={false}
  const shouldAnimate = !hasHeroIntroPlayed;

  useEffect(() => {
    hasHeroIntroPlayed = true;
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      className="relative min-h-[92vh] pt-28 pb-16 flex flex-col justify-between overflow-hidden border-b border-border"
    >
      {/* Background Subtle Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      {/* Pointer-following Faint Lime Glow (Desktop only, CSS vars --hx / --hy) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70 transition-opacity duration-500 hidden md:block"
        style={{
          background:
            "radial-gradient(600px circle at var(--hx, 50%) var(--hy, 30%), var(--glow), transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading, Subtext, CTAs (7 cols) */}
          <div className="lg:col-span-7">
            {/* Section Label */}
            <motion.div
              initial={shouldAnimate ? { opacity: 0, y: 12 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm text-muted mb-6 px-3 py-1.5 rounded-full border border-border bg-surface"
            >
              <span className="text-accent-text font-bold">[01]</span>
              <span className="tracking-wider uppercase text-text">
                AUTONOMOUS UX AUDIT ENGINE
              </span>
              <span className="text-accent-text font-bold blink-cursor">_</span>
            </motion.div>

            {/* Headline with SplitText line mask reveal & Scrambled keyword */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight leading-[0.95] text-text">
              {/* Line 1: FIND THE FRICTION_ */}
              <span className="block overflow-hidden">
                <motion.span
                  initial={shouldAnimate ? { y: "110%" } : false}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.7, ease: EASE_PREMIUM }}
                  className="block whitespace-nowrap"
                >
                  <span>FIND THE </span>
                  <span className="text-accent-text">
                    <ScrambleText text="FRICTION" duration={700} />
                  </span>
                  <span className="text-accent-text blink-cursor">_</span>
                </motion.span>
              </span>

              {/* Line 2: [10X] SHIP THE FIX. */}
              <span className="block overflow-hidden mt-1 sm:mt-2">
                <motion.span
                  initial={shouldAnimate ? { y: "110%" } : false}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.7, delay: 0.1, ease: EASE_PREMIUM }}
                  className="inline-flex items-baseline flex-wrap gap-x-4 gap-y-1"
                >
                  <span className="font-mono text-3xl sm:text-5xl md:text-6xl text-accent-text tracking-normal font-normal">
                    [10X]
                  </span>
                  <span className="text-text">SHIP THE FIX.</span>
                </motion.span>
              </span>
            </h1>

            {/* Subtext */}
            <motion.p
              initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-8 text-lg sm:text-xl text-muted max-w-xl font-light leading-relaxed"
            >
              Upload screenshots or a user journey. Get usability issues, impact, and concrete fixes in seconds.
            </motion.p>

            {/* Magnetic CTAs */}
            <motion.div
              initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
            >
              {/* Primary CTA wrapped in Magnetic */}
              <Magnetic intensity={0.2}>
                <button
                  onClick={scrollToAnalyzer}
                  className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-mono text-sm font-bold uppercase tracking-wider bg-accent text-accent-ink hover:bg-[#d6ff5e] transition-all shadow-[0_0_24px_rgba(200,255,61,0.25)] hover:shadow-[0_0_36px_rgba(200,255,61,0.45)] cursor-pointer"
                >
                  <span>Analyze my app</span>
                  <span className="text-accent-ink font-extrabold group-hover:translate-x-1 transition-transform">
                    &rarr;
                  </span>
                </button>
              </Magnetic>

              {/* Secondary CTA: 90-sec demo */}
              <Magnetic intensity={0.15}>
                <button
                  onClick={() => {
                    playMicroClick(1000);
                    onOpenDemo();
                  }}
                  className="group inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl font-mono text-sm font-medium tracking-wide bg-surface text-text border border-border hover:border-accent-text hover:bg-surface-2 transition-all cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-surface-2 flex items-center justify-center group-hover:bg-accent group-hover:text-accent-ink transition-colors">
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                  </div>
                  <span>Watch 90-sec demo</span>
                </button>
              </Magnetic>
            </motion.div>
          </div>

          {/* Right Column: Interactive Mock Phone Screen with Lime Sweep & Spring Pins (5 cols) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <motion.div
              initial={shouldAnimate ? { opacity: 0, y: 30, scale: 0.96 } : false}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: EASE_PREMIUM }}
              className="relative w-full max-w-[320px] rounded-[36px] p-3 bg-surface border border-border shadow-xl backdrop-blur-md"
            >
              {/* Phone Inner Bezel & Screen (realistic mobile device) */}
              <div className="relative aspect-[9/18] w-full rounded-[28px] bg-zinc-950 overflow-hidden border border-border flex flex-col justify-between shadow-inner">
                {/* Simulated Screen Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/samples/checkout.jpg"
                  alt="App interface preview"
                  className="w-full h-full object-cover pointer-events-none opacity-90"
                />

                {/* Sweeping Lime Laser Scan Line (top -> bottom infinite or smooth) */}
                {!prefersReduced && (
                  <motion.div
                    animate={{ y: ["0%", "480%", "0%"] }}
                    transition={{
                      duration: 4.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#c8ff3d] to-transparent shadow-[0_0_15px_#c8ff3d] pointer-events-none z-10"
                    aria-hidden="true"
                  />
                )}

                {/* Numbered Issue Pins popping in one by one (spring) */}
                {HERO_PINS.map((pin) => (
                  <motion.div
                    key={pin.id}
                    style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                    initial={shouldAnimate ? { scale: 0, opacity: 0 } : false}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 18,
                      delay: prefersReduced ? 0.2 : pin.delay,
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
                  >
                    <button
                      onClick={() => {
                        playPinSelect();
                        setActiveHeroPin(activeHeroPin === pin.id ? null : pin.id);
                      }}
                      className={`relative w-7 h-7 rounded-full font-mono text-xs font-black flex items-center justify-center text-zinc-950 transition-transform group-hover:scale-125 cursor-pointer shadow-lg ${
                        pin.severity === "critical"
                          ? "bg-rose-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.7)]"
                          : pin.color
                      }`}
                    >
                      <span>0{pin.id}</span>

                      {/* Small Mono Tooltip */}
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 rounded-md bg-surface border border-border text-[10px] font-mono whitespace-nowrap text-text opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
                        {pin.label}
                      </span>
                    </button>
                  </motion.div>
                ))}

                {/* Top Status Bar Notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-zinc-950/80 rounded-full border border-white/10 flex items-center justify-center z-30">
                  <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                </div>

                {/* Bottom telemetry overlay pill */}
                <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-surface/95 border border-border backdrop-blur-md flex items-center justify-between text-[10px] font-mono text-muted z-30 shadow-md">
                  <span className="text-accent-text flex items-center gap-1 font-bold">
                    <Sparkles className="w-3 h-3 text-accent-text" />
                    <span>3 ISSUES PINNED</span>
                  </span>
                  <span className="text-muted font-medium">1.8s TURNAROUND</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Small Meta Row */}
        <motion.div
          initial={shouldAnimate ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-14 pt-8 border-t border-border flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-muted"
        >
          <div className="flex flex-wrap items-center gap-3 sm:gap-6">
            <span className="inline-flex items-center gap-2 text-text">
              <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
              <span>LIVE ANALYSIS</span>
            </span>
            <span className="text-muted">/</span>
            <span className="text-text">2026 EDITION</span>
            <span className="text-muted">/</span>
            <span className="text-text flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-accent-text" />
              BUILT ON NIELSEN HEURISTICS + WCAG 2.2
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-[11px] text-muted">
            <span>PRESS</span>
            <kbd className="px-1.5 py-0.5 rounded bg-surface-2 border border-border text-text font-mono">
              SPACE
            </kbd>
            <span>OR SCROLL DOWN TO EXPLORE</span>
            <ArrowDown className="w-3 h-3 animate-bounce text-accent-text" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
