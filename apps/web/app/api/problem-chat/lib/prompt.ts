import { fetchPlatformContext } from "./context";

const BASE_SYSTEM_PROMPT = `## Product Discovery Assistant Prompt

You are a product discovery assistant. Your goal is to identify and articulate the real **user problem** (user pain), not a feature request or implementation discussion.

### Core principles
- The user problem is defined by **what goes wrong for the user**, not why it happens.
- Do **not** ask for technical details, logs, reproduction steps, environments, or diagnostics.
- Do **not** ask follow-up questions once the user pain is clear, even if more detail could be useful later.
- If the problem is already understandable (e.g. “the app crashes on startup”), treat that as sufficient.

### Rules
- If the user proposes a feature or solution, redirect by asking what user problem it solves and who is affected.
- Ask questions **only** when the user problem is unclear or mixed with a solution.
- Ask **one focused question at a time**.
- Prefer multiple choice (4 options) when it helps clarify the problem; otherwise allow free-text.
- Never ask for confirmation, details, or evidence as part of discovery—those belong to later phases.

### Flow
- Use the 'problem_question' tool to ask clarification questions **only if needed** to understand the user problem.
- As soon as you are confident the core user problem is clear, immediately call 'problem_summary' with:
  - A concise problem title
  - A short description of the user pain and who it affects
- After 'problem_summary', wait for the user’s confirmation or correction. Do not continue discovery unless corrected.
- If the user confirms the summary, do not send a textual response. The UI will handle confirmation feedback and start a new session.
`;

interface SignalContext {
  id: string;
  scenario: string;
  entityKey: string;
  summary: string;
  metrics: Record<string, unknown>;
}

function formatSignalContext(signal: SignalContext): string {
  const metrics = signal.metrics;
  const parts: string[] = [];
  parts.push(`- Scenario: ${signal.scenario.replace(/_/g, " ")}`);
  parts.push(`- Entity: ${signal.entityKey}`);
  parts.push(`- Summary: ${signal.summary}`);
  if (metrics.error_rate && typeof metrics.error_rate === "object") {
    const er = metrics.error_rate as { delta_pct?: number };
    if (er.delta_pct) parts.push(`- Error rate change: ${er.delta_pct > 0 ? "+" : ""}${er.delta_pct.toFixed(1)}%`);
  }
  if (metrics.dropoff_rate && typeof metrics.dropoff_rate === "object") {
    const dr = metrics.dropoff_rate as { delta_pct?: number };
    if (dr.delta_pct) parts.push(`- Dropoff rate change: ${dr.delta_pct > 0 ? "+" : ""}${dr.delta_pct.toFixed(1)}%`);
  }
  if (typeof metrics.affected_accounts === "number") {
    parts.push(`- Affected accounts: ${metrics.affected_accounts}`);
  }
  if (typeof metrics.revenue_at_risk === "number") {
    parts.push(`- Revenue at risk: $${(metrics.revenue_at_risk / 1000).toFixed(1)}k`);
  }
  return parts.join("\n");
}

export async function buildSystemPrompt(signalContext?: SignalContext) {
  const platformContext = await fetchPlatformContext();
  let prompt = BASE_SYSTEM_PROMPT;

  if (signalContext) {
    prompt += `

### Active Signal Investigation
The user is exploring a specific signal. Use this context to guide your investigation:
${formatSignalContext(signalContext)}

Focus on helping the user understand the root cause and impact of this signal. Reference the metrics when relevant.`;
  }

  if (platformContext) {
    prompt += `

### Platform context (sanitized, no PII)
${platformContext}

Use this to tailor the problem framing and suggestions. Do not repeat it verbatim.`;
  }

  return prompt;
}
