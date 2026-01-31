import { openai } from "@ai-sdk/openai";
import { jsonSchema, streamText, tool, convertToModelMessages } from "ai";

const system = `You are a product discovery assistant. Your goal is to help users describe the real user problem, not a feature request.

Rules:
- If the user proposes a feature or solution, redirect: ask what user problem it solves and who is affected.
- Ask one focused question at a time.
- Prefer multiple choice (4 options) when it helps clarify; otherwise allow free-text.
- Use the problem_question tool to ask questions.
- Once you are confident the core user problem is clear, call problem_summary with a concise title and description.
- After problem_summary, wait for the user's confirmation or correction.`;

const tools = {
  problem_question: tool({
    description:
      "Ask the user a focused question to clarify the real user problem.",
    inputSchema: jsonSchema({
      type: "object",
      properties: {
        question: {
          type: "string",
          description: "The question to ask the user.",
        },
        options: {
          type: "array",
          minItems: 2,
          maxItems: 4,
          items: { type: "string" },
          description: "Up to 4 multiple-choice options.",
        },
        allowFreeText: {
          type: "boolean",
          description: "Whether the user can answer with free text.",
        },
        helperText: {
          type: "string",
          description: "Short hint that explains what to include.",
        },
      },
      required: ["question"],
      additionalProperties: false,
    }),
  }),
  problem_summary: tool({
    description:
      "Confirm the understood user problem with a title and description.",
    inputSchema: jsonSchema({
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "Short, specific title of the user problem.",
        },
        description: {
          type: "string",
          description: "1-3 sentences describing the user problem.",
        },
        confidence: {
          type: "number",
          minimum: 0,
          maximum: 1,
          description: "Optional confidence score from 0 to 1.",
        },
      },
      required: ["title", "description"],
      additionalProperties: false,
    }),
  }),
};

export async function POST(req: Request) {
  const { messages } = await req.json();

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
