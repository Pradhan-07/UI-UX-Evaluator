"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { EASE_PREMIUM } from "@/lib/motion";

export function Loader({ onComplete }: { onComplete?: () => void }) {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const prefersReduced = useReducedMotion();

  const lines = [
    "Loading 14 heuristics...",
    "Calibrating WCAG 2.2...",
    "Ready",
  ];

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check sessionStorage
    const alreadyLoaded = sessionStorage.getItem("protolens_loaded");
    if (alreadyLoaded || prefersReduced) {
      if (onComplete) onComplete();
      return;
    }

    setVisible(true);

    // Skip on any keypress or click
    const handleSkip = () => {
      finish();
    };

    window.addEventListener("keydown", handleSkip);
    window.addEventListener("click", handleSkip);

    // Progress counter 0 -> 100 within max 2.0s
    const startTime = performance.now();
    const duration = 1900;

    const timer = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const pct = Math.min(Math.round((elapsed / duration) * 100), 100);
      setProgress(pct);

      if (pct > 35 && pct < 75) {
        setCurrentLineIndex(1);
      } else if (pct >= 75) {
        setCurrentLineIndex(2);
      }

      if (pct >= 100) {
        clearInterval(timer);
        setTimeout(finish, 180);
      }
    }, 25);

    function finish() {
      sessionStorage.setItem("protolens_loaded", "true");
      setVisible(false);
      window.removeEventListener("keydown", handleSkip);
      window.removeEventListener("click", handleSkip);
      if (onComplete) onComplete();
    }

    return () => {
      clearInterval(timer);
      window.removeEventListener("keydown", handleSkip);
      window.removeEventListener("click", handleSkip);
    };
  }, [prefersReduced, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ y: "0%" }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.65, ease: EASE_PREMIUM }}
          className="fixed inset-0 z-[9999999] bg-[#08080a] flex flex-col justify-between p-6 sm:p-12 font-mono select-none cursor-pointer"
        >
          {/* Top Brand Tag */}
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#c8ff3d] animate-pulse" />
              <span className="text-zinc-300 font-bold tracking-wider">
                PROTOLENS // BOOTSTRAP
              </span>
            </div>
            <span className="text-zinc-600">CLICK ANYWHERE TO SKIP</span>
          </div>

          {/* Center Terminal Logs */}
          <div className="max-w-md w-full mx-auto space-y-2">
            <div className="space-y-1.5 text-xs sm:text-sm">
              {lines.slice(0, currentLineIndex + 1).map((line, idx) => {
                const isCurrent = idx === currentLineIndex;
                return (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-zinc-600">&gt;</span>
                    <span
                      className={
                        idx === 2
                          ? "text-[#c8ff3d] font-bold"
                          : "text-zinc-300"
                      }
                    >
                      {line}
                    </span>
                    {isCurrent && (
                      <span className="text-[#c8ff3d] font-bold blink-cursor">_</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Counter */}
          <div className="flex items-end justify-between border-t border-white/[0.08] pt-6">
            <div className="text-[11px] text-zinc-600">
              AUTONOMOUS COGNITIVE ENGINE V2.4
            </div>
            <div className="text-4xl sm:text-6xl font-black text-white tracking-tight flex items-baseline">
              <span>{progress}</span>
              <span className="text-base sm:text-2xl text-[#c8ff3d] ml-1">%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
