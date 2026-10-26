"use client";

import React from "react";
import { motion } from "framer-motion";
import { Play, Sparkles, Zap, ArrowDown, CheckCircle2 } from "lucide-react";
import { playMicroClick } from "@/utils/audio";

interface HeroProps {
  onOpenDemo: () => void;
}

export function Hero({ onOpenDemo }: HeroProps) {
  const scrollToAnalyzer = () => {
    playMicroClick(1100);
    const element = document.getElementById("analyzer");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] pt-28 pb-16 flex flex-col justify-between overflow-hidden border-b border-white/[0.08]"
    >
      {/* Background Subtle Grid & Radial Glow */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#c8ff3d]/[0.035] blur-[140px] pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Section Label with blinking underscore */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm text-zinc-400 mb-6 px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02]"
        >
          <span className="text-[#c8ff3d] font-bold">[01]</span>
          <span className="tracking-wider uppercase text-zinc-300">
            AUTONOMOUS UX AUDIT ENGINE
          </span>
          <span className="text-[#c8ff3d] font-bold blink-cursor">_</span>
        </motion.div>

        {/* Hero Heading: Editorial, tight-tracked, uppercase, bracketed [10X] */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.4rem] font-black uppercase tracking-tight leading-[0.95] text-white max-w-6xl"
        >
          <span>FIND THE FRICTION</span>
          <span className="text-[#c8ff3d] blink-cursor">_</span>
          <br />
          <span className="inline-flex items-baseline flex-wrap gap-x-4 gap-y-1">
            <span className="font-mono text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-[#c8ff3d] tracking-normal font-normal">
              [10X]
            </span>
            <span className="text-zinc-200">SHIP THE FIX.</span>
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 text-lg sm:text-xl md:text-2xl text-zinc-400 max-w-2xl font-light leading-relaxed"
        >
          Upload screenshots or a user journey. Get usability issues, impact, and concrete fixes in seconds.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
        >
          {/* Primary CTA */}
          <button
            onClick={scrollToAnalyzer}
            className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-mono text-sm font-bold uppercase tracking-wider bg-[#c8ff3d] text-black hover:bg-[#d6ff5e] transition-all shadow-[0_0_24px_rgba(200,255,61,0.25)] hover:shadow-[0_0_36px_rgba(200,255,61,0.45)] cursor-pointer"
          >
            <span>Analyze my app</span>
            <span className="text-black font-extrabold group-hover:translate-x-1 transition-transform">
              &rarr;
            </span>
          </button>

          {/* Secondary CTA: 90-sec demo */}
          <button
            onClick={() => {
              playMicroClick(1000);
              onOpenDemo();
            }}
            className="group inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl font-mono text-sm font-medium tracking-wide bg-white/[0.03] text-white border border-white/15 hover:border-white/30 hover:bg-white/[0.08] transition-all cursor-pointer"
          >
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#c8ff3d] group-hover:text-black transition-colors">
              <Play className="w-3 h-3 fill-current ml-0.5" />
            </div>
            <span>Watch 90-sec demo</span>
          </button>
        </motion.div>

        {/* Small Meta Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-14 pt-8 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-zinc-400"
        >
          <div className="flex flex-wrap items-center gap-3 sm:gap-6">
            <span className="inline-flex items-center gap-2 text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-[#c8ff3d] animate-ping" />
              <span>LIVE ANALYSIS</span>
            </span>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-300">2026 EDITION</span>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#c8ff3d]" />
              BUILT ON NIELSEN HEURISTICS + WCAG 2.2
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-[11px] text-zinc-500">
            <span>PRESS</span>
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-white/20 text-zinc-300 font-mono">
              SPACE
            </kbd>
            <span>OR SCROLL DOWN TO EXPLORE</span>
            <ArrowDown className="w-3 h-3 animate-bounce text-[#c8ff3d]" />
          </div>
        </motion.div>
      </div>

      {/* Floating Agency Telemetry Badge in bottom corner */}
      <div className="hidden xl:block absolute right-8 top-36 w-64 p-4 rounded-xl bg-zinc-950/70 border border-white/[0.08] backdrop-blur-md font-mono text-xs">
        <div className="flex items-center justify-between text-zinc-500 mb-2">
          <span>MODEL TELEMETRY</span>
          <span className="text-[#c8ff3d]">LIVE</span>
        </div>
        <div className="space-y-1.5 text-zinc-400">
          <div className="flex justify-between">
            <span>Saccade Mapping:</span>
            <span className="text-zinc-200">Active (40Hz)</span>
          </div>
          <div className="flex justify-between">
            <span>Fitts Radius:</span>
            <span className="text-zinc-200">44px Rule</span>
          </div>
          <div className="flex justify-between">
            <span>Contrast Engine:</span>
            <span className="text-zinc-200">WCAG AAA</span>
          </div>
        </div>
        <div className="mt-3 pt-2.5 border-t border-white/[0.06] text-[10px] text-zinc-500 flex items-center gap-1.5">
          <Zap className="w-3 h-3 text-[#c8ff3d]" />
          <span>ZERO LOREM IPSUM // REAL CODE FIXES</span>
        </div>
      </div>
    </section>
  );
}
