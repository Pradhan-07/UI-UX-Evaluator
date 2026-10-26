import multer from "multer";
import { config } from "./config.js";

// Memory storage: files go straight to Gemini as base64, nothing is
// written to disk. This keeps the hackathon backend simple and stateless.
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    files: config.maxImages,
    fileSize: 5 * 1024 * 1024, // 5 MB per image
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});
