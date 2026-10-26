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
      className="py-24 sm:py-32 bg-bg border-b border-border relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-border mb-12">
          <div>
            <SectionLabel number="07" label="SAMPLE REPORT // BEFORE & AFTER" />
            <Reveal delay={0.1}>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-text uppercase">
                Interactive Audit Teardown.
              </h2>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <div className="font-mono text-xs text-muted max-w-sm">
              DRAG THE SLIDER TO REVEAL HOW FRICTION TRANSFORMS HIGH-FRICTION UI INTO CONVERTING FLOWS.
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
            className="w-full max-w-5xl rounded-2xl border border-border bg-surface shadow-xl overflow-hidden will-change-transform"
          >
            {/* Top Window Chrome Bar */}
            <div className="px-6 py-4 bg-surface-2 border-b border-border flex items-center justify-between font-mono text-xs text-muted">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-text font-bold uppercase tracking-wider">
                  TELEMETRY COMPARISON: CHECKOUT CONVERSION FLOW
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-accent-text font-bold">DRAG SLIDER &harr;</span>
                <span className="text-muted">60FPS RENDER</span>
              </div>
            </div>

            {/* Before / After Slider Canvas */}
            <div
              ref={containerRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="relative min-h-[460px] sm:min-h-[520px] select-none cursor-ew-resize overflow-hidden bg-surface-2"
            >
              {/* UNDER LAYER: "BEFORE" (Severe Friction UI) */}
              <div className="absolute inset-0 p-8 sm:p-12 flex flex-col justify-between bg-surface-2/90">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-rose-500 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/30 font-bold">
                    [BEFORE AUDIT // FRICTION SCORE: 48/100]
                  </span>
                  <span className="font-mono text-xs text-muted">4 Critical Violations</span>
                </div>

                <div className="max-w-md my-auto space-y-4">
                  <div className="space-y-1">
                    <div className="h-3 w-28 bg-border rounded" />
                    <div className="text-lg sm:text-2xl font-bold text-muted line-through">
                      Payment Verification Failed
                    </div>
                    <div className="text-xs text-muted font-mono">
                      Error 4002: payload validation failed on address token.
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 font-mono text-xs text-rose-500 space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-rose-500">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>HEURISTIC #9: CRITICAL ERROR LOCKOUT</span>
                    </div>
                    <p className="text-[11px] text-muted">
                      User receives zero self-healing guidance. 58% of shoppers close the checkout tab at this step.
                    </p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button className="px-5 py-2.5 rounded-lg bg-surface-2 text-muted border border-border font-mono text-xs cursor-not-allowed">
                      Submit Query
                    </button>
                    <button className="px-5 py-2.5 rounded-lg border border-border text-muted font-mono text-xs">
                      Cancel
                    </button>
                  </div>
                </div>

                <div className="font-mono text-[11px] text-muted flex justify-between">
                  <span>CONTRAST: 2.1:1 (FAIL)</span>
                  <span>TAP TARGET: 28px (FAIL)</span>
                  <span>EST. DROP-OFF: 38%</span>
                </div>
              </div>

              {/* OVER LAYER: "AFTER" (Remediated Clean UI revealed via clip-path) */}
              <div
                style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
                className="absolute inset-0 p-8 sm:p-12 flex flex-col justify-between bg-gradient-to-br from-surface to-surface-2 border-l-2 border-accent will-change-[clip-path]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-accent-text bg-accent/20 px-3 py-1 rounded-full border border-accent/40 font-bold">
                    [AFTER FRICTION // SCORE: 96/100]
                  </span>
                  <span className="font-mono text-xs text-accent-text flex items-center gap-1 font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>0 Friction Blockers</span>
                  </span>
                </div>

                <div className="max-w-md my-auto space-y-4">
                  <div className="space-y-1">
                    <div className="h-3 w-32 bg-accent/40 rounded" />
                    <div className="text-lg sm:text-2xl font-bold text-text">
                      Please check your postal code
                    </div>
                    <div className="text-xs text-text/80 font-mono">
                      Your street address looks great. Just add your 6-digit postal code to complete checkout.
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-accent/40 bg-accent/10 font-mono text-xs text-text space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-accent-text">
                      <Check className="w-3.5 h-3.5" />
                      <span>HEURISTIC #9 REMEDIATED // INLINE GUIDANCE</span>
                    </div>
                    <p className="text-[11px] text-muted">
                      Clear auto-focused input field with inline validation. Recoverable revenue captured immediately.
                    </p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button className="px-6 py-3 rounded-xl bg-accent text-accent-ink font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#d6ff5e] transition-colors shadow-sm">
                      Update Postal Code &rarr;
                    </button>
                    <button className="px-4 py-3 rounded-xl border border-border text-text font-mono text-xs hover:bg-surface-2 transition-colors">
                      Change Address
                    </button>
                  </div>
                </div>

                <div className="font-mono text-[11px] text-accent-text font-bold flex justify-between">
                  <span>CONTRAST: 11.4:1 (AAA PASS)</span>
                  <span>TAP TARGET: 48px (PASS)</span>
                  <span>EST. CONVERSION LIFT: +24%</span>
                </div>
              </div>

              {/* Central Divider Handle */}
              <div
                style={{ left: `${sliderPos}%` }}
                className="absolute top-0 bottom-0 w-[2px] bg-accent shadow-[0_0_12px_rgba(200,255,61,0.8)] pointer-events-none z-30"
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-surface border-2 border-accent flex items-center justify-center text-accent-text shadow-md">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Bottom telemetry footer */}
            <div className="px-6 py-4 bg-surface-2 border-t border-border flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-muted">
              <div className="flex items-center gap-2">
                <span className="text-accent-text font-bold">✦</span>
                <span>Automated Remediation Engine: React component + CSS variables generated in 1.4s</span>
              </div>
              <a
                href="#analyzer"
                className="text-accent-text hover:underline flex items-center gap-1 font-bold"
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
