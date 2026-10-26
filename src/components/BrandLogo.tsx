"use client";

import React from "react";

interface BrandLogoProps {
  className?: string;
  variant?: "auto" | "dark" | "light" | "accent";
  showBadge?: boolean;
}

export function BrandLogo({
  className = "h-10 sm:h-11 w-auto",
  variant = "auto",
  showBadge = false,
}: BrandLogoProps) {
  if (variant === "dark") {
    return (
      <div className="inline-flex items-center gap-2.5 select-none">
        <img
          src="/friction-logo-dark.png"
          alt="FRICTION // UI/UX Evaluator"
          className={`object-contain ${className}`}
        />
        {showBadge && (
          <span className="text-[10px] font-mono tracking-widest text-[#c8ff3d] bg-[#c8ff3d]/10 border border-[#c8ff3d]/30 px-1.5 py-0.5 rounded">
            v2.4
          </span>
        )}
      </div>
    );
  }

  if (variant === "light") {
    return (
      <div className="inline-flex items-center gap-2.5 select-none">
        <img
          src="/friction-logo-light.png"
          alt="FRICTION // UI/UX Evaluator"
          className={`object-contain ${className}`}
        />
        {showBadge && (
          <span className="text-[10px] font-mono tracking-widest text-accent-text bg-accent/10 border border-accent/30 px-1.5 py-0.5 rounded">
            v2.4
          </span>
        )}
      </div>
    );
  }

  if (variant === "accent") {
    return (
      <div className="inline-flex items-center gap-2.5 select-none">
        <img
          src="/friction-logo-accent.png"
          alt="FRICTION // UI/UX Evaluator"
          className={`object-contain ${className}`}
        />
        {showBadge && (
          <span className="text-[10px] font-mono tracking-widest text-accent-text bg-accent/10 border border-accent/30 px-1.5 py-0.5 rounded">
            v2.4
          </span>
        )}
      </div>
    );
  }

  // "auto": Zero-flash CSS-based theme matching
  return (
    <div className="inline-flex items-center gap-2.5 select-none">
      {/* Visible in Dark Theme */}
      <img
        src="/friction-logo-dark.png"
        alt="FRICTION // UI/UX Evaluator"
        className={`object-contain logo-on-dark ${className}`}
      />
      {/* Visible in Light Theme */}
      <img
        src="/friction-logo-light.png"
        alt="FRICTION // UI/UX Evaluator"
        className={`object-contain logo-on-light ${className}`}
      />
      {showBadge && (
        <span className="text-[10px] font-mono tracking-widest text-accent-text bg-accent/10 border border-accent/30 px-1.5 py-0.5 rounded">
          v2.4
        </span>
      )}
    </div>
  );
}
