"use client";
import { useState, useRef, useEffect } from "react";

type Message = { role: "user" | "assistant"; content: string };

interface ChatWindowProps {
  track: string;
  week: number;
  weekLabel: string;
  studentId?: string;
}

export default function ChatWindow({ track, week, weekLabel, studentId }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, track, week, studentId }),
      });
      if (!res.ok) throw new Error("Server error");
      if (!res.body) throw new Error("No response body");

      setLoading(false);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      setMessages([...next, { role: "assistant", content: "▋" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullContent += decoder.decode(value, { stream: true });
        setMessages([...next, { role: "assistant", content: fullContent + " ▋" }]);
      }
      setMessages([...next, { role: "assistant", content: fullContent }]);
    } catch {
      setError("Mshauri is unavailable right now — check your connection and try again.");
      setInput(text);
      setMessages(messages);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <p className="text-gray-400 text-center mt-8">
            Ask the AI Foundry tutor anything about Week {week}: {weekLabel}
          </p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "assistant" && (
              <img src="/brand/hero-mark.svg" alt="Mshauri" className="w-7 h-7 mr-2 flex-shrink-0" />
            )}
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap ${
                m.role === "user"
                  ? "bg-foundry-green text-white"
                  : "bg-white border border-gray-200 text-gray-800"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <img src="/brand/hero-mark.svg" alt="Mshauri" className="w-7 h-7 mr-2 flex-shrink-0" />
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-2 text-gray-400 text-sm animate-pulse">
              Thinking…
            </div>
          </div>
        )}
        {error && (
          <div className="flex justify-start">
            <img src="/brand/hero-mark.svg" alt="Mshauri" className="w-7 h-7 mr-2 flex-shrink-0 opacity-40" />
            <div className="max-w-[75%] rounded-2xl px-4 py-2 text-sm bg-red-50 border border-red-200 text-red-600">
              {error}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="border-t border-gray-200 p-4 flex gap-2">
        <input
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-foundry-green"
          placeholder="Ask a question…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          disabled={loading}
        />
        <button
          onClick={send}
          disabled={loading}
          className="bg-foundry-green text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-foundry-green-light disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
