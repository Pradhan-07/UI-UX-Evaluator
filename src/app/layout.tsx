import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "FRICTION_ // AI-Powered App Prototype & UX Evaluator",
  description:
    "Autonomous UX intelligence for digital products. Upload app screenshots or describe user journeys to discover usability issues, conversion impact, and concrete code fixes in seconds.",
  keywords: [
    "UX evaluator",
    "usability audit",
    "AI design critique",
    "Nielsen heuristics",
    "WCAG accessibility",
    "conversion rate optimization",
    "prototype testing",
  ],
  authors: [{ name: "FRICTION Autonomous UX Systems" }],
  openGraph: {
    title: "FRICTION_ // AI-Powered App Prototype & UX Evaluator",
    description:
      "Find the friction. Ship the fix. Nielsen heuristics, cognitive load analysis, and WCAG accessibility audits in real time.",
    type: "website",
  },
};

import { CustomCursor } from "@/components/CustomCursor";
import { SmoothScrollProvider, ScrollProgressBar } from "@/lib/motion";
import { ThemeProvider } from "@/lib/theme";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased scroll-smooth`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem("protolens_theme");
                  var theme = saved || "light";
                  document.documentElement.setAttribute("data-theme", theme);
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-bg text-text font-sans selection:bg-accent selection:text-accent-ink transition-colors duration-150">
        <ThemeProvider>
          <SmoothScrollProvider>
            <ScrollProgressBar />
            <CustomCursor />
            {children}
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
