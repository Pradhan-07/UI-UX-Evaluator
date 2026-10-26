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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} dark antialiased scroll-smooth`}
    >
      <body className="min-h-screen bg-[#08080a] text-[#f2f2f2] font-sans selection:bg-[#c8ff3d] selection:text-black">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
