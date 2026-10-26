// Deterministic scoring. Never let the AI invent the score —
// otherwise the same screenshots can score 40 one run and 90 the next.
export const SEVERITY_WEIGHTS = {
  critical: 15,
  high: 8,
  medium: 4,
  low: 2,
};

export const SEVERITY_ORDER = ["critical", "high", "medium", "low"];

export function countIssues(issues) {
  const counts = { critical: 0, high: 0, medium: 0, low: 0, total: issues.length };
  for (const issue of issues) {
    if (counts[issue.severity] !== undefined) counts[issue.severity] += 1;
  }
  return counts;
}

export function calculateScore(issues) {
  let score = 100;
  for (const issue of issues) {
    score -= SEVERITY_WEIGHTS[issue.severity] || 0;
  }
  return Math.max(0, Math.min(100, score));
}

export function gradeForScore(score) {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Needs work";
  return "Critical";
}

export function sortIssues(issues) {
  return [...issues].sort(
    (a, b) =>
      SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity) ||
      a.screen - b.screen
  );
}

// Top 3 fixes, in the order a team should actually do them.
export function buildRoadmap(sortedIssues) {
  return sortedIssues.slice(0, 3).map(
    (issue) =>
      `Screen ${issue.screen}: ${issue.fix} (${issue.effort})`
  );
}
