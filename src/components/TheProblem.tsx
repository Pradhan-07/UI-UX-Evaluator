"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  MotionValue,
  AnimatePresence,
} from "framer-motion";
import {
  ChevronDown,
  AlertCircle,
  ArrowUpRight,
  TrendingDown,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { playMicroClick } from "@/utils/audio";
import { SectionLabel, Reveal } from "@/lib/motion";

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

const pains: PainPoint[] = [
  {
    id: "pain-1",
    num: "01",
    pain: "Feature works but users can't find it.",
    category: "DISCOVERABILITY & COGNITIVE OVERHEAD",
    metric: "42%",
    metricLabel: "Search Failure Rate",
    rootCause:
      "Critical features hidden inside nested hamburger menus, unlabelled icon buttons, or low-contrast sub-navigation bars.",
    impact:
      "Users bombard customer support asking for capabilities that already exist, while new feature adoption languishes under 8%.",
    heuristicRule: "Hick's Law & Nielsen #6: Recognition over Recall",
    aiDetection:
      "Our engine maps visual fixation zones (saccades) and flags navigation hierarchies deeper than 2 clicks from the main viewport.",
  },
  {
    id: "pain-2",
    num: "02",
    pain: "Signup drop-off at step 3.",
    category: "CONVERSION LEAKAGE & PREMATURE FRICTION",
    metric: "31%",
    metricLabel: "Funnel Abandonment",
    rootCause:
      "Demanding high-friction phone number SMS verification and multi-factor authentication before delivering any product value.",
    impact:
      "Paid advertising spend goes down the drain; users bounce to competitor tools with friction-free 1-click social sign-in.",
    heuristicRule: "Nielsen #8: Minimalist Design & Value-to-Friction Ratio",
    aiDetection:
      "Evaluates cognitive strain per onboarding step and flags excessive mandatory fields prior to first aha-moment.",
  },
  {
    id: "pain-3",
    num: "03",
    pain: "Error messages nobody understands.",
    category: "SYSTEM FEEDBACK & RAGE-CLICKS",
    metric: "58%",
    metricLabel: "Instant Tab Closure",
    rootCause:
      "Displaying raw database or network exceptions like 'Error 4002: payload validation failed' with zero guidance or self-healing undo option.",
    impact:
      "Frustrated users perform repeated rage-clicks on frozen buttons, concluding your application is fundamentally broken.",
    heuristicRule: "Nielsen #9: Help Users Recognize, Diagnose, and Recover from Errors",
    aiDetection:
      "Parses system error copy against our 5,000+ plain-language UX vocabulary dictionary and flags dead-end modals.",
  },
  {
    id: "pain-4",
    num: "04",
    pain: "Accessibility issues found after launch.",
    category: "LEGAL EXPOSURE & INCLUSIVITY LOCKOUT",
    metric: "2.1:1",
    metricLabel: "Illegible Contrast Ratio",
    rootCause:
      "Ultra-subtle dark-mode gray typography (#666 on #111) and tiny 28px mobile tap targets designed only for high-end desktop monitors.",
    impact:
      "Complete lockout of elderly, visually-impaired, and mobile users under sunlight, risking ADA lawsuits and European Accessibility Act fines.",
    heuristicRule: "WCAG 2.2 AA (1.4.3 Contrast Minimum & 2.5.5 Target Size)",
    aiDetection:
      "Performs mathematical luminance ratio calculations across all color layers and bounds every touch target to the 44x44px minimum.",
  },
];

function ScrollWord({
  word,
  progress,
  range,
  prefersReduced,
}: {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
  prefersReduced: boolean;
}) {
  const opacity = useTransform(progress, range, [0.28, 1]);

  if (prefersReduced) {
    return <span className="inline-block mr-[0.26em] text-text">{word}</span>;
  }

  return (
    <motion.span
      style={{ opacity }}
      className="inline-block mr-[0.26em] text-text transition-opacity will-change-[opacity]"
    >
      {word}
    </motion.span>
  );
}

function StatementRow({
  item,
  index,
  total,
  progress,
  prefersReduced,
  isSelected,
  onSelect,
}: {
  item: PainPoint;
  index: number;
  total: number;
  progress: MotionValue<number>;
  prefersReduced: boolean;
  isSelected: boolean;
  onSelect: () => void;
}) {
  // Segment range for this item in the scroll progress
  const segmentSize = 0.85 / total;
  const segStart = 0.05 + index * segmentSize;
  const segEnd = segStart + segmentSize * 0.8;
  const underlineTrigger = segEnd;

  // Underline draws left->right when the line completes
  const scaleX = useTransform(
    progress,
    [underlineTrigger - 0.02, underlineTrigger + 0.03],
    [0, 1],
    { clamp: true }
  );

  const words = item.pain.split(" ");
  const wordStep = (segEnd - segStart) / words.length;

  return (
    <div
      onClick={onSelect}
      className={`relative py-5 sm:py-7 px-4 sm:px-6 rounded-xl border transition-all cursor-pointer ${
        isSelected
          ? "border-accent-text/40 bg-surface shadow-md"
          : "border-border/60 bg-surface/50 hover:border-border hover:bg-surface"
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-3 sm:gap-4">
        <div className="flex items-baseline gap-3 sm:gap-4">
          <span className="font-mono text-sm sm:text-base text-accent-text font-bold">
            [{item.num}]
          </span>
          <div>
            <div className="font-mono text-[10px] sm:text-[11px] text-muted uppercase tracking-widest mb-1.5 font-medium">
              {item.category}
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight select-none text-text">
              &ldquo;
              {words.map((w, wIdx) => {
                const wStart = segStart + wIdx * wordStep;
                const wEnd = wStart + wordStep;
                return (
                  <ScrollWord
                    key={wIdx}
                    word={w}
                    progress={progress}
                    range={[wStart, wEnd]}
                    prefersReduced={prefersReduced}
                  />
                );
              })}
              &rdquo;
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 self-end md:self-auto shrink-0">
          <div className="text-right">
            <div className="font-mono text-lg sm:text-xl font-black text-rose-500 flex items-center gap-1 justify-end">
              <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
              <span>{item.metric}</span>
            </div>
            <div className="font-mono text-[10px] text-muted uppercase tracking-wider">
              {item.metricLabel}
            </div>
          </div>
          <div
            className={`w-7 h-7 rounded-full border border-border flex items-center justify-center transition-transform ${
              isSelected ? "rotate-180 bg-accent text-accent-ink border-accent" : "bg-surface-2 text-muted"
            }`}
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Finished line lime underline draw */}
      {prefersReduced ? (
        <div className="h-[2px] bg-accent mt-3 rounded-full" />
      ) : (
        <motion.div
          style={{ scaleX, transformOrigin: "left" }}
          className="h-[2px] bg-accent mt-3 rounded-full"
        />
      )}
    </div>
  );
}

export function TheProblem() {
  const [activePain, setActivePain] = useState<string>("pain-1");
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Track scroll progress to auto-update active card if not user-clicked
  useEffect(() => {
    if (prefersReduced) return;
    const unsubscribe = scrollYProgress.on("change", (val) => {
      const idx = Math.min(Math.floor(val * pains.length), pains.length - 1);
      if (pains[idx] && val > 0.05) {
        setActivePain(pains[idx].id);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, prefersReduced]);

  const activeItem = pains.find((p) => p.id === activePain) || pains[0];

  const handleSelect = (id: string) => {
    playMicroClick();
    setActivePain(id);
  };

  return (
    <section
      id="the-problem"
      className="bg-bg border-b border-border relative"
    >
      {/* Repeated marquee-style banner header */}
      <div className="w-full overflow-hidden border-b border-border py-3 bg-surface-2/60">
        <div className="animate-marquee flex gap-8 whitespace-nowrap font-mono text-xs text-muted uppercase tracking-widest">
          {Array(6)
            .fill("WHY PRODUCTS LEAK CONVERSION // THE INVISIBLE TAX OF FRICTION")
            .map((item, i) => (
              <span key={i} className="flex items-center gap-6">
                <span>{item}</span>
                <span className="text-accent-text">✦</span>
              </span>
            ))}
        </div>
      </div>

      {/* Main Sticky Pin Container */}
      <div
        ref={containerRef}
        className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${
          prefersReduced ? "py-24" : "h-[220vh] sm:h-[240vh]"
        }`}
      >
        <div
          className={`${
            prefersReduced ? "relative" : "sticky top-20 sm:top-24 pt-8 pb-12"
          }`}
        >
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border mb-8">
            <div>
              <SectionLabel number="03" label="THE PROBLEM" />
              <Reveal delay={0.1}>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-text uppercase">
                  Microscopic Friction. Compounding Losses.
                </h2>
              </Reveal>
            </div>

            <Reveal delay={0.15}>
              <div className="font-mono text-xs text-muted max-w-sm">
                SCROLL TO ADVANCE // CLICK ANY ROW TO INSPECT ROOT CAUSE & TELEMETRY.
              </div>
            </Reveal>
          </div>

          {/* Interactive Pinned Statements and Synchronized Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Col: 4 Pain statements */}
            <div className="lg:col-span-7 flex flex-col gap-3">
              {pains.map((item, idx) => (
                <StatementRow
                  key={item.id}
                  item={item}
                  index={idx}
                  total={pains.length}
                  progress={scrollYProgress}
                  prefersReduced={!!prefersReduced}
                  isSelected={activePain === item.id}
                  onSelect={() => handleSelect(item.id)}
                />
              ))}
            </div>

            {/* Right Col: Active Pain Root Cause Inspector */}
            <div className="lg:col-span-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeItem.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="p-6 sm:p-7 rounded-xl border border-border bg-surface shadow-xl space-y-6"
                >
                  <div className="flex items-center justify-between pb-4 border-b border-border">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-accent-text font-bold">
                        [{activeItem.num}]
                      </span>
                      <span className="font-mono text-xs text-text uppercase tracking-wider font-semibold">
                        DEEP ANALYSIS
                      </span>
                    </div>
                    <span className="font-mono text-xs text-rose-500 bg-rose-500/10 px-2.5 py-1 rounded border border-rose-500/20 font-bold">
                      {activeItem.metric} {activeItem.metricLabel}
                    </span>
                  </div>

                  {/* Root Cause */}
                  <div>
                    <div className="text-muted font-mono text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5 font-bold">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                      <span>ROOT ARCHITECTURAL CAUSE</span>
                    </div>
                    <p className="text-text/90 font-sans text-sm leading-relaxed">
                      {activeItem.rootCause}
                    </p>
                  </div>

                  {/* Business Impact */}
                  <div>
                    <div className="text-muted font-mono text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5 font-bold">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                      <span>BUSINESS PENALTY</span>
                    </div>
                    <p className="text-text/90 font-sans text-sm leading-relaxed">
                      {activeItem.impact}
                    </p>
                    <div className="mt-3 inline-block px-2.5 py-1 rounded bg-accent/10 border border-accent/30 text-xs font-mono text-accent-text font-bold">
                      Rule: {activeItem.heuristicRule}
                    </div>
                  </div>

                  {/* AI Detection */}
                  <div className="pt-4 border-t border-border">
                    <div className="text-muted font-mono text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5 font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-accent-text" />
                      <span>HOW FRICTION DETECTS THIS</span>
                    </div>
                    <p className="text-text/90 font-sans text-sm leading-relaxed">
                      {activeItem.aiDetection}
                    </p>
                    <a
                      href="#analyzer"
                      onClick={() => playMicroClick(1000)}
                      className="mt-4 inline-flex items-center gap-1 text-accent-text hover:underline font-semibold font-mono text-xs"
                    >
                      <span>Audit your screens for this rule</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
