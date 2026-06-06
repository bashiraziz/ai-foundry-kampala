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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, track, week, studentId }),
      });
      if (!res.ok) throw new Error();
      if (!res.body) throw new Error();

      setLoading(false);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      setMessages([...next, { role: "assistant", content: "▋" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullContent += decoder.decode(value, { stream: true });
        setMessages([...next, { role: "assistant", content: fullContent + "▋" }]);
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12 space-y-3 animate-fade-in">
            <img src="/brand/hero-mark.svg" alt="Mshauri" className="w-9 h-9 mx-auto opacity-40" />
            <p className="text-sm text-stone-grey">
              Ask Mshauri anything about{" "}
              <span className="font-medium text-gray-700">Week {week}: {weekLabel}</span>
            </p>
            <p className="text-xs text-gray-400">Enter to send · Shift+Enter for new line</p>
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex items-end gap-2 animate-fade-up ${m.role === "user" ? "flex-row-reverse" : ""}`}
          >
            {m.role === "assistant" && (
              <img src="/brand/hero-mark.svg" alt="Mshauri" className="w-6 h-6 flex-shrink-0 mb-0.5" />
            )}
            <div
              className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words ${
                m.role === "user"
                  ? "bg-foundry-green text-white rounded-br-sm"
                  : "bg-white border border-gray-100 text-gray-800 rounded-bl-sm shadow-sm"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-end gap-2 animate-fade-up">
            <img src="/brand/hero-mark.svg" alt="Mshauri" className="w-6 h-6 flex-shrink-0 mb-0.5" />
            <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex items-center gap-1.5 text-stone-grey">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-end gap-2 animate-fade-up">
            <img src="/brand/hero-mark.svg" alt="Mshauri" className="w-6 h-6 flex-shrink-0 mb-0.5 opacity-30" />
            <div className="max-w-[78%] rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm bg-red-50 border border-red-100 text-red-600">
              {error}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 bg-white p-3">
        <div className="flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 focus-within:border-foundry-green focus-within:ring-2 focus-within:ring-foundry-green/10 transition-all">
          <textarea
            ref={textareaRef}
            rows={1}
            className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none leading-relaxed"
            placeholder="Ask a question…"
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            disabled={loading}
            style={{ maxHeight: "120px" }}
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            className="w-7 h-7 bg-foundry-green text-white rounded-lg flex items-center justify-center flex-shrink-0 hover:bg-foundry-green-light disabled:opacity-30 transition-all mb-0.5"
            aria-label="Send"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 11L11 1M11 1H4M11 1V8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
