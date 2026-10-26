"use client";

import React, { useState, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, AlertTriangle, ArrowRight, Sparkles, SlidersHorizontal } from "lucide-react";
import { playMicroClick } from "@/utils/audio";
import { SectionLabel, Reveal, Magnetic } from "@/lib/motion";

export function SampleReportCard() {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  // 3D tilt calculation (max 6deg perspective)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced || typeof window === "undefined" || window.innerWidth < 768) return;
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = Math.max(-6, Math.min(6, ((y - centerY) / centerY) * -6));
    const rotateY = Math.max(-6, Math.min(6, ((x - centerX) / centerX) * 6));

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setIsDragging(false);
  };

  // Slider drag handling
  const handleSliderMove = (clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const pos = ((clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.max(5, Math.min(95, pos)));
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    playMicroClick();
    setIsDragging(true);
    handleSliderMove(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      handleSliderMove(e.clientX);
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <section
      id="sample-report"
      className="py-24 sm:py-32 bg-[#08080a] border-b border-white/[0.08] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/[0.08] mb-12">
          <div>
            <SectionLabel number="07" label="SAMPLE REPORT // BEFORE & AFTER" />
            <Reveal delay={0.1}>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white uppercase">
                Interactive Audit Teardown.
              </h2>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <div className="font-mono text-xs text-zinc-400 max-w-sm">
              DRAG THE SLIDER TO REVEAL HOW PROTOLENS TRANSFORMS HIGH-FRICTION UI INTO CONVERTING FLOWS.
            </div>
          </Reveal>
        </div>

        {/* 3D Tilt Card Container with perspective */}
        <div
          style={{ perspective: 1200 }}
          className="flex justify-center"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div
            ref={cardRef}
            animate={{ rotateX: rotate.x, rotateY: rotate.y }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-full max-w-5xl rounded-2xl border border-white/[0.12] bg-zinc-950/90 shadow-2xl overflow-hidden will-change-transform"
          >
            {/* Top Window Chrome Bar */}
            <div className="px-6 py-4 bg-zinc-900/60 border-b border-white/[0.08] flex items-center justify-between font-mono text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-zinc-300 font-bold uppercase tracking-wider">
                  TELEMETRY COMPARISON: CHECKOUT CONVERSION FLOW
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#c8ff3d] font-bold">DRAG SLIDER &harr;</span>
                <span className="text-zinc-500">60FPS RENDER</span>
              </div>
            </div>

            {/* Before / After Slider Canvas */}
            <div
              ref={containerRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="relative min-h-[460px] sm:min-h-[520px] select-none cursor-ew-resize overflow-hidden bg-black"
            >
              {/* UNDER LAYER: "BEFORE" (Severe Friction UI) */}
              <div className="absolute inset-0 p-8 sm:p-12 flex flex-col justify-between bg-zinc-950">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/30 font-bold">
                    [BEFORE AUDIT // FRICTION SCORE: 48/100]
                  </span>
                  <span className="font-mono text-xs text-zinc-500">4 Critical Violations</span>
                </div>

                <div className="max-w-md my-auto space-y-4">
                  <div className="space-y-1">
                    <div className="h-3 w-28 bg-zinc-800 rounded" />
                    <div className="text-lg sm:text-2xl font-bold text-zinc-400 line-through">
                      Payment Verification Failed
                    </div>
                    <div className="text-xs text-zinc-600 font-mono">
                      Error 4002: payload validation failed on address token.
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/20 font-mono text-xs text-rose-300 space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-rose-400">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>HEURISTIC #9: CRITICAL ERROR LOCKOUT</span>
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      User receives zero self-healing guidance. 58% of shoppers close the checkout tab at this step.
                    </p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button className="px-5 py-2.5 rounded-lg bg-zinc-800 text-zinc-400 font-mono text-xs cursor-not-allowed">
                      Submit Query
                    </button>
                    <button className="px-5 py-2.5 rounded-lg border border-zinc-800 text-zinc-600 font-mono text-xs">
                      Cancel
                    </button>
                  </div>
                </div>

                <div className="font-mono text-[11px] text-zinc-600 flex justify-between">
                  <span>CONTRAST: 2.1:1 (FAIL)</span>
                  <span>TAP TARGET: 28px (FAIL)</span>
                  <span>EST. DROP-OFF: 38%</span>
                </div>
              </div>

              {/* OVER LAYER: "AFTER" (Remediated Clean UI revealed via clip-path) */}
              <div
                style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
                className="absolute inset-0 p-8 sm:p-12 flex flex-col justify-between bg-gradient-to-br from-[#0c0f08] to-zinc-950 border-l border-[#c8ff3d]/60 will-change-[clip-path]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[#c8ff3d] bg-[#c8ff3d]/15 px-3 py-1 rounded-full border border-[#c8ff3d]/40 font-bold">
                    [AFTER PROTOLENS // SCORE: 96/100]
                  </span>
                  <span className="font-mono text-xs text-[#c8ff3d] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>0 Friction Blockers</span>
                  </span>
                </div>

                <div className="max-w-md my-auto space-y-4">
                  <div className="space-y-1">
                    <div className="h-3 w-32 bg-[#c8ff3d]/30 rounded" />
                    <div className="text-lg sm:text-2xl font-bold text-white">
                      Please check your postal code
                    </div>
                    <div className="text-xs text-zinc-300 font-mono">
                      Your street address looks great. Just add your 6-digit postal code to complete checkout.
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-[#c8ff3d]/30 bg-[#c8ff3d]/[0.06] font-mono text-xs text-zinc-200 space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-[#c8ff3d]">
                      <Check className="w-3.5 h-3.5" />
                      <span>HEURISTIC #9 REMEDIATED // INLINE GUIDANCE</span>
                    </div>
                    <p className="text-[11px] text-zinc-300">
                      Clear auto-focused input field with inline validation. Recoverable revenue captured immediately.
                    </p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button className="px-6 py-3 rounded-xl bg-[#c8ff3d] text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#d6ff5e] transition-colors shadow-[0_0_15px_rgba(200,255,61,0.3)]">
                      Update Postal Code &rarr;
                    </button>
                    <button className="px-4 py-3 rounded-xl border border-white/10 text-zinc-300 font-mono text-xs">
                      Change Address
                    </button>
                  </div>
                </div>

                <div className="font-mono text-[11px] text-[#c8ff3d] flex justify-between">
                  <span>CONTRAST: 11.4:1 (AAA PASS)</span>
                  <span>TAP TARGET: 48px (PASS)</span>
                  <span>EST. CONVERSION LIFT: +24%</span>
                </div>
              </div>

              {/* Central Divider Handle */}
              <div
                style={{ left: `${sliderPos}%` }}
                className="absolute top-0 bottom-0 w-[2px] bg-[#c8ff3d] shadow-[0_0_12px_#c8ff3d] pointer-events-none z-30"
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-black border-2 border-[#c8ff3d] flex items-center justify-center text-[#c8ff3d] shadow-[0_0_16px_rgba(200,255,61,0.6)]">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Bottom telemetry footer */}
            <div className="px-6 py-4 bg-zinc-950 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="text-[#c8ff3d]">✦</span>
                <span>Automated Remediation Engine: React component + CSS variables generated in 1.4s</span>
              </div>
              <a
                href="#analyzer"
                className="text-[#c8ff3d] hover:underline flex items-center gap-1 font-bold"
              >
                <span>Audit your flow now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
