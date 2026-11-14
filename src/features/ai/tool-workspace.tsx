"use client";

import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

export type Tool = "tutor" | "mock-interview" | "resume-review" | "study-planner";

const errorSchema = z.object({ error: z.string().optional(), message: z.string().optional() });
const interviewSchema = z.union([
  z.object({ interview: z.object({ id: z.string().uuid() }), firstQuestion: z.string().min(1) }),
  z.object({ feedback: z.string().min(1), isComplete: z.boolean() }),
]);
const analysisSchema = z.object({
  analysis: z.object({
    atsScore: z.number().min(0).max(100),
    overallFeedback: z.string(),
    improvements: z.array(z.string()),
    keywordAnalysis: z.object({ matched: z.array(z.string()), missing: z.array(z.string()) }),
  }),
});

export function ToolWorkspace({ tool }: { tool: Tool }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<Array<{ role: string; text: string }>>([]);
  const [conversationId, setConversationId] = useState<string>();
  const [interviewId, setInterviewId] = useState<string>();
  const [complete, setComplete] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const field = (key: string) => String(data.get(key) ?? "").trim();
    const list = (key: string) =>
      field(key)
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);
    setError("");
    setPending(true);
    let endpoint: string;
    let body: Record<string, unknown>;
    if (tool === "tutor") {
      endpoint = "/api/ai/tutor";
      body = { message: field("message"), conversationId };
    } else if (tool === "mock-interview") {
      endpoint = "/api/ai/interview";
      body = interviewId
        ? { interviewId, answer: field("message") }
        : { type: field("type"), role: field("role") };
    } else if (tool === "resume-review") {
      endpoint = "/api/ai/resume";
      body = {
        fileName: "Pasted resume",
        fileUrl: "",
        resumeText: field("message"),
        targetRole: field("role"),
      };
    } else {
      endpoint = "/api/ai/generate";
      body = {
        type: "studyPlan",
        targetRole: field("role"),
        targetCompany: field("company"),
        interviewDate: field("date") || undefined,
        hoursPerDay: Number(field("hours")),
        weakAreas: list("weak"),
        strongAreas: list("strong"),
      };
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        if (response.status === 401 || response.redirected)
          throw new Error("Your session has expired. Please log in again.");
        const payload: unknown = response.headers.get("content-type")?.includes("application/json")
          ? await response.json()
          : {};
        const parsed = errorSchema.safeParse(payload);
        throw new Error(
          parsed.success
            ? (parsed.data.error ??
                parsed.data.message ??
                "The request could not be completed. Please try again.")
            : "The request could not be completed. Please try again."
        );
      }
      if (response.redirected || response.headers.get("content-type")?.includes("text/html")) {
        throw new Error("Please log in to use this tool.");
      }
      if (tool === "tutor") {
        const id = response.headers.get("X-Conversation-Id");
        if (!id || !z.string().uuid().safeParse(id).success)
          throw new Error("The server did not return a conversation ID.");
        setConversationId(id);
        const reader = response.body?.getReader();
        if (!reader) throw new Error("The server did not return a response stream.");
        const decoder = new TextDecoder();
        const previous = [...results, { role: "You", text: field("message") }];
        let text = "";
        for (;;) {
          const chunk = await reader.read();
          if (chunk.done) break;
          text += decoder.decode(chunk.value, { stream: true });
          setResults([...previous, { role: "AI Tutor", text }]);
        }
        text += decoder.decode();
        if (!text.trim()) throw new Error("The AI returned an empty response. Please try again.");
        setResults([...previous, { role: "AI Tutor", text }]);
        form.reset();
      } else {
        const payload: unknown = await response.json();
        if (tool === "mock-interview") {
          const result = interviewSchema.parse(payload);
          if ("interview" in result) {
            setInterviewId(result.interview.id);
            setResults([{ role: "Interviewer", text: result.firstQuestion }]);
          } else {
            setResults([
              ...results,
              { role: "You", text: field("message") },
              {
                role: result.isComplete ? "Interview summary" : "Feedback and next question",
                text: result.feedback,
              },
            ]);
            setComplete(result.isComplete);
          }
          form.reset();
        } else if (tool === "resume-review") {
          const { analysis } = analysisSchema.parse(payload);
          setResults([
            {
              role: `AI-estimated ATS score: ${analysis.atsScore}/100`,
              text: analysis.overallFeedback,
            },
            {
              role: "Suggested improvements",
              text: analysis.improvements.map((item) => `- ${item}`).join("\n"),
            },
            {
              role: "Missing keywords",
              text: analysis.keywordAnalysis.missing.join(", ") || "No missing keywords reported.",
            },
          ]);
        } else {
          const result = z.object({ text: z.string().min(1) }).parse(payload);
          setResults([{ role: "Your study plan", text: result.text }]);
        }
      }
    } catch (failure) {
      setError(
        failure instanceof z.ZodError
          ? "The AI returned an invalid response. Please try again."
          : failure instanceof Error
            ? failure.message
            : "An unexpected error occurred. Please try again."
      );
    } finally {
      setPending(false);
    }
  }

  const needsMessage =
    tool === "tutor" || tool === "resume-review" || (tool === "mock-interview" && !!interviewId);
  return (
    <div className="space-y-6">
      {results.length > 0 && (
        <div className="space-y-4" aria-live="polite" aria-busy={pending}>
          {results.map((result, index) => (
            <Card key={index}>
              <CardContent className="space-y-2">
                <h2 className="font-semibold">{result.role}</h2>
                <p className="whitespace-pre-wrap break-words text-sm leading-7 [overflow-wrap:anywhere]">
                  {result.text}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {complete ? (
        <Button
          onClick={() => {
            setInterviewId(undefined);
            setComplete(false);
            setResults([]);
          }}
        >
          Start another interview
        </Button>
      ) : (
        <Card>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              {tool === "mock-interview" && !interviewId && (
                <Select
                  id="interview-type"
                  aria-label="Interview type"
                  name="type"
                  options={[
                    { value: "technical", label: "Technical" },
                    { value: "behavioral", label: "Behavioral" },
                    { value: "hr", label: "HR" },
                    { value: "system_design", label: "System design" },
                    { value: "coding", label: "Coding" },
                  ]}
                />
              )}
              {tool !== "tutor" && !interviewId && (
                <div className="space-y-1.5">
                  <label htmlFor="target-role" className="text-sm font-medium">
                    Target role
                  </label>
                  <Input
                    id="target-role"
                    name="role"
                    required
                    maxLength={100}
                    placeholder="Software engineer"
                    className="h-11"
                  />
                </div>
              )}
              {tool === "study-planner" && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label htmlFor="company" className="text-sm font-medium">
                        Target company (optional)
                      </label>
                      <Input id="company" name="company" maxLength={100} className="h-11" />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="date" className="text-sm font-medium">
                        Interview date (optional)
                      </label>
                      <Input id="date" name="date" type="date" className="h-11" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="hours" className="text-sm font-medium">
                      Study hours per day
                    </label>
                    <Input
                      id="hours"
                      name="hours"
                      type="number"
                      required
                      min={1}
                      max={16}
                      defaultValue={2}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="weak" className="text-sm font-medium">
                      Areas to improve (comma-separated)
                    </label>
                    <Input id="weak" name="weak" maxLength={1000} className="h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="strong" className="text-sm font-medium">
                      Strong areas (comma-separated)
                    </label>
                    <Input id="strong" name="strong" maxLength={1000} className="h-11" />
                  </div>
                </>
              )}
              {needsMessage && (
                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-sm font-medium">
                    {tool === "resume-review"
                      ? "Paste your resume text"
                      : tool === "tutor"
                        ? "Your question"
                        : "Your answer"}
                  </label>
                  <TextArea
                    id="message"
                    name="message"
                    required
                    minLength={tool === "resume-review" ? 50 : 1}
                    maxLength={tool === "resume-review" ? 50000 : 10000}
                    className="min-h-40"
                  />
                  {tool === "resume-review" && (
                    <p className="text-xs text-muted-foreground">
                      Paste text only. Do not include sensitive identifiers. This is AI feedback,
                      not an employer ATS guarantee.
                    </p>
                  )}
                </div>
              )}
              {error && (
                <p
                  role="alert"
                  className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
                >
                  {error}
                </p>
              )}
              <div className="flex flex-wrap gap-3">
                <Button type="submit" disabled={pending}>
                  {pending
                    ? "Working..."
                    : tool === "tutor"
                      ? "Send question"
                      : tool === "mock-interview"
                        ? interviewId
                          ? "Submit answer"
                          : "Start interview"
                        : tool === "resume-review"
                          ? "Review resume"
                          : "Generate study plan"}
                </Button>
                {tool === "tutor" && conversationId && (
                  <Button
                    type="button"
                    variant="outline"
                    disabled={pending}
                    onClick={() => {
                      setConversationId(undefined);
                      setResults([]);
                      setError("");
                    }}
                  >
                    New conversation
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
