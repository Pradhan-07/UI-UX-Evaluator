import { AuditPreset } from "@/types";

export const AUDIT_PRESETS: AuditPreset[] = [
  {
    id: "fintech-checkout",
    name: "Fintech Mobile Checkout Flow",
    category: "E-Commerce & Payments",
    type: "screenshot",
    imageSrc: "/samples/checkout.jpg",
    description: "Dark-mode mobile checkout with payment method selection, card inputs, and final order total authorization.",
    context: "Mobile first-time buyers completing a $128.50 order on iOS/Android. Goal: frictionless 1-tap checkout.",
    initialScore: 62,
    estimatedRecovery: "+19.4% conversion uplift",
    issues: [
      {
        id: "issue-fc-1",
        pinNumber: 1,
        pinLocation: { x: 74, y: 32 },
        title: "Ambiguous card input formatting without automatic brand detection",
        severity: "high",
        heuristic: "Nielsen #2: Match between system and real world",
        heuristicCategory: "Nielsen",
        impact: "Users must manually format card spaces; 14% of mobile transactions fail on typos in expiration or CVV without inline validation.",
        fix: {
          summary: "Implement automatic credit card format masking (4-4-4-4) with instant Luhn algorithm check and dynamic card network indicator.",
          codeSnippet: `<input
  type="text"
  inputMode="numeric"
  autoComplete="cc-number"
  placeholder="4000 1234 5678 9010"
  onChange={handleCardFormat}
  className="w-full bg-zinc-900/80 border border-white/20 rounded-xl px-4 py-3 font-mono text-white focus:border-[#C8FF3D] focus:ring-1 focus:ring-[#C8FF3D]"
/>`,
        },
        scorePenalty: 8,
      },
      {
        id: "issue-fc-2",
        pinNumber: 2,
        pinLocation: { x: 38, y: 44 },
        title: "Truncated tap target on Expiry Date field (34px height)",
        severity: "critical",
        heuristic: "WCAG 2.5.5: Target Size Minimum (44x44px)",
        heuristicCategory: "WCAG",
        impact: "Mobile touch accuracy drops significantly on sub-40px inputs, resulting in 28% mis-taps that dismiss the keyboard or focus the wrong field.",
        fix: {
          summary: "Elevate container height to minimum 48px with 12px thumb clearance, and specify numeric inputMode.",
          codeSnippet: `/* CSS Fix */
.input-expiry {
  min-height: 48px;
  padding: 12px 16px;
  touch-action: manipulation;
  font-size: 16px; /* Prevents iOS auto-zoom */
}`,
        },
        scorePenalty: 12,
      },
      {
        id: "issue-fc-3",
        pinNumber: 3,
        pinLocation: { x: 50, y: 55 },
        title: "Low contrast ratio (2.3:1) on 'Add New Card' secondary button",
        severity: "medium",
        heuristic: "WCAG 1.4.3: Contrast (Minimum 4.5:1)",
        heuristicCategory: "WCAG",
        impact: "Subtle dark-on-dark button text is practically illegible in bright daylight or for users with visual fatigue.",
        fix: {
          summary: "Upgrade text contrast from #55555c to #EDEDED, and add a crisp 1px subtle white/15 border border-hover glow.",
          codeSnippet: `<button className="w-full py-3 px-4 rounded-xl text-sm font-medium text-zinc-100 bg-white/5 border border-white/15 hover:border-[#C8FF3D]/50 transition-colors">
  + Add New Payment Card
</button>`,
        },
        scorePenalty: 6,
      },
      {
        id: "issue-fc-4",
        pinNumber: 4,
        pinLocation: { x: 78, y: 72 },
        title: "Hidden shipping & tax fee breakdown causes cart sticker shock",
        severity: "low",
        heuristic: "Nielsen #10: Help and documentation & Transparency",
        heuristicCategory: "Nielsen",
        impact: "Surprise appearance of $8.50 shipping fee at the final screen causes 18% cart abandonment before authorization.",
        fix: {
          summary: "Display transparent shipping calculation upfront with a clear tooltip and estimated delivery timeline.",
          codeSnippet: `<div className="flex justify-between text-xs text-zinc-400">
  <span className="flex items-center gap-1">Shipping <Tooltip text="Insured 2-day priority delivery" /></span>
  <span className="font-mono text-zinc-200">$8.50</span>
</div>`,
        },
        scorePenalty: 4,
      },
      {
        id: "issue-fc-5",
        pinNumber: 5,
        pinLocation: { x: 50, y: 83 },
        title: "Missing system progress & idempotency on 'Pay Now' CTA",
        severity: "critical",
        heuristic: "Nielsen #1: Visibility of system status",
        heuristicCategory: "Nielsen",
        impact: "Zero visual feedback during 3-5 second bank 3D-Secure roundtrip causes frantic repeated clicks, generating duplicate auth charges and customer rage.",
        fix: {
          summary: "Instantly disable button on click, swap text with an electric-lime pulsing loader, and attach an idempotency key header.",
          codeSnippet: `<button
  disabled={isAuthorizing}
  aria-busy={isAuthorizing}
  className="w-full py-4 rounded-xl font-bold bg-[#C8FF3D] text-black disabled:opacity-75 flex items-center justify-center gap-2"
>
  {isAuthorizing ? (
    <>
      <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
      <span>Authorizing securely...</span>
    </>
  ) : (
    <span>Pay Now $128.50 &rarr;</span>
  )}
</button>`,
        },
        scorePenalty: 12,
      },
    ],
  },
  {
    id: "onboarding-step-3",
    name: "Signup Step 3 (SMS & 2FA Drop-off)",
    category: "Authentication & Onboarding",
    type: "screenshot",
    imageSrc: "/samples/onboarding.jpg",
    description: "Mobile onboarding step 3 asking for phone number verification code and secondary authenticator token.",
    context: "New users attempting to create a free trial account on mobile web. Goal: reach core workspace in under 60 seconds.",
    initialScore: 54,
    estimatedRecovery: "+26.8% funnel completion",
    issues: [
      {
        id: "issue-ob-1",
        pinNumber: 1,
        pinLocation: { x: 24, y: 15 },
        title: "Invisible back navigation (1.8:1 contrast on dark header)",
        severity: "high",
        heuristic: "Nielsen #3: User control and freedom",
        heuristicCategory: "Nielsen",
        impact: "Users who mistyped their mobile number cannot easily navigate back to step 2 to correct it, resulting in dead-end abandonment.",
        fix: {
          summary: "Increase contrast of back navigation button to 7:1 ratio and expand the hit zone to 48x48px.",
          codeSnippet: `<button aria-label="Go back to step 2" className="flex items-center gap-1.5 text-zinc-100 hover:text-[#C8FF3D] p-2 -ml-2 text-sm font-medium">
  <ChevronLeft className="w-4 h-4" />
  <span>Back</span>
</button>`,
        },
        scorePenalty: 9,
      },
      {
        id: "issue-ob-2",
        pinNumber: 2,
        pinLocation: { x: 50, y: 44 },
        title: "Missing WebOTP & SMS native autofill attribute",
        severity: "critical",
        heuristic: "Hick's Law & Cognitive Load Reduction",
        heuristicCategory: "Psychology",
        impact: "Users are forced to leave the browser to open their SMS app. 34% never return to complete the session due to notification distractions.",
        fix: {
          summary: "Add autoComplete='one-time-code' and register navigator.credentials.get with WebOTP for 1-tap verification.",
          codeSnippet: `<input
  type="text"
  inputMode="numeric"
  autoComplete="one-time-code"
  pattern="[0-9]*"
  maxLength={6}
  className="w-12 h-14 text-center font-mono text-xl font-bold rounded-lg bg-zinc-900 border border-white/20 focus:border-[#C8FF3D]"
/>`,
        },
        scorePenalty: 14,
      },
      {
        id: "issue-ob-3",
        pinNumber: 3,
        pinLocation: { x: 50, y: 64 },
        title: "Redundant double-MFA barrier before demonstrating product value",
        severity: "critical",
        heuristic: "Nielsen #8: Aesthetic and minimalist design",
        heuristicCategory: "Nielsen",
        impact: "Requiring both SMS verification AND Authenticator App token during free signup causes severe friction fatigue; 48% bounce right here.",
        fix: {
          summary: "Defer Authenticator App configuration until user reaches high-security actions or account settings post-activation.",
          codeSnippet: `// Postpone non-critical security hurdles
if (isFirstSignup) {
  allowAccessWithSMSOnly();
  scheduleSecurityBannerPrompt({ delayDays: 3 });
}`,
        },
        scorePenalty: 15,
      },
      {
        id: "issue-ob-4",
        pinNumber: 4,
        pinLocation: { x: 50, y: 84 },
        title: "Ambiguous error recovery state if SMS code is expired",
        severity: "medium",
        heuristic: "Nielsen #9: Help users recognize, diagnose, and recover from errors",
        heuristicCategory: "Nielsen",
        impact: "When the 60s timer expires, the button silently errors without clear recovery action or automatic resend trigger.",
        fix: {
          summary: "Display human-readable error banner with an instant 1-click 'Resend SMS' action button and countdown reset.",
          codeSnippet: `<div className="mt-3 p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-center justify-between">
  <span>Code expired. A new token can be dispatched.</span>
  <button onClick={resendToken} className="text-[#C8FF3D] underline font-semibold">Resend Now</button>
</div>`,
        },
        scorePenalty: 8,
      },
    ],
  },
  {
    id: "saas-pricing-journey",
    name: "SaaS Enterprise Billing & Paywall Journey",
    category: "SaaS & Subscriptions",
    type: "journey",
    description: "Multi-step user journey from marketing pricing table to credit card paywall before value trial.",
    context: "Tech leads evaluating B2B cloud monitoring software. Goal: start free sandbox environment without procurement hurdles.",
    steps: [
      "Step 1: User visits pricing table and selects 'Pro Tier ($79/mo)'",
      "Step 2: Clicks 'Start 14-Day Free Trial' CTA",
      "Step 3: Presented with 12-field corporate registration form demanding company VAT and phone",
      "Step 4: Forced to enter credit card before accessing dashboard sandbox",
      "Step 5: Dashboard opens into an empty state with zero sample data or guided tour",
    ],
    initialScore: 58,
    estimatedRecovery: "+22.5% trial conversion",
    issues: [
      {
        id: "issue-saas-1",
        pinNumber: 1,
        pinLocation: { x: 30, y: 25 },
        title: "Premature credit card gate before trial value demonstration",
        severity: "critical",
        heuristic: "Nielsen #4: Consistency and standards (B2B PLG benchmark)",
        heuristicCategory: "Nielsen",
        impact: "Demanding credit card credentials for a 14-day trial creates corporate procurement paralysis; 61% of developers abandon.",
        fix: {
          summary: "Remove upfront card requirement; offer true friction-free 14-day sandbox access, collecting payment info at day 10.",
          codeSnippet: `<Button variant="primary" className="bg-[#C8FF3D] text-black">
  Start Free 14-Day Trial — No Credit Card Required &rarr;
</Button>`,
        },
        scorePenalty: 16,
      },
      {
        id: "issue-saas-2",
        pinNumber: 2,
        pinLocation: { x: 50, y: 48 },
        title: "12-field registration form causes excessive cognitive overhead",
        severity: "high",
        heuristic: "Hick's Law: Decision Time Increases with Options",
        heuristicCategory: "Psychology",
        impact: "Excessive non-essential fields (Company VAT, Phone number, Industry size) reduce signup completion by 38%.",
        fix: {
          summary: "Pare down initial signup to single-sign-on (Google / GitHub / Work Email) and enrich company data asynchronously via Clearbit/Enrichment API.",
          codeSnippet: `<div className="flex flex-col gap-3">
  <GitHubAuthButton />
  <GoogleAuthButton />
  <span className="text-center text-xs text-zinc-500">or use work email</span>
</div>`,
        },
        scorePenalty: 12,
      },
      {
        id: "issue-saas-3",
        pinNumber: 3,
        pinLocation: { x: 70, y: 75 },
        title: "Empty state syndrome on first dashboard launch",
        severity: "medium",
        heuristic: "Nielsen #6: Recognition rather than recall",
        heuristicCategory: "Nielsen",
        impact: "A blank white screen with 'No data yet' leaves users bewildered about what to configure next; 42% churn on session 1.",
        fix: {
          summary: "Pre-populate initial workspace with mock telemetry data and an interactive 3-step checklist to connect first agent.",
          codeSnippet: `<DemoDataToggle defaultChecked={true} label="Showing simulated production cluster metrics" />`,
        },
        scorePenalty: 10,
      },
      {
        id: "issue-saas-4",
        pinNumber: 4,
        pinLocation: { x: 85, y: 90 },
        title: "Hidden annual vs monthly billing toggle multiplier",
        severity: "low",
        heuristic: "Nielsen #10: Error prevention & Transparency",
        heuristicCategory: "Nielsen",
        impact: "Defaulting to annual billing ($948 upfront) without transparent monthly toggle creates checkout confusion and churn.",
        fix: {
          summary: "Clearly delineate 'Billed annually ($79/mo)' vs 'Billed monthly ($95/mo)' with explicit toggle switch.",
          codeSnippet: `<BillingToggle value={billingCycle} onChange={setBillingCycle} discountBadge="Save 20%" />`,
        },
        scorePenalty: 4,
      },
    ],
  },
];
