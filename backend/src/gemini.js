import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "./config.js";
import { buildPrompt } from "./prompt.js";
import { extractJson, normaliseIssues } from "./parseJson.js";

// Sends the screenshots as vision input (base64 inline data) + the prompt.
// 60s timeout so a slow AI call never hangs the demo forever.
export async function analyzeWithGemini(images, context) {
  if (!config.geminiApiKey) throw new Error("GEMINI_API_KEY is not set");

  const genAI = new GoogleGenerativeAI(config.geminiApiKey);
  const model = genAI.getGenerativeModel({ model: config.geminiModel });

  const prompt = buildPrompt({ ...context, screenCount: images.length });
  const parts = [
    { text: prompt },
    ...images.flatMap((img, idx) => [
      { text: `\n=== SCREEN ${idx + 1} OF ${images.length} (Journey Step ${idx + 1}) ===\n` },
      {
        inlineData: {
          data: img.buffer.toString("base64"),
          mimeType: img.mimetype,
        },
      },
    ]),
  ];

  const result = await Promise.race([
    model.generateContent(parts),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("AI request timed out after 60s")), 60000)
    ),
  ]);

  const text = result.response.text();
  const parsed = extractJson(text);

  return {
    summary:
      typeof parsed.summary === "string" && parsed.summary.trim()
        ? parsed.summary.trim()
        : "Review complete. See the issues below, ordered by severity.",
    issues: normaliseIssues(parsed.issues, images.length),
  };
}
