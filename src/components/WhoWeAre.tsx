"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cpu, Eye, Code2 } from "lucide-react";
import { CountUp, SectionLabel, Reveal, DURATIONS, EASE_PREMIUM, VIEWPORT } from "@/lib/motion";

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
            <SectionLabel number="02" label="WHO WE ARE" />
            <Reveal delay={0.1}>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white uppercase">
                The Autonomous Eyes of UX.
              </h2>
            </Reveal>
          </div>

          <Reveal delay={0.2}>
            <div className="font-mono text-xs text-zinc-400 max-w-xs">
              TRANSFORMING SUBJECTIVE DESIGN OPINIONS INTO QUANTIFIABLE ENGINE FIXES.
            </div>
          </Reveal>
        </div>

        {/* Big Statement Paragraph */}
        <Reveal delay={0.15}>
          <div className="py-14 sm:py-20 max-w-5xl">
            <p className="text-2xl sm:text-3xl md:text-4xl font-light text-zinc-200 leading-[1.35] tracking-tight">
              Most digital products bleed up to <span className="text-white font-medium">40% of their conversion</span> not
              from server downtime, but from <span className="text-[#c8ff3d] font-normal underline decoration-[#c8ff3d]/40 underline-offset-8">microscopic moments of human friction</span>.
              We built FRICTION to act as an unblinking design partner: an autonomous intelligence layer that audits screens through
              the rigorous science of cognitive psychology, Nielsen heuristics, and WCAG accessibility—delivering instant, engineering-ready fixes.
            </p>
          </div>
        </Reveal>

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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: DURATIONS.base, delay: 0.05, ease: EASE_PREMIUM }}
              className="p-6 rounded-xl border border-white/[0.08] bg-white/[0.015] hover:bg-white/[0.03] hover:border-white/20 transition-colors"
            >
              <div className="font-mono text-xs text-zinc-400 uppercase tracking-wider mb-3">
                [01] SCREENS ANALYZED
              </div>
              <div className="font-mono text-3xl sm:text-4xl lg:text-5xl font-black text-white">
                <CountUp target={42850} suffix="+" duration={2000} />
              </div>
              <p className="mt-2 text-xs text-zinc-400 font-mono">
                Mobile & desktop flows audited across SaaS, fintech, and commerce.
              </p>
            </motion.div>

            {/* Stat 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: DURATIONS.base, delay: 0.12, ease: EASE_PREMIUM }}
              className="p-6 rounded-xl border border-white/[0.08] bg-white/[0.015] hover:bg-white/[0.03] hover:border-white/20 transition-colors"
            >
              <div className="font-mono text-xs text-zinc-400 uppercase tracking-wider mb-3">
                [02] ISSUES ISOLATED
              </div>
              <div className="font-mono text-3xl sm:text-4xl lg:text-5xl font-black text-white">
                <CountUp target={148200} suffix="+" duration={2200} />
              </div>
              <p className="mt-2 text-xs text-zinc-400 font-mono">
                Usability blockers, contrast violations, and cognitive hurdles identified.
              </p>
            </motion.div>

            {/* Stat 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: DURATIONS.base, delay: 0.19, ease: EASE_PREMIUM }}
              className="p-6 rounded-xl border border-white/[0.08] bg-white/[0.015] hover:bg-white/[0.03] hover:border-white/20 transition-colors"
            >
              <div className="font-mono text-xs text-zinc-400 uppercase tracking-wider mb-3">
                [03] AVG. ANALYSIS TIME
              </div>
              <div className="font-mono text-3xl sm:text-4xl lg:text-5xl font-black text-white">
                <CountUp target={1.8} decimals={1} suffix="s" duration={1800} />
              </div>
              <p className="mt-2 text-xs text-zinc-400 font-mono">
                Instant multi-heuristic evaluation with sub-2s turnaround.
              </p>
            </motion.div>

            {/* Stat 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: DURATIONS.base, delay: 0.26, ease: EASE_PREMIUM }}
              className="p-6 rounded-xl border border-white/[0.08] bg-white/[0.015] hover:bg-white/[0.03] hover:border-[#c8ff3d]/50 transition-colors"
            >
              <div className="font-mono text-xs text-[#c8ff3d] uppercase tracking-wider mb-3">
                [04] HEURISTICS COVERED
              </div>
              <div className="font-mono text-3xl sm:text-4xl lg:text-5xl font-black text-white">
                10 <span className="text-[#c8ff3d]">/</span> 10
              </div>
              <p className="mt-2 text-xs text-zinc-400 font-mono">
                Full Nielsen heuristics + WCAG 2.2 AA/AAA accessibility compliance.
              </p>
            </motion.div>
          </div>
        </div>

        {/* 3 Pillars / Methodology Rows */}
        <div className="mt-16 pt-16 border-t border-white/[0.08] grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{
                  duration: DURATIONS.base,
                  delay: 0.1 + idx * 0.08,
                  ease: EASE_PREMIUM,
                }}
                whileHover={{ y: -4 }}
                className="group p-6 rounded-xl border border-white/[0.06] bg-zinc-950/40 hover:border-white/20 transition-all cursor-default"
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
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
