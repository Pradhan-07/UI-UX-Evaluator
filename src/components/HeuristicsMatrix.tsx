"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
import { Search, Sparkles, X, RotateCcw } from "lucide-react";
import { HEURISTICS_DATABASE, HeuristicDetail } from "@/data/heuristics";
import { playMicroClick } from "@/utils/audio";

// Animated counter component for chip counts
function AnimatedCount({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValue = useRef(value);

  useEffect(() => {
    if (prevValue.current === value) return;
    const start = prevValue.current;
    const end = value;
    prevValue.current = value;
    const duration = 250;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutQuad
      const current = Math.round(start + (end - start) * (1 - (1 - progress) * (1 - progress)));
      setDisplayValue(current);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setDisplayValue(end);
      }
    };

    requestAnimationFrame(step);
  }, [value]);

  return <span className="tabular-nums font-mono text-[11px] opacity-80">({displayValue})</span>;
}

// Scramble text effect for Rule ID (e.g. [N-01])
function ScrambleId({ text, disabled }: { text: string; disabled: boolean }) {
  const [displayText, setDisplayText] = useState(`[${text}]`);
  const isScrambling = useRef(false);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#*!";

  const handleHover = () => {
    if (disabled || isScrambling.current) return;
    isScrambling.current = true;
    const original = `[${text}]`;
    const length = original.length;
    const duration = 380;
    const startTime = performance.now();

    const interval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const revealedCount = Math.floor(progress * length);

      let scrambled = "";
      for (let i = 0; i < length; i++) {
        if (i < revealedCount) {
          scrambled += original[i];
        } else {
          scrambled += chars[Math.floor(Math.random() * chars.length)];
        }
      }

      setDisplayText(scrambled);

      if (progress >= 1) {
        clearInterval(interval);
        setDisplayText(original);
        isScrambling.current = false;
      }
    }, 30);
  };

  return (
    <span
      onMouseEnter={handleHover}
      className="font-mono text-xs sm:text-sm font-bold text-[#c8ff3d] tracking-wider select-none cursor-default inline-block"
    >
      {displayText}
    </span>
  );
}

// Text highlighting utility
function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;

  const cleanQuery = query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${cleanQuery})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="heuristic-mark">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

