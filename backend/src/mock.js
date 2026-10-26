// Mock mode: used when there is no API key, or when Gemini fails.
// This keeps the demo alive on stage and lets you build the frontend
// before you get a key. It is clearly labelled "mock" in the response.
export function analyzeMock(context, screenCount) {
  const allIssues = [
    {
      screen: 1,
      title: "Primary call-to-action is hard to find",
      severity: "critical",
      heuristic: "Visibility of system status",
      evidence:
        "The main action blends into the background and sits below other competing buttons on the first screen.",
      impact:
        "First-time users miss the next step, hesitate, and many abandon the journey before it starts.",
      fix: "Make one primary button full-width, sticky at the bottom of the screen, with high-contrast text.",
      effort: "Quick win",
    },
    {
      screen: 1,
      title: "Too many competing elements on one screen",
      severity: "high",
      heuristic: "Aesthetic and minimalist design",
      evidence:
        "Banners, cards, icons and text compete for attention with no clear visual hierarchy.",
      impact:
        "Users scan past the important action and take longer to decide what to do next.",
      fix: "Keep one primary action per screen. Move secondary links into a single overflow menu.",
      effort: "Medium",
    },
    {
      screen: Math.min(2, screenCount),
      title: "No visible progress or confirmation after an action",
      severity: "high",
      heuristic: "Visibility of system status",
      evidence:
        "After moving to the next screen there is no progress indicator, success state, or summary of what changed.",
      impact:
        "Users are unsure whether their action worked and may tap again or go back, breaking the flow.",
      fix: "Add a 3-step progress indicator and a short confirmation line after each completed step.",
      effort: "Quick win",
    },
    {
      screen: Math.min(2, screenCount),
      title: "Labels rely on icons alone, with no text",
      severity: "medium",
      heuristic: "Recognition rather than recall",
      evidence: "Several key actions are shown as icons only, with no label underneath.",
      impact:
        "New users must guess what each icon does, which slows them down and causes wrong taps.",
      fix: "Add a short text label under every primary icon, at least on first use.",
      effort: "Quick win",
    },
    {
      screen: screenCount,
      title: "Error and empty states are not handled",
      severity: "medium",
      heuristic:
        "Help users recognize, diagnose, and recover from errors",
      evidence:
        "The final screen has no guidance for what happens if a field is wrong or a step fails.",
      impact:
        "When something goes wrong, users get stuck with no next step and leave.",
      fix: "Show inline error text next to the field, in plain language, with exactly how to fix it.",
      effort: "Medium",
    },
    {
      screen: screenCount,
      title: "Small tap targets and low-contrast secondary text",
      severity: "low",
      heuristic: "Consistency and standards",
      evidence:
        "Secondary text and small controls are close together and hard to read at a glance.",
      impact:
        "Users on small phones mis-tap and strain to read supporting information.",
      fix: "Increase tap targets to at least 44px and raise secondary text contrast to 4.5:1.",
      effort: "Quick win",
    },
  ];

  // With 1 screen, only return the first-screen issues. With more screens,
  // return more issues — so the demo still feels journey-aware.
  const issues =
    screenCount <= 1
      ? allIssues.filter((i) => i.screen === 1)
      : allIssues;

  return {
    summary:
      "Mock analysis (no Gemini key): the journey has a weak primary action and unclear progress, so first-time users are likely to hesitate or drop off before finishing the task. Fix the call-to-action and progress feedback first.",
    issues,
  };
}
