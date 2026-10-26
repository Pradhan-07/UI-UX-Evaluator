import { NextResponse } from "next/server";

export async function GET() {
  const hasGemini = Boolean(process.env.GEMINI_API_KEY);
  return NextResponse.json({
    status: "ok",
    service: "friction-engine",
    ai: hasGemini ? "gemini" : "friction-engine",
    model: hasGemini ? "Gemini 3 Flash Vision" : "Cognitive Heuristic Engine",
    aiMode: hasGemini ? "gemini" : "heuristic-engine",
    timestamp: new Date().toISOString(),
  });
}
