"use client";

import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";

interface MarqueeTickerProps {
  reverse?: boolean;
  className?: string;
}

function wrap(min: number, max: number, v: number) {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

export function MarqueeTicker({ reverse = false, className = "" }: MarqueeTickerProps) {
  const phrase = "DESIGNERS SHOULD DESIGN. AI SHOULD FIND THE FRICTION. WE BUILD THE EYES THAT SEE IT.";
  const items = Array(8).fill(phrase);

  const prefersReduced = useReducedMotion();
  const baseX = useMotionValue(0);

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });

  // Scale velocity to a multiplier
  const velocityFactor = useTransform(smoothVelocity, [-1200, 0, 1200], [-3.5, 0, 3.5], {
    clamp: false,
  });

  // Direction: 1 moves right, -1 moves left
  const defaultDir = reverse ? 1 : -1;
  const directionFactor = useRef<number>(defaultDir);

  useAnimationFrame((_, delta) => {
    if (prefersReduced) return;

    const vel = smoothVelocity.get();
    // Reverse direction when scrolling up
    if (vel < -30) {
      directionFactor.current = -defaultDir;
    } else if (vel > 30) {
      directionFactor.current = defaultDir;
    }

    // Base movement speed (% per frame)
    const baseStep = 2.5; // % per second base
    const speedBoost = Math.min(Math.abs(velocityFactor.get()), 6);
    const moveBy = directionFactor.current * (baseStep + speedBoost * 3) * (delta / 1000);

    baseX.set(baseX.get() + moveBy);
  });

  // Seamless wrap between -50% and 0%
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  return (
    <div
      className={`relative w-full overflow-hidden py-4 bg-surface border-y border-border select-none ${className}`}
      aria-label="Philosophy Marquee"
    >
      {/* Side gradient masks for smooth fade */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-surface to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-surface to-transparent z-10 pointer-events-none" />

      {prefersReduced ? (
        <div className="flex w-max">
          {items.slice(0, 4).map((text, idx) => (
            <div key={idx} className="flex items-center gap-8 whitespace-nowrap px-4">
              <span className="font-mono text-xs sm:text-sm md:text-base font-bold tracking-widest uppercase text-muted">
                {text}
              </span>
              <span className="text-accent-text text-xs font-mono">✦</span>
            </div>
          ))}
        </div>
      ) : (
        <motion.div style={{ x }} className="flex w-max will-change-transform">
          {items.map((text, idx) => (
            <div key={idx} className="flex items-center gap-8 whitespace-nowrap px-4">
              <span className="font-mono text-xs sm:text-sm md:text-base font-bold tracking-widest uppercase text-muted hover:text-text transition-colors">
                {text}
              </span>
              <span className="text-accent-text text-xs font-mono">✦</span>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
