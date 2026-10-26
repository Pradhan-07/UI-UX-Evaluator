"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useReducedMotion } from "framer-motion";
import { Volume2, VolumeX, Menu, X, ArrowUpRight, ShieldCheck, Clock } from "lucide-react";
import { toggleSound, playMicroClick } from "@/utils/audio";
import { EASE_PREMIUM } from "@/lib/motion";

interface NavbarProps {
  onOpenDemo: () => void;
}

export function Navbar({ onOpenDemo }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [timeStr, setTimeStr] = useState<string>("");
  const [selectedCityIndex, setSelectedCityIndex] = useState(0);

  // Scroll hide / show state
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const prevScrollY = useRef(0);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      if (menuOpen) return;
      const diff = latest - prevScrollY.current;
      if (latest > 100 && diff > 8) {
        setHidden(true);
      } else if (diff < -8 || latest <= 50) {
        setHidden(false);
      }
      prevScrollY.current = latest;
    });
  }, [scrollY, menuOpen]);

  const CITIES = [
    { name: "NEW DELHI (IST)", tz: "Asia/Kolkata" },
    { name: "MUMBAI (IST)", tz: "Asia/Kolkata" },
    { name: "BENGALURU (IST)", tz: "Asia/Kolkata" },
    { name: "SAN FRANCISCO", tz: "America/Los_Angeles" },
    { name: "LONDON", tz: "Europe/London" },
    { name: "TOKYO", tz: "Asia/Tokyo" },
  ];

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const city = CITIES[selectedCityIndex];
      try {
        const formatter = new Intl.DateTimeFormat("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
          timeZone: city.tz,
        });
        setTimeStr(formatter.format(now));
      } catch {
        setTimeStr(now.toLocaleTimeString());
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [selectedCityIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleToggleSound = () => {
    const state = toggleSound();
    setSoundOn(state);
    if (state) playMicroClick(1000);
  };

  const cycleCity = () => {
    playMicroClick(900);
    setSelectedCityIndex((prev) => (prev + 1) % CITIES.length);
  };

  const navLinks = [
    { num: "01", label: "OVERVIEW", href: "#hero", desc: "Core proposition & speed" },
    { num: "02", label: "WHO WE ARE", href: "#who-we-are", desc: "Cognitive UX intelligence" },
    { num: "03", label: "THE PROBLEM", href: "#the-problem", desc: "Where user flows leak revenue" },
    { num: "04", label: "UX COST CALCULATOR", href: "#calculator", desc: "Quantify your friction penalty" },
    { num: "05", label: "LIVE ANALYZER", href: "#analyzer", desc: "Interactive prototype & journey evaluator" },
    { num: "06", label: "HEURISTICS MATRIX", href: "#heuristics", desc: "Nielsen 10 + WCAG 2.2 rules" },
  ];

  const handleNavClick = (href: string) => {
    playMicroClick();
    setMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const lenis = (window as unknown as { __lenis?: { scrollTo: (target: Element) => void } }).__lenis;
      if (lenis) {
        lenis.scrollTo(element);
      } else {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
      <motion.header
        animate={{ y: hidden && !menuOpen ? "-100%" : "0%" }}
        transition={{ duration: 0.35, ease: EASE_PREMIUM }}
        className="fixed top-0 left-0 right-0 z-50 bg-[#08080a]/85 backdrop-blur-md border-b border-white/[0.08]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo Left */}
          <div className="flex items-center gap-3">
            <a
              href="#hero"
              onClick={() => playMicroClick()}
              className="group flex items-center gap-2.5 font-bold tracking-tight text-white hover:text-[#c8ff3d] transition-colors"
            >
              <div className="w-2.5 h-2.5 bg-[#c8ff3d] rounded-sm group-hover:scale-125 transition-transform" />
              <span className="text-lg font-mono tracking-wider">FRICTION</span>
              <span className="text-[10px] font-mono tracking-widest text-[#c8ff3d] bg-[#c8ff3d]/10 border border-[#c8ff3d]/30 px-1.5 py-0.5 rounded">
                v2.4
              </span>
            </a>
          </div>

          {/* Center: Live Clock & City Switcher */}
          <div className="hidden md:flex items-center gap-3 font-mono text-xs text-zinc-400">
            <button
              onClick={cycleCity}
              title="Click to toggle timezone"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/[0.04] border border-white/[0.08] hover:border-white/20 hover:text-white transition-colors cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-[#c8ff3d]" />
              <span className="text-zinc-200 font-medium">{CITIES[selectedCityIndex].name}</span>
              <span className="text-[#c8ff3d] font-bold min-w-[76px] text-right">{timeStr || "--:--:--"}</span>
            </button>
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>SYSTEM NOMINAL</span>
            </div>
          </div>

          {/* Right: Actions & Menu */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Audio Toggle */}
            <button
              onClick={handleToggleSound}
              title={soundOn ? "Mute interface feedback" : "Enable tactile sound feedback"}
              aria-label="Sound feedback toggle"
              className={`p-2 rounded border transition-colors cursor-pointer ${
                soundOn
                  ? "bg-[#c8ff3d]/10 text-[#c8ff3d] border-[#c8ff3d]/40"
                  : "bg-white/[0.03] text-zinc-400 border-white/[0.08] hover:text-white hover:border-white/20"
              }`}
            >
              {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Quick Analyze Button */}
            <a
              href="#analyzer"
              onClick={() => playMicroClick()}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono font-medium px-3.5 py-1.5 rounded bg-white/[0.05] border border-white/[0.12] text-zinc-200 hover:text-white hover:border-[#c8ff3d] hover:bg-[#c8ff3d]/10 transition-all cursor-pointer"
            >
              <span>[05] ANALYZE</span>
              <span className="text-[#c8ff3d]">&rarr;</span>
            </a>

            {/* Menu Trigger */}
            <button
              onClick={() => {
                playMicroClick();
                setMenuOpen(!menuOpen);
              }}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded bg-zinc-900 border border-white/20 hover:border-[#c8ff3d] text-white hover:text-[#c8ff3d] transition-all font-mono text-xs font-semibold cursor-pointer"
              aria-expanded={menuOpen}
              aria-label="Toggle navigation menu"
            >
              <span>{menuOpen ? "CLOSE" : "MENU"}</span>
              <span className="text-zinc-500 text-[10px] hidden sm:inline">[ESC]</span>
              {menuOpen ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Full-screen Overlay Menu with expanding circular clip-path */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{
              clipPath: prefersReduced
                ? "none"
                : "circle(0% at calc(100% - 60px) 32px)",
              opacity: prefersReduced ? 0 : 1,
            }}
            animate={{
              clipPath: prefersReduced
                ? "none"
                : "circle(150% at calc(100% - 60px) 32px)",
              opacity: 1,
            }}
            exit={{
              clipPath: prefersReduced
                ? "none"
                : "circle(0% at calc(100% - 60px) 32px)",
              opacity: prefersReduced ? 0 : 1,
            }}
            transition={{ duration: 0.55, ease: EASE_PREMIUM }}
            className="fixed inset-0 z-40 bg-[#08080a]/98 backdrop-blur-2xl pt-20 px-6 overflow-y-auto flex flex-col justify-between"
          >
            <div className="max-w-6xl mx-auto w-full py-8">
              <div className="flex items-center justify-between pb-6 border-b border-white/[0.08] mb-8">
                <span className="font-mono text-xs text-[#c8ff3d] tracking-widest uppercase">
                  [NAVIGATIONAL INDEX // DIRECTORY]
                </span>
                <span className="font-mono text-xs text-zinc-500">
                  PRESS ESC OR CLICK ANY ANCHOR TO JUMP
                </span>
              </div>

              {/* Staggered Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {navLinks.map((link, idx) => (
                  <motion.button
                    key={link.num}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.45,
                      delay: prefersReduced ? 0 : 0.12 + idx * 0.05,
                      ease: EASE_PREMIUM,
                    }}
                    onClick={() => handleNavClick(link.href)}
                    className="group text-left p-5 rounded-lg border border-white/[0.06] bg-white/[0.015] hover:bg-white/[0.04] hover:border-[#c8ff3d]/40 transition-all flex items-start justify-between cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-[#c8ff3d] font-bold">
                          [{link.num}]
                        </span>
                        <span className="text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-[#c8ff3d] transition-colors">
                          {link.label}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-zinc-400 font-mono">
                        {link.desc}
                      </p>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-zinc-500 group-hover:text-[#c8ff3d] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </motion.button>
                ))}
              </div>

              {/* Extra Agency & System Telemetry */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="mt-8 p-6 rounded-xl border border-white/[0.08] bg-zinc-950/60 grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono text-xs text-zinc-400"
              >
                <div>
                  <div className="text-zinc-500 uppercase tracking-wider mb-1">
                    ENGINE SPECIFICATION
                  </div>
                  <div className="text-white font-medium flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#c8ff3d]" />
                    <span>Nielsen 10 + WCAG 2.2 AAA</span>
                  </div>
                </div>
                <div>
                  <div className="text-zinc-500 uppercase tracking-wider mb-1">
                    PROCESSING LATENCY
                  </div>
                  <div className="text-white font-medium">1.8s Autonomous Multi-pass</div>
                </div>
                <div>
                  <div className="text-zinc-500 uppercase tracking-wider mb-1">
                    INTERACTIVE DEMO
                  </div>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenDemo();
                    }}
                    className="text-[#c8ff3d] underline hover:text-white transition-colors text-left cursor-pointer"
                  >
                    Launch 90-sec Video Walkthrough &rarr;
                  </button>
                </div>
              </motion.div>
            </div>

            <div className="max-w-6xl mx-auto w-full py-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-zinc-500">
              <div>&copy; 2026 FRICTION SYSTEMS INC. ALL RIGHTS RESERVED.</div>
              <div className="mt-2 sm:mt-0 text-[#c8ff3d]">
                &ldquo;DESIGNERS SHOULD DESIGN. AI SHOULD FIND THE FRICTION.&rdquo;
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
