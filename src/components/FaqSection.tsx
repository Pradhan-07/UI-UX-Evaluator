"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import { playMicroClick } from "@/utils/audio";
import { SectionLabel, Reveal, EASE_PREMIUM } from "@/lib/motion";

interface FaqItem {
  id: string;
  num: string;
  question: string;
  answer: string;
  category: string;
}

const faqs: FaqItem[] = [
  {
    id: "faq-1",
    num: "01",
    question: "How does ProtoLens evaluate cognitive friction without real user tests?",
    category: "METHODOLOGY",
    answer:
      "ProtoLens simulates biological eye saccades, fixation paths, and cognitive load limits using multimodal vision models grounded in cognitive psychology literature (F-pattern scanning, Hick's Law, and Miller's 7±2 rule). It cross-references visual saliency against Nielsen's 10 heuristics and WCAG 2.2 mathematical thresholds to catch 85% of usability blockers before users ever see them.",
  },
  {
    id: "faq-2",
    num: "02",
    question: "Does ProtoLens replace human UX researchers and design systems teams?",
    category: "WORKFLOW",
    answer:
      "No. ProtoLens acts as an unblinking telemetry partner that handles the tedious, repetitive auditing—spotting contrast failures, broken tap targets, inconsistent icon metaphors, and cognitive dead ends in seconds. This frees product designers and researchers to focus on high-level customer empathy and qualitative problem definition.",
  },
  {
    id: "faq-3",
    num: "03",
    question: "What frameworks and UI component libraries can receive code fixes?",
    category: "ENGINEERING",
    answer:
      "ProtoLens outputs production-ready component remediations in React (JSX/TSX), Tailwind CSS utility classes, vanilla CSS custom properties, and standardized JSON audit payloads. You can immediately copy-paste the fixes or export the JSON to populate Jira or GitHub Issues.",
  },
  {
    id: "faq-4",
    num: "04",
    question: "How is WCAG 2.2 AAA accessibility compliance mathematically verified?",
    category: "ACCESSIBILITY",
    answer:
      "Every text layer and interactive icon is sampled against its true rendered background pixel luminance using the W3C relative luminance formula (L = 0.2126*R + 0.7152*G + 0.0722*B). The engine verifies contrast ratios against the strict 4.5:1 (AA) and 7:1 (AAA) thresholds, and bounds all tap targets to ensure compliance with the 44x44px target size minimum (WCAG 2.5.5).",
  },
  {
    id: "faq-5",
    num: "05",
    question: "Is uploaded screenshot telemetry encrypted and protected?",
    category: "PRIVACY & SECURITY",
    answer:
      "Yes. All uploaded screen artifacts are processed in-memory through secure TLS 1.3 tunnels and are never retained for public model training. Transient processing buffers are purged immediately upon report generation, ensuring enterprise NDA compliance.",
  },
];

export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>("faq-1");
  const prefersReduced = useReducedMotion();

  const toggleFaq = (id: string) => {
    playMicroClick();
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      className="py-24 sm:py-32 bg-surface/50 border-b border-border relative overflow-hidden"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <SectionLabel number="08" label="FREQUENTLY ASKED QUESTIONS" />
          <Reveal delay={0.1}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-text uppercase mt-2">
              Autonomous UX Intelligence FAQ.
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-4 text-xs sm:text-sm font-mono text-muted">
              ANSWERS ON COGNITIVE SACCADES, HEURISTIC ENGINES, AND COMPONENT REMEDIATIONS.
            </p>
          </Reveal>
        </div>

        {/* Smooth Accordion List */}
        <div className="divide-y divide-border border-y border-border">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div key={faq.id} className="transition-colors hover:bg-surface-2/60">
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full py-6 sm:py-8 flex items-center justify-between gap-4 text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-4 sm:gap-6 pr-4">
                    <span className="font-mono text-xs sm:text-sm text-accent-text font-bold shrink-0">
                      [{faq.num}]
                    </span>
                    <span className="text-base sm:text-lg md:text-xl font-bold text-text group-hover:text-accent-text transition-colors">
                      {faq.question}
                    </span>
                  </div>

                  {/* Plus icon rotates 45deg to become an X */}
                  <motion.div
                    animate={prefersReduced ? {} : { rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: EASE_PREMIUM }}
                    className={`w-8 h-8 rounded-full border border-border flex items-center justify-center shrink-0 transition-colors ${
                      isOpen
                        ? "bg-accent text-accent-ink border-accent"
                        : "bg-surface-2 text-muted group-hover:text-text group-hover:border-accent-text/40"
                    }`}
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                  </motion.div>
                </button>

                {/* Smooth Height Drawer with Answer Fade-Up */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: EASE_PREMIUM }}
                      className="overflow-hidden"
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3, delay: 0.05 }}
                        className="pb-7 pl-9 sm:pl-14 pr-4"
                      >
                        <div className="font-mono text-[10px] text-accent-text uppercase tracking-wider mb-2 font-bold">
                          CATEGORY // {faq.category}
                        </div>
                        <p className="text-sm sm:text-base font-sans text-text/90 font-light leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
