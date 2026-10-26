"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, useSpring, useReducedMotion } from "framer-motion";
import { TrendingDown, AlertTriangle } from "lucide-react";
import { playMicroClick } from "@/utils/audio";
import { SectionLabel, Magnetic, Reveal } from "@/lib/motion";

function TweenNumber({
  value,
  prefix = "",
  suffix = "",
  className = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const prefersReduced = useReducedMotion();
  const spring = useSpring(value, { stiffness: 100, damping: 20 });
  const [displayVal, setDisplayVal] = useState(value);

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  useEffect(() => {
    if (prefersReduced) {
      setDisplayVal(value);
      return;
    }
    const unsubscribe = spring.on("change", (latest) => {
      setDisplayVal(Math.round(latest));
    });
    return () => unsubscribe();
  }, [spring, value, prefersReduced]);

  return (
    <span className={className}>
      {prefix}
      {displayVal.toLocaleString()}
      {suffix}
    </span>
  );
}

interface SliderRowProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  displayValue: string;
  unit: string;
  minLabel: string;
  midLabel: string;
  maxLabel: string;
  onChange: (val: number) => void;
  accentColor?: string;
}

function SliderRow({
  label,
  min,
  max,
  step,
  value,
  displayValue,
  unit,
  minLabel,
  midLabel,
  maxLabel,
  onChange,
  accentColor = "#c8ff3d",
}: SliderRowProps) {
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  return (
    <div>
      <div className="flex items-center justify-between mb-2 font-mono">
        <span className="text-xs text-muted uppercase tracking-wider font-medium">{label}</span>
        <span className="text-base font-bold text-text">
          {displayValue} <span className="text-muted text-xs">{unit}</span>
        </span>
      </div>

      {/* Custom styled slider with animated fill track */}
      <div className="relative w-full h-2 bg-surface-2 border border-border rounded-full overflow-hidden flex items-center">
        <motion.div
          className="absolute left-0 top-0 bottom-0 rounded-full"
          style={{ backgroundColor: accentColor }}
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 350, damping: 35 }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
      </div>

      <div className="flex justify-between text-[11px] font-mono text-muted mt-1.5">
        <span>{minLabel}</span>
        <span>{midLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}

export function UxCostCalculator() {
  const [visitors, setVisitors] = useState<number>(150000);
  const [conversionRate, setConversionRate] = useState<number>(2.4);
  const [aov, setAov] = useState<number>(120);
  const [dropoff, setDropoff] = useState<number>(22);
  const prefersReduced = useReducedMotion();

  // Quick Preset Configurations
  const presets = [
    { name: "Early Stage SaaS", visitors: 30000, cr: 1.8, aov: 65, dropoff: 28 },
    { name: "Growth Scaleup", visitors: 150000, cr: 2.4, aov: 120, dropoff: 22 },
    { name: "High-Volume Commerce", visitors: 650000, cr: 3.2, aov: 85, dropoff: 18 },
  ];

  const applyPreset = (p: (typeof presets)[0]) => {
    playMicroClick(1050);
    setVisitors(p.visitors);
    setConversionRate(p.cr);
    setAov(p.aov);
    setDropoff(p.dropoff);
  };

  // Institutional CRO Formula
  const calculation = useMemo(() => {
    const currentOrders = Math.round(visitors * (conversionRate / 100));
    const currentRevenue = currentOrders * aov;

    // Friction represents percentage of potential buyers lost to usability issues
    const potentialOrders = Math.round(currentOrders / (1 - dropoff / 100));
    const lostOrders = Math.max(0, potentialOrders - currentOrders);
    const monthlyLostRevenue = lostOrders * aov;
    const annualLostRevenue = monthlyLostRevenue * 12;

    // Conservative 30-day recoverable revenue with top-3 fixes (60% capture)
    const recoverableRevenue = Math.round(monthlyLostRevenue * 0.6);

    return {
      currentRevenue,
      lostOrders,
      monthlyLostRevenue,
      annualLostRevenue,
      recoverableRevenue,
    };
  }, [visitors, conversionRate, aov, dropoff]);

  // High loss threshold triggers red pulse
  const isHighLoss = calculation.monthlyLostRevenue >= 100000 || dropoff >= 25;

  const scrollToAnalyzer = () => {
    playMicroClick(1200);
    const element = document.getElementById("analyzer");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="calculator"
      className="py-24 sm:py-32 bg-surface/40 border-b border-border relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-border">
          <div>
            <SectionLabel number="04" label="UX COST CALCULATOR" />
            <Reveal delay={0.1}>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-text uppercase">
                Quantify Your Friction Tax.
              </h2>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <div className="font-mono text-xs text-muted max-w-sm">
              EVERY CONFUSING FORM FIELD AND UNREADABLE ERROR MESSAGE HAS A PRECISE DOLLAR VALUE.
            </div>
          </Reveal>
        </div>

        {/* Quick Presets Bar */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <span className="font-mono text-xs text-muted uppercase tracking-wider mr-2 font-medium">
            LOAD INDUSTRY PROFILE:
          </span>
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className="px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-2 hover:border-accent-text/40 font-mono text-xs text-text/80 hover:text-text transition-all cursor-pointer shadow-xs"
            >
              {preset.name}
            </button>
          ))}
        </div>

        {/* Calculator Grid */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Sliders & Controls (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl border border-border bg-surface shadow-sm space-y-8">
            {/* Input 1: Monthly Visitors */}
            <SliderRow
              label="01 // MONTHLY UNIQUE VISITORS"
              min={10000}
              max={2000000}
              step={10000}
              value={visitors}
              displayValue={visitors.toLocaleString()}
              unit="users"
              minLabel="10,000"
              midLabel="1,000,000"
              maxLabel="2,000,000+"
              onChange={(val) => {
                setVisitors(val);
                playMicroClick(600);
              }}
            />

            {/* Input 2: Baseline Conversion Rate */}
            <SliderRow
              label="02 // CURRENT CONVERSION RATE"
              min={0.5}
              max={10.0}
              step={0.1}
              value={conversionRate}
              displayValue={conversionRate.toFixed(1) + "%"}
              unit="completed"
              minLabel="0.5% (Low)"
              midLabel="2.5% (Industry avg)"
              maxLabel="10.0% (High)"
              onChange={(val) => {
                setConversionRate(val);
                playMicroClick(650);
              }}
            />

            {/* Input 3: Average Order Value / ACV */}
            <SliderRow
              label="03 // AVERAGE ORDER VALUE (AOV) / LTV"
              min={15}
              max={1000}
              step={5}
              value={aov}
              displayValue={"$" + aov.toLocaleString()}
              unit="per user"
              minLabel="$15"
              midLabel="$250"
              maxLabel="$1,000+"
              onChange={(val) => {
                setAov(val);
                playMicroClick(700);
              }}
            />

            {/* Input 4: Estimated Friction Drop-off */}
            <SliderRow
              label="04 // ESTIMATED UX FRICTION DROP-OFF"
              min={5}
              max={50}
              step={1}
              value={dropoff}
              displayValue={dropoff + "%"}
              unit="leakage"
              minLabel="5% (Streamlined)"
              midLabel="22% (Average product)"
              maxLabel="50% (Severe friction)"
              onChange={(val) => {
                setDropoff(val);
                playMicroClick(750);
              }}
              accentColor={dropoff >= 25 ? "#f43f5e" : "#c8ff3d"}
            />
          </div>

          {/* Right Column: Dynamic Output Card (5 cols) */}
          <div
            className={`lg:col-span-5 p-6 sm:p-8 rounded-2xl border relative overflow-hidden flex flex-col justify-between transition-colors shadow-md ${
              isHighLoss
                ? "border-rose-500/40 bg-gradient-to-b from-rose-500/[0.08] to-surface"
                : "border-accent-text/30 bg-gradient-to-b from-accent/15 to-surface"
            }`}
          >
            <div>
              <div className="flex items-center justify-between font-mono text-xs text-muted pb-4 border-b border-border">
                <span
                  className={`uppercase tracking-widest font-bold ${
                    isHighLoss ? "text-rose-500 flex items-center gap-1.5" : "text-accent-text"
                  }`}
                >
                  {isHighLoss && <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />}
                  {isHighLoss ? "[HIGH FRICTION ALERT]" : "[AUDIT PROJECTION // REAL-TIME]"}
                </span>
                <span>FORMULA: CRO-V2</span>
              </div>

              {/* Main Animated Number: Monthly Revenue Lost with Red Pulse */}
              <div className="mt-8">
                <div
                  className={`font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 mb-2 ${
                    isHighLoss ? "text-rose-500 font-bold" : "text-muted"
                  }`}
                >
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>MONTHLY REVENUE LOST TO FRICTION</span>
                </div>

                {/* Pulses red once crossing high threshold */}
                <motion.div
                  animate={
                    isHighLoss && !prefersReduced
                      ? {
                          scale: [1, 1.02, 1],
                          color: ["var(--text)", "#e11d48", "var(--text)"],
                        }
                      : { scale: 1, color: "var(--text)" }
                  }
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut",
                  }}
                  className="text-4xl sm:text-5xl lg:text-6xl font-black font-mono tracking-tight will-change-transform text-text"
                >
                  <TweenNumber value={calculation.monthlyLostRevenue} prefix="$" />
                  <span className="text-sm font-normal text-muted block sm:inline sm:ml-2">
                    / month
                  </span>
                </motion.div>
              </div>

              {/* Breakdown Rows */}
              <div className="mt-8 space-y-3 font-mono text-xs pt-6 border-t border-border">
                <div className="flex justify-between py-1 text-muted">
                  <span>Annualized Friction Penalty:</span>
                  <span className="text-rose-500 font-bold">
                    <TweenNumber value={calculation.annualLostRevenue} prefix="$" suffix=" / yr" />
                  </span>
                </div>
                <div className="flex justify-between py-1 text-muted">
                  <span>Lost Paying Customers:</span>
                  <span className="text-text font-bold">
                    <TweenNumber value={calculation.lostOrders} suffix=" users / mo" />
                  </span>
                </div>
                <div className="flex justify-between py-1 text-muted">
                  <span>30-Day Recoverable Revenue (Est.):</span>
                  <span className="text-accent-text font-bold">
                    +<TweenNumber value={calculation.recoverableRevenue} prefix="$" suffix=" / mo" />
                  </span>
                </div>
              </div>

              {/* Visual Leakage Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-[11px] font-mono text-muted mb-1.5">
                  <span>CAPTURED REVENUE</span>
                  <span className="text-rose-500 font-bold">LOST TO FRICTION ({dropoff}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-2 border border-border overflow-hidden flex">
                  <motion.div
                    className="h-full bg-text/70"
                    initial={false}
                    animate={{ width: `${100 - dropoff}%` }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                  <motion.div
                    className="h-full bg-rose-500"
                    initial={false}
                    animate={{ width: `${dropoff}%` }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                </div>
              </div>
            </div>

            {/* Action CTA */}
            <div className="mt-8 pt-6 border-t border-border">
              <Magnetic intensity={0.15} className="w-full">
                <button
                  onClick={scrollToAnalyzer}
                  className="w-full py-4 rounded-xl font-mono text-xs sm:text-sm font-bold uppercase tracking-wider bg-accent text-accent-ink hover:bg-[#d4ff5e] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Eliminate this friction &rarr; Run Live Analyzer</span>
                </button>
              </Magnetic>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
