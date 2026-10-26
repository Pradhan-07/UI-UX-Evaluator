"use client";

import React, { useEffect, useRef, useState, useId } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Lenis from "lenis";

// Core Motion Design Tokens
export const EASE_PREMIUM: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const DURATIONS = {
  fast: 0.2,
  base: 0.6,
  slow: 1.0,
} as const;

export const STAGGER = 0.06;

export const VIEWPORT = {
  once: true,
  margin: "-80px",
} as const;

// 1) Smooth Scroll Provider (Lenis) with reduced-motion respect
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined" || prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    // Expose globally for smooth programmatic jumps
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, [prefersReduced]);

  return <>{children}</>;
}

// 2) 2px Lime Scroll Progress Bar (Fixed at top)
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[2px] bg-[#c8ff3d] z-[99999] origin-left pointer-events-none shadow-[0_0_10px_rgba(200,255,61,0.8)]"
      aria-hidden="true"
    />
  );
}

// 3) <Reveal />: fade + translateY with subtle blur filter
export function Reveal({
  children,
  delay = 0,
  duration = DURATIONS.base,
  y = 24,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  className?: string;
}) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: DURATIONS.fast, delay }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={VIEWPORT}
      transition={{ duration, delay, ease: EASE_PREMIUM }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// 4) <SplitText />: Line/Word mask reveal (overflow-hidden container)
export function SplitText({
  text,
  className = "",
  lineClassName = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  lineClassName?: string;
  delay?: number;
}) {
  const prefersReduced = useReducedMotion();
  const lines = text.split("\n");

  if (prefersReduced) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={`inline-block ${className}`} aria-label={text}>
      {lines.map((line, idx) => (
        <span
          key={idx}
          className={`block overflow-hidden ${lineClassName}`}
          aria-hidden="true"
        >
          <motion.span
            className="block"
            initial={{ y: "110%" }}
            whileInView={{ y: "0%" }}
            viewport={VIEWPORT}
            transition={{
              duration: DURATIONS.base,
              delay: delay + idx * 0.08,
              ease: EASE_PREMIUM,
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// 5) <Typewriter />: types text character by character when in view
export function Typewriter({
  text,
  speed = 30,
  delay = 0,
  className = "",
  showCursor = true,
}: {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  showCursor?: boolean;
}) {
  const [displayText, setDisplayText] = useState("");
  const [isDone, setIsDone] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) {
      setDisplayText(text);
      setIsDone(true);
      return;
    }

    if (!inView) return;

    let timeout: NodeJS.Timeout;
    let index = 0;

    const startTyping = () => {
      const interval = setInterval(() => {
        index++;
        setDisplayText(text.slice(0, index));
        if (index >= text.length) {
          clearInterval(interval);
          setIsDone(true);
        }
      }, speed);
    };

    if (delay > 0) {
      timeout = setTimeout(startTyping, delay * 1000);
    } else {
      startTyping();
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [inView, text, speed, delay, prefersReduced]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{displayText}</span>
      {showCursor && (
        <span
          className={`text-[#c8ff3d] font-bold ${
            isDone ? "blink-cursor" : "opacity-100"
          }`}
          aria-hidden="true"
        >
          _
        </span>
      )}
    </span>
  );
}

// 6) <CountUp />: Odometer digit roll on view
export function CountUp({
  target,
  decimals = 0,
  duration = 1800,
  suffix = "",
  className = "",
}: {
  target: number;
  decimals?: number;
  duration?: number;
  suffix?: string;
  className?: string;
}) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) {
      setVal(target);
      return;
    }

    if (!inView) return;

    let startTime: number | null = null;
    const startVal = 0;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(startVal + (target - startVal) * eased);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setVal(target);
      }
    };

    requestAnimationFrame(step);
  }, [inView, target, duration, prefersReduced]);

  return (
    <span ref={ref} className={className}>
      {decimals > 0 ? val.toFixed(decimals) : Math.round(val).toLocaleString()}
      {suffix && <span className="text-[#c8ff3d] ml-0.5">{suffix}</span>}
    </span>
  );
}

// 7) <Magnetic />: Gentle spring pull on hover (desktop fine pointer only)
export function Magnetic({
  children,
  intensity = 0.25,
  className = "",
}: {
  children: React.ReactNode;
  intensity?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const prefersReduced = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced || typeof window === "undefined") return;
    if (window.innerWidth < 768) return; // Disable on mobile

    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = (e.clientX - centerX) * intensity;
    const y = (e.clientY - centerY) * intensity;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 220, damping: 18, mass: 0.3 }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}

// 8) <ScrambleText />: Decoding text effect with zero layout shift
const UPPERCASE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function ScrambleText({
  text,
  duration = 400,
  triggerOnHover = false,
  className = "",
}: {
  text: string;
  duration?: number;
  triggerOnHover?: boolean;
  className?: string;
}) {
  const [displayText, setDisplayText] = useState(text);
  const isRunning = useRef(false);
  const hasRun = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const prefersReduced = useReducedMotion();

  const runScramble = () => {
    if (prefersReduced || isRunning.current) return;
    isRunning.current = true;
    const len = text.length;
    const startTime = performance.now();

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const revealed = Math.floor(progress * len);

      let result = "";
      for (let i = 0; i < len; i++) {
        if (i < revealed) {
          result += text[i];
        } else {
          result += UPPERCASE_CHARS[Math.floor(Math.random() * UPPERCASE_CHARS.length)];
        }
      }
      setDisplayText(result);

      if (progress >= 1) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;
        setDisplayText(text);
        isRunning.current = false;
        hasRun.current = true;
      }
    }, 30);
  };

  useEffect(() => {
    if (prefersReduced) {
      setDisplayText(text);
      return;
    }
    if (!triggerOnHover && inView && !hasRun.current) {
      runScramble();
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [inView, triggerOnHover, text, prefersReduced]);

  return (
    <span
      ref={ref}
      onMouseEnter={triggerOnHover ? runScramble : undefined}
      className={`relative inline-block ${className}`}
    >
      {/* Real text preserved in DOM for layout sizing and screen readers (transparent, nowrap) */}
      <span
        style={{ color: "transparent", whiteSpace: "nowrap" }}
        className="select-none"
      >
        {text}
      </span>
      {/* Absolutely positioned overlay for scrambled glyphs (aria-hidden) */}
      <span
        className="absolute inset-0 select-none whitespace-nowrap pointer-events-none"
        aria-hidden="true"
      >
        {displayText}
      </span>
    </span>
  );
}

// 9) <SectionLabel />: Types "[0N] TITLE" once, then a blinking lime underscore
export function SectionLabel({
  number,
  label,
  className = "",
}: {
  number: string;
  label: string;
  className?: string;
}) {
  const fullText = `[${number}] ${label}`;
  return (
    <div
      className={`inline-flex items-center gap-2 font-mono text-xs sm:text-sm text-muted mb-4 px-3 py-1.5 rounded-full border border-border bg-surface shadow-xs ${className}`}
    >
      <Typewriter text={fullText} speed={25} showCursor={true} />
    </div>
  );
}