export function HeuristicsMatrix() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchInput, setSearchInput] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");

  const sectionRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" });
  const prefersReducedMotion = useReducedMotion() ?? false;

  // Typewriter effect for section label
  const fullLabel = "[06] EVALUATION STANDARDS MATRIX";
  const [typedLabel, setTypedLabel] = useState("");
  const [typingComplete, setTypingComplete] = useState(false);

  useEffect(() => {
    if (!isInView) return;
    if (prefersReducedMotion) {
      setTypedLabel(fullLabel);
      setTypingComplete(true);
      return;
    }

    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTypedLabel(fullLabel.slice(0, i));
      if (i >= fullLabel.length) {
        clearInterval(interval);
        setTypingComplete(true);
      }
    }, 28);

    return () => clearInterval(interval);
  }, [isInView, prefersReducedMotion]);

  // Debounce search query by 150ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchInput.trim().toLowerCase());
    }, 150);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Keyboard shortcut listener: "/" to focus, "Esc" to clear
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If user presses "/" and isn't typing in an input
      if (
        e.key === "/" &&
        document.activeElement !== searchInputRef.current &&
        !["INPUT", "TEXTAREA"].includes((document.activeElement?.tagName || ""))
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
        playMicroClick(800);
      }

      // If user presses "Esc" while search is focused or active
      if (e.key === "Escape") {
        if (searchInput || document.activeElement === searchInputRef.current) {
          setSearchInput("");
          setDebouncedQuery("");
          searchInputRef.current?.blur();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchInput]);

  // Filter categories
  const categories = ["all", "Nielsen", "WCAG 2.2", "Cognitive Psychology"];

  // Filter logic across title, description, detection rule, remedy
  const filteredRules = useMemo(() => {
    return HEURISTICS_DATABASE.filter((item) => {
      const matchesCat =
        selectedCategory === "all" || item.category === selectedCategory;

      if (!matchesCat) return false;
      if (!debouncedQuery) return true;

      const q = debouncedQuery;
      return (
        item.name.toLowerCase().includes(q) ||
        item.number.toLowerCase().includes(q) ||
        item.definition.toLowerCase().includes(q) ||
        item.detectionRule.toLowerCase().includes(q) ||
        item.remedy.toLowerCase().includes(q)
      );
    });
  }, [selectedCategory, debouncedQuery]);

  // Counts per category for animated chips
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: HEURISTICS_DATABASE.length,
    };
    categories.forEach((cat) => {
      if (cat !== "all") {
        counts[cat] = HEURISTICS_DATABASE.filter((i) => i.category === cat).length;
      }
    });
    return counts;
  }, []);

  const handleClearFilters = () => {
    playMicroClick(750);
    setSearchInput("");
    setDebouncedQuery("");
    setSelectedCategory("all");
    searchInputRef.current?.focus();
  };

  return (
    <section
      id="heuristics"
      ref={sectionRef}
      className="py-24 sm:py-32 bg-[#08080a] border-b border-white/[0.08] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1) SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            {/* Typewritten section tag with blinking lime cursor */}
            <div className="inline-flex items-center gap-1.5 font-mono text-xs sm:text-sm text-zinc-400 mb-4 h-6">
              <span className="text-[#c8ff3d] font-bold">
                {typedLabel.slice(0, 4)}
              </span>
              <span className="tracking-wider uppercase text-zinc-300">
                {typedLabel.slice(4)}
              </span>
              <span className="text-[#c8ff3d] font-bold blink-cursor">_</span>
            </div>

            {/* Masked Line Reveal for Heading */}
            <div className="overflow-hidden">
              <motion.h2
                initial={prefersReducedMotion ? { opacity: 0 } : { y: "100%" }}
                animate={isInView ? (prefersReducedMotion ? { opacity: 1 } : { y: 0 }) : {}}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white uppercase"
              >
                Heuristic Rulebook.
              </motion.h2>
            </div>
          </div>

          {/* Right-Side Caption fading in 200ms later */}
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 8 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-mono text-xs text-zinc-400 max-w-sm leading-relaxed"
          >
            THE SCIENTIFIC FRAMEWORK DRIVING EVERY AUDIT. ZERO ARBITRARY CRITIQUES.
          </motion.div>
        </div>

        {/* 1px Lime Line Drawing Left-to-Right */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          style={{ transformOrigin: "left" }}
          className="h-[1px] w-full bg-[#c8ff3d] mt-8"
        />

        {/* 3) FILTER CHIPS + SEARCH BAR */}
        <div className="mt-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Animated Shared layoutId Filter Chips (WCAG 2.5.5 touch height) */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              const count = categoryCounts[cat] || 0;
              const label =
                cat === "all" ? "All Rules" : cat;

              return (
                <button
                  key={cat}
                  onClick={() => {
                    playMicroClick(900);
                    setSelectedCategory(cat);
                  }}
                  className={`relative min-h-[36px] sm:min-h-[32px] px-3.5 py-1.5 rounded-lg font-mono text-xs transition-colors cursor-pointer flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8ff3d] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08080a] ${
                    isSelected ? "text-black font-bold z-10" : "text-zinc-300 hover:text-white border border-white/10 hover:border-white/20 bg-white/[0.02]"
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeFilterChip"
                      className="absolute inset-0 bg-[#c8ff3d] rounded-lg -z-10 shadow-[0_0_14px_rgba(200,255,61,0.3)]"
                      transition={
                        prefersReducedMotion
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 350, damping: 28 }
                      }
                    />
                  )}
                  <span>{label}</span>
                  <AnimatedCount value={count} />
                </button>
              );
            })}
          </div>

          {/* Search Box with focus ring & keyboard shortcut hint */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search heuristics, rules, terms... (Press '/')"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-zinc-950/90 border border-white/15 rounded-xl pl-10 pr-9 py-2 font-mono text-xs text-zinc-100 placeholder:text-zinc-500 transition-all duration-200 focus:border-[#c8ff3d] focus:ring-[3px] focus:ring-[#c8ff3d]/15 focus:outline-none"
            />
            {searchInput ? (
              <button
                onClick={() => {
                  setSearchInput("");
                  setDebouncedQuery("");
                  searchInputRef.current?.focus();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1"
                title="Clear search (Esc)"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="hidden sm:inline absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-zinc-900 border border-white/15 text-[10px] font-mono text-zinc-400 pointer-events-none">
                /
              </kbd>
            )}
          </div>
        </div>

        {/* 2) CARDS GRID (14 rules) */}
        <motion.div layout="position" className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
          <AnimatePresence mode="popLayout">
            {filteredRules.map((rule, idx) => (
              <motion.div
                key={rule.number}
                layout="position"
                initial={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: 24, filter: "blur(6px)" }
                }
                whileInView={
                  prefersReducedMotion
                    ? { opacity: 1 }
                    : { opacity: 1, y: 0, filter: "blur(0px)" }
                }
                exit={{ opacity: 0, scale: 0.96 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0.2 }
                    : {
                        duration: 0.45,
                        delay: (idx % 6) * 0.06,
                        ease: [0.22, 1, 0.36, 1],
                      }
                }
                whileHover={
                  prefersReducedMotion
                    ? {}
                    : {
                        y: -4,
                        boxShadow: "0 12px 30px -10px rgba(200, 255, 61, 0.16)",
                        transition: { type: "spring", stiffness: 300, damping: 24 },
                      }
                }
                onPointerMove={(e) => {
                  if (prefersReducedMotion) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
                  e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
                }}
                tabIndex={0}
                className="group relative p-6 sm:p-7 rounded-xl border border-white/[0.08] hover:border-[#c8ff3d]/40 bg-zinc-950/70 backdrop-blur-sm transition-colors duration-200 flex flex-col justify-between overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8ff3d]"
              >
                {/* Mouse spotlight overlay (no re-renders, uses CSS vars --mx / --my) */}
                {!prefersReducedMotion && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
                    style={{
                      background:
                        "radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(200, 255, 61, 0.08), transparent 70%)",
                    }}
                  />
                )}

                <div className="relative z-10">
                  {/* Card Header: Rule ID with scramble effect + Category badge */}
                  <div className="flex items-center justify-between font-mono text-xs mb-3.5">
                    <ScrambleId
                      text={rule.number}
                      disabled={prefersReducedMotion}
                    />
                    <span className="px-2.5 py-0.5 rounded bg-white/[0.06] border border-white/15 text-zinc-300 text-[11px] font-mono uppercase tracking-wide">
                      {rule.category}
                    </span>
                  </div>

                  {/* Rule Name */}
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white mb-2.5 group-hover:text-zinc-100 transition-colors">
                    <HighlightText text={rule.name} query={debouncedQuery} />
                  </h3>

                  {/* Definition / Body Text (Accessible >=13px and >=4.5:1 contrast) */}
                  <p className="text-[13px] sm:text-sm text-zinc-300 font-sans leading-relaxed mb-5">
                    <HighlightText text={rule.definition} query={debouncedQuery} />
                  </p>
                </div>

                {/* Bottom Inspection Rows with 2px Lime Bar on Hover */}
                <div className="relative z-10 pt-4 border-t border-white/[0.07] space-y-3 font-mono text-xs">
                  {/* Detection Rule Row */}
                  <div className="relative pl-3 py-1 group/row transition-colors">
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#c8ff3d] origin-top scale-y-0 group-hover/row:scale-y-100 transition-transform duration-200"
                    />
                    <div>
                      <span className="text-amber-400 font-semibold mr-1.5 uppercase tracking-wide">
                        DETECTION RULE:
                      </span>
                      <span className="text-zinc-300 font-sans leading-relaxed">
                        <HighlightText text={rule.detectionRule} query={debouncedQuery} />
                      </span>
                    </div>
                  </div>

                  {/* Concrete Remedy Row */}
                  <div className="relative pl-3 py-1 group/row transition-colors">
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#c8ff3d] origin-top scale-y-0 group-hover/row:scale-y-100 transition-transform duration-200"
                    />
                    <div>
                      <span className="text-[#c8ff3d] font-semibold mr-1.5 uppercase tracking-wide">
                        CONCRETE REMEDY:
                      </span>
                      <span className="text-zinc-300 font-sans leading-relaxed">
                        <HighlightText text={rule.remedy} query={debouncedQuery} />
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State when search has 0 matches */}
        {filteredRules.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 p-12 text-center rounded-2xl border border-white/[0.08] bg-zinc-950/60 font-mono"
          >
            <div className="text-base sm:text-lg text-white font-bold tracking-wider mb-2">
              <span>NO RULES MATCH THAT QUERY</span>
              <span className="text-[#c8ff3d] blink-cursor">_</span>
            </div>
            <p className="text-xs text-zinc-400 mb-6">
              No heuristics found matching &ldquo;{searchInput}&rdquo; in category &ldquo;{selectedCategory}&rdquo;.
            </p>
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#c8ff3d] text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#d6ff5e] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear filters</span>
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
