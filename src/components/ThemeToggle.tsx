"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { playMicroClick } from "@/utils/audio";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    playMicroClick(1200);
    toggleTheme(e);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={`relative min-w-[44px] min-h-[44px] w-11 h-11 rounded-xl flex items-center justify-center border border-border bg-surface text-text hover:bg-surface-2 transition-colors cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-[var(--accent-text)] ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ rotate: -90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="flex items-center justify-center text-text"
          >
            <Moon className="w-4 h-4" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: 90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="flex items-center justify-center text-[var(--accent-text)]"
          >
            <Sun className="w-4 h-4" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
