import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: Number(process.env.PORT || 5000),
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  geminiModel: process.env.GEMINI_MODEL || "gemini-3-flash-preview",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  maxImages: Number(process.env.MAX_IMAGES || 5),
  useMockAi: process.env.USE_MOCK_AI === "true",
};

export const aiMode = () =>
  config.useMockAi || !config.geminiApiKey ? "mock" : "gemini";
