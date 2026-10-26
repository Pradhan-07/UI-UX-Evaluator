import express from "express";
import cors from "cors";
import { config, aiMode } from "./src/config.js";
import { upload } from "./src/upload.js";
import { analyzeJourney } from "./src/analyze.js";

const app = express();

app.use(
  cors({
    origin: [config.frontendUrl, "http://localhost:5173", "http://localhost:3000"],
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  if (req.headers.accept && req.headers.accept.includes("text/html")) {
    return res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ProtoLens Backend — API Dashboard</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090d16;
      --card-bg: #111726;
      --card-border: #1e293b;
      --text: #f1f5f9;
      --text-muted: #94a3b8;
      --accent: #38bdf8;
      --accent-glow: rgba(56, 189, 248, 0.15);
      --success: #10b981;
      --warning: #f59e0b;
      --danger: #ef4444;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', -apple-system, sans-serif;
      background: radial-gradient(circle at 50% 0%, #151d33 0%, var(--bg) 75%);
      color: var(--text);
      min-height: 100vh;
      padding: 2.5rem 1.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .container { max-width: 960px; width: 100%; }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .brand { display: flex; align-items: center; gap: 0.75rem; }
    .brand-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: linear-gradient(135deg, #0284c7, #38bdf8);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      box-shadow: 0 8px 20px var(--accent-glow);
    }
    h1 { font-size: 1.75rem; font-weight: 700; letter-spacing: -0.02em; }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.35rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.82rem;
      font-weight: 600;
      background: rgba(16, 185, 129, 0.15);
      color: var(--success);
      border: 1px solid rgba(16, 185, 129, 0.3);
    }
    .badge-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--success);
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(1.15); }
    }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; margin-bottom: 2rem; }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 14px;
      padding: 1.5rem;
      position: relative;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(0,0,0,0.25);
    }
    .card h3 { font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: 0.5rem; }
    .card .val { font-size: 1.5rem; font-weight: 700; color: #fff; font-family: 'JetBrains Mono', monospace; }
    .card .sub { font-size: 0.85rem; color: var(--text-muted); margin-top: 0.35rem; }

    .section-title { font-size: 1.2rem; font-weight: 600; margin: 1.5rem 0 1rem; display: flex; align-items: center; gap: 0.5rem; }
    .panel {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 14px;
      padding: 1.5rem;
      margin-bottom: 2rem;
    }
    .endpoint-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      border-radius: 10px;
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(255,255,255,0.05);
      margin-bottom: 0.75rem;
      flex-wrap: wrap;
      gap: 0.75rem;
    }
    .method {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.25rem 0.55rem;
      border-radius: 6px;
    }
    .method-get { background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); }
    .method-post { background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); }
    .ep-path { font-family: 'JetBrains Mono', monospace; font-size: 0.95rem; font-weight: 600; color: #fff; }
    .btn {
      background: #0284c7;
      color: #fff;
      border: none;
      padding: 0.45rem 0.9rem;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s;
    }
    .btn:hover { background: #0369a1; }
    .btn-secondary {
      background: #1e293b;
      color: #e2e8f0;
      border: 1px solid #334155;
    }
    .btn-secondary:hover { background: #334155; }
    pre {
      background: #060911;
      padding: 1rem;
      border-radius: 8px;
      border: 1px solid #1e293b;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85rem;
      color: #a5b4fc;
      overflow-x: auto;
      max-height: 280px;
    }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; font-size: 0.85rem; font-weight: 500; color: var(--text-muted); margin-bottom: 0.35rem; }
    .form-control {
      width: 100%;
      background: #0a0f1d;
      border: 1px solid var(--card-border);
      color: #fff;
      padding: 0.65rem 0.85rem;
      border-radius: 8px;
      font-size: 0.9rem;
    }
    .form-control:focus { outline: none; border-color: var(--accent); }
    .tester-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
    .file-drop {
      border: 2px dashed #334155;
      padding: 1.5rem;
      border-radius: 10px;
      text-align: center;
      cursor: pointer;
      background: rgba(255,255,255,0.01);
      transition: border-color 0.2s;
    }
    .file-drop:hover { border-color: var(--accent); }
    .issue-card {
      background: #0b1120;
      border-left: 4px solid #38bdf8;
      border-radius: 8px;
      padding: 1rem;
      margin-top: 0.75rem;
    }
    .issue-critical { border-left-color: var(--danger); }
    .issue-high { border-left-color: var(--warning); }
    .issue-medium { border-left-color: var(--accent); }
    .issue-low { border-left-color: #64748b; }
    .pill {
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      text-transform: uppercase;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="brand">
        <div class="brand-icon">🔍</div>
        <div>
          <h1>ProtoLens Backend</h1>
          <p style="font-size: 0.85rem; color: var(--text-muted);">AI-Powered App Prototype & UX Evaluator (Phase 1)</p>
        </div>
      </div>
      <div class="badge">
        <div class="badge-dot"></div>
        <span>API Online • Port ${config.port}</span>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <h3>AI Engine</h3>
        <div class="val" style="color: #38bdf8;">${aiMode().toUpperCase()}</div>
        <div class="sub">Model: ${config.geminiModel}</div>
      </div>
      <div class="card">
        <h3>Server Status</h3>
        <div class="val" style="color: #10b981;">HEALTHY</div>
        <div class="sub">Express 4.19 • Node.js ESM</div>
      </div>
      <div class="card">
        <h3>Active Port</h3>
        <div class="val">${config.port}</div>
        <div class="sub">CORS enabled for localhost:5173</div>
      </div>
    </div>

    <div class="section-title">⚡ Available API Endpoints</div>
    <div class="panel">
      <div class="endpoint-row">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <span class="method method-get">GET</span>
          <span class="ep-path">/api/health</span>
          <span style="font-size: 0.85rem; color: var(--text-muted);">Health check & AI mode</span>
        </div>
        <button class="btn btn-secondary" onclick="testHealth()">Test Health</button>
      </div>
      <div id="health-output" style="display: none; margin-bottom: 1rem;"><pre id="health-json"></pre></div>

      <div class="endpoint-row">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <span class="method method-get">GET</span>
          <span class="ep-path">/api/sample-journeys</span>
          <span style="font-size: 0.85rem; color: var(--text-muted);">Sample flow metadata for testing</span>
        </div>
        <button class="btn btn-secondary" onclick="testSamples()">View Samples</button>
      </div>
      <div id="samples-output" style="display: none; margin-bottom: 1rem;"><pre id="samples-json"></pre></div>

      <div class="endpoint-row">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <span class="method method-post">POST</span>
          <span class="ep-path">/api/analyze</span>
          <span style="font-size: 0.85rem; color: var(--text-muted);">Multipart form upload for 1–5 journey screenshots</span>
        </div>
      </div>
    </div>

    <div class="section-title">🧪 Live AI Journey Tester</div>
    <div class="panel">
      <form id="analyze-form">
        <div class="tester-row">
          <div class="form-group">
            <label>App Name</label>
            <input type="text" id="appName" class="form-control" value="ShopKart">
          </div>
          <div class="form-group">
            <label>Target User</label>
            <input type="text" id="targetUser" class="form-control" value="First-time mobile shoppers">
          </div>
          <div class="form-group">
            <label>User's Task</label>
            <input type="text" id="task" class="form-control" value="Checkout an item in under 1 minute">
          </div>
          <div class="form-group">
            <label>Platform</label>
            <select id="platform" class="form-control">
              <option value="mobile">Mobile</option>
              <option value="web">Web</option>
            </select>
          </div>
        </div>

        <div class="form-group" style="margin-top: 0.5rem;">
          <label>Screenshots (1 to 5 images)</label>
          <div class="file-drop" onclick="document.getElementById('screenshots-input').click()">
            <input type="file" id="screenshots-input" multiple accept="image/*" style="display: none;" onchange="updateFileCount(this)">
            <p id="file-drop-text" style="color: var(--text-muted);">📁 Click here to select 1–5 screenshots to analyze</p>
          </div>
        </div>

        <div style="margin-top: 1.25rem; display: flex; gap: 0.75rem; align-items: center;">
          <button type="button" class="btn" onclick="submitAnalysis()" id="submit-btn" style="padding: 0.65rem 1.5rem; font-size: 0.95rem;">⚡ Run AI Analysis</button>
          <span id="loading-spinner" style="display: none; color: var(--accent); font-size: 0.9rem;">Analyzing with ${aiMode() === 'gemini' ? 'Gemini Vision' : 'Mock Mode'}...</span>
        </div>
      </form>

      <div id="analysis-results" style="display: none; margin-top: 1.5rem; border-top: 1px solid var(--card-border); padding-top: 1.25rem;">
        <h4 style="margin-bottom: 0.75rem;">Analysis Results</h4>
        <div id="results-summary" style="font-size: 0.95rem; color: #cbd5e1; margin-bottom: 1rem; line-height: 1.5;"></div>
        <div id="score-box" style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1.25rem; background: #0a0f1d; padding: 1rem; border-radius: 8px;">
          <div style="font-size: 2.2rem; font-weight: 800; color: #38bdf8;" id="res-score"></div>
          <div>
            <div style="font-size: 0.85rem; color: var(--text-muted);">UX Score / 100</div>
            <div style="font-weight: 600;" id="res-grade"></div>
          </div>
          <div id="res-counts" style="margin-left: auto; display: flex; gap: 0.5rem;"></div>
        </div>
        <div id="issues-list"></div>
      </div>
    </div>
  </div>

  <script>
    async function testHealth() {
      const box = document.getElementById('health-output');
      const pre = document.getElementById('health-json');
      box.style.display = 'block';
      pre.textContent = 'Loading...';
      const res = await fetch('/api/health');
      const data = await res.json();
      pre.textContent = JSON.stringify(data, null, 2);
    }

    async function testSamples() {
      const box = document.getElementById('samples-output');
      const pre = document.getElementById('samples-json');
      box.style.display = 'block';
      pre.textContent = 'Loading...';
      const res = await fetch('/api/sample-journeys');
      const data = await res.json();
      pre.textContent = JSON.stringify(data, null, 2);
    }

    function updateFileCount(input) {
      const text = document.getElementById('file-drop-text');
      if (input.files && input.files.length > 0) {
        text.textContent = '✅ ' + input.files.length + ' file(s) selected: ' + Array.from(input.files).map(f => f.name).join(', ');
      } else {
        text.textContent = '📁 Click here to select 1–5 screenshots to analyze';
      }
    }

    async function submitAnalysis() {
      const input = document.getElementById('screenshots-input');
      if (!input.files || input.files.length === 0) {
        alert('Please select at least 1 screenshot to analyze.');
        return;
      }
      const formData = new FormData();
      for (const file of input.files) {
        formData.append('screenshots', file);
      }
      formData.append('appName', document.getElementById('appName').value);
      formData.append('targetUser', document.getElementById('targetUser').value);
      formData.append('task', document.getElementById('task').value);
      formData.append('platform', document.getElementById('platform').value);

      const btn = document.getElementById('submit-btn');
      const spinner = document.getElementById('loading-spinner');
      const resultsDiv = document.getElementById('analysis-results');

      btn.disabled = true;
      spinner.style.display = 'inline';
      resultsDiv.style.display = 'none';

      try {
        const res = await fetch('/api/analyze', { method: 'POST', body: formData });
        const json = await res.json();
        if (!json.success) throw new Error(json.error || 'Analysis failed');

        const data = json.data;
        document.getElementById('res-score').textContent = data.score;
        document.getElementById('res-grade').textContent = data.grade;
        document.getElementById('results-summary').textContent = data.summary;

        const countsDiv = document.getElementById('res-counts');
        countsDiv.innerHTML = \`
          <span class="pill" style="background: rgba(239,68,68,0.2); color: #ef4444;">\${data.counts.critical} Critical</span>
          <span class="pill" style="background: rgba(245,158,11,0.2); color: #f59e0b;">\${data.counts.high} High</span>
          <span class="pill" style="background: rgba(56,189,248,0.2); color: #38bdf8;">\${data.counts.medium} Med</span>
        \`;

        const issuesList = document.getElementById('issues-list');
        issuesList.innerHTML = '<h5 style="margin-bottom: 0.5rem; color: var(--text-muted);">Prioritized Issues (' + data.issues.length + ')</h5>';
        data.issues.forEach(issue => {
          const card = document.createElement('div');
          card.className = 'issue-card issue-' + issue.severity;
          card.innerHTML = \`
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
              <strong>Screen \${issue.screen}: \${issue.title}</strong>
              <span class="pill" style="background: rgba(255,255,255,0.08);">\${issue.severity.toUpperCase()}</span>
            </div>
            <p style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 0.35rem;"><strong>Impact:</strong> \${issue.impact}</p>
            <p style="font-size: 0.85rem; color: #38bdf8;"><strong>Fix:</strong> \${issue.fix} <span style="color: #64748b;">(\${issue.effort})</span></p>
          \`;
          issuesList.appendChild(card);
        });

        resultsDiv.style.display = 'block';
      } catch (err) {
        alert('Error: ' + err.message);
      } finally {
        btn.disabled = false;
        spinner.style.display = 'none';
      }
    }
  </script>
</body>
</html>`);
  }
  res.json({ name: "ProtoLens backend", status: "ok", ai: aiMode() });
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", ai: aiMode(), model: config.geminiModel });
});

// Sample journey descriptions for the frontend "Try a sample" button.
// The frontend still needs its own sample images in Phase 2 —
// this endpoint only supplies the text so both sides stay consistent.
app.get("/api/sample-journeys", (_req, res) => {
  res.json([
    {
      id: "checkout",
      label: "Cluttered checkout flow",
      appName: "ShopKart (sample)",
      targetUser: "First-time shoppers on mobile",
      task: "Buy one item and complete checkout",
      platform: "mobile",
    },
    {
      id: "onboarding",
      label: "Confusing onboarding flow",
      appName: "FitTrack (sample)",
      targetUser: "New users opening the app for the first time",
      task: "Sign up and set a fitness goal",
      platform: "mobile",
    },
  ]);
});

app.post("/api/analyze", upload.array("screenshots", config.maxImages), async (req, res) => {
  try {
    const files = req.files || [];
    if (files.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Upload at least 1 screenshot in the 'screenshots' field.",
      });
    }

    const context = {
      appName: String(req.body.appName || "").trim(),
      targetUser: String(req.body.targetUser || "").trim(),
      task: String(req.body.task || "").trim(),
      platform: ["mobile", "web"].includes(req.body.platform)
        ? req.body.platform
        : "mobile",
    };

    const images = files.map((f) => ({
      buffer: f.buffer,
      mimetype: f.mimetype,
    }));

    const { source, data } = await analyzeJourney(images, context);
    return res.json({ success: true, source, data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: "Analysis failed. Please try again.",
    });
  }
});

