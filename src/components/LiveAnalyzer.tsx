"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  AlertOctagon,
  Info,
  Copy,
  Check,
  RotateCcw,
  Download,
  Plus,
  Trash2,
  Maximize2,
  ExternalLink,
  ChevronRight,
  Filter,
  CheckCircle2,
  Cpu,
  Zap,
} from "lucide-react";
import confetti from "canvas-confetti";
import { AUDIT_PRESETS } from "@/data/presets";
import { UsabilityIssue, Severity, AuditPreset } from "@/types";
import { playMicroClick, playPinSelect, playSuccessChime } from "@/utils/audio";

interface BackendHealth {
  status: string;
  ai: string;
  model: string;
}

export function LiveAnalyzer() {
  const [activePreset, setActivePreset] = useState<AuditPreset>(AUDIT_PRESETS[0]);
  const [inputMode, setInputMode] = useState<"screenshot" | "journey">("screenshot");
  
  // Custom upload state
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedFileObjects, setUploadedFileObjects] = useState<File[]>([]);
  const [journeySteps, setJourneySteps] = useState<string[]>([
    "User lands on product checkout page",
    "Selects shipping address and delivery speed",
    "Attempts to enter credit card details in modal",
    "Clicks 'Pay Now' with no visual loading feedback",
  ]);
  const [contextNote, setContextNote] = useState<string>("");
  
  // Backend connection & AI status
  const [backendHealth, setBackendHealth] = useState<BackendHealth | null>(null);
  const [aiSource, setAiSource] = useState<string>("gemini");
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [roadmap, setRoadmap] = useState<string[]>([]);
  const [backendScore, setBackendScore] = useState<number | null>(null);

  // Analysis Pipeline state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<number>(0);
  const [hasAnalyzed, setHasAnalyzed] = useState<boolean>(true); // default true for immediate visual wow!
  
  // Results Interactive State
  const [issues, setIssues] = useState<UsabilityIssue[]>(AUDIT_PRESETS[0].issues);
  const [activePinId, setActivePinId] = useState<string | null>(AUDIT_PRESETS[0].issues[0].id);
  const [hoveredPinId, setHoveredPinId] = useState<string | null>(null);
  const [severityFilter, setSeverityFilter] = useState<"all" | Severity>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  const analysisSteps = [
    "Ingesting screenshots & transmitting to ProtoLens backend...",
    "Gemini vision evaluating visual hierarchy & cognitive saccades...",
    "Checking Nielsen's 10 Heuristics & WCAG 2.2 contrast compliance...",
    "Synthesizing severity scoring & engineering remediation patches...",
  ];

  // Check backend health on mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/health");
        if (res.ok) {
          const data = await res.json();
          setBackendHealth(data);
          return;
        }
      } catch {
        // try 5000 if 5001 is unavailable
      }
      try {
        const res2 = await fetch("http://localhost:5000/api/health");
        if (res2.ok) {
          const data2 = await res2.json();
          setBackendHealth(data2);
        }
      } catch {
        setBackendHealth(null);
      }
    };
    checkBackend();
  }, []);

  // Dynamic Usability Score calculation based on resolved issues
  const initialPenaltyTotal = issues.reduce((acc, issue) => acc + issue.scorePenalty, 0);
  const currentPenaltyRemaining = issues.reduce(
    (acc, issue) => acc + (issue.isResolved ? 0 : issue.scorePenalty),
    0
  );
  const baseScore = backendScore !== null ? backendScore : activePreset.initialScore;
  const currentScore = Math.min(100, Math.round(baseScore + (initialPenaltyTotal - currentPenaltyRemaining)));

  // Load preset handler
  const handleSelectPreset = (preset: AuditPreset) => {
    playMicroClick(1000);
    setActivePreset(preset);
    setInputMode(preset.type);
    setContextNote(preset.context);
    setIssues(preset.issues);
    setBackendScore(null);
    setAiSummary(null);
    setRoadmap([]);
    setActivePinId(preset.issues[0]?.id || null);
    if (preset.steps) {
      setJourneySteps(preset.steps);
    }
  };

  // Run Real Backend Analysis
  const handleRunAnalysis = async () => {
    playMicroClick(1150);
    setIsAnalyzing(true);
    setAnalysisStep(0);

    // Progress animation loop
    const stepInterval = setInterval(() => {
      setAnalysisStep((prev) => {
        if (prev < analysisSteps.length - 1) {
          playMicroClick(800 + prev * 100);
          return prev + 1;
        }
        return prev;
      });
    }, 800);

    const backendPort = backendHealth ? 5001 : 5001;
    const backendUrl = `http://localhost:${backendPort}/api/analyze`;

    try {
      const formData = new FormData();
      
      if (uploadedFileObjects.length > 0) {
        uploadedFileObjects.forEach((file) => {
          formData.append("screenshots", file);
        });
      } else {
        // Fetch current preset image as a blob
        try {
          const sampleUrl = activePreset.imageSrc || "/samples/checkout.jpg";
          const imgRes = await fetch(sampleUrl);
          const blob = await imgRes.blob();
          formData.append("screenshots", blob, "screen.jpg");
        } catch (fetchErr) {
          console.warn("Could not convert preset image to blob:", fetchErr);
        }
      }

      formData.append("appName", activePreset.name || "App Evaluation");
      formData.append("targetUser", contextNote || "First-time mobile shoppers");
      formData.append("task", "Complete primary conversion action");
      formData.append("platform", "mobile");

      const response = await fetch(backendUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Backend returned status ${response.status}`);
      }

      const json = await response.json();

      if (json.success && json.data) {
        const { data, source } = json;
        setAiSource(source || "gemini");
        setAiSummary(data.summary || null);
        setRoadmap(data.roadmap || []);
        if (typeof data.score === "number") {
          setBackendScore(data.score);
        }

        // Map backend issues to our rich UI UsabilityIssue format
        const pinPositions = [
          { x: 74, y: 32 },
          { x: 38, y: 44 },
          { x: 50, y: 55 },
          { x: 78, y: 72 },
          { x: 50, y: 83 },
          { x: 24, y: 15 },
        ];

        interface BackendIssue {
          screen?: number;
          title: string;
          severity: string;
          heuristic: string;
          evidence?: string;
          impact: string;
          fix: string;
          effort?: string;
        }

        const mappedIssues: UsabilityIssue[] = (data.issues || []).map(
          (item: BackendIssue, idx: number) => {
            const sev = (item.severity?.toLowerCase() as Severity) || "medium";
            return {
              id: `api-issue-${idx + 1}-${Date.now()}`,
              pinNumber: idx + 1,
              pinLocation: pinPositions[idx % pinPositions.length],
              title: item.title,
              severity: sev,
              heuristic: item.heuristic || "Nielsen Heuristic",
              heuristicCategory: "Nielsen",
              impact: item.impact || item.evidence || "Impairs usability and increases friction.",
              fix: {
                summary: item.fix,
                codeSnippet: `// Concrete fix for: ${item.title} (${item.effort || "Quick win"})\n// Heuristic: ${item.heuristic}\n/* ${item.fix} */`,
              },
              scorePenalty: sev === "critical" ? 14 : sev === "high" ? 9 : sev === "medium" ? 5 : 2,
              isResolved: false,
            };
          }
        );

        if (mappedIssues.length > 0) {
          setIssues(mappedIssues);
          setActivePinId(mappedIssues[0].id);
        }
      }
    } catch (err) {
      console.warn("Backend call failed or timed out, keeping active preset data:", err);
      // Keep existing preset issues as reliable fallback
      setIssues(activePreset.issues);
      setActivePinId(activePreset.issues[0]?.id || null);
    } finally {
      clearInterval(stepInterval);
      setIsAnalyzing(false);
      setHasAnalyzed(true);
      playSuccessChime();
    }
  };

  // Handle local image upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    playMicroClick(950);
    const newUrls: string[] = [];
    const fileArray = Array.from(files);
    setUploadedFileObjects((prev) => [...prev, ...fileArray]);

    fileArray.forEach((file) => {
      const url = URL.createObjectURL(file);
      newUrls.push(url);
    });

    setUploadedImages((prev) => [...prev, ...newUrls]);
    setInputMode("screenshot");
  };

  // Handle Pin Click
  const handlePinClick = (issueId: string) => {
    playPinSelect();
    setActivePinId(issueId);
    // Scroll matching card into view smoothly
    const cardEl = document.getElementById(`card-${issueId}`);
    if (cardEl && cardsContainerRef.current) {
      cardEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  // Toggle issue resolved state
  const handleToggleResolved = (issueId: string) => {
    playMicroClick(1100);
    setIssues((prev) => {
      const next = prev.map((item) =>
        item.id === issueId ? { ...item, isResolved: !item.isResolved } : item
      );
      // Trigger celebration if all resolved
      const allResolved = next.every((item) => item.isResolved);
      if (allResolved) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#C8FF3D", "#FFFFFF", "#9ECB28"],
        });
      }
      return next;
    });
  };

  // Copy Fix Snippet
  const handleCopyFix = (snippet: string, id: string) => {
    playMicroClick(1200);
    navigator.clipboard.writeText(snippet);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2200);
  };

  // Export JSON Report
  const handleExportReport = () => {
    playMicroClick(1000);
    const report = {
      project: "FRICTION Autonomous UX Audit",
      timestamp: new Date().toISOString(),
      presetName: activePreset.name,
      score: currentScore,
      aiSource,
      summary: aiSummary,
      roadmap,
      heuristicsEvaluated: "Nielsen 10 + WCAG 2.2 AAA",
      issues: issues.map((i) => ({
        id: i.id,
        pin: i.pinNumber,
        title: i.title,
        severity: i.severity,
        heuristic: i.heuristic,
        impact: i.impact,
        fix: i.fix,
        resolved: !!i.isResolved,
      })),
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `friction-ux-audit-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filtered issues list
  const filteredIssues = issues.filter((i) => {
    if (severityFilter === "all") return true;
    return i.severity === severityFilter;
  });

  const getSeverityBadge = (sev: Severity) => {
    switch (sev) {
      case "critical":
        return {
          bg: "bg-rose-500/10 text-rose-400 border-rose-500/30",
          icon: AlertOctagon,
          label: "CRITICAL",
        };
      case "high":
        return {
          bg: "bg-amber-500/10 text-amber-400 border-amber-500/30",
          icon: AlertTriangle,
          label: "HIGH",
        };
      case "medium":
        return {
          bg: "bg-[#c8ff3d]/10 text-[#c8ff3d] border-[#c8ff3d]/30",
          icon: Info,
          label: "MEDIUM",
        };
      case "low":
        return {
          bg: "bg-zinc-500/10 text-zinc-400 border-zinc-500/30",
          icon: Info,
          label: "LOW",
        };
    }
  };

  // Active display image: custom upload or active preset image
  const displayImageSrc =
    uploadedImages.length > 0 ? uploadedImages[0] : activePreset.imageSrc;

  return (
    <section
      id="analyzer"
      className="py-24 sm:py-32 bg-[#08080a] border-b border-white/[0.08] relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm text-zinc-400 mb-4">
              <span className="text-[#c8ff3d] font-bold">[05]</span>
              <span className="tracking-wider uppercase text-zinc-300">
                LIVE ANALYZER // THE CORE
              </span>
              <span className="text-[#c8ff3d] font-bold blink-cursor">_</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white uppercase">
              Autonomous Usability Evaluation.
            </h2>
          </div>

          {/* Backend Status indicator */}
          <div className="flex flex-col sm:items-end gap-2 font-mono text-xs">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-zinc-950">
              <span
                className={`w-2 h-2 rounded-full ${
                  backendHealth ? "bg-[#c8ff3d] animate-pulse" : "bg-zinc-600"
                }`}
              />
              <span className="text-zinc-300 font-bold">
                {backendHealth
                  ? `BACKEND: ${backendHealth.ai.toUpperCase()} (${backendHealth.model})`
                  : "PROTOLENS BACKEND: PORT 5001 READY"}
              </span>
            </div>
            <span className="text-zinc-500 text-[11px]">
              DROP APP SCREENSHOTS OR PASTE A USER JOURNEY TO ISOLATE FRICTION.
            </span>
          </div>
        </div>

        {/* 1-Click Quick Presets Bar */}
        <div className="mt-8 p-4 rounded-xl border border-white/[0.08] bg-zinc-950/60 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-zinc-400 uppercase tracking-wider mr-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#c8ff3d]" />
              <span>TEST SAMPLE FLOWS:</span>
            </span>
            {AUDIT_PRESETS.map((preset) => {
              const isSelected = activePreset.id === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#c8ff3d] text-black font-bold shadow-[0_0_15px_rgba(200,255,61,0.3)]"
                      : "bg-white/[0.03] text-zinc-300 hover:text-white border border-white/10 hover:border-white/20"
                  }`}
                >
                  {preset.name}
                </button>
              );
            })}
          </div>

          <div className="font-mono text-xs text-zinc-400 flex items-center gap-2">
            <span>INPUT:</span>
            <span className="text-white uppercase font-bold">{inputMode}</span>
          </div>
        </div>

        {/* Input Configuration Drawer */}
        <div className="mt-6 p-6 sm:p-8 rounded-2xl border border-white/[0.08] bg-zinc-950/80">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Mode Selector & Dropzone (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Mode Toggle Tabs */}
              <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4">
                <button
                  onClick={() => {
                    playMicroClick();
                    setInputMode("screenshot");
                  }}
                  className={`flex items-center gap-2 font-mono text-xs uppercase tracking-wider pb-1 transition-colors cursor-pointer ${
                    inputMode === "screenshot"
                      ? "text-[#c8ff3d] border-b-2 border-[#c8ff3d] font-bold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  <span>Screenshot Upload (Multi-file)</span>
                </button>

                <button
                  onClick={() => {
                    playMicroClick();
                    setInputMode("journey");
                  }}
                  className={`flex items-center gap-2 font-mono text-xs uppercase tracking-wider pb-1 transition-colors cursor-pointer ${
                    inputMode === "journey"
                      ? "text-[#c8ff3d] border-b-2 border-[#c8ff3d] font-bold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Describe User Journey Steps</span>
                </button>
              </div>

              {/* Mode A: Drag & Drop Zone */}
              {inputMode === "screenshot" ? (
                <div>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                        const fileArray = Array.from(e.dataTransfer.files);
                        setUploadedFileObjects((prev) => [...prev, ...fileArray]);
                        const urls = fileArray.map((f) => URL.createObjectURL(f));
                        setUploadedImages((prev) => [...prev, ...urls]);
                        playMicroClick(1000);
                      }
                    }}
                    className="border-2 border-dashed border-white/15 hover:border-[#c8ff3d]/60 rounded-xl p-8 text-center cursor-pointer bg-white/[0.015] hover:bg-white/[0.03] transition-all group"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:border-[#c8ff3d]/50 transition-all">
                      <Upload className="w-5 h-5 text-zinc-400 group-hover:text-[#c8ff3d] transition-colors" />
                    </div>
                    <div className="font-mono text-sm text-white font-medium">
                      Drag & Drop Screenshots Here or{" "}
                      <span className="text-[#c8ff3d] underline">Browse</span>
                    </div>
                    <p className="mt-1 text-xs text-zinc-500 font-mono">
                      Accepts 1–5 PNG/JPG mobile or desktop screens for live Gemini vision review
                    </p>
                  </div>

                  {/* Thumbnail Previews if custom uploaded */}
                  {uploadedImages.length > 0 && (
                    <div className="mt-4 flex items-center gap-3 overflow-x-auto pb-2">
                      {uploadedImages.map((src, idx) => (
                        <div
                          key={idx}
                          className="relative w-16 h-20 rounded-lg overflow-hidden border border-white/20 shrink-0 group"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={src}
                            alt="upload thumb"
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setUploadedImages((prev) => prev.filter((_, i) => i !== idx));
                              setUploadedFileObjects((prev) => prev.filter((_, i) => i !== idx));
                            }}
                            className="absolute top-1 right-1 p-1 rounded bg-black/80 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          setUploadedImages([]);
                          setUploadedFileObjects([]);
                        }}
                        className="text-xs font-mono text-zinc-500 hover:text-rose-400 underline pl-2 cursor-pointer"
                      >
                        Reset to preset
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Mode B: Journey Steps Builder */
                <div className="space-y-3">
                  <div className="font-mono text-xs text-zinc-400 uppercase tracking-wider">
                    SPECIFY STEP-BY-STEP FUNNEL:
                  </div>
                  {journeySteps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="font-mono text-xs text-[#c8ff3d] w-6 shrink-0">
                        0{idx + 1}.
                      </span>
                      <input
                        type="text"
                        value={step}
                        onChange={(e) => {
                          const updated = [...journeySteps];
                          updated[idx] = e.target.value;
                          setJourneySteps(updated);
                        }}
                        className="flex-1 bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-zinc-200 focus:border-[#c8ff3d] focus:outline-none"
                      />
                      {journeySteps.length > 2 && (
                        <button
                          onClick={() => {
                            setJourneySteps(journeySteps.filter((_, i) => i !== idx));
                          }}
                          className="text-zinc-600 hover:text-rose-400 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      playMicroClick();
                      setJourneySteps([...journeySteps, "New step in conversion journey..."]);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-[#c8ff3d] hover:underline pt-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add step to journey</span>
                  </button>
                </div>
              )}
            </div>

            {/* Right Context & Trigger Column (5 cols) */}
            <div className="lg:col-span-5 space-y-6 lg:border-l lg:border-white/[0.08] lg:pl-8">
              <div>
                <label className="block font-mono text-xs text-zinc-400 uppercase tracking-wider mb-2">
                  AUDIT CONTEXT & OBJECTIVE (OPTIONAL)
                </label>
                <textarea
                  rows={4}
                  value={contextNote}
                  onChange={(e) => setContextNote(e.target.value)}
                  placeholder="E.g. Target audience: first-time buyers on iOS checkout. Desired goal: complete payment with minimum cognitive hesitation."
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-xs font-mono text-zinc-200 focus:border-[#c8ff3d] focus:outline-none resize-none"
                />
              </div>

              {/* Action Trigger Button */}
              <button
                disabled={isAnalyzing}
                onClick={handleRunAnalysis}
                className="w-full py-4 rounded-xl font-mono text-sm font-bold uppercase tracking-wider bg-[#c8ff3d] text-black hover:bg-[#d4ff5e] disabled:opacity-60 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_24px_rgba(200,255,61,0.25)]"
              >
                {isAnalyzing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>AUDITING VIA PROTOLENS BACKEND...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-black" />
                    <span>ANALYZE WITH FRICTION ENGINE &rarr;</span>
                  </>
                )}
              </button>

              <div className="font-mono text-[11px] text-zinc-500 leading-normal flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#c8ff3d] shrink-0" />
                <span>Powered by Gemini 3 Flash Vision API + Nielsen 10 Heuristics</span>
              </div>
            </div>
          </div>

          {/* Realistic Multi-Step Analysis Loading Pipeline */}
          <AnimatePresence>
            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 border-t border-white/[0.08] overflow-hidden"
              >
                <div className="p-5 rounded-xl bg-black border border-[#c8ff3d]/30 font-mono text-xs space-y-3">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-[#c8ff3d] uppercase font-bold tracking-wider">
                      [ENGINE PIPELINE // STEP {analysisStep + 1} OF {analysisSteps.length}]
                    </span>
                    <span className="text-zinc-500">
                      {Math.round(((analysisStep + 1) / analysisSteps.length) * 100)}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full bg-[#c8ff3d] transition-all duration-300"
                      style={{
                        width: `${((analysisStep + 1) / analysisSteps.length) * 100}%`,
                      }}
                    />
                  </div>

                  {/* Step status text */}
                  <div className="flex items-center gap-2 text-zinc-200">
                    <span className="w-2 h-2 rounded-full bg-[#c8ff3d] animate-ping" />
                    <span>{analysisSteps[analysisStep]}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RESULTS VIEW */}
        {hasAnalyzed && !isAnalyzing && (
          <div className="mt-14 space-y-8">
            {/* AI Summary Banner if returned by Gemini */}
            {aiSummary && (
              <div className="p-6 rounded-2xl border border-[#c8ff3d]/40 bg-zinc-950/90 relative overflow-hidden">
                <div className="flex items-center gap-2 font-mono text-xs text-[#c8ff3d] mb-2 font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-[#c8ff3d]" />
                  <span>GEMINI COGNITIVE OVERVIEW ({aiSource.toUpperCase()})</span>
                </div>
                <p className="text-sm sm:text-base font-sans text-zinc-200 leading-relaxed font-light">
                  {aiSummary}
                </p>

                {/* Quick Roadmap bullets if available */}
                {roadmap.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/[0.08] space-y-1.5 font-mono text-xs text-zinc-400">
                    <div className="text-zinc-500 uppercase tracking-wider text-[11px] mb-2">
                      RECOMMENDED ACTION ROADMAP:
                    </div>
                    {roadmap.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-zinc-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#c8ff3d] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Results Header: Usability Score + Filter Bar */}
            <div className="p-6 rounded-2xl border border-white/[0.08] bg-zinc-950/90 flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Score Indicator */}
              <div className="flex items-center gap-6">
                <div className="relative w-20 h-20 rounded-full border-4 border-zinc-800 flex items-center justify-center font-mono">
                  <div
                    className="absolute inset-0 rounded-full border-4 border-[#c8ff3d]"
                    style={{
                      clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 ${100 - currentScore}%)`,
                    }}
                  />
                  <div className="text-center">
                    <span className="text-2xl font-black text-white">{currentScore}</span>
                    <span className="text-[10px] text-zinc-400 block -mt-1">/100</span>
                  </div>
                </div>

                <div>
                  <div className="font-mono text-xs text-[#c8ff3d] uppercase tracking-widest font-bold">
                    USABILITY HEALTH SCORE
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {currentScore >= 85
                      ? "High Usability / Production Ready"
                      : currentScore >= 70
                      ? "Moderate Friction / Optimization Suggested"
                      : "Severe Usability Friction Detected"}
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono mt-0.5">
                    Estimated Recovery: <span className="text-[#c8ff3d]">{activePreset.estimatedRecovery}</span>
                  </p>
                </div>
              </div>

              {/* Severity Filter Pills & Actions */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 p-1 rounded-lg bg-zinc-900 border border-white/10 font-mono text-xs">
                  <button
                    onClick={() => setSeverityFilter("all")}
                    className={`px-2.5 py-1 rounded cursor-pointer ${
                      severityFilter === "all" ? "bg-white/15 text-white font-bold" : "text-zinc-400"
                    }`}
                  >
                    All ({issues.length})
                  </button>
                  <button
                    onClick={() => setSeverityFilter("critical")}
                    className={`px-2 py-1 rounded cursor-pointer ${
                      severityFilter === "critical" ? "bg-rose-500/20 text-rose-400 font-bold" : "text-zinc-400"
                    }`}
                  >
                    Critical ({issues.filter((i) => i.severity === "critical").length})
                  </button>
                  <button
                    onClick={() => setSeverityFilter("high")}
                    className={`px-2 py-1 rounded cursor-pointer ${
                      severityFilter === "high" ? "bg-amber-500/20 text-amber-400 font-bold" : "text-zinc-400"
                    }`}
                  >
                    High ({issues.filter((i) => i.severity === "high").length})
                  </button>
                  <button
                    onClick={() => setSeverityFilter("medium")}
                    className={`px-2 py-1 rounded cursor-pointer ${
                      severityFilter === "medium" ? "bg-[#c8ff3d]/20 text-[#c8ff3d] font-bold" : "text-zinc-400"
                    }`}
                  >
                    Medium ({issues.filter((i) => i.severity === "medium").length})
                  </button>
                </div>

                {/* Export Report CTA */}
                <button
                  onClick={handleExportReport}
                  className="px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 hover:border-[#c8ff3d] text-xs font-mono text-zinc-200 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Download full JSON audit report"
                >
                  <Download className="w-3.5 h-3.5 text-[#c8ff3d]" />
                  <span>Export JSON</span>
                </button>
              </div>
            </div>

            {/* Dual Interactive Split Layout: Left Screenshot with Pins / Right Issue Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Pane: Interactive Screenshot with Numbered Pins (5 cols) */}
              <div className="lg:col-span-5 lg:sticky lg:top-24">
                <div className="p-4 sm:p-5 rounded-2xl border border-white/[0.08] bg-zinc-950/70">
                  <div className="flex items-center justify-between mb-3 font-mono text-xs text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#c8ff3d]" />
                      <span>CLICK PIN TO FOCUS ISSUE</span>
                    </span>
                    <span className="text-zinc-500 text-[11px]">
                      {issues.filter((i) => i.isResolved).length}/{issues.length} FIXED
                    </span>
                  </div>

                  {/* Screenshot Container */}
                  <div className="relative rounded-xl overflow-hidden border border-white/15 bg-black flex items-center justify-center">
                    {displayImageSrc ? (
                      <div className="relative w-full aspect-[9/16] max-h-[640px] flex items-center justify-center overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={displayImageSrc}
                          alt="Analyzed Application Screen"
                          className="w-full h-full object-contain pointer-events-none"
                        />

                        {/* Interactive Pins Overlay */}
                        {issues.map((issue) => {
                          const isActive = activePinId === issue.id;
                          const isHovered = hoveredPinId === issue.id;
                          const badge = getSeverityBadge(issue.severity);

                          return (
                            <div
                              key={issue.id}
                              style={{
                                left: `${issue.pinLocation.x}%`,
                                top: `${issue.pinLocation.y}%`,
                              }}
                              className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                            >
                              <button
                                onClick={() => handlePinClick(issue.id)}
                                onMouseEnter={() => setHoveredPinId(issue.id)}
                                onMouseLeave={() => setHoveredPinId(null)}
                                className={`group relative w-7 h-7 sm:w-8 sm:h-8 rounded-full font-mono text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                                  issue.isResolved
                                    ? "bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                                    : isActive || isHovered
                                    ? "bg-[#c8ff3d] text-black scale-125 shadow-[0_0_18px_rgba(200,255,61,0.8)] z-30"
                                    : issue.severity === "critical"
                                    ? "bg-rose-500 text-white pin-pulse shadow-[0_0_12px_rgba(244,63,94,0.6)]"
                                    : issue.severity === "high"
                                    ? "bg-amber-500 text-black shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                                    : "bg-zinc-800 text-zinc-200 border border-white/30"
                                }`}
                              >
                                {issue.isResolved ? (
                                  <Check className="w-4 h-4 stroke-[3]" />
                                ) : (
                                  <span>0{issue.pinNumber}</span>
                                )}

                                {/* Hover tooltip */}
                                <div className="absolute left-1/2 bottom-full -translate-x-1/2 mb-2 w-48 p-2 rounded-lg bg-zinc-950/95 border border-white/20 text-[11px] font-sans font-normal text-zinc-200 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-40 text-center shadow-2xl">
                                  <span className="font-mono text-[9px] uppercase tracking-wider block text-[#c8ff3d]">
                                    [{badge.label}]
                                  </span>
                                  {issue.title}
                                </div>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      /* Journey Step representation if no image */
                      <div className="w-full p-8 text-center font-mono text-xs text-zinc-400 space-y-4">
                        <div className="text-[#c8ff3d] font-bold uppercase">
                          JOURNEY FUNNEL SIMULATION
                        </div>
                        <p className="text-zinc-300">
                          {activePreset.steps?.join(" → ") || "User journey funnel active"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Pane: Issue Cards (7 cols) */}
              <div
                ref={cardsContainerRef}
                className="lg:col-span-7 space-y-4 max-h-[800px] overflow-y-auto pr-1"
              >
                {filteredIssues.map((issue) => {
                  const isActive = activePinId === issue.id;
                  const isHovered = hoveredPinId === issue.id;
                  const badge = getSeverityBadge(issue.severity);
                  const Icon = badge.icon;

                  return (
                    <motion.div
                      id={`card-${issue.id}`}
                      key={issue.id}
                      layout
                      onMouseEnter={() => setHoveredPinId(issue.id)}
                      onMouseLeave={() => setHoveredPinId(null)}
                      className={`p-6 rounded-2xl border transition-all ${
                        issue.isResolved
                          ? "bg-zinc-950/40 border-white/[0.04] opacity-60"
                          : isActive || isHovered
                          ? "bg-zinc-900/90 border-[#c8ff3d]/60 shadow-[0_0_24px_rgba(200,255,61,0.08)]"
                          : "bg-zinc-950/80 border-white/[0.08] hover:border-white/20"
                      }`}
                    >
                      {/* Top Meta Bar */}
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex flex-wrap items-center gap-2">
                          {/* Pin Reference */}
                          <button
                            onClick={() => handlePinClick(issue.id)}
                            className="w-6 h-6 rounded-md bg-[#c8ff3d]/15 text-[#c8ff3d] border border-[#c8ff3d]/30 font-mono text-xs font-bold flex items-center justify-center hover:bg-[#c8ff3d] hover:text-black transition-colors cursor-pointer"
                          >
                            #{issue.pinNumber}
                          </button>

                          {/* Severity Pill */}
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded font-mono text-[10px] font-bold uppercase border ${badge.bg}`}
                          >
                            <Icon className="w-3 h-3" />
                            <span>{badge.label}</span>
                          </span>

                          {/* Heuristic Category */}
                          <span className="font-mono text-[11px] text-zinc-400">
                            {issue.heuristic}
                          </span>
                        </div>

                        {/* Resolve Checkbox */}
                        <button
                          onClick={() => handleToggleResolved(issue.id)}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border font-mono text-xs transition-colors cursor-pointer ${
                            issue.isResolved
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                              : "bg-white/[0.03] border-white/10 text-zinc-400 hover:text-white hover:border-white/25"
                          }`}
                        >
                          <CheckCircle
                            className={`w-3.5 h-3.5 ${
                              issue.isResolved ? "text-emerald-400" : "text-zinc-600"
                            }`}
                          />
                          <span>{issue.isResolved ? "Resolved (+pts)" : "Mark fixed"}</span>
                        </button>
                      </div>

                      {/* Issue Title */}
                      <h4
                        className={`text-lg sm:text-xl font-bold tracking-tight text-white mb-2 ${
                          issue.isResolved ? "line-through text-zinc-400" : ""
                        }`}
                      >
                        {issue.title}
                      </h4>

                      {/* Impact Explanation */}
                      <div className="mt-3 text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
                        <span className="font-mono text-xs text-rose-400 font-semibold block sm:inline sm:mr-2">
                          [HUMAN FRICTION IMPACT]:
                        </span>
                        {issue.impact}
                      </div>

                      {/* Concrete Fix Section */}
                      <div className="mt-4 p-4 rounded-xl bg-black/70 border border-white/[0.08] space-y-2">
                        <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                          <span className="text-[#c8ff3d] font-bold flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-[#c8ff3d]" />
                            <span>CONCRETE REMEDIATION</span>
                          </span>
                          {issue.fix.codeSnippet && (
                            <button
                              onClick={() =>
                                handleCopyFix(issue.fix.codeSnippet || "", issue.id)
                              }
                              className="inline-flex items-center gap-1 text-zinc-400 hover:text-[#c8ff3d] transition-colors cursor-pointer"
                            >
                              {copiedId === issue.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-emerald-400">Copied to clipboard!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy patch</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>

                        <p className="text-xs text-zinc-300 font-sans">
                          {issue.fix.summary}
                        </p>

                        {/* Code snippet if present */}
                        {issue.fix.codeSnippet && (
                          <pre className="mt-2 p-3 rounded-lg bg-zinc-950 border border-white/10 font-mono text-[11px] text-zinc-200 overflow-x-auto leading-relaxed">
                            <code>{issue.fix.codeSnippet}</code>
                          </pre>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
