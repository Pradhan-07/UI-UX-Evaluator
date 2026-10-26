"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, Send, ShieldCheck, Zap } from "lucide-react";
import { playMicroClick } from "@/utils/audio";
import { EASE_PREMIUM } from "@/lib/motion";
import { BrandLogo } from "@/components/BrandLogo";


export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const prefersReduced = useReducedMotion();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    playMicroClick(1100);
    setSubscribed(true);
    setTimeout(() => {
      setEmail("");
      setSubscribed(false);
    }, 3500);
  };

  // Back to top smoothly via Lenis
  const scrollToTop = () => {
    playMicroClick();
    if (typeof window !== "undefined" && (window as any).__lenis) {
      (window as any).__lenis.scrollTo(0, { duration: 1.2 });
    } else if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const wordmarkLetters = "FRICTION".split("");

  return (
    <footer className="bg-surface border-t border-border text-muted font-mono text-xs overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Top Agency Branding Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-border">
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <BrandLogo variant="auto" className="h-10 w-auto" />
              <span className="text-[10px] text-accent-text bg-accent/15 border border-accent/40 px-1.5 py-0.5 rounded font-bold">
                AUTONOMOUS UX
              </span>
            </div>
            <p className="text-sm font-sans text-muted font-light max-w-md leading-relaxed">
              Autonomous cognitive UX evaluation engine for product teams, engineering leads, and digital agencies.
              Turning subjective design arguments into quantified revenue fixes.
            </p>
            <div className="pt-2 flex items-center gap-4 text-muted text-[11px]">
              <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>ALL SYSTEMS OPERATIONAL</span>
              </span>
              <span>/</span>
              <span>NIELSEN + WCAG 2.2 AAA VERIFIED</span>
            </div>
          </div>

          {/* Newsletter / Early Access */}
          <div className="lg:col-span-6 space-y-4">
            <div className="text-text uppercase tracking-wider font-bold">
              [JOIN THE UX INTELLIGENCE DISPATCH]
            </div>
            <p className="text-xs font-sans text-muted font-light">
              Weekly teardowns of real-world app friction, cognitive psychology patterns, and conversion optimization patches.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@company.com"
                className="flex-1 bg-surface-2 border border-border rounded-xl px-4 py-2.5 text-xs text-text placeholder:text-muted focus:border-accent-text focus:outline-none shadow-xs"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-accent text-accent-ink font-bold uppercase tracking-wider hover:bg-[#d6ff5e] transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                {subscribed ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>SUBSCRIBED</span>
                  </>
                ) : (
                  <>
                    <span>JOIN</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Directory Links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-12 border-b border-border text-xs">
          <div>
            <div className="text-text uppercase tracking-wider mb-4 font-bold">
              [01] ENGINE
            </div>
            <ul className="space-y-2.5 text-muted">
              <li><a href="#analyzer" className="hover:text-accent-text transition-colors">Live Prototype Evaluator</a></li>
              <li><a href="#analyzer" className="hover:text-accent-text transition-colors">Journey Funnel Parser</a></li>
              <li><a href="#calculator" className="hover:text-accent-text transition-colors">Usability Cost Calculator</a></li>
              <li><a href="#heuristics" className="hover:text-accent-text transition-colors">Nielsen 10 Database</a></li>
            </ul>
          </div>

          <div>
            <div className="text-text uppercase tracking-wider mb-4 font-bold">
              [02] STANDARDS
            </div>
            <ul className="space-y-2.5 text-muted">
              <li><a href="#heuristics" className="hover:text-accent-text transition-colors">WCAG 2.2 AA / AAA</a></li>
              <li><a href="#heuristics" className="hover:text-accent-text transition-colors">Fitts's Law Touch Radii</a></li>
              <li><a href="#heuristics" className="hover:text-accent-text transition-colors">Hick's Decision Overhead</a></li>
              <li><a href="#heuristics" className="hover:text-accent-text transition-colors">Cognitive Saccades</a></li>
            </ul>
          </div>

          <div>
            <div className="text-text uppercase tracking-wider mb-4 font-bold">
              [03] PROTOCOLS
            </div>
            <ul className="space-y-2.5 text-muted">
              <li><span className="text-muted/60">API Documentation (v2.4)</span></li>
              <li><span className="text-muted/60">GitHub CI/CD Action</span></li>
              <li><span className="text-muted/60">Figma Plugin Bridge</span></li>
              <li><span className="text-muted/60">Telemetry SLA (99.98%)</span></li>
            </ul>
          </div>

          <div>
            <div className="text-text uppercase tracking-wider mb-4 font-bold">
              [04] AGENCY
            </div>
            <ul className="space-y-2.5 text-muted">
              <li><a href="#who-we-are" className="hover:text-accent-text transition-colors">Who We Are</a></li>
              <li><a href="#the-problem" className="hover:text-accent-text transition-colors">The Problem Matrix</a></li>
              <li><span className="text-muted/60">New Delhi // Bengaluru // SF // Tokyo</span></li>
              <li>
                <button
                  onClick={scrollToTop}
                  className="text-accent-text hover:underline flex items-center gap-1 cursor-pointer pt-2 font-bold"
                >
                  <span>Back to top [▲]</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Giant Footer Wordmark Rising Letter-by-Letter */}
        <div className="overflow-hidden mt-16 pt-8 pb-4 border-t border-border">
          <div className="flex justify-between items-center overflow-hidden w-full">
            {wordmarkLetters.map((char, idx) => (
              <motion.span
                key={idx}
                initial={prefersReduced ? false : { y: "115%", opacity: 0 }}
                whileInView={{ y: "0%", opacity: 1 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{
                  duration: 0.7,
                  delay: prefersReduced ? 0 : idx * 0.045,
                  ease: EASE_PREMIUM,
                }}
                className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl xl:text-[11rem] font-black tracking-tight text-text/[0.05] hover:text-accent-text/30 transition-colors cursor-default select-none inline-block will-change-transform leading-none"
              >
                {char}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Bottom Tagline & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-muted text-[11px] font-mono">
          <div>
            &copy; 2026 FRICTION SYSTEMS INC. ALL RIGHTS RESERVED.
          </div>
          <div className="text-accent-text font-bold tracking-wider">
            &ldquo;DESIGNERS SHOULD DESIGN. AI SHOULD FIND THE FRICTION.&rdquo;
          </div>
          <div className="flex gap-4">
            <span className="hover:text-text cursor-pointer transition-colors">PRIVACY</span>
            <span className="hover:text-text cursor-pointer transition-colors">TERMS</span>
            <span className="hover:text-text cursor-pointer transition-colors">SECURITY</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
