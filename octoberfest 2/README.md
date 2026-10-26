# ProtoLens — AI-Powered App Prototype & UX Evaluator

Hacktoberfest Hack Day Amaravati x AIBPT Club — VIT-AP
Prize category: AI-Powered App Prototype & UX Evaluator

Upload app screenshots in journey order + describe the user's task.
The AI returns likely usability problems, their impact, and concrete fixes.

## Phases (do them in this order)

### Phase 1 — Backend + AI [DO THIS FIRST — included in this zip]
Express API + Gemini vision analysis + deterministic UX scoring.
Works even without an API key (mock mode) so the demo never dies on stage.

Files: `backend/`

### Phase 2 — Frontend: Upload + Journey Form [NEXT]
React + Vite + Tailwind. Drag-and-drop screenshots, reorder them,
journey form (app name, target user, task, platform), "Try a sample" button.
Calls `POST /api/analyze`. No design decisions needed from the backend.

### Phase 3 — Frontend: Results Dashboard
Score ring, severity filters, issue cards, prioritised roadmap, export/copy report.
Consumes exactly the JSON shape returned by Phase 1 — do not change it in Phase 2/3.

### Phase 4 — Polish, Deploy & Submit
Deploy frontend to Vercel, backend to Render/Railway, record a 2-min demo,
write the MLH submission. Freeze features at 5:30 PM on submission day.

## Phase 1 API contract (frozen)

### POST /api/analyze
Multipart form-data:
- `screenshots`: 1–5 image files (field name must be exactly this)
- `appName`: string, optional
- `targetUser`: string, optional
- `task`: string, e.g. "Book a cab in under 1 minute"
- `platform`: `mobile` | `web`, optional, defaults to `mobile`

Success response:
```json
{
  "success": true,
  "source": "gemini",
  "data": {
    "appName": "My App",
    "targetUser": "First-time users",
    "task": "Checkout",
    "platform": "mobile",
    "screenCount": 3,
    "score": 62,
    "grade": "Needs work",
    "counts": { "critical": 1, "high": 2, "medium": 3, "low": 1, "total": 7 },
    "summary": "One-paragraph summary",
    "issues": [
      {
        "screen": 1,
        "title": "Primary CTA is hard to find",
        "severity": "critical",
        "heuristic": "Visibility of system status",
        "evidence": "What is visible in the screenshot",
        "impact": "Who gets blocked and what happens",
        "fix": "One specific change, not 'improve UI'",
        "effort": "Quick win"
      }
    ],
    "roadmap": ["Fix the first 3 issues, in priority order"],
    "analyzedAt": "2026-10-26T10:30:00.000Z"
  }
}
```

`source` is `gemini`, `mock`, or `mock-fallback`.
`severity` is always one of: `critical`, `high`, `medium`, `low`.
`effort` is always one of: `Quick win`, `Medium`, `Redesign`.

### GET /api/health
Returns `{ "status": "ok", "ai": "gemini" | "mock" }`.
