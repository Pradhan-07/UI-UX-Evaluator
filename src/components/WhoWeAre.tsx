"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Sparkles, Cpu, Eye, Code2, ArrowUpRight } from "lucide-react";

function CountUpStat({
  target,
  suffix = "",
  decimals = 0,
  duration = 2000,
}: {
  target: number;
  suffix?: string;
  decimals?: number;
  duration?: number;
}) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const startVal = 0;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(startVal + (target - startVal) * eased);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [isInView, target, duration]);

  return (
    <div ref={ref} className="font-mono text-3xl sm:text-4xl lg:text-5xl font-black text-white">
      {decimals > 0 ? val.toFixed(decimals) : Math.round(val).toLocaleString()}
      <span className="text-[#c8ff3d] ml-1">{suffix}</span>
    </div>
  );
}

export function WhoWeAre() {
  const pillars = [
    {
      num: "01",
      icon: Eye,
      title: "Visual Cognitive Saccades",
      desc: "Simulates biological eye-tracking and visual saliency patterns to predict where users get stuck, confused, or ignore crucial calls to action.",
    },
    {
      num: "02",
      icon: Cpu,
      title: "Nielsen & Fitts Synthesis",
      desc: "Evaluates layout against Nielsen Norman’s 10 core heuristics, Fitts's thumb reach models, and WCAG 2.2 accessibility contrast standards.",
    },
    {
      num: "03",
      icon: Code2,
      title: "Executable Code Remediations",
      desc: "Translates abstract design criticisms into copy-paste React components, Tailwind utility classes, and actionable engineering diffs.",
    },
  ];

  return (
    <section
      id="who-we-are"
      className="py-24 sm:py-32 bg-[#08080a] border-b border-white/[0.08] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm text-zinc-400 mb-4">
              <span className="text-[#c8ff3d] font-bold">[02]</span>
              <span className="tracking-wider uppercase text-zinc-300">WHO WE ARE</span>
              <span className="text-[#c8ff3d] font-bold blink-cursor">_</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white uppercase">
              The Autonomous Eyes of UX.
            </h2>
          </div>

          <div className="font-mono text-xs text-zinc-400 max-w-xs">
            TRANSFORMING SUBJECTIVE DESIGN OPINIONS INTO QUANTIFIABLE ENGINE FIXES.
          </div>
        </div>

        {/* Big Statement Paragraph */}
        <div className="py-14 sm:py-20 max-w-5xl">
          <p className="text-2xl sm:text-3xl md:text-4xl font-light text-zinc-200 leading-[1.35] tracking-tight">
            Most digital products bleed up to <span className="text-white font-medium">40% of their conversion</span> not
            from server downtime, but from <span className="text-[#c8ff3d] font-normal underline decoration-[#c8ff3d]/40 underline-offset-8">microscopic moments of human friction</span>.
            We built FRICTION to act as an unblinking design partner: an autonomous intelligence layer that audits screens through
            the rigorous science of cognitive psychology, Nielsen heuristics, and WCAG accessibility—delivering instant, engineering-ready fixes.
          </p>
        </div>

        {/* 4 Stat Counters */}
        <div className="pt-8 border-t border-white/[0.08]">
          <div className="flex items-center justify-between mb-8">
            <span className="font-mono text-xs text-[#c8ff3d] tracking-widest uppercase">
              [BENCHMARK TELEMETRY // DEMO DATA]
            </span>
            <span className="font-mono text-xs text-zinc-400">
              *AGGREGATED ACROSS 1,200+ REPOSITORIES
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stat 1 */}
            <div className="p-6 rounded-xl border border-white/[0.08] bg-white/[0.015] hover:bg-white/[0.03] hover:border-white/20 transition-all">
              <div className="font-mono text-xs text-zinc-400 uppercase tracking-wider mb-3">
                [01] SCREENS ANALYZED
              </div>
              <CountUpStat target={42850} suffix="+" duration={2200} />
              <p className="mt-2 text-xs text-zinc-400 font-mono">
                Mobile & desktop flows audited across SaaS, fintech, and commerce.
              </p>
            </div>

            {/* Stat 2 */}
            <div className="p-6 rounded-xl border border-white/[0.08] bg-white/[0.015] hover:bg-white/[0.03] hover:border-white/20 transition-all">
              <div className="font-mono text-xs text-zinc-400 uppercase tracking-wider mb-3">
                [02] ISSUES ISOLATED
              </div>
              <CountUpStat target={148200} suffix="+" duration={2500} />
              <p className="mt-2 text-xs text-zinc-400 font-mono">
                Usability blockers, contrast violations, and cognitive hurdles identified.
              </p>
            </div>

            {/* Stat 3 */}
            <div className="p-6 rounded-xl border border-white/[0.08] bg-white/[0.015] hover:bg-white/[0.03] hover:border-white/20 transition-all">
              <div className="font-mono text-xs text-zinc-400 uppercase tracking-wider mb-3">
                [03] AVG. ANALYSIS TIME
              </div>
              <CountUpStat target={1.8} decimals={1} suffix="s" duration={1800} />
              <p className="mt-2 text-xs text-zinc-400 font-mono">
                Instant multi-heuristic evaluation with sub-2s turnaround.
              </p>
            </div>

            {/* Stat 4 */}
            <div className="p-6 rounded-xl border border-white/[0.08] bg-white/[0.015] hover:bg-white/[0.03] hover:border-[#c8ff3d]/50 transition-all">
              <div className="font-mono text-xs text-[#c8ff3d] uppercase tracking-wider mb-3">
                [04] HEURISTICS COVERED
              </div>
              <div className="font-mono text-3xl sm:text-4xl lg:text-5xl font-black text-white">
                10 <span className="text-[#c8ff3d]">/</span> 10
              </div>
              <p className="mt-2 text-xs text-zinc-400 font-mono">
                Full Nielsen heuristics + WCAG 2.2 AA/AAA accessibility compliance.
              </p>
            </div>
          </div>
        </div>

        {/* 3 Pillars / Methodology Rows */}
        <div className="mt-16 pt-16 border-t border-white/[0.08] grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.num}
                className="group p-6 rounded-xl border border-white/[0.06] bg-zinc-950/40 hover:border-white/20 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs text-[#c8ff3d]">[{pillar.num}]</span>
                  <Icon className="w-5 h-5 text-zinc-400 group-hover:text-[#c8ff3d] transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-zinc-100 mb-2">
                  {pillar.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed font-light">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
