"use client";

import React, { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const [cursorState, setCursorState] = useState<"default" | "hover" | "text" | "hidden">("default");
  const [isMouseDown, setIsMouseDown] = useState(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // Mouse coords stored in refs to survive re-renders without reset
  const mousePos = useRef({ x: -1000, y: -1000 });
  const ringPos = useRef({ x: -1000, y: -1000 });
  const initialized = useRef(false);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check pointer: fine and prefers-reduced-motion
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!finePointer || reducedMotion) {
      setIsEnabled(false);
      return;
    }

    setIsEnabled(true);

    // Hide native cursor on html and * only after mounting on (pointer: fine)
    document.documentElement.classList.add("custom-cursor-enabled");

    const onPointerMove = (e: PointerEvent) => {
      // First move initialization: never at 0,0
      if (!initialized.current) {
        initialized.current = true;
        mousePos.current.x = e.clientX;
        mousePos.current.y = e.clientY;
        ringPos.current.x = e.clientX;
        ringPos.current.y = e.clientY;
        if (dotRef.current) {
          dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
        }
        if (ringRef.current) {
          ringRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%) scale(1)`;
        }
        setHasMoved(true);
      } else {
        mousePos.current.x = e.clientX;
        mousePos.current.y = e.clientY;
        // Dot follows the pointer instantly
        if (dotRef.current) {
          dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
        }
      }

      // Detect hover target
      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (target.closest("input, textarea, [contenteditable='true']")) {
        setCursorState("text");
        return;
      }

      if (target.closest("button, a, [role='button'], select, label, .cursor-pointer")) {
        setCursorState("hover");
        return;
      }

      setCursorState("default");
    };

    const onMouseDown = () => setIsMouseDown(true);
    const onMouseUp = () => setIsMouseDown(false);
    const onMouseEnter = () => setCursorState("default");
    const onMouseLeave = () => setCursorState("hidden");

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onMouseDown);
    window.addEventListener("pointerup", onMouseUp);
    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mouseleave", onMouseLeave);

    const lerp = (start: number, end: number, factor: number) =>
      start + (end - start) * factor;

    const render = () => {
      if (initialized.current) {
        ringPos.current.x = lerp(ringPos.current.x, mousePos.current.x, 0.15);
        ringPos.current.y = lerp(ringPos.current.y, mousePos.current.y, 0.15);

        if (ringRef.current) {
          ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
        }
      }

      rafId.current = requestAnimationFrame(render);
    };

    rafId.current = requestAnimationFrame(render);

    return () => {
      document.documentElement.classList.remove("custom-cursor-enabled");
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onMouseDown);
      window.removeEventListener("pointerup", onMouseUp);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseleave", onMouseLeave);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  if (!isEnabled) return null;

  const isHidden = !hasMoved || cursorState === "hidden" || cursorState === "text";
  const isHover = cursorState === "hover";

  const ringSize = isHover ? 48 : 36;
  const ringScale = isMouseDown ? 0.85 : 1;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[999999] overflow-hidden select-none"
      style={{
        opacity: isHidden ? 0 : 1,
        transition: "opacity 0.15s ease",
      }}
    >
      {/* Outline Ring (Follower with Lerp Easing 0.15, no fill, no text) */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 rounded-full flex items-center justify-center pointer-events-none bg-transparent transition-[width,height,border-color] duration-200"
        style={{
          width: `${ringSize}px`,
          height: `${ringSize}px`,
          border: isHover
            ? "1.5px solid var(--cursor-ring-hover, var(--accent, #c8ff3d))"
            : "1px solid var(--cursor-ring, var(--border-accent, rgba(200, 255, 61, 0.6)))",
          transform: `translate3d(-1000px, -1000px, 0) translate(-50%, -50%) scale(${ringScale})`,
          willChange: "transform",
        }}
      />

      {/* 8px Instant Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 flex items-center justify-center pointer-events-none transition-opacity duration-150"
        style={{
          opacity: isHover ? 0 : 1,
          transform: "translate3d(-1000px, -1000px, 0) translate(-50%, -50%)",
          willChange: "transform",
        }}
      >
        <div className="w-2 h-2 rounded-full bg-[var(--cursor-dot,var(--accent,#c8ff3d))] shadow-[0_0_8px_var(--cursor-dot-glow,rgba(200,255,61,0.9))]" />
      </div>
    </div>
  );
}
