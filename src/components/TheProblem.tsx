"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, AlertCircle, ArrowUpRight, TrendingDown, ShieldAlert, Sparkles } from "lucide-react";
import { playMicroClick } from "@/utils/audio";

interface PainPoint {
  id: string;
  num: string;
  pain: string;
  category: string;
  metric: string;
  metricLabel: string;
  rootCause: string;
  impact: string;
  heuristicRule: string;
  aiDetection: string;
}

export function TheProblem() {
  const [activePain, setActivePain] = useState<string | null>("pain-1");

  const pains: PainPoint[] = [
    {
      id: "pain-1",
      num: "01",
      pain: "Feature works but users can't find it.",
      category: "DISCOVERABILITY & COGNITIVE OVERHEAD",
      metric: "42%",
      metricLabel: "Search Failure Rate",
      rootCause: "Critical features hidden inside nested hamburger menus, unlabelled icon buttons, or low-contrast sub-navigation bars.",
      impact: "Users bombard customer support asking for capabilities that already exist, while new feature adoption languishes under 8%.",
      heuristicRule: "Hick's Law & Nielsen #6: Recognition over Recall",
      aiDetection: "Our engine maps visual fixation zones (saccades) and flags navigation hierarchies deeper than 2 clicks from the main viewport.",
    },
    {
      id: "pain-2",
      num: "02",
      pain: "Signup drop-off at step 3.",
      category: "CONVERSION LEAKAGE & PREMATURE FRICTION",
      metric: "31%",
      metricLabel: "Funnel Abandonment",
      rootCause: "Demanding high-friction phone number SMS verification and multi-factor authentication before delivering any product value.",
      impact: "Paid advertising spend goes down the drain; users bounce to competitor tools with friction-free 1-click social sign-in.",
      heuristicRule: "Nielsen #8: Minimalist Design & Value-to-Friction Ratio",
      aiDetection: "Evaluates cognitive strain per onboarding step and flags excessive mandatory fields prior to first aha-moment.",
    },
    {
      id: "pain-3",
      num: "03",
      pain: "Error messages nobody understands.",
      category: "SYSTEM FEEDBACK & RAGE-CLICKS",
      metric: "58%",
      metricLabel: "Instant Tab Closure",
      rootCause: "Displaying raw database or network exceptions like 'Error 4002: payload validation failed' with zero guidance or self-healing undo option.",
      impact: "Frustrated users perform repeated rage-clicks on frozen buttons, concluding your application is fundamentally broken.",
      heuristicRule: "Nielsen #9: Help Users Recognize, Diagnose, and Recover from Errors",
      aiDetection: "Parses system error copy against our 5,000+ plain-language UX vocabulary dictionary and flags dead-end modals.",
    },
    {
      id: "pain-4",
      num: "04",
      pain: "Accessibility issues found after launch.",
      category: "LEGAL EXPOSURE & INCLUSIVITY LOCKOUT",
      metric: "2.1:1",
      metricLabel: "Illegible Contrast Ratio",
      rootCause: "Ultra-subtle dark-mode gray typography (#666 on #111) and tiny 28px mobile tap targets designed only for high-end desktop monitors.",
      impact: "Complete lockout of elderly, visually-impaired, and mobile users under sunlight, risking ADA lawsuits and European Accessibility Act fines.",
      heuristicRule: "WCAG 2.2 AA (1.4.3 Contrast Minimum & 2.5.5 Target Size)",
      aiDetection: "Performs mathematical luminance ratio calculations across all color layers and bounds every touch target to the 44x44px minimum.",
    },
  ];

  const handleRowClick = (id: string) => {
    playMicroClick();
    setActivePain((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="the-problem"
      className="py-24 sm:py-32 bg-[#08080a] border-b border-white/[0.08] relative overflow-hidden"
    >
      {/* Repeated marquee-style banner header */}
      <div className="w-full overflow-hidden border-b border-white/[0.08] py-3 bg-zinc-950/60 mb-12 sm:mb-16">
        <div className="animate-marquee flex gap-8 whitespace-nowrap font-mono text-xs text-zinc-500 uppercase tracking-widest">
          {Array(6)
            .fill("WHY PRODUCTS LEAK CONVERSION // THE INVISIBLE TAX OF FRICTION")
            .map((item, i) => (
              <span key={i} className="flex items-center gap-6">
                <span>{item}</span>
                <span className="text-[#c8ff3d]">✦</span>
              </span>
            ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm text-zinc-400 mb-4">
              <span className="text-[#c8ff3d] font-bold">[03]</span>
              <span className="tracking-wider uppercase text-zinc-300">THE PROBLEM</span>
              <span className="text-[#c8ff3d] font-bold blink-cursor">_</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white uppercase">
              Microscopic Friction. Compounding Losses.
            </h2>
          </div>

          <div className="font-mono text-xs text-zinc-400 max-w-sm">
            CLICK ANY FRICTION ROW TO INSPECT ROOT CAUSE & AI DETECTION LOGIC.
          </div>
        </div>

        {/* Scrolling / Interactive List of Pains */}
        <div className="mt-8 divide-y divide-white/[0.08]">
          {pains.map((item) => {
            const isOpen = activePain === item.id;
            return (
              <div
                key={item.id}
                className={`transition-colors ${
                  isOpen ? "bg-white/[0.03]" : "hover:bg-white/[0.015]"
                }`}
              >
                {/* Header row */}
                <button
                  onClick={() => handleRowClick(item.id)}
                  className="w-full py-7 px-4 sm:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4 text-left group"
                >
                  <div className="flex items-start sm:items-center gap-4 sm:gap-6">
                    <span className="font-mono text-sm sm:text-base text-[#c8ff3d] font-bold mt-1 sm:mt-0">
                      [{item.num}]
                    </span>
                    <div>
                      <div className="font-mono text-[11px] text-zinc-400 uppercase tracking-widest mb-1">
                        {item.category}
                      </div>
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white group-hover:text-[#c8ff3d] transition-colors">
                        &ldquo;{item.pain}&rdquo;
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 justify-between md:justify-end">
                    <div className="text-right">
                      <div className="font-mono text-xl sm:text-2xl font-black text-rose-400 flex items-center gap-1 justify-end">
                        <TrendingDown className="w-4 h-4 text-rose-400" />
                        <span>{item.metric}</span>
                      </div>
                      <div className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider">
                        {item.metricLabel}
                      </div>
                    </div>

                    <div
                      className={`w-9 h-9 rounded-full border border-white/10 flex items-center justify-center transition-transform ${
                        isOpen ? "rotate-180 bg-[#c8ff3d] text-black border-[#c8ff3d]" : "text-zinc-400 group-hover:text-white group-hover:border-white/30"
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </button>

                {/* Expanded Details Drawer */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-6 pb-8 pt-2">
                        <div className="p-6 rounded-xl border border-white/[0.08] bg-zinc-950/80 grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
                          {/* Col 1: Root Cause */}
                          <div>
                            <div className="text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-bold">
                              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                              <span>ROOT ARCHITECTURAL CAUSE</span>
                            </div>
                            <p className="text-zinc-300 font-sans leading-relaxed text-sm">
                              {item.rootCause}
                            </p>
                          </div>

                          {/* Col 2: Business Impact */}
                          <div>
                            <div className="text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-bold">
                              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                              <span>BUSINESS PENALTY</span>
                            </div>
                            <p className="text-zinc-300 font-sans leading-relaxed text-sm">
                              {item.impact}
                            </p>
                            <div className="mt-3 inline-block px-2 py-1 rounded bg-white/[0.04] border border-white/[0.08] text-[11px] text-[#c8ff3d]">
                              Rule: {item.heuristicRule}
                            </div>
                          </div>

                          {/* Col 3: AI Detection */}
                          <div className="border-t md:border-t-0 md:border-l border-white/[0.08] md:pl-6">
                            <div className="text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-bold">
                              <Sparkles className="w-3.5 h-3.5 text-[#c8ff3d]" />
                              <span>HOW FRICTION DETECTS THIS</span>
                            </div>
                            <p className="text-zinc-300 font-sans leading-relaxed text-sm">
                              {item.aiDetection}
                            </p>
                            <a
                              href="#analyzer"
                              onClick={() => playMicroClick(1000)}
                              className="mt-4 inline-flex items-center gap-1 text-[#c8ff3d] hover:underline font-semibold"
                            >
                              <span>Test your screens now</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
