"use client";

import React, { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useReducedMotion,
  MotionValue,
} from "framer-motion";
import {
  Eye,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  Layers,
  Sparkles,
  Cpu,
  Terminal,
  FileCode2,
} from "lucide-react";
import { playMicroClick } from "@/utils/audio";
import {
  SectionLabel,
  Reveal,
  DURATIONS,
  EASE_PREMIUM,
  VIEWPORT,
} from "@/lib/motion";

interface CheckCategory {
  num: string;
  title: string;
  summary: string;
  heuristics: string[];
  metrics: string;
}

const checkCategories: CheckCategory[] = [
  {
    num: "01",
    title: "Visual Saliency & Cognitive Attention",
    summary:
      "Predicts biological eye saccades, fixation order, and visual hierarchy weight to ensure critical actions are recognized in under 50ms.",
    heuristics: [
      "F-pattern scanning conformity",
      "Clutter index & negative space ratio",
      "Information density vs. cognitive capacity",
      "Hero CTA prominence & isolation",
    ],
    metrics: "Sub-50ms visual pop-out",
  },
  {
    num: "02",
    title: "Nielsen Norman Core Usability Heuristics",
    summary:
      "Evaluates interface components against Jakob Nielsen's 10 foundational human-computer interaction heuristics.",
    heuristics: [
      "Visibility of system status (#1)",
      "Match between system and real world (#2)",
      "User control and freedom & safe undo (#3)",
      "Recognition over recall (#6)",
      "Error diagnosis & constructive recovery (#9)",
    ],
    metrics: "10 / 10 Heuristics covered",
  },
  {
    num: "03",
    title: "WCAG 2.2 AA / AAA Accessibility",
    summary:
      "Rigorous mathematical checks for luminance contrast, minimum interactive dimensions, and inclusive interaction patterns.",
    heuristics: [
      "4.5:1 text luminance contrast minimum (WCAG 1.4.3)",
      "44x44px physical tap target minimum (WCAG 2.5.5)",
      "Non-color dependent status indicators",
      "Keyboard tab-order & focus indicator visibility",
    ],
    metrics: "Full WCAG 2.2 AAA validation",
  },
  {
    num: "04",
    title: "Fitts's Law Ergonomics & Thumb Reach",
    summary:
      "Simulates physical mobile thumb reach zones for one-handed operation across both left- and right-handed ergonomic models.",
    heuristics: [
      "Natural thumb sweep arc placement",
      "Dangerous destructive actions positioned in hard-to-reach zones",
      "Bottom-sheet navigation ergonomic reachability",
      "Corner cluster tap interference prevention",
    ],
    metrics: "94% thumb zone comfort rate",
  },
  {
    num: "05",
    title: "Micro-Copy & Plain-Language Clarity",
    summary:
      "Audits all form instructions, button text, error messages, and modal feedback against our 5,000+ plain-language UX vocabulary.",
    heuristics: [
      "Zero cryptic error codes shown to end users",
      "Action-oriented button verbs ('Save and Continue' vs 'Submit')",
      "Contextual inline input validation timing",
      "Reassuring transactional security cues",
    ],
    metrics: "100% human-readable messaging",
  },
];

interface StepItem {
  num: string;
  title: string;
  category: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
}

const pipelineSteps: StepItem[] = [
  {
    num: "01",
    title: "Multimodal Screen Ingestion",
    category: "INGESTION PHASE",
    desc: "Upload 1–5 mobile or desktop screenshots, or describe an end-to-end user conversion funnel. The pipeline packages visual assets and context metadata.",
    icon: Layers,
    tag: "PNG / JPG / WEBP",
  },
  {
    num: "02",
    title: "Gemini 3 Vision Cognitive Audit",
    category: "INTELLIGENCE ENGINE",
    desc: "Gemini 3 Flash multimodal vision evaluates visual hierarchy, biological saccades, and cross-references all 14 heuristic matrix standards.",
    icon: Cpu,
    tag: "GEMINI 3 FLASH VISION",
  },
  {
    num: "03",
    title: "Quantitative Friction Scoring",
    category: "EVALUATION MATRIX",
    desc: "Aggregates usability health score (0–100), isolates precise x/y bounding coordinates for visual pins, and computes potential CRO revenue recovery.",
    icon: Terminal,
    tag: "CRO-V2 ALGORITHM",
  },
  {
    num: "04",
    title: "Engineering Remediation Patches",
    category: "DELIVERY & FIXES",
    desc: "Generates production-ready React JSX diffs, Tailwind utility classes, and an exportable JSON audit payload ready for sprint ticket backlogs.",
    icon: FileCode2,
    tag: "REACT + TAILWIND DIFFS",
  },
];

