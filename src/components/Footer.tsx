"use client";

import React, { useState } from "react";
import { ArrowUpRight, Check, Send, ShieldCheck, Zap } from "lucide-react";
import { playMicroClick } from "@/utils/audio";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

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

  const scrollToTop = () => {
    playMicroClick();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#050507] border-t border-white/[0.08] text-zinc-400 font-mono text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Top Agency Branding Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/[0.08]">
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 bg-[#c8ff3d] rounded-sm" />
              <span className="text-xl font-bold tracking-wider text-white">FRICTION</span>
              <span className="text-[10px] text-[#c8ff3d] bg-[#c8ff3d]/10 border border-[#c8ff3d]/30 px-1.5 py-0.5 rounded">
                SYSTEMS
              </span>
            </div>
            <p className="text-sm font-sans text-zinc-400 font-light max-w-md leading-relaxed">
              Autonomous cognitive UX evaluation engine for product teams, engineering leads, and digital agencies.
              Turning subjective design arguments into quantified revenue fixes.
            </p>
            <div className="pt-2 flex items-center gap-4 text-zinc-500 text-[11px]">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>ALL SYSTEMS OPERATIONAL</span>
              </span>
              <span>/</span>
              <span>NIELSEN + WCAG 2.2 AAA VERIFIED</span>
            </div>
          </div>

          {/* Newsletter / Early Access */}
          <div className="lg:col-span-6 space-y-4">
            <div className="text-white uppercase tracking-wider font-bold">
              [JOIN THE UX INTELLIGENCE DISPATCH]
            </div>
            <p className="text-xs font-sans text-zinc-400 font-light">
              Weekly teardowns of real-world app friction, cognitive psychology patterns, and conversion optimization patches.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@company.com"
                className="flex-1 bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#c8ff3d] focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#c8ff3d] text-black font-bold uppercase tracking-wider hover:bg-[#d6ff5e] transition-colors cursor-pointer flex items-center gap-1.5"
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-12 border-b border-white/[0.08] text-xs">
          <div>
            <div className="text-white uppercase tracking-wider mb-4 font-bold">
              [01] ENGINE
            </div>
            <ul className="space-y-2.5 text-zinc-400">
              <li><a href="#analyzer" className="hover:text-[#c8ff3d] transition-colors">Live Prototype Evaluator</a></li>
              <li><a href="#analyzer" className="hover:text-[#c8ff3d] transition-colors">Journey Funnel Parser</a></li>
              <li><a href="#calculator" className="hover:text-[#c8ff3d] transition-colors">Usability Cost Calculator</a></li>
              <li><a href="#heuristics" className="hover:text-[#c8ff3d] transition-colors">Nielsen 10 Database</a></li>
            </ul>
          </div>

          <div>
            <div className="text-white uppercase tracking-wider mb-4 font-bold">
              [02] STANDARDS
            </div>
            <ul className="space-y-2.5 text-zinc-400">
              <li><a href="#heuristics" className="hover:text-[#c8ff3d] transition-colors">WCAG 2.2 AA / AAA</a></li>
              <li><a href="#heuristics" className="hover:text-[#c8ff3d] transition-colors">Fitts's Law Touch Radii</a></li>
              <li><a href="#heuristics" className="hover:text-[#c8ff3d] transition-colors">Hick's Decision Overhead</a></li>
              <li><a href="#heuristics" className="hover:text-[#c8ff3d] transition-colors">Cognitive Saccades</a></li>
            </ul>
          </div>

          <div>
            <div className="text-white uppercase tracking-wider mb-4 font-bold">
              [03] PROTOCOLS
            </div>
            <ul className="space-y-2.5 text-zinc-400">
              <li><span className="text-zinc-500">API Documentation (v2.4)</span></li>
              <li><span className="text-zinc-500">GitHub CI/CD Action</span></li>
              <li><span className="text-zinc-500">Figma Plugin Bridge</span></li>
              <li><span className="text-zinc-500">Telemetry SLA (99.98%)</span></li>
            </ul>
          </div>

          <div>
            <div className="text-white uppercase tracking-wider mb-4 font-bold">
              [04] AGENCY
            </div>
            <ul className="space-y-2.5 text-zinc-400">
              <li><a href="#who-we-are" className="hover:text-[#c8ff3d] transition-colors">Who We Are</a></li>
              <li><a href="#the-problem" className="hover:text-[#c8ff3d] transition-colors">The Problem Matrix</a></li>
              <li><span className="text-zinc-500">New Delhi // Bengaluru // SF // Tokyo</span></li>
              <li>
                <button
                  onClick={scrollToTop}
                  className="text-[#c8ff3d] hover:underline flex items-center gap-1 cursor-pointer pt-2"
                >
                  <span>Back to top [▲]</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Tagline & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-400 text-[11px]">
          <div>
            &copy; 2026 FRICTION SYSTEMS INC. ALL RIGHTS RESERVED.
          </div>
          <div className="text-[#c8ff3d] font-bold tracking-wider">
            DESIGNERS SHOULD DESIGN. AI SHOULD FIND THE FRICTION.
          </div>
          <div className="flex gap-4">
            <span className="hover:text-zinc-300 cursor-pointer">PRIVACY</span>
            <span className="hover:text-zinc-300 cursor-pointer">TERMS</span>
            <span className="hover:text-zinc-300 cursor-pointer">SECURITY</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
