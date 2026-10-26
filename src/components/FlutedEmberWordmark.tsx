"use client";

import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

interface FlutedEmberWordmarkProps {
  /** The wordmark string to render inside the fluted ember mask */
  text?: string;
  /** Horizontal spacing between vertical ribs in pixels (default 7) */
  colPitch?: number;
  /** Glow intensity multiplier (default 1.45) */
  glowIntensity?: number;
  /** Height clamp CSS value (default clamp(100px, 15vw, 190px)) */
  heightClamp?: string;
  /** Optional custom CSS classes for the container */
  className?: string;
}

interface EmberParticle {
  col: number;
  yRatio: number;
  speed: number;
  phase: number;
  warm: boolean;
}

export function FlutedEmberWordmark({
  text = "FRICTION",
  colPitch = 7,
  glowIntensity = 1.45,
  heightClamp = "clamp(100px, 15vw, 190px)",
  className = "",
}: FlutedEmberWordmarkProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Offscreen mask canvas that holds the crisp ultra-bold text silhouette
    const maskCanvas = document.createElement("canvas");
    const maskCtx = maskCanvas.getContext("2d");
    if (!maskCtx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let rafId: number | null = null;
    let isVisible = true;
    let particles: EmberParticle[] = [];

    const pointer = {
      x: -9999,
      y: -9999,
      tx: -9999,
      ty: -9999,
      active: false,
    };

    function initParticles(cols: number) {
      particles = [];
      for (let c = 0; c < cols; c++) {
        // 3 shimmering micro-sparks per vertical column
        for (let k = 0; k < 3; k++) {
          particles.push({
            col: c,
            yRatio: Math.random(),
            speed: 0.0012 + Math.random() * 0.0032,
            phase: Math.random() * Math.PI * 2,
            warm: Math.random() > 0.28,
          });
        }
      }
    }

    function drawTextMask() {
      if (!maskCtx) return;
      maskCtx.clearRect(0, 0, width, height);
      maskCtx.fillStyle = "#ffffff";
      maskCtx.textBaseline = "middle";
      maskCtx.textAlign = "center";

      const fontStack =
        "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

      if ("letterSpacing" in maskCtx) {
        (maskCtx as unknown as { letterSpacing: string }).letterSpacing =
          "-0.03em";
      }

      // 1. Measure test glyph bounding box
      const testSize = 100;
      maskCtx.font = `900 ${testSize}px ${fontStack}`;
      const metrics = maskCtx.measureText(text);
      const measuredWidth = metrics.width || 1;
      const ascent = metrics.actualBoundingBoxAscent || testSize * 0.74;
      const descent = metrics.actualBoundingBoxDescent || testSize * 0.12;
      const glyphHeight = ascent + descent;

      // 2. Proportionally scale to fit comfortably inside 92% width and 78% height
      const targetWidth = width * 0.92;
      const targetHeight = height * 0.78;
      const scaleByWidth = targetWidth / measuredWidth;
      const scaleByHeight = targetHeight / glyphHeight;
      const scale = Math.min(scaleByWidth, scaleByHeight);
      const fontSize = Math.max(12, Math.floor(testSize * scale));

      maskCtx.font = `900 ${fontSize}px ${fontStack}`;
      if ("letterSpacing" in maskCtx) {
        (maskCtx as unknown as { letterSpacing: string }).letterSpacing =
          "-0.03em";
      }

      // 3. Render centered vertically so cap tops and baseline have clean, balanced breathing room
      maskCtx.textBaseline = "middle";
      maskCtx.fillText(text, width * 0.5, height * 0.50);
    }

    function resize() {
      if (!wrap || !canvas || !ctx || !maskCtx) return;
      const rect = wrap.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      maskCanvas.width = width * dpr;
      maskCanvas.height = height * dpr;
      maskCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

      drawTextMask();
      initParticles(Math.ceil(width / colPitch));
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!wrap) return;
      const r = wrap.getBoundingClientRect();
      pointer.tx = e.clientX - r.left;
      pointer.ty = e.clientY - r.top;
      pointer.active = true;
    };

    const onPointerLeave = () => {
      pointer.active = false;
    };

    function render(now: number) {
      if (!ctx || !maskCtx) return;
      if (!isVisible) {
        rafId = requestAnimationFrame(render);
        return;
      }

      const t = now * 0.001;

      // Smooth cursor interpolation
      if (pointer.active) {
        if (pointer.x < -1000) {
          pointer.x = pointer.tx;
          pointer.y = pointer.ty;
        } else {
          pointer.x += (pointer.tx - pointer.x) * 0.16;
          pointer.y += (pointer.ty - pointer.y) * 0.16;
        }
      } else {
        pointer.x += (-9999 - pointer.x) * 0.05;
        pointer.y += (-9999 - pointer.y) * 0.05;
      }

      ctx.clearRect(0, 0, width, height);

      const ribWidth = Math.max(2, Math.floor(colPitch * 0.36));
      const cols = Math.ceil(width / colPitch);
      const spotlightRadius = Math.max(180, width * 0.22);

      // 1. Draw fluted vertical columns with ember bottom glow + cursor proximity boost
      for (let c = 0; c < cols; c++) {
        const x = c * colPitch;
        const dx = x - pointer.x;
        const colProximity = pointer.active
          ? Math.max(0, 1 - Math.abs(dx) / spotlightRadius)
          : 0;

        // Subtle per-column organic shimmer wave
        const wave = prefersReduced
          ? 1
          : 0.88 + 0.12 * Math.sin(t * 2.2 + c * 0.45);
        const boost = (1 + colProximity * 0.85) * glowIntensity * wave;

        const grad = ctx.createLinearGradient(0, height * 0.05, 0, height);
        const topGrey = Math.min(85, Math.floor(18 + colProximity * 34));
        const midR = Math.min(255, Math.floor(46 * boost));
        const midG = Math.min(255, Math.floor(16 * boost));
        const midB = Math.min(255, Math.floor(14 * boost));
        const lowR = Math.min(255, Math.floor(175 * boost));
        const lowG = Math.min(255, Math.floor(48 * boost));
        const lowB = Math.min(255, Math.floor(20 * boost));
        const botR = Math.min(255, Math.floor(245 * boost));
        const botG = Math.min(255, Math.floor(88 * boost));
        const botB = Math.min(255, Math.floor(32 * boost));

        grad.addColorStop(0.0, `rgb(${topGrey}, ${topGrey}, ${topGrey + 3})`);
        grad.addColorStop(0.5, `rgb(${midR}, ${midG}, ${midB})`);
        grad.addColorStop(0.8, `rgb(${lowR}, ${lowG}, ${lowB})`);
        grad.addColorStop(1.0, `rgb(${botR}, ${botG}, ${botB})`);

        ctx.fillStyle = grad;
        ctx.fillRect(x, 0, ribWidth, height);

        // Faint 1px secondary rib edge for realistic fluted depth
        ctx.fillStyle = `rgba(255, 120, 60, ${0.03 + colProximity * 0.08})`;
        ctx.fillRect(x + ribWidth, 0, 1, height);
      }

      // 2. Draw shimmering micro-sparks along the vertical ribs
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (!prefersReduced) {
          p.yRatio -= p.speed;
          if (p.yRatio < 0.04) p.yRatio = 0.98;
        }

        const px = p.col * colPitch;
        const py = p.yRatio * height;

        const dist = Math.hypot(px - pointer.x, py - pointer.y);
        const hoverBoost = pointer.active
          ? Math.max(0, 1 - dist / (spotlightRadius * 0.95))
          : 0;
        const flicker = prefersReduced
          ? 0.8
          : 0.5 + 0.5 * Math.sin(t * 6.0 + p.phase);

        // More sparks light up near the bottom ember zone and under the cursor
        const bottomBias = Math.pow(p.yRatio, 1.4);
        const alpha = Math.min(
          1,
          (0.18 + bottomBias * 0.52 + hoverBoost * 0.75) *
            flicker *
            glowIntensity
        );

        if (alpha > 0.08) {
          if (p.warm || hoverBoost > 0.35) {
            ctx.fillStyle = `rgba(255, ${Math.floor(
              170 + hoverBoost * 75
            )}, ${Math.floor(110 + hoverBoost * 110)}, ${alpha})`;
          } else {
            ctx.fillStyle = `rgba(195, 195, 205, ${alpha * 0.65})`;
          }
          ctx.fillRect(px, py, ribWidth, 2.2);
        }
      }

      // 3. Clip everything strictly inside the ultra-bold FRICTION glyph mask
      ctx.globalCompositeOperation = "destination-in";
      ctx.drawImage(maskCanvas, 0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";

      rafId = requestAnimationFrame(render);
    }

    // Performance: Pause canvas render loop when offscreen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.01 }
    );
    observer.observe(wrap);

    wrap.addEventListener("pointermove", onPointerMove);
    wrap.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("resize", resize);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(resize);
    }

    resize();
    rafId = requestAnimationFrame(render);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      observer.disconnect();
      wrap.removeEventListener("pointermove", onPointerMove);
      wrap.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", resize);
    };
  }, [text, colPitch, glowIntensity, prefersReduced]);

  return (
    <div
      ref={wrapRef}
      className={`relative w-full bg-black cursor-crosshair overflow-hidden select-none ${className}`}
      style={{ height: heightClamp }}
    >
      <span className="sr-only">{text}</span>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="block w-full h-full"
      />
    </div>
  );
}
