"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { DollarSign, TrendingDown, ArrowRight, Zap, RefreshCw, BarChart3 } from "lucide-react";
import { playMicroClick } from "@/utils/audio";

export function UxCostCalculator() {
  const [visitors, setVisitors] = useState<number>(150000);
  const [conversionRate, setConversionRate] = useState<number>(2.4);
  const [aov, setAov] = useState<number>(120);
  const [dropoff, setDropoff] = useState<number>(22);

  // Quick Preset Configurations
  const presets = [
    { name: "Early Stage SaaS", visitors: 30000, cr: 1.8, aov: 65, dropoff: 28 },
    { name: "Growth Scaleup", visitors: 150000, cr: 2.4, aov: 120, dropoff: 22 },
    { name: "High-Volume Commerce", visitors: 650000, cr: 3.2, aov: 85, dropoff: 18 },
  ];

  const applyPreset = (p: typeof presets[0]) => {
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
      className="py-24 sm:py-32 bg-[#08080a] border-b border-white/[0.08] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm text-zinc-400 mb-4">
              <span className="text-[#c8ff3d] font-bold">[04]</span>
              <span className="tracking-wider uppercase text-zinc-300">
                UX COST CALCULATOR
              </span>
              <span className="text-[#c8ff3d] font-bold blink-cursor">_</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white uppercase">
              Quantify Your Friction Tax.
            </h2>
          </div>

          <div className="font-mono text-xs text-zinc-400 max-w-sm">
            EVERY CONFUSING FORM FIELD AND UNREADABLE ERROR MESSAGE HAS A PRECISE DOLLAR VALUE.
          </div>
        </div>

        {/* Quick Presets Bar */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <span className="font-mono text-xs text-zinc-400 uppercase tracking-wider mr-2">
            LOAD INDUSTRY PROFILE:
          </span>
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] hover:border-[#c8ff3d]/40 font-mono text-xs text-zinc-300 hover:text-white transition-all cursor-pointer"
            >
              {preset.name}
            </button>
          ))}
        </div>

        {/* Calculator Grid */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Sliders & Controls (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl border border-white/[0.08] bg-zinc-950/60 backdrop-blur-sm space-y-8">
            {/* Input 1: Monthly Visitors */}
            <div>
              <div className="flex items-center justify-between mb-3 font-mono">
                <span className="text-xs text-zinc-400 uppercase tracking-wider">
                  01 // MONTHLY UNIQUE VISITORS
                </span>
                <span className="text-base font-bold text-white">
                  {visitors.toLocaleString()} <span className="text-zinc-500 text-xs">users</span>
                </span>
              </div>
              <input
                type="range"
                min="10000"
                max="2000000"
                step="10000"
                value={visitors}
                onChange={(e) => {
                  setVisitors(Number(e.target.value));
                  playMicroClick(600);
                }}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#c8ff3d]"
              />
              <div className="flex justify-between text-[11px] font-mono text-zinc-400 mt-1">
                <span>10,000</span>
                <span>1,000,000</span>
                <span>2,000,000+</span>
              </div>
            </div>

            {/* Input 2: Baseline Conversion Rate */}
            <div>
              <div className="flex items-center justify-between mb-3 font-mono">
                <span className="text-xs text-zinc-400 uppercase tracking-wider">
                  02 // CURRENT CONVERSION RATE
                </span>
                <span className="text-base font-bold text-white">
                  {conversionRate.toFixed(1)}% <span className="text-zinc-500 text-xs">completed</span>
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="10.0"
                step="0.1"
                value={conversionRate}
                onChange={(e) => {
                  setConversionRate(Number(e.target.value));
                  playMicroClick(650);
                }}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#c8ff3d]"
              />
              <div className="flex justify-between text-[11px] font-mono text-zinc-400 mt-1">
                <span>0.5% (Low)</span>
                <span>2.5% (Industry avg)</span>
                <span>10.0% (High)</span>
              </div>
            </div>

            {/* Input 3: Average Order Value / ACV */}
            <div>
              <div className="flex items-center justify-between mb-3 font-mono">
                <span className="text-xs text-zinc-400 uppercase tracking-wider">
                  03 // AVERAGE ORDER VALUE (AOV) / LTV
                </span>
                <span className="text-base font-bold text-white">
                  ${aov.toLocaleString()} <span className="text-zinc-500 text-xs">per user</span>
                </span>
              </div>
              <input
                type="range"
                min="15"
                max="1000"
                step="5"
                value={aov}
                onChange={(e) => {
                  setAov(Number(e.target.value));
                  playMicroClick(700);
                }}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#c8ff3d]"
              />
              <div className="flex justify-between text-[11px] font-mono text-zinc-400 mt-1">
                <span>$15</span>
                <span>$250</span>
                <span>$1,000+</span>
              </div>
            </div>

            {/* Input 4: Estimated Friction Drop-off */}
            <div>
              <div className="flex items-center justify-between mb-3 font-mono">
                <span className="text-xs text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#c8ff3d]" />
                  <span>04 // ESTIMATED UX FRICTION DROP-OFF</span>
                </span>
                <span className="text-base font-bold text-[#c8ff3d]">
                  {dropoff}% <span className="text-zinc-400 text-xs">leakage</span>
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="1"
                value={dropoff}
                onChange={(e) => {
                  setDropoff(Number(e.target.value));
                  playMicroClick(750);
                }}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#c8ff3d]"
              />
              <div className="flex justify-between text-[11px] font-mono text-zinc-400 mt-1">
                <span>5% (Streamlined)</span>
                <span>22% (Average product)</span>
                <span>50% (Severe friction)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Output Card (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl border border-[#c8ff3d]/30 bg-gradient-to-b from-[#c8ff3d]/[0.05] to-zinc-950/90 relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between font-mono text-xs text-zinc-400 pb-4 border-b border-white/[0.08]">
                <span className="text-[#c8ff3d] uppercase tracking-widest font-bold">
                  [AUDIT PROJECTION // REAL-TIME]
                </span>
                <span>FORMULA: CRO-V2</span>
              </div>

              {/* Main Animated Number: Monthly Revenue Lost */}
              <div className="mt-8">
                <div className="font-mono text-xs uppercase tracking-wider text-rose-400 flex items-center gap-1.5 mb-2">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>MONTHLY REVENUE LOST TO FRICTION</span>
                </div>
                <div className="text-4xl sm:text-5xl lg:text-6xl font-black font-mono tracking-tight text-white">
                  ${calculation.monthlyLostRevenue.toLocaleString()}
                  <span className="text-sm font-normal text-zinc-400 block sm:inline sm:ml-2">
                    / month
                  </span>
                </div>
              </div>

              {/* Breakdown Rows */}
              <div className="mt-8 space-y-3 font-mono text-xs pt-6 border-t border-white/[0.08]">
                <div className="flex justify-between py-1 text-zinc-400">
                  <span>Annualized Friction Penalty:</span>
                  <span className="text-rose-400 font-bold">
                    ${calculation.annualLostRevenue.toLocaleString()} / yr
                  </span>
                </div>
                <div className="flex justify-between py-1 text-zinc-400">
                  <span>Lost Paying Customers:</span>
                  <span className="text-zinc-200 font-bold">
                    {calculation.lostOrders.toLocaleString()} users / mo
                  </span>
                </div>
                <div className="flex justify-between py-1 text-zinc-400">
                  <span>30-Day Recoverable Revenue (Est.):</span>
                  <span className="text-[#c8ff3d] font-bold">
                    +${calculation.recoverableRevenue.toLocaleString()} / mo
                  </span>
                </div>
              </div>

              {/* Visual Leakage Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-[11px] font-mono text-zinc-500 mb-1.5">
                  <span>CAPTURED REVENUE</span>
                  <span className="text-rose-400">LOST TO FRICTION ({dropoff}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden flex">
                  <div
                    className="h-full bg-zinc-400 transition-all duration-300"
                    style={{ width: `${100 - dropoff}%` }}
                  />
                  <div
                    className="h-full bg-rose-500 transition-all duration-300"
                    style={{ width: `${dropoff}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Action CTA */}
            <div className="mt-8 pt-6 border-t border-white/[0.08]">
              <button
                onClick={scrollToAnalyzer}
                className="w-full py-4 rounded-xl font-mono text-xs sm:text-sm font-bold uppercase tracking-wider bg-[#c8ff3d] text-black hover:bg-[#d4ff5e] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(200,255,61,0.2)]"
              >
                <span>Eliminate this friction &rarr; Run Live Analyzer</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
