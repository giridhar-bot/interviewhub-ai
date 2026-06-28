"use client";

import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: Date | string;
}

interface AIChatWindowProps {
  messages: Message[];
  onSend: (message: string) => void;
  isLoading?: boolean;
  className?: string;
}

export function AIChatWindow({ messages, onSend, isLoading, className }: AIChatWindowProps) {
  return (
    <div className={cn("flex h-full flex-col", className)}>
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((msg) => (
          <AIMessageBubble key={msg.id} role={msg.role} content={msg.content} />
        ))}
        {isLoading && (
          <div className="flex gap-1 px-4 py-2">
            <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0ms]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]" />
          </div>
        )}
      </div>
      <PromptInput onSend={onSend} disabled={isLoading} />
    </div>
  );
}

function AIMessageBubble({ role, content }: { role: "user" | "assistant"; content: string }) {
  return (
    <div className={cn("flex", role === "user" ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-2 text-sm",
          role === "user"
            ? "bg-violet-600 text-white"
            : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
        )}
      >
        {content}
      </div>
    </div>
  );
}

function PromptInput({ onSend, disabled }: { onSend: (msg: string) => void; disabled?: boolean }) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem("prompt") as HTMLInputElement;
    const val = input.value.trim();
    if (!val) return;
    onSend(val);
    input.value = "";
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 dark:border-gray-800">
      <div className="flex gap-2">
        <input
          name="prompt"
          type="text"
          disabled={disabled}
          placeholder="Ask anything about interview prep..."
          className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-violet-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        />
        <button
          type="submit"
          disabled={disabled}
          className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </form>
  );
}
