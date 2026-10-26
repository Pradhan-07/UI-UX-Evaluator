"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Pause, RotateCcw, Volume2, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";
import { playMicroClick } from "@/utils/audio";

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DemoModal({ isOpen, onClose }: DemoModalProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [currentChapter, setCurrentChapter] = useState<number>(0);

  const chapters = [
    {
      time: "0:00 - 0:25",
      title: "1. Visual Ingestion & Layout Saliency",
      narration:
        "FRICTION ingests multi-screen mockups and runs a biological saccade eye-tracking simulation to detect cognitive blindspots.",
      activeArea: "Top Header & Navigation Hierarchy",
    },
    {
      time: "0:25 - 0:50",
      title: "2. Nielsen 10 & WCAG 2.2 Deep Scan",
      narration:
        "Every interactive element is benchmarked against Fitts's thumb reach law and luminance contrast matrices in sub-50ms.",
      activeArea: "Credit Card Masking & 34px Touch Target Hazard",
    },
    {
      time: "0:50 - 1:15",
      title: "3. Quantified Severity Scoring",
      narration:
        "Usability issues are weighted by conversion drop-off probability, distinguishing cosmetic nitpicks from revenue blockers.",
      activeArea: "Missing Idempotency & Progress Feedback on Primary CTA",
    },
    {
      time: "1:15 - 1:30",
      title: "4. Code-Ready Remediation Output",
      narration:
        "The engine synthesizes ready-to-merge React hooks, accessible Tailwind tokens, and copy guidelines for immediate pull requests.",
      activeArea: "Exporting JSON Diff & React Component Patches",
    },
  ];

  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIsPlaying(false);
          return 100;
        }
        const next = prev + 1.1;
        // Determine chapter
        if (next < 28) setCurrentChapter(0);
        else if (next < 56) setCurrentChapter(1);
        else if (next < 84) setCurrentChapter(2);
        else setCurrentChapter(3);
        return next;
      });
    }, 250);

    return () => clearInterval(interval);
  }, [isOpen, isPlaying]);

  const handleRestart = () => {
    playMicroClick(800);
    setProgress(0);
    setCurrentChapter(0);
    setIsPlaying(true);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header Bar */}
          <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between font-mono text-xs text-muted">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-accent animate-ping" />
              <span className="text-text font-bold tracking-wider">
                FRICTION // 90-SECOND SYSTEM WALKTHROUGH
              </span>
            </div>
            <button
              onClick={() => {
                playMicroClick();
                onClose();
              }}
              className="p-1.5 rounded-lg hover:bg-surface-2 text-muted hover:text-text transition-colors cursor-pointer border border-transparent hover:border-border"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Interactive Player Screen (High-tech monitor simulation) */}
          <div className="relative aspect-video bg-zinc-950 flex flex-col justify-between p-6 sm:p-8 overflow-hidden mx-4 sm:mx-6 my-4 rounded-xl border border-border shadow-inner">
            {/* Ambient Animated Radar Grid */}
            <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none" />
            
            {/* Scanning Laser Line */}
            <motion.div
              animate={{ y: [0, 360, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#c8ff3d] to-transparent opacity-60 pointer-events-none z-10"
            />

            {/* Top Chapter Status */}
            <div className="relative z-20 flex items-center justify-between font-mono text-xs">
              <span className="px-2.5 py-1 rounded bg-[#c8ff3d]/15 border border-[#c8ff3d]/40 text-[#c8ff3d] font-bold">
                {chapters[currentChapter].title}
              </span>
              <span className="text-zinc-400 font-mono">{chapters[currentChapter].time}</span>
            </div>

            {/* Center Visual Mockup & Scanning Diagnostics */}
            <div className="relative z-20 max-w-lg mx-auto w-full text-center py-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/15 text-xs font-mono text-zinc-300 mb-4">
                <Sparkles className="w-3.5 h-3.5 text-[#c8ff3d]" />
                <span>INSPECTING: {chapters[currentChapter].activeArea}</span>
              </div>
              <div className="p-4 rounded-xl bg-zinc-900/90 border border-white/10 text-sm sm:text-base font-light text-zinc-200 leading-relaxed font-sans shadow-xl">
                &ldquo;{chapters[currentChapter].narration}&rdquo;
              </div>
            </div>

            {/* Bottom Narration & Telemetry */}
            <div className="relative z-20 flex items-center justify-between font-mono text-xs text-zinc-400 pt-2 border-t border-white/10">
              <div className="flex items-center gap-2 text-zinc-300">
                <ShieldCheck className="w-4 h-4 text-[#c8ff3d]" />
                <span>EVALUATION ENGINE: ACTIVE V2.4</span>
              </div>
              <div className="text-zinc-500">COGNITIVE SACCADES: 40HZ AUDIT PASS</div>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="p-4 sm:p-5 border-t border-border bg-surface-2 font-mono text-xs flex flex-col gap-3">
            {/* Scrub bar */}
            <div className="relative w-full h-2 rounded-full bg-border overflow-hidden cursor-pointer">
              <div
                className="h-full bg-accent transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    playMicroClick();
                    setIsPlaying(!isPlaying);
                  }}
                  className="p-2 rounded-lg bg-surface border border-border hover:bg-surface-2 text-text transition-colors cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>
                <button
                  onClick={handleRestart}
                  className="p-2 rounded-lg bg-surface border border-border hover:bg-surface-2 text-muted hover:text-text transition-colors cursor-pointer"
                  title="Replay from start"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <span className="text-muted font-mono">
                  {Math.floor((progress / 100) * 90)}s / 90s
                </span>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    playMicroClick();
                    onClose();
                    const el = document.getElementById("analyzer");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-4 py-2 rounded-lg bg-accent text-accent-ink font-bold uppercase tracking-wider hover:bg-[#d6ff5e] transition-colors cursor-pointer shadow-sm"
                >
                  Test My App Now &rarr;
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
