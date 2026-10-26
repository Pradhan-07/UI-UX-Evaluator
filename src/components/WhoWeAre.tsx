"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cpu, Eye, Code2 } from "lucide-react";
import { SectionLabel, Reveal, DURATIONS, EASE_PREMIUM, VIEWPORT } from "@/lib/motion";

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
      className="py-24 sm:py-32 bg-surface/50 border-b border-border relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-border">
          <div>
            <SectionLabel number="02" label="WHO WE ARE" />
            <Reveal delay={0.1}>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-text uppercase">
                The Autonomous Eyes of UX.
              </h2>
            </Reveal>
          </div>

          <Reveal delay={0.2}>
            <div className="font-mono text-xs text-muted max-w-xs">
              TRANSFORMING SUBJECTIVE DESIGN OPINIONS INTO QUANTIFIABLE ENGINE FIXES.
            </div>
          </Reveal>
        </div>

        {/* Big Statement Paragraph */}
        <Reveal delay={0.15}>
          <div className="py-14 sm:py-20 max-w-5xl">
            <p className="text-2xl sm:text-3xl md:text-4xl font-light text-muted leading-[1.35] tracking-tight">
              Most digital products bleed up to <span className="text-text font-medium">40% of their conversion</span> not
              from server downtime, but from <span className="text-accent-text font-normal underline decoration-accent/40 underline-offset-8">microscopic moments of human friction</span>.
              We built FRICTION to act as an unblinking design partner: an autonomous intelligence layer that audits screens through
              the rigorous science of cognitive psychology, Nielsen heuristics, and WCAG accessibility—delivering instant, engineering-ready fixes.
            </p>
          </div>
        </Reveal>

        {/* 3 Pillars / Methodology Rows */}
        <div className="pt-12 border-t border-border grid grid-cols-1 md:grid-cols-3 gap-8">
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
                className="group p-6 rounded-xl border border-border bg-surface hover:border-accent-text/40 transition-all cursor-default"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs text-accent-text">[{pillar.num}]</span>
                  <Icon className="w-5 h-5 text-muted group-hover:text-accent-text transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-text tracking-tight group-hover:text-accent-text transition-colors mb-2">
                  {pillar.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed font-light">
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
