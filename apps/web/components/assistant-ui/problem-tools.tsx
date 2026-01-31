"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useAui, type ToolCallMessagePartComponent } from "@assistant-ui/react";
import { useMemo, useState } from "react";

type ProblemQuestionArgs = {
  question?: string;
  options?: string[];
  allowFreeText?: boolean;
  helperText?: string;
};

type ProblemSummaryArgs = {
  title?: string;
  description?: string;
  confidence?: number;
};

export const ProblemQuestionTool: ToolCallMessagePartComponent<
  ProblemQuestionArgs,
  { answer: string; mode: "option" | "text"; question?: string }
> = ({ args, result }) => {
  const aui = useAui();
  const [text, setText] = useState("");
  const question = args?.question ?? "Can you clarify the user problem?";
  const options = args?.options ?? [];
  const allowFreeText = args?.allowFreeText ?? true;
  const helperText = args?.helperText;
  const isAnswered = result !== undefined;

  const canSubmitText = useMemo(
    () => allowFreeText && text.trim().length > 0 && !isAnswered,
    [allowFreeText, text, isAnswered]
  );

  return (
    <Card className="mb-4 border-dashed">
      <CardHeader>
        <CardTitle className="text-base">Clarify the real user problem</CardTitle>
        <CardDescription>{question}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {helperText ? (
          <p className="text-xs text-muted-foreground">{helperText}</p>
        ) : null}
        {options.length > 0 ? (
          <div className="grid gap-2 sm:grid-cols-2">
            {options.map((option) => (
              <Button
                key={option}
                type="button"
                variant="outline"
                disabled={isAnswered}
                onClick={() =>
                  aui.part().addToolResult({
                    answer: option,
                    mode: "option",
                    question,
                  })
                }
              >
                {option}
              </Button>
            ))}
          </div>
        ) : null}
        {allowFreeText ? (
          <div className="space-y-2">
            <textarea
              className={cn(
                "min-h-24 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
              )}
              placeholder="Describe the user problem in your own words..."
              value={text}
              onChange={(event) => setText(event.target.value)}
              disabled={isAnswered}
            />
            <Button
              type="button"
              variant="default"
              disabled={!canSubmitText}
              onClick={() =>
                aui.part().addToolResult({
                  answer: text.trim(),
                  mode: "text",
                  question,
                })
              }
            >
              Send answer
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export const ProblemSummaryTool: ToolCallMessagePartComponent<
  ProblemSummaryArgs,
  { confirmed: boolean; correction?: string }
> = ({ args, result }) => {
  const aui = useAui();
  const [correction, setCorrection] = useState("");
  const [showCorrection, setShowCorrection] = useState(false);
  const isAnswered = result !== undefined;
  const title = args?.title ?? "Proposed user problem";
  const description =
    args?.description ??
    "Please review the summary and confirm if this matches the real user problem.";

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-base">Confirm the user problem</CardTitle>
        <CardDescription>
          Make sure this matches what users are truly struggling with.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="rounded-lg border bg-white px-4 py-3">
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {showCorrection ? (
          <textarea
            className={cn(
              "min-h-24 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
            )}
            placeholder="What needs to change in the summary?"
            value={correction}
            onChange={(event) => setCorrection(event.target.value)}
            disabled={isAnswered}
          />
        ) : null}
      </CardContent>
      <CardFooter className="gap-2">
        <Button
          type="button"
          variant="default"
          disabled={isAnswered}
          onClick={() => aui.part().addToolResult({ confirmed: true })}
        >
          Submit
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isAnswered}
          onClick={() => {
            if (!showCorrection) {
              setShowCorrection(true);
              return;
            }
            aui.part().addToolResult({
              confirmed: false,
              correction: correction.trim() || undefined,
            });
          }}
        >
          {showCorrection ? "Send correction" : "Reiterate"}
        </Button>
      </CardFooter>
    </Card>
  );
};
