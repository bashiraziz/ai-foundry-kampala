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
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, track, week, studentId }),
      });
      const { reply } = await res.json();
      setMessages([...next, { role: "assistant", content: reply }]);
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
            {m.role === "assistant" && <span className="mr-2 text-xl">🦁</span>}
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap ${
                m.role === "user"
                  ? "bg-[#1a7f4b] text-white"
                  : "bg-white border border-gray-200 text-gray-800"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <span className="mr-2 text-xl">🦁</span>
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-2 text-gray-400 text-sm animate-pulse">
              Thinking…
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="border-t border-gray-200 p-4 flex gap-2">
        <input
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a7f4b]"
          placeholder="Ask a question…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          disabled={loading}
        />
        <button
          onClick={send}
          disabled={loading}
          className="bg-[#1a7f4b] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#15643c] disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
