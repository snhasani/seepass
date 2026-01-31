import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, jsonSchema, streamText, tool } from "ai";

const system = `## Product Discovery Assistant Prompt

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
`;

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
