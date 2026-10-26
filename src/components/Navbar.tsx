"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useReducedMotion } from "framer-motion";
import { Volume2, VolumeX, Menu, X, ArrowUpRight, ShieldCheck, Clock } from "lucide-react";
import { toggleSound, playMicroClick } from "@/utils/audio";
import { EASE_PREMIUM } from "@/lib/motion";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BrandLogo } from "@/components/BrandLogo";


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
        className="fixed top-0 left-0 right-0 z-50 bg-bg/85 backdrop-blur-md border-b border-border transition-colors duration-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo Left */}
          <div className="flex items-center gap-3">
            <a
              href="#hero"
              onClick={() => playMicroClick()}
              className="group flex items-center transition-all duration-200 hover:opacity-90"
              aria-label="FRICTION - Return to top"
            >
              <BrandLogo className="h-9 sm:h-10 w-auto group-hover:scale-[1.02] transition-transform duration-200" showBadge={true} />
            </a>
          </div>

          {/* Center: Live Clock & City Switcher */}
          <div className="hidden md:flex items-center gap-3 font-mono text-xs text-muted">
            <button
              onClick={cycleCity}
              title="Click to toggle timezone"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface border border-border hover:border-border text-text transition-colors cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-accent-text" />
              <span className="text-text font-medium">{CITIES[selectedCityIndex].name}</span>
              <span className="text-accent-text font-bold min-w-[76px] text-right">{timeStr || "--:--:--"}</span>
            </button>
            <div className="flex items-center gap-1.5 text-[11px] text-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span>SYSTEM NOMINAL</span>
            </div>
          </div>

          {/* Right: Actions & Menu */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Theme Toggle Button */}
            <ThemeToggle />

            {/* Audio Toggle */}
            <button
              onClick={handleToggleSound}
              title={soundOn ? "Mute interface feedback" : "Enable tactile sound feedback"}
              aria-label="Sound feedback toggle"
              className={`min-w-[44px] min-h-[44px] w-11 h-11 rounded-xl flex items-center justify-center border transition-colors cursor-pointer ${
                soundOn
                  ? "bg-accent/15 text-accent-text border-accent/40"
                  : "bg-surface text-muted border-border hover:text-text hover:bg-surface-2"
              }`}
            >
              {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Quick Analyze Button */}
            <a
              href="#analyzer"
              onClick={() => playMicroClick()}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono font-medium px-3.5 py-2.5 rounded-xl bg-surface border border-border text-text hover:text-accent-text hover:border-accent-text hover:bg-surface-2 transition-all cursor-pointer min-h-[44px]"
            >
              <span>[05] ANALYZE</span>
              <span className="text-accent-text">&rarr;</span>
            </a>

            {/* Menu Trigger */}
            <button
              onClick={() => {
                playMicroClick();
                setMenuOpen(!menuOpen);
              }}
              className="min-w-[44px] min-h-[44px] flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface border border-border hover:border-accent-text text-text hover:text-accent-text transition-all font-mono text-xs font-semibold cursor-pointer"
              aria-expanded={menuOpen}
              aria-label="Toggle navigation menu"
            >
              <span>{menuOpen ? "CLOSE" : "MENU"}</span>
              <span className="text-muted text-[10px] hidden sm:inline">[ESC]</span>
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
            className="fixed inset-0 z-40 bg-bg/98 backdrop-blur-2xl pt-20 px-6 overflow-y-auto flex flex-col justify-between text-text"
          >
            <div className="max-w-6xl mx-auto w-full py-8">
              <div className="flex items-center justify-between pb-6 border-b border-border mb-8">
                <span className="font-mono text-xs text-accent-text tracking-widest uppercase">
                  [NAVIGATIONAL INDEX // DIRECTORY]
                </span>
                <div className="flex items-center gap-4">
                  <span className="hidden sm:inline font-mono text-xs text-muted">
                    THEME:
                  </span>
                  <ThemeToggle />
                  <span className="font-mono text-xs text-muted hidden md:inline">
                    PRESS ESC OR CLICK ANY ANCHOR TO JUMP
                  </span>
                </div>
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
                    className="group text-left p-5 rounded-xl border border-border bg-surface hover:bg-surface-2 hover:border-accent-text/40 transition-all flex items-start justify-between cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-accent-text font-bold">
                          [{link.num}]
                        </span>
                        <span className="text-xl sm:text-2xl font-bold tracking-tight text-text group-hover:text-accent-text transition-colors">
                          {link.label}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted font-mono">
                        {link.desc}
                      </p>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-muted group-hover:text-accent-text group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </motion.button>
                ))}
              </div>

              {/* Extra Agency & System Telemetry */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="mt-8 p-6 rounded-xl border border-border bg-surface grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono text-xs text-muted"
              >
                <div>
                  <div className="text-muted uppercase tracking-wider mb-1">
                    ENGINE SPECIFICATION
                  </div>
                  <div className="text-text font-medium flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-accent-text" />
                    <span>Nielsen 10 + WCAG 2.2 AAA</span>
                  </div>
                </div>
                <div>
                  <div className="text-muted uppercase tracking-wider mb-1">
                    PROCESSING LATENCY
                  </div>
                  <div className="text-text font-medium">1.8s Autonomous Multi-pass</div>
                </div>
                <div>
                  <div className="text-muted uppercase tracking-wider mb-1">
                    INTERACTIVE DEMO
                  </div>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenDemo();
                    }}
                    className="text-accent-text underline hover:text-text transition-colors text-left cursor-pointer"
                  >
                    Launch 90-sec Video Walkthrough &rarr;
                  </button>
                </div>
              </motion.div>
            </div>

            <div className="max-w-6xl mx-auto w-full py-6 border-t border-border flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-muted">
              <div>&copy; 2026 FRICTION SYSTEMS INC. ALL RIGHTS RESERVED.</div>
              <div className="mt-2 sm:mt-0 text-accent-text">
                &ldquo;DESIGNERS SHOULD DESIGN. AI SHOULD FIND THE FRICTION.&rdquo;
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
