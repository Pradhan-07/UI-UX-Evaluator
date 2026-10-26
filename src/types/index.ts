export type Severity = "critical" | "high" | "medium" | "low";

export interface PinLocation {
  x: number; // percentage from left (0-100)
  y: number; // percentage from top (0-100)
}

export interface UsabilityIssue {
  id: string;
  pinNumber: number;
  screenNumber?: number; // 1-indexed screen in multi-screen flow
  pinLocation: PinLocation;
  title: string;
  severity: Severity;
  heuristic: string;
  heuristicCategory: "Nielsen" | "WCAG" | "Psychology" | "Fitts";
  impact: string;
  fix: {
    summary: string;
    codeSnippet?: string;
    designSpec?: string;
  };
  scorePenalty: number;
  isResolved?: boolean;
}

export interface AuditPreset {
  id: string;
  name: string;
  category: string;
  type: "screenshot" | "journey";
  imageSrc?: string;
  images?: string[]; // optional multi-screen flow images
  description: string;
  context: string;
  steps?: string[];
  initialScore: number;
  estimatedRecovery: string;
  issues: UsabilityIssue[];
}

export interface CalculatorState {
  monthlyVisitors: number;
  conversionRate: number; // percentage, e.g. 2.4
  averageOrderValue: number; // dollars, e.g. 120
  dropoffPercentage: number; // percentage lost to friction, e.g. 22
}
