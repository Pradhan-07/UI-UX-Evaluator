"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { MarqueeTicker } from "@/components/MarqueeTicker";
import { WhoWeAre } from "@/components/WhoWeAre";
import { TheProblem } from "@/components/TheProblem";
import { UxCostCalculator } from "@/components/UxCostCalculator";
import { LiveAnalyzer } from "@/components/LiveAnalyzer";
import { WhatWeCheckAndHowItWorks } from "@/components/WhatWeCheckAndHowItWorks";
import { HeuristicsMatrix } from "@/components/HeuristicsMatrix";
import { SampleReportCard } from "@/components/SampleReportCard";
import { FaqSection } from "@/components/FaqSection";
import { FinalCta } from "@/components/FinalCta";
import { Footer } from "@/components/Footer";
import { DemoModal } from "@/components/DemoModal";

import { Loader } from "@/components/motion/Loader";

export default function Home() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg text-text relative selection:bg-accent selection:text-accent-ink">
      {/* Step 1 Session Loader */}
      <Loader />

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

        {/* [05B, 05C] WHAT WE CHECK + HOW IT WORKS */}
        <WhatWeCheckAndHowItWorks />

        {/* [06] HEURISTICS MATRIX */}
        <HeuristicsMatrix />

        {/* [07] SAMPLE REPORT */}
        <SampleReportCard />

        {/* [08] FAQ SECTION */}
        <FaqSection />

        {/* [09] FINAL CTA */}
        <FinalCta onOpenDemo={() => setDemoOpen(true)} />
      </main>

      {/* FOOTER */}
      <Footer />

      {/* Interactive 90-sec Demo Modal */}
      <DemoModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} />
    </div>
  );
}
