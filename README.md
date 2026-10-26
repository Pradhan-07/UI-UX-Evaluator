# Friction — Autonomous AI Usability & Prototype Review Platform

> *"Teams can build a feature that technically works while leaving users confused or blocked."*  
> **"Designers should design. AI should find the friction."**

[![Next.js](https://img.shields.io/badge/Next.js-16.4.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.19-lightgrey?style=for-the-badge&logo=express)](https://expressjs.com/)
[![Gemini](https://img.shields.io/badge/Google_Gemini-3_Flash_Vision-8E75C4?style=for-the-badge&logo=google)](https://aistudio.google.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4.0-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![WCAG](https://img.shields.io/badge/Accessibility-WCAG_2.2_AAA-success?style=for-the-badge)](https://www.w3.org/WAI/standards-guidelines/wcag/)

---

## 📌 Problem Statement & Core Value Proposition

Automated unit, integration, and end-to-end tests only verify that code executes without throwing unhandled exceptions—**they cannot tell you when a first-time user is confused by specialist jargon, blocked by a silent disabled button, or nervous about a buried billing disclosure.**

**Friction** bridges the gap between *"technically working code"* and *"self-explanatory human interfaces"* across three core pillars:

1. **Identifies Likely Usability Problems**: Flags critical blockers, confusing visual hierarchy, double-negative microcopy, and WCAG 2.2 AA/AAA accessibility violations mapped rigorously to Nielsen-Norman heuristics and Fitts's Law.
2. **Explains & Quantifies Their Impact**: Models why specific user personas stall and calculates estimated conversion drop-off, task-completion latency, and support ticket volume.
3. **Proposes Concrete Improvements**: Generates interactive Before / After UI state previews, rewritten plain-English microcopy, and ready-to-copy React + Tailwind CSS remediation patches.

---

## 🏗️ Repository & Project Structure

```bash
HAKATHON/
├── octoberfest 2/                              # Express AI Backend API (Port 5001 / 5000)
│   ├── src/
│   │   ├── analyze.js                   # Orchestration: picks Gemini Vision or Mock AI
│   │   ├── config.js                    # Env parser, model config, CORS policies
│   │   ├── gemini.js                    # Multimodal Google Generative AI vision client
│   │   ├── mock.js                      # Realistic offline fallback analysis
│   │   ├── parseJson.js                 # JSON fence stripper & schema validator
│   │   ├── prompt.js                    # Nielsen 10 & WCAG 2.2 cognitive system prompt
│   │   ├── scoring.js                   # Deterministic scoring algorithm (/100)
│   │   └── upload.js                    # Multer multipart/form-data handler (max 5 imgs)
│   ├── .env.example                     # Environment variables template
│   ├── package.json                     # Backend dependencies & dev scripts
│   ├── server.js                        # Express server entry point & interactive web tester
│   ├── test-screen-1.png                # Sample UI screenshot 1 for automated audit testing
│   └── test-screen-2.png                # Sample UI screenshot 2 for automated audit testing
├── public/                              # Static public assets & high-resolution logos
│   ├── friction-logo-light.png          # High-res dark ink mark for White Theme
│   ├── friction-logo-dark.png           # High-res white ink mark for Dark Theme
│   ├── friction-logo-accent.png         # High-res lime ink mark
│   └── samples/                         # Built-in evaluation screens (checkout, onboarding, etc.)
├── src/                                 # Next.js 16.4.3 Frontend
│   ├── app/
│   │   ├── globals.css                  # Semantic design tokens & responsive CSS utilities
│   │   ├── layout.tsx                   # Root layout, font definitions & zero-flash theme script
│   │   └── page.tsx                     # Single-page high-performance application
│   ├── components/
│   │   ├── BrandLogo.tsx                # Zero-flash theme-adaptive SVG/PNG brand logo
│   │   ├── CustomCursor.tsx             # Hardware-accelerated fluid lerp follower dot
│   │   ├── DemoModal.tsx                # Interactive 90-second video walkthrough modal
│   │   ├── FaqSection.tsx               # Animated accordion answering product & audit FAQs
│   │   ├── FinalCta.tsx                 # High-impact conversion closing section
│   │   ├── Footer.tsx                   # Studio footer with letter-by-letter rising wordmark
│   │   ├── Hero.tsx                     # Kinetic headline, laser-scanning phone mock & pins
│   │   ├── HeuristicsMatrix.tsx         # 14 Nielsen & WCAG cards with live keyword filter
│   │   ├── LiveAnalyzer.tsx             # The Core: multi-tab drag-drop screenshot & flow inspector
│   │   ├── MarqueeTicker.tsx            # Velocity-sensitive infinite philosophy ticker
│   │   ├── Navbar.tsx                   # Fixed navigation with world clocks & full-screen index
│   │   ├── SampleReportCard.tsx         # Interactive 3D tilt before/after slider comparison
│   │   ├── TheProblem.tsx               # Cognitive friction deep-dive & interactive inspector
│   │   ├── ThemeToggle.tsx              # View Transitions API animated theme switcher
│   │   ├── UxCostCalculator.tsx         # Real-time revenue leak & ARR recovery estimator
│   │   ├── WhatWeCheckAndHowItWorks.tsx # Step-by-step 4-phase audit pipeline
│   │   └── WhoWeAre.tsx                 # Core methodology & 3 cognitive pillars
│   ├── data/
│   │   ├── heuristics.ts                # Nielsen 10 + WCAG 2.2 matrix database
│   │   └── presets.ts                   # Pre-configured product flow samples
│   ├── lib/
│   │   ├── motion.tsx                   # Framer Motion animations & Lenis smooth scroll
│   │   └── theme.tsx                    # ThemeContext provider with View Transitions API
│   └── types/                           # TypeScript interfaces & types
└── README.md
```

---

## ⚡ Frontend Architecture & Interactive Modules

### 1. Prototype & Screenshot Inspector (`LiveAnalyzer.tsx`)
- **Multi-File Ingestion**: Drag and drop 1–5 mobile or desktop screenshots (PNG, JPG, WebP) or select from 1-click built-in presets (SaaS Checkout, API Key Setup, Mobile Wire Transfer, AI Workspace Permissions).
- **Interactive Pins Overlay**: Real-time numbered issue pins placed directly over visual hotspots (`#1` to `#4`), color-coded by severity (Critical Blocker, High Friction, Medium, Low).
- **Usability Health Score Ring**: Circular animated SVG indicator calculating an objective Clarity Score out of 100 based on flagged friction points.
- **Remediation Code Cards**: Filterable list of detected friction points detailing the exact Nielsen heuristic violated, human cognitive impact, and copy-paste React + Tailwind CSS code patches.

### 2. User Journey & Flow Simulator (`LiveAnalyzer.tsx`)
- Specify step-by-step conversion funnels (e.g., *"User lands on checkout page → Enters address → Clicks Pay Now with no visual feedback"*).
- Evaluates multi-step mental models, missing idempotency safeguards, and cognitive hesitation points.

### 3. UX Cost & Revenue Recovery Calculator (`UxCostCalculator.tsx`)
- Dynamic range sliders for **Monthly Unique Visitors**, **Current Conversion Rate**, and **Average Order Value**.
- Quantifies the hidden cost of human friction and computes estimated annual revenue unlocked by fixing identified blockers.

### 4. Heuristics Matrix (`HeuristicsMatrix.tsx`)
- Full interactive matrix of 14 core Nielsen Norman usability heuristics and WCAG 2.2 accessibility rules.
- Real-time instant search filtering with keyword mark highlighting (`mark.heuristic-mark`).

### 5. Interactive 90-Second System Walkthrough (`DemoModal.tsx`)
- Built-in chaptered media simulation demonstrating visual ingestion, WCAG deep scans, severity weighting, and remediation code export.

---

## 🎨 Design System & Color Palette

Friction pairs a **pristine Studio White Theme** (default) with an optional **Obsidian Dark Theme**, strictly conforming to **WCAG 2.2 AA and AAA** color contrast ratios:

| Token / Role | Light Theme (Default) | Dark Theme (Toggle) | Contrast Ratio | Description |
| :--- | :--- | :--- | :--- | :--- |
| **`--bg`** | `#FAFAF7` (Studio Warm White) | `#0A0A0A` (Deep Carbon) | — | Main canvas background |
| **`--surface`** | `#FFFFFF` (Pure White) | `#111111` (Elevated Zinc) | Base | Elevated cards, panels & modals |
| **`--surface-2`**| `#F0F0EB` (Soft Toned Grey) | `#18181B` (Dark Well) | Distinct | Dropzones, code blocks & wells |
| **`--border`** | `rgba(0, 0, 0, 0.09)` | `rgba(255, 255, 255, 0.08)` | — | Hairline structural borders |
| **`--text`** | `#0A0A0A` (Deep Ink) | `#F5F5F5` (Parchment) | **19.8 : 1** | **Exceeds WCAG AAA (>= 7:1)** |
| **`--muted`** | `#52525B` (Zinc-600) | `#A1A1AA` (Muted Zinc) | **7.2 : 1** | **Exceeds WCAG AAA (>= 7:1)** |
| **`--accent`** | `#C8FF3D` (Electric Lime) | `#C8FF3D` (Electric Lime) | — | Primary interactive button fill |
| **`--accent-ink`**| `#0A0A0A` (Deep Ink) | `#0A0A0A` (Deep Ink) | **16.8 : 1** | Ultra-contrast text on lime buttons |
| **`--accent-text`**| `#15803D` (Forest Emerald) | `#C8FF3D` (Electric Lime) | **5.8 : 1** | **Passes WCAG AA/AAA (>= 4.5:1)** |
| **`--danger`** | `#DC2626` (Red-600) | `#F43F5E` (Rose-500) | **5.2 : 1** | Critical blocker alert badge |
| **`--warning`** | `#B45309` (Amber-700) | `#F59E0B` (Amber-500) | **4.7 : 1** | High severity warning badge |
| **`--success`** | `#059669` (Emerald-600) | `#10B981` (Emerald-500) | **4.6 : 1** | Resolved item badge |

### Typography
- **Headings & Display**: Space Grotesk / Geist Sans with tight display tracking (`-0.03em`) for crisp legibility.
- **Body Copy**: Geist Sans / Inter (`300–600` weight) for maximum reading comfort across desktop and mobile.
- **Telemetry & Code**: JetBrains Mono for cURL snippets, API logs, latency counters, and code patches.

---

## ⚙️ Backend Architecture & API Documentation (`backend/`)

The backend is a high-speed, stateless **Node.js + Express** microservice integrating Google Gemini's multimodal vision API (`@google/generative-ai`).

### 1. Installation & Environment Configuration

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Create .env from template
cp .env.example .env
```

Configure `backend/.env`:
```ini
PORT=5001
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3-flash-preview
FRONTEND_URL=http://localhost:3000
MAX_IMAGES=5
USE_MOCK_AI=false
```
> **Note**: If `GEMINI_API_KEY` is not provided, the backend automatically operates in realistic mock mode, enabling full offline evaluation and demonstration!

### 2. Running the Backend Server

```bash
# Start backend in development mode with auto-reload
npm run dev

# Or start in standard production mode
npm start
```
By default, the backend runs on **`http://localhost:5001`** (or `http://localhost:5000`).

### 3. REST API Endpoints

| Method | Endpoint | Description | Request Payload |
| :--- | :--- | :--- | :--- |
| **`GET`** | `/api/health` | Health check, active AI mode (Gemini vs Mock), and model status | *None* |
| **`GET`** | `/api/sample-journeys` | Pre-configured evaluation journeys for checkout, onboarding, etc. | *None* |
| **`POST`** | `/api/analyze` | Multimodal screenshot evaluation via Gemini Vision | `multipart/form-data` with `screenshots` (1–5 files), `appName`, `targetUser`, `task`, `platform` |
| **`POST`** | `/v1/audit/prototype` | Alternative prototype evaluation endpoint | `multipart/form-data` or JSON with `imageBase64` |
| **`POST`** | `/v1/simulate/journey` | Evaluates multi-step plain-text user journey | JSON `{ "persona": "first_time", "steps": [...] }` |

### 4. Testing with cURL

#### Health Check:
```bash
curl -s http://localhost:5001/api/health
```

#### Analyze UI Screenshots:
```bash
curl -X POST http://localhost:5001/api/analyze \
  -F "screenshots=@./test-screen-1.png" \
  -F "appName=Checkout App" \
  -F "targetUser=First-time mobile users" \
  -F "task=Complete order payment" \
  -F "platform=mobile"
```

#### Sample API Response:
```json
{
  "success": true,
  "data": {
    "score": 68,
    "grade": "Moderate Friction",
    "summary": "Primary checkout CTA is disabled without field error indicators. Tap targets on payment inputs violate Fitts's law (34px < 44px minimum).",
    "counts": { "critical": 1, "high": 2, "medium": 1, "low": 0 },
    "issues": [
      {
        "id": "chk-1",
        "pinNumber": 1,
        "pinLocation": { "x": 50, "y": 82 },
        "severity": "critical",
        "heuristic": "Nielsen #1: Visibility of System Status",
        "title": "Silent Disabled Confirm & Pay Button",
        "impact": "Leaves 34% of mobile users tapping a dead button repeatedly and abandoning the funnel.",
        "fix": {
          "summary": "Keep CTA interactive; on click, smooth-scroll and focus the invalid postal code field.",
          "codeSnippet": "<button onClick={handleValidate} className=\"w-full py-4 bg-emerald-600 text-white rounded-xl\">Pay Now</button>"
        }
      }
    ]
  }
}
```

---

## 🚀 Getting Started (Full Stack)

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **pnpm**

### Step-by-Step Setup

```bash
# Clone the repository
git clone https://github.com/Pradhan-07/UI-UX-Evaluator.git
cd UI-UX-Evaluator

# Terminal 1: Start Express Backend
cd backend
npm install
npm run dev

# Terminal 2: Start Next.js Frontend
cd ..
npm install
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 📊 Usability Scoring Algorithm

Friction scores interfaces out of **100** using a weighted penalty deduction model:

$$\text{Score} = 100 - (15 \times N_{\text{critical}}) - (8 \times N_{\text{high}}) - (4 \times N_{\text{medium}}) - (2 \times N_{\text{low}})$$

- **85–100**: Production Ready / High Usability
- **70–84**: Moderate Friction / Minor Optimizations Recommended
- **< 70**: Severe Usability Friction Detected / Revenue Blocker

---

## 📄 License & Attribution

&copy; 2026 **FRICTION SYSTEMS INC.** All rights reserved.  
*"Designers should design. AI should find the friction."*
