import { z } from "zod";

const PLATFORM_CONTEXT_URL = process.env.PLATFORM_CONTEXT_URL;
const PLATFORM_CONTEXT_API_KEY = process.env.PLATFORM_CONTEXT_API_KEY;
const PLATFORM_CONTEXT_TIMEOUT_MS = 2500;
const PLATFORM_CONTEXT_MAX_CHARS = 4000;

// Example response payload the platform context API should return.
export const platformContextExample = {
  platform: {
    name: "Saferspaces",
    description:
      "Germany-based safety and awareness platform providing a web-based, no-app reporting and rapid-response system for events, venues, and organizations. Focused on making help accessible, anonymous, and immediate for harassment, discrimination, medical incidents, or escalating conflict.",
    primaryUsers: ["Event attendees", "Venue visitors", "Employees", "Students"],
    industries: ["Events", "Hospitality", "Education", "Workplaces", "Public venues"],
    regions: ["Germany", "Europe"],
  },
  surfaces: ["Web app (browser-based)", "QR codes", "Venue links", "White-label integrations"],
  keyFeatures: [
    "Anonymous, low-barrier reporting",
    "Real-time location sharing",
    "Rapid Response & Rapid Report modes",
    "Anonymous chat & protocol logging",
    "Analytics & heatmaps",
    "Multilingual access",
    "Geofencing",
  ],
  constraints: ["No app download", "No login", "No personal data required", "GDPR-compliant"],
  knownPainPoints: [
    "People hesitate to report due to fear of retaliation",
    "Slow or misdirected responses during incidents",
    "Lack of structured documentation for aftercare and review",
  ],
  terminology: {
    "Rapid Response": "Immediate on-site intervention when teams are present",
    "Rapid Report": "Confidential reporting when teams are not on-site",
  },
} as const;
const platformContextSchema = z.object({
  platform: z
    .object({
      name: z.string().min(1).max(120),
      description: z.string().min(1).max(600),
      primaryUsers: z.array(z.string().min(1).max(80)).max(6).optional(),
      industries: z.array(z.string().min(1).max(80)).max(6).optional(),
      regions: z.array(z.string().min(1).max(80)).max(6).optional(),
    })
    .strict(),
  surfaces: z.array(z.string().min(1).max(80)).max(8).optional(),
  keyFeatures: z.array(z.string().min(1).max(120)).max(12).optional(),
  constraints: z.array(z.string().min(1).max(120)).max(8).optional(),
  knownPainPoints: z.array(z.string().min(1).max(140)).max(8).optional(),
  terminology: z
    .record(z.string(), z.string().min(1).max(80))
    .refine((value) => Object.keys(value).length <= 10)
    .optional(),
});

export async function fetchPlatformContext(): Promise<string | null> {
  if (!PLATFORM_CONTEXT_URL) return null;

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    PLATFORM_CONTEXT_TIMEOUT_MS
  );

  try {
    const response = await fetch(PLATFORM_CONTEXT_URL, {
      method: "GET",
      headers: {
        Accept: "application/json, text/plain;q=0.9",
        ...(PLATFORM_CONTEXT_API_KEY
          ? { Authorization: `Bearer ${PLATFORM_CONTEXT_API_KEY}` }
          : {}),
      },
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) return null;

    const contentType = response.headers.get("content-type") ?? "";
    let text = "";

    if (contentType.includes("application/json")) {
      const raw = await response.json();
      const parsed = platformContextSchema.safeParse(raw);
      if (!parsed.success) return null;
      text = formatContextPayload(parsed.data);
    } else {
      text = await response.text();
    }

    const trimmed = text.trim();
    if (!trimmed) return null;
    return trimmed.length > PLATFORM_CONTEXT_MAX_CHARS
      ? `${trimmed.slice(0, PLATFORM_CONTEXT_MAX_CHARS)}…`
      : trimmed;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

type PlatformContext = z.infer<typeof platformContextSchema>;

function formatContextPayload(payload: PlatformContext) {
  const lines: string[] = [];

  lines.push(`- Platform: ${payload.platform.name}`);
  lines.push(`- Description: ${payload.platform.description}`);

  if (payload.platform.primaryUsers?.length) {
    lines.push(`- Primary users: ${payload.platform.primaryUsers.join("; ")}`);
  }
  if (payload.platform.industries?.length) {
    lines.push(`- Industries: ${payload.platform.industries.join("; ")}`);
  }
  if (payload.platform.regions?.length) {
    lines.push(`- Regions: ${payload.platform.regions.join("; ")}`);
  }
  if (payload.surfaces?.length) {
    lines.push(`- Surfaces: ${payload.surfaces.join("; ")}`);
  }
  if (payload.keyFeatures?.length) {
    lines.push(`- Key features: ${payload.keyFeatures.join("; ")}`);
  }
  if (payload.constraints?.length) {
    lines.push(`- Constraints: ${payload.constraints.join("; ")}`);
  }
  if (payload.knownPainPoints?.length) {
    lines.push(`- Known pain points: ${payload.knownPainPoints.join("; ")}`);
  }
  if (payload.terminology && Object.keys(payload.terminology).length > 0) {
    const terms = Object.entries(payload.terminology)
      .map(([term, meaning]) => `${term} = ${meaning}`)
      .join("; ");
    lines.push(`- Terminology: ${terms}`);
  }

  return lines.join("\n");
}
