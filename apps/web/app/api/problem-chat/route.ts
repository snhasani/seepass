import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText } from "ai";
import { buildSystemPrompt } from "./lib/prompt";
import { tools } from "./lib/tools";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const system = await buildSystemPrompt();

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