function StepDot({
  progress,
  threshold,
  prefersReduced,
}: {
  progress: MotionValue<number>;
  threshold: number;
  prefersReduced: boolean;
}) {
  const isLit = useTransform(progress, (v) => v >= threshold);
  const [lit, setLit] = useState(false);

  React.useEffect(() => {
    if (prefersReduced) {
      setLit(true);
      return;
    }
    const unsub = isLit.on("change", (latest) => setLit(latest));
    return () => unsub();
  }, [isLit, prefersReduced]);

  return (
    <div className="relative flex items-center justify-center">
      <div
        className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
          lit
            ? "border-[#c8ff3d] bg-[#c8ff3d] shadow-[0_0_14px_#c8ff3d]"
            : "border-zinc-700 bg-zinc-900"
        }`}
      />
      {lit && (
        <div className="absolute w-7 h-7 rounded-full bg-[#c8ff3d]/20 animate-ping pointer-events-none" />
      )}
    </div>
  );
}

export function WhatWeCheckAndHowItWorks() {
  const [openRow, setOpenRow] = useState<string | null>("01");
  const prefersReduced = useReducedMotion();
  const pipelineRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: pipelineRef,
    offset: ["start 75%", "end 55%"],
  });

  const toggleRow = (num: string) => {
    playMicroClick();
    setOpenRow((prev) => (prev === num ? null : num));
  };

  return (
    <div className="bg-[#08080a] border-b border-white/[0.08]">
      {/* ========================================================================= */}
      {/* FRAME 8: WHAT WE CHECK */}
      {/* ========================================================================= */}
      <section
        id="what-we-check"
        className="py-24 sm:py-32 border-b border-white/[0.08] relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-white/[0.08]">
            <div>
              <SectionLabel number="05B" label="WHAT WE CHECK // AUDIT SCOPE" />
              <Reveal delay={0.1}>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white uppercase">
                  Comprehensive UX Audit Coverage.
                </h2>
              </Reveal>
            </div>

            <Reveal delay={0.15}>
              <div className="font-mono text-xs text-zinc-400 max-w-sm">
                5 SPECIALIZED INSPECTION LAYERS AUDITED CONCURRENTLY ON EVERY FLOW.
              </div>
            </Reveal>
          </div>

          {/* Expanding Rows with Sliding Numbers and Left-to-Right Drawing Borders */}
          <div className="mt-8 divide-y-0">
            {checkCategories.map((cat, idx) => {
              const isOpen = openRow === cat.num;
              return (
                <div key={cat.num} className="group relative">
                  {/* Top 1px border that draws left to right on scroll */}
                  <motion.div
                    initial={prefersReduced ? false : { scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={VIEWPORT}
                    transition={{
                      duration: 0.6,
                      delay: idx * 0.08,
                      ease: EASE_PREMIUM,
                    }}
                    style={{ transformOrigin: "left" }}
                    className="h-[1px] bg-white/[0.08] w-full"
                  />

                  {/* Row Header Button */}
                  <button
                    onClick={() => toggleRow(cat.num)}
                    className="w-full py-6 sm:py-7 flex flex-col md:flex-row md:items-center justify-between gap-4 text-left cursor-pointer transition-colors hover:bg-white/[0.015] px-3 sm:px-4 rounded-lg"
                  >
                    <div className="flex items-start sm:items-center gap-4 sm:gap-6">
                      {/* Sliding row number */}
                      <span className="font-mono text-sm sm:text-base text-[#c8ff3d] font-bold transition-transform duration-300 group-hover:translate-x-2">
                        [{cat.num}]
                      </span>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-[#c8ff3d] transition-colors">
                          {cat.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-zinc-400 font-sans mt-0.5 line-clamp-1">
                          {cat.summary}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-end md:self-auto shrink-0">
                      <span className="font-mono text-xs text-zinc-400 px-2.5 py-1 rounded bg-white/[0.03] border border-white/[0.08]">
                        {cat.metrics}
                      </span>
                      <div
                        className={`w-7 h-7 rounded-full border border-white/10 flex items-center justify-center transition-transform duration-300 ${
                          isOpen
                            ? "rotate-180 bg-[#c8ff3d] text-black border-[#c8ff3d]"
                            : "text-zinc-400 group-hover:text-white"
                        }`}
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </button>

                  {/* Smooth Height Expansion Drawer */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: EASE_PREMIUM }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-7 pt-1 sm:pl-16">
                          <div className="p-6 rounded-xl border border-white/[0.08] bg-zinc-950/70 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <div className="font-mono text-xs text-[#c8ff3d] uppercase tracking-wider mb-2 font-bold flex items-center gap-1.5">
                                <ShieldCheck className="w-3.5 h-3.5 text-[#c8ff3d]" />
                                <span>CRITICAL HEURISTICS VALIDATED</span>
                              </div>
                              <ul className="space-y-2 mt-3 font-mono text-xs text-zinc-300">
                                {cat.heuristics.map((h, hIdx) => (
                                  <li key={hIdx} className="flex items-start gap-2">
                                    <span className="text-[#c8ff3d] font-bold">✦</span>
                                    <span>{h}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="border-t md:border-t-0 md:border-l border-white/[0.08] md:pl-6 flex flex-col justify-between">
                              <div>
                                <div className="font-mono text-xs text-zinc-400 uppercase tracking-wider mb-2 font-bold">
                                  WHY THIS BLOCKS CONVERSIONS
                                </div>
                                <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
                                  {cat.summary}
                                </p>
                              </div>
                              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between font-mono text-[11px] text-zinc-500">
                                <span>TELEMETRY: AUTOMATED</span>
                                <span className="text-[#c8ff3d]">{cat.metrics}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            {/* Bottom terminating 1px line */}
            <motion.div
              initial={prefersReduced ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.6, delay: 0.45, ease: EASE_PREMIUM }}
              style={{ transformOrigin: "left" }}
              className="h-[1px] bg-white/[0.08] w-full"
            />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FRAME 9: HOW IT WORKS */}
      {/* ========================================================================= */}
      <section
        id="how-it-works"
        ref={pipelineRef}
        className="py-24 sm:py-32 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/[0.08] mb-16">
            <div>
              <SectionLabel number="05C" label="HOW IT WORKS // PIPELINE" />
              <Reveal delay={0.1}>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white uppercase">
                  From Prototype to Engineering Diff.
                </h2>
              </Reveal>
            </div>

            <Reveal delay={0.15}>
              <div className="font-mono text-xs text-zinc-400 max-w-sm">
                4-STAGE AUTONOMOUS PROCESSING PIPELINE WITH SUB-2 SECOND TURNAROUND.
              </div>
            </Reveal>
          </div>

          {/* Pipeline Cards with Central SVG Connecting Line */}
          <div className="relative">
            {/* Center Vertical SVG Path that draws linked to scroll progress */}
            <div className="hidden lg:block absolute left-1/2 top-8 bottom-8 -translate-x-1/2 w-8 pointer-events-none z-10">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 32 800">
                {/* Background track line */}
                <line
                  x1="16"
                  y1="0"
                  x2="16"
                  y2="800"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                {/* Foreground animated lime line */}
                <motion.line
                  x1="16"
                  y1="0"
                  x2="16"
                  y2="800"
                  stroke="#c8ff3d"
                  strokeWidth="2"
                  style={
                    prefersReduced
                      ? { pathLength: 1 }
                      : { pathLength: scrollYProgress }
                  }
                />
              </svg>
            </div>

            {/* Alternating Step Cards */}
            <div className="space-y-12 sm:space-y-16">
              {pipelineSteps.map((step, idx) => {
                const Icon = step.icon;
                const isEven = idx % 2 === 0;
                const dotThreshold = (idx + 1) / (pipelineSteps.length + 0.5);

                return (
                  <div
                    key={step.num}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative"
                  >
                    {/* Left Card or Spacer */}
                    <div
                      className={`lg:col-span-5 ${
                        isEven ? "lg:order-1" : "lg:order-3"
                      }`}
                    >
                      <motion.div
                        initial={
                          prefersReduced
                            ? { opacity: 0 }
                            : {
                                opacity: 0,
                                x: isEven ? -30 : 30,
                                y: 20,
                              }
                        }
                        whileInView={{ opacity: 1, x: 0, y: 0 }}
                        viewport={VIEWPORT}
                        transition={{
                          duration: DURATIONS.base,
                          delay: 0.1,
                          ease: EASE_PREMIUM,
                        }}
                        className="p-7 rounded-2xl border border-white/[0.08] bg-zinc-950/70 hover:border-white/20 transition-all group"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-mono text-xs text-[#c8ff3d] font-bold">
                            [{step.num}] {step.category}
                          </span>
                          <span className="font-mono text-[10px] text-zinc-500 bg-white/[0.03] px-2 py-0.5 rounded border border-white/[0.06]">
                            {step.tag}
                          </span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight group-hover:text-[#c8ff3d] transition-colors mb-2">
                          {step.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed">
                          {step.desc}
                        </p>
                      </motion.div>
                    </div>

                    {/* Center Step Dot on desktop */}
                    <div className="hidden lg:flex lg:col-span-2 lg:order-2 justify-center">
                      <StepDot
                        progress={scrollYProgress}
                        threshold={dotThreshold}
                        prefersReduced={!!prefersReduced}
                      />
                    </div>

                    {/* Opposite Spacer on desktop */}
                    <div
                      className={`hidden lg:block lg:col-span-5 ${
                        isEven ? "lg:order-3" : "lg:order-1"
                      }`}
                    >
                      <div className="flex items-center justify-center p-6 text-zinc-700 font-mono text-xs opacity-40">
                        <Icon className="w-8 h-8 stroke-[1.2]" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
