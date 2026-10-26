"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { MarqueeTicker } from "@/components/MarqueeTicker";
import { WhoWeAre } from "@/components/WhoWeAre";
import { TheProblem } from "@/components/TheProblem";
import { UxCostCalculator } from "@/components/UxCostCalculator";
import { LiveAnalyzer } from "@/components/LiveAnalyzer";
import { HeuristicsMatrix } from "@/components/HeuristicsMatrix";
import { Footer } from "@/components/Footer";
import { DemoModal } from "@/components/DemoModal";

export default function Home() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#08080a] text-[#f2f2f2] relative selection:bg-[#c8ff3d] selection:text-black">
      {/* Fixed Navigation Bar with Live Clock and Fullscreen Menu */}
      <Navbar onOpenDemo={() => setDemoOpen(true)} />

      {/* Main Single-Page Sections */}
      <main>
        {/* [01] HERO */}
        <Hero onOpenDemo={() => setDemoOpen(true)} />

        {/* Infinite Horizontal Marquee Ticker */}
        <MarqueeTicker />

        {/* [02] WHO WE ARE */}
        <WhoWeAre />

        {/* Secondary Marquee Divider in Reverse */}
        <MarqueeTicker reverse={true} className="border-t-0" />

        {/* [03] THE PROBLEM */}
        <TheProblem />

        {/* [04] UX COST CALCULATOR */}
        <UxCostCalculator />

        {/* [05] LIVE ANALYZER (THE CORE) */}
        <LiveAnalyzer />

        {/* [06] HEURISTICS MATRIX */}
        <HeuristicsMatrix />
      </main>

      {/* FOOTER */}
      <Footer />

      {/* Interactive 90-sec Demo Modal */}
      <DemoModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} />
    </div>
  );
}
