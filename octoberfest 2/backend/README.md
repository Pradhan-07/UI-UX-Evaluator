# ProtoLens Backend — Phase 1

Express + Gemini vision API. No database, no login — stateless on purpose.

## Run it in Antigravity IDE

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:5000/api/health — you should see `{"status":"ok"}`.

## Enable real AI (optional but recommended for judging)

1. Go to https://aistudio.google.com/ and create a free API key.
2. Put it in `backend/.env` as `GEMINI_API_KEY=your_key_here`
3. Restart with `npm run dev`.

Without a key, the API still works in mock mode and returns realistic
sample issues, so you can build the frontend first and add the key later.

## Test it with curl (no frontend needed)

```bash
curl -X POST http://localhost:5000/api/analyze \
  -F "screenshots=@./test-screen-1.png" \
  -F "screenshots=@./test-screen-2.png" \
  -F "appName=My App" \
  -F "targetUser=First-time users" \
  -F "task=Complete checkout" \
  -F "platform=mobile"
```

Use any 1–5 PNG/JPG screenshots. The field name must be `screenshots`.

## What each file does

- `server.js` — routes, CORS, error handling. Start here.
- `src/config.js` — env vars, AI mode (gemini vs mock).
- `src/prompt.js` — the Gemini system prompt. Tune this to change issue quality.
- `src/gemini.js` — sends images + prompt to Gemini, 60s timeout.
- `src/parseJson.js` — strips ```json fences, validates severity/effort.
- `src/scoring.js` — deterministic score: 100 − 15/critical − 8/high − 4/medium − 2/low.
- `src/mock.js` — fallback analysis when there is no key or Gemini fails.
- `src/analyze.js` — picks Gemini or mock, sorts issues, builds the roadmap.
- `src/upload.js` — multer: images only, max 5 files, 5 MB each.

## Deploy later (Phase 4)

Render / Railway: set the root to `backend`, start command `npm start`,
and add `GEMINI_API_KEY` and `FRONTEND_URL` (your Vercel URL) as env vars.
