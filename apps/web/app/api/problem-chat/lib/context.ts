const PLATFORM_CONTEXT_URL = process.env.PLATFORM_CONTEXT_URL;
const PLATFORM_CONTEXT_API_KEY = process.env.PLATFORM_CONTEXT_API_KEY;
const PLATFORM_CONTEXT_TIMEOUT_MS = 2500;
const PLATFORM_CONTEXT_MAX_CHARS = 4000;

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
      const data = (await response.json()) as Record<string, unknown>;
      text = formatContextPayload(data);
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

function formatContextPayload(payload: Record<string, unknown>) {
  const lines: string[] = [];

  for (const [key, value] of Object.entries(payload)) {
    if (value == null) continue;
    if (typeof value === "string") {
      lines.push(`- ${key}: ${value}`);
      continue;
    }
    if (typeof value === "number" || typeof value === "boolean") {
      lines.push(`- ${key}: ${String(value)}`);
      continue;
    }
    if (Array.isArray(value)) {
      const entries = value
        .filter((item) => item != null)
        .map((item) => String(item))
        .slice(0, 6);
      if (entries.length) {
        lines.push(`- ${key}: ${entries.join("; ")}`);
      }
      continue;
    }
    if (typeof value === "object") {
      const nested = Object.entries(value as Record<string, unknown>)
        .filter(([, nestedValue]) => nestedValue != null)
        .slice(0, 6)
        .map(([nestedKey, nestedValue]) => `${nestedKey}: ${String(nestedValue)}`)
        .join("; ");
      if (nested) {
        lines.push(`- ${key}: ${nested}`);
      }
    }
  }

  return lines.join("\n");
}
