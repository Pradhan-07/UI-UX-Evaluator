import { aiMode } from "./config.js";
import { analyzeWithGemini } from "./gemini.js";
import { analyzeMock } from "./mock.js";
import {
  buildRoadmap,
  calculateScore,
  countIssues,
  gradeForScore,
  sortIssues,
} from "./scoring.js";

export async function analyzeJourney(images, context) {
  const mode = aiMode();
  let source = mode;
  let result;

  if (mode === "mock") {
    result = analyzeMock(context, images.length);
  } else {
    try {
      result = await analyzeWithGemini(images, context);
      source = "gemini";
    } catch (err) {
      // Demo resilience: a failed AI call must not give judges a blank screen.
      console.error("Gemini failed, falling back to mock:", err.message);
      result = analyzeMock(context, images.length);
      source = "mock-fallback";
    }
  }

  const issues = sortIssues(result.issues);
  const score = calculateScore(issues);

  return {
    source,
    data: {
      appName: context.appName || "",
      targetUser: context.targetUser || "",
      task: context.task || "",
      platform: context.platform || "mobile",
      screenCount: images.length,
      score,
      grade: gradeForScore(score),
      counts: countIssues(issues),
      summary: result.summary,
      issues,
      roadmap: buildRoadmap(issues),
      analyzedAt: new Date().toISOString(),
    },
  };
}
