"use client";

import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { useAui, type ToolCallMessagePartComponent } from "@assistant-ui/react";
import { useMemo, useState } from "react";
import type { ProblemQuestion, ProblemSummary } from "../types";

export const ProblemQuestionTool: ToolCallMessagePartComponent<
  ProblemQuestion,
  { answer: string; mode: "option" | "text"; question?: string }
> = ({ args, result }) => {
  const aui = useAui();
  const [text, setText] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const question = args?.question ?? "Can you clarify the user problem?";
  const options = args?.options ?? [];
  const allowFreeText = args?.allowFreeText ?? true;
  const helperText = args?.helperText;
  const isAnswered = result !== undefined;

  const canSubmitText = useMemo(
    () => allowFreeText && text.trim().length > 0 && !isAnswered,
    [allowFreeText, text, isAnswered]
  );
  const canSubmitOption = useMemo(
    () => !isAnswered && !!selectedOption,
    [isAnswered, selectedOption]
  );

  return (
    <div className="mb-4 space-y-4 rounded-2xl border border-dashed p-4">
      <div className="space-y-1">
        <h3 className="text-base font-semibold">Clarify the real user problem</h3>
        <p className="text-sm text-muted-foreground">{question}</p>
      </div>
      {helperText ? (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      ) : null}
      {options.length > 0 ? (
        <div className="grid gap-2">
          {options.map((option, index) => {
            const isSelected = selectedOption === option;
            return (
              <button
                key={option}
                type="button"
                className={cn(
                  "flex w-full items-start gap-3 rounded-xl border px-3 py-2 text-left text-sm transition",
                  "hover:bg-muted/40",
                  isSelected
                    ? "border-primary/40 bg-primary/5"
                    : "border-border",
                  isAnswered ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                )}
                disabled={isAnswered}
                onClick={() => setSelectedOption(option)}
              >
                <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold text-muted-foreground">
                  {index + 1}
                </span>
                <span className="text-foreground">{option}</span>
              </button>
            );
          })}
          <div>
            <Button
              type="button"
              variant="default"
              disabled={!canSubmitOption}
              onClick={() => {
                if (!selectedOption) return;
                aui.part().addToolResult({
                  answer: selectedOption,
                  mode: "option",
                  question,
                });
              }}
            >
              Submit selection
            </Button>
          </div>
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
    </div>
  );
};

export const ProblemSummaryTool: ToolCallMessagePartComponent<
  ProblemSummary,
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
    <div className="mb-4 space-y-4 rounded-2xl border p-4">
      <div className="space-y-1">
        <h3 className="text-base font-semibold">Confirm the user problem</h3>
        <p className="text-sm text-muted-foreground">
          Make sure this matches what users are truly struggling with.
        </p>
      </div>
      <div className="rounded-lg border px-4 py-3">
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
      <div className="flex flex-wrap gap-2">
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
      </div>
    </div>
  );
};
