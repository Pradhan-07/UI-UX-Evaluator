"use client";

import React, { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [cursorState, setCursorState] = useState<"default" | "hover" | "text" | "hidden">("default");
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [hasSvgCursor, setHasSvgCursor] = useState(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // Mouse coords
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check media queries
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!finePointer || reducedMotion) {
      setIsEnabled(false);
      return;
    }

    setIsEnabled(true);

    // Check if /cursor.svg exists
    fetch("/cursor.svg", { method: "HEAD" })
      .then((res) => {
        if (res.ok && res.headers.get("content-type")?.includes("svg")) {
          setHasSvgCursor(true);
        }
      })
      .catch(() => {});

    // Add global body class to hide native cursor
    document.body.classList.add("custom-cursor-enabled");

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      // Update inner dot instantly via transform3d (no layout thrash)
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }

      // Detect hover target
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Text input detection -> custom cursor fades out
      if (target.closest("input, textarea, [contenteditable='true']")) {
        setCursorState("text");
        return;
      }

      // Links, buttons, chips, interactive elements -> ~48px outline ring, dot hides
      if (
        target.closest(
          "button, a, [role='button'], select, label, .cursor-pointer"
        )
      ) {
        setCursorState("hover");
        return;
      }

      setCursorState("default");
    };

    const onMouseDown = () => setIsMouseDown(true);
    const onMouseUp = () => setIsMouseDown(false);

    const onMouseEnter = () => {
      setCursorState("default");
    };

    const onMouseLeave = () => {
      setCursorState("hidden");
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mouseleave", onMouseLeave);

    // Lerp loop for the ring using requestAnimationFrame (~0.15 lerp factor)
    const lerp = (start: number, end: number, factor: number) =>
      start + (end - start) * factor;

    const render = () => {
      ringPos.current.x = lerp(ringPos.current.x, mousePos.current.x, 0.15);
      ringPos.current.y = lerp(ringPos.current.y, mousePos.current.y, 0.15);

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      rafId.current = requestAnimationFrame(render);
    };

    rafId.current = requestAnimationFrame(render);

    return () => {
      document.body.classList.remove("custom-cursor-enabled");
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseleave", onMouseLeave);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  if (!isEnabled) return null;

  // Derive styles based on state
  const isHidden = cursorState === "hidden" || cursorState === "text";
  const isHover = cursorState === "hover";

  // Outline ring dimensions: 36px default, ~48px on hover, outline only (no fill)
  const ringSize = isHover ? 48 : 36;
  const ringBorder = isHover ? "1px solid #c8ff3d" : "1px solid rgba(200, 255, 61, 0.6)";
  const ringScale = isMouseDown ? 0.85 : 1;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[999999] overflow-hidden select-none"
      style={{
        opacity: isHidden ? 0 : 1,
        transition: "opacity 0.2s ease",
      }}
    >
      {/* Outline Ring (Follower with Lerp Easing 0.15, no fill, no text) */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 rounded-full flex items-center justify-center transition-all duration-200 pointer-events-none bg-transparent"
        style={{
          width: `${ringSize}px`,
          height: `${ringSize}px`,
          border: ringBorder,
          transform: `translate3d(-100px, -100px, 0) translate(-50%, -50%) scale(${ringScale})`,
          willChange: "transform",
        }}
      />

      {/* 8px Instant Lime Dot / Optional cursor.svg */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 flex items-center justify-center pointer-events-none transition-opacity duration-150"
        style={{
          opacity: isHover ? 0 : 1,
          transform: "translate3d(-100px, -100px, 0) translate(-50%, -50%)",
          willChange: "transform",
        }}
      >
        {hasSvgCursor ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/cursor.svg"
            alt=""
            className="w-7 h-7 object-contain select-none pointer-events-none"
          />
        ) : (
          <div className="w-2 h-2 rounded-full bg-[#c8ff3d] shadow-[0_0_8px_rgba(200,255,61,0.9)]" />
        )}
      </div>
    </div>
  );
}