// Multer errors (too many files, file too large, wrong file type)
// must return clean JSON, not an HTML error page.
app.use((err, _req, res, _next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      error: "Each image must be under 5 MB.",
    });
  }
  if (err.code === "LIMIT_FILE_COUNT" || err.code === "LIMIT_UNEXPECTED_FILE") {
    return res.status(400).json({
      success: false,
      error: `Upload at most ${config.maxImages} screenshots.`,
    });
  }
  return res.status(400).json({ success: false, error: err.message });
});

const server = app.listen(config.port, () => {
  console.log(`ProtoLens backend running on http://localhost:${config.port}`);
  console.log(`AI mode: ${aiMode()} (model: ${config.geminiModel})`);
  if (aiMode() === "mock") {
    console.log("Tip: add GEMINI_API_KEY to .env to enable real Gemini analysis.");
  }
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    const fallbackPort = config.port === 5000 ? 5001 : config.port + 1;
    console.warn(`⚠️ Port ${config.port} is already in use (common with macOS AirPlay Receiver). Retrying on http://localhost:${fallbackPort}...`);
    app.listen(fallbackPort, () => {
      console.log(`ProtoLens backend running on http://localhost:${fallbackPort}`);
      console.log(`AI mode: ${aiMode()} (model: ${config.geminiModel})`);
      if (aiMode() === "mock") {
        console.log("Tip: add GEMINI_API_KEY to .env to enable real Gemini analysis.");
      }
    });
  } else {
    console.error("Server error:", err);
  }
});
