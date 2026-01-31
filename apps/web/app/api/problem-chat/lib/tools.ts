import { jsonSchema, tool } from "ai";

export const tools = {
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
