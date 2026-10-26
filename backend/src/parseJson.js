// Gemini often wraps JSON in ```json fences or adds a short preamble.
// This extracts the JSON object safely instead of crashing on it.
export function extractJson(text) {
  if (!text || typeof text !== "string") throw new Error("Empty AI response");

  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```json\s*/i, "").replace(/^```\s*/i, "");
  cleaned = cleaned.replace(/\s*```$/i, "");

  const first = cleaned.indexOf("{");
  const last = cleaned.lastIndexOf("}");
  if (first === -1 || last === -1 || last <= first) {
    throw new Error("AI response did not contain a JSON object");
  }
  return JSON.parse(cleaned.slice(first, last + 1));
}

const VALID_SEVERITIES = ["critical", "high", "medium", "low"];
const VALID_EFFORTS = ["Quick win", "Medium", "Redesign"];

// Normalise + validate AI output so the frontend never receives junk.
export function normaliseIssues(rawIssues, screenCount) {
  if (!Array.isArray(rawIssues)) return [];
  const defaultPins = [
    { x: 74, y: 32 },
    { x: 38, y: 44 },
    { x: 50, y: 55 },
    { x: 78, y: 72 },
    { x: 50, y: 83 },
    { x: 24, y: 22 },
  ];

  return rawIssues
    .filter((i) => i && typeof i.title === "string" && i.title.trim())
    .map((i, idx) => {
      const pinX = Number(i.pinLocation?.x);
      const pinY = Number(i.pinLocation?.y);
      const fallbackPin = defaultPins[idx % defaultPins.length];

      return {
        screen: Math.min(
          Math.max(Number(i.screen) || 1, 1),
          Math.max(screenCount, 1)
        ),
        title: String(i.title).trim(),
        severity: VALID_SEVERITIES.includes(i.severity) ? i.severity : "medium",
        heuristic: String(i.heuristic || "Aesthetic and minimalist design").trim(),
        evidence: String(i.evidence || "Visible in the screenshot.").trim(),
        impact: String(i.impact || "Users may get confused or slowed down.").trim(),
        fix: String(i.fix || "Review this element against the heuristic.").trim(),
        effort: VALID_EFFORTS.includes(i.effort) ? i.effort : "Medium",
        pinLocation: {
          x: !isNaN(pinX) && pinX >= 5 && pinX <= 95 ? pinX : fallbackPin.x,
          y: !isNaN(pinY) && pinY >= 5 && pinY <= 95 ? pinY : fallbackPin.y,
        },
      };
    });
}
