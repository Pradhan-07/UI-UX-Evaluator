"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: (e?: React.MouseEvent) => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read theme applied by blocking script on <html>
    const currentTheme = (document.documentElement.getAttribute("data-theme") as Theme) || "light";
    setThemeState(currentTheme);
    setMounted(true);

    // Listen to OS theme changes ONLY if user hasn't chosen manually
    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    const handleSystemChange = (e: MediaQueryListEvent) => {
      const saved = localStorage.getItem("protolens_theme");
      if (!saved) {
        const newTheme = e.matches ? "light" : "dark";
        applyTheme(newTheme, false);
      }
    };

    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, []);

  const applyTheme = (newTheme: Theme, isManual = true) => {
    setThemeState(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    if (isManual) {
      try {
        localStorage.setItem("protolens_theme", newTheme);
      } catch {}
    }
  };

  const toggleTheme = (e?: React.MouseEvent) => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Use View Transitions API if supported and not prefers-reduced-motion
    if (!prefersReduced && "startViewTransition" in document && e) {
      const x = e.clientX;
      const y = e.clientY;
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      // View Transitions API
      const doc = document as unknown as { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
      const transition = doc.startViewTransition?.(() => {
        applyTheme(nextTheme, true);
      });

      transition?.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 400,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      });
      return;
    }

    // Fallback: 250ms transition
    if (!prefersReduced) {
      document.documentElement.classList.add("theme-transitioning");
      applyTheme(nextTheme, true);
      setTimeout(() => {
        document.documentElement.classList.remove("theme-transitioning");
      }, 260);
    } else {
      applyTheme(nextTheme, true);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme: (t) => applyTheme(t, true) }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
