"use client";

import React from "react";

interface MarqueeTickerProps {
  reverse?: boolean;
  className?: string;
}

export function MarqueeTicker({ reverse = false, className = "" }: MarqueeTickerProps) {
  const phrase = "DESIGNERS SHOULD DESIGN. AI SHOULD FIND THE FRICTION. WE BUILD THE EYES THAT SEE IT.";
  // Repeat items to ensure seamless infinite loop
  const items = Array(8).fill(phrase);

  return (
    <div
      className={`relative w-full overflow-hidden py-4 bg-[#08080a] border-y border-white/[0.08] select-none ${className}`}
      aria-label="Philosophy Marquee"
    >
      {/* Side gradient masks for smooth fade */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#08080a] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#08080a] to-transparent z-10 pointer-events-none" />

      <div className={reverse ? "animate-marquee-reverse" : "animate-marquee"}>
        {items.map((text, idx) => (
          <div key={idx} className="flex items-center gap-8 whitespace-nowrap px-4">
            <span className="font-mono text-xs sm:text-sm md:text-base font-bold tracking-widest uppercase text-zinc-300 hover:text-white transition-colors">
              {text}
            </span>
            <span className="text-[#c8ff3d] text-xs font-mono">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
