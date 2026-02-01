import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { z } from "zod";
import { buildSystemPrompt } from "./lib/prompt";
import { tools } from "./lib/tools";

type UIMessageInput = Omit<UIMessage, "id">;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

const uiMessageSchema: z.ZodType<UIMessageInput> = z.custom<UIMessageInput>(
  (value) => {
    if (!isPlainObject(value)) return false;
    if (
      value.role !== "system" &&
      value.role !== "user" &&
      value.role !== "assistant"
    ) {
      return false;
    }
    if (!Array.isArray(value.parts)) return false;
    return value.parts.every(
      (part) => isPlainObject(part) && typeof part.type === "string"
    );
  },
  "Invalid UI message"
);

const signalContextSchema = z.object({
  id: z.string(),
  scenario: z.string(),
  entityKey: z.string(),
  summary: z.string(),
  metrics: z.any(),
}).nullish();

const requestSchema = z.object({
  messages: z.array(uiMessageSchema),
  signalContext: signalContextSchema,
});

export async function POST(req: Request) {
  const data = await req.json();

  const parsed = requestSchema.safeParse(data);
  if (!parsed.success) {
    return new Response("Invalid request body", { status: 400 });
  }
  const { messages, signalContext } = parsed.data;
  const system = await buildSystemPrompt(signalContext ?? undefined);

  const result = streamText({
    model: openai.responses("gpt-5-nano"),
    system,
    messages: await convertToModelMessages(messages),
    tools,
    providerOptions: {
      openai: {
        reasoningEffort: "low",
        reasoningSummary: "auto",
      },
    },
  });

  return result.toUIMessageStreamResponse({
    sendReasoning: true,
  });
}
