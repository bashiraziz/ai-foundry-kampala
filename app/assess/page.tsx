"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MAX_ASSESSMENT_MESSAGES } from "@/lib/constants";

type Message = { role: "user" | "assistant"; content: string };

export default function AssessPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<"start" | "chat" | "completing">("start");
  const [name, setName] = useState("");
  const [applicantId, setApplicantId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const triggerCompletion = async (id: string) => {
    if (completing) return;
    setCompleting(true);
    setPhase("completing");
    router.push(`/assess/complete?id=${id}`);
  };

  const startAssessment = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [], name: name.trim() }),
      });
      const data = await res.json();
      setApplicantId(data.applicantId);
      setMessages([{ role: "assistant", content: data.reply }]);
      setMessageCount(1);
      setPhase("chat");
    } catch {
      setError("Could not connect — check your internet and try again.");
    } finally {
      setLoading(false);
    }
  };

  const send = async () => {
    const text = input.trim();
    if (!text || loading || completing) return;
    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, applicantId, name }),
      });
      const data = await res.json();
      const withReply: Message[] = [...next, { role: "assistant", content: data.reply }];
      setMessages(withReply);
      const nextCount = messageCount + 1;
      setMessageCount(nextCount);

      if (data.complete || nextCount >= MAX_ASSESSMENT_MESSAGES) {
        await triggerCompletion(data.applicantId ?? applicantId!);
      }
    } catch {
      setError("Connection lost — please try again.");
      setMessages(messages);
      setInput(text);
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

  /* ── Entry screen ── */
  if (phase === "start") {
    return (
      <div className="min-h-screen bg-forge-deep flex flex-col items-center justify-center px-4">
        <Link href="/" className="mb-8 opacity-70 hover:opacity-100 transition">
          <img src="/brand/lockup-horizontal.svg" alt="The AI Foundry Kampala" className="h-7" />
        </Link>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 space-y-6 animate-scale-in">
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-forge-night">Intake assessment</h1>
            <p className="text-sm text-stone-grey leading-relaxed">
              A 10-minute conversation with Mshauri to find the right path for you. No exam — just a chat.
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block">Your name</label>
            <input
              type="text"
              placeholder="e.g. Tendo Nakabiri"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && startAssessment()}
              autoFocus
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-foundry-green/20 focus:border-foundry-green transition"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            onClick={startAssessment}
            disabled={!name.trim() || loading}
            className="w-full bg-amber-400 text-forge-night font-semibold py-3 rounded-xl hover:bg-amber-300 disabled:opacity-40 transition text-sm"
          >
            {loading ? "Starting…" : "Begin assessment →"}
          </button>
          <p className="text-center text-xs text-gray-400">Takes about 10 minutes</p>
        </div>
      </div>
    );
  }

  /* ── Completing screen ── */
  if (phase === "completing") {
    return (
      <div className="min-h-screen bg-forge-deep flex items-center justify-center">
        <div className="text-center space-y-4 animate-fade-in">
          <img src="/brand/hero-mark.svg" alt="Mshauri" className="w-14 h-14 mx-auto animate-pulse" />
          <div>
            <p className="text-white font-semibold text-lg">Scoring your assessment…</p>
            <p className="text-gray-400 text-sm mt-1">This takes a few seconds</p>
          </div>
        </div>
      </div>
    );
  }

  /* ── Chat screen ── */
  const progressPct = Math.min((messageCount / MAX_ASSESSMENT_MESSAGES) * 100, 100);
  const showEscapeHatch = messageCount >= 5 && !completing;

  return (
    <div className="min-h-screen bg-forge-deep flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-white/[0.06] px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/brand/hero-mark.svg" alt="Mshauri" className="w-7 h-7" />
            <div>
              <p className="text-white text-sm font-semibold">Mshauri</p>
              <p className="text-gray-500 text-xs">Intake assessment</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <Link href="/" className="text-xs text-gray-500 hover:text-gray-300 transition">Exit</Link>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-6">
        <div className="max-w-2xl mx-auto px-4 space-y-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex items-end gap-2.5 animate-fade-up ${m.role === "user" ? "flex-row-reverse" : ""}`}
            >
              {m.role === "assistant" && (
                <img src="/brand/hero-mark.svg" alt="Mshauri" className="w-6 h-6 flex-shrink-0 mb-0.5" />
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words ${
                  m.role === "user"
                    ? "bg-foundry-green text-white rounded-br-sm"
                    : "bg-white/[0.07] border border-white/[0.08] text-gray-100 rounded-bl-sm"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-end gap-2.5 animate-fade-up">
              <img src="/brand/hero-mark.svg" alt="Mshauri" className="w-6 h-6 flex-shrink-0 mb-0.5" />
              <div className="bg-white/[0.07] border border-white/[0.08] rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5 text-gray-400">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-end gap-2.5 animate-fade-up">
              <img src="/brand/hero-mark.svg" alt="Mshauri" className="w-6 h-6 flex-shrink-0 mb-0.5 opacity-30" />
              <div className="max-w-[78%] rounded-2xl rounded-bl-sm px-4 py-3 text-sm bg-red-900/30 border border-red-500/20 text-red-300">
                {error}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="flex-shrink-0 border-t border-white/[0.06] p-4">
        <div className="max-w-2xl mx-auto space-y-2">
          {showEscapeHatch && (
            <div className="text-center animate-fade-in">
              <button
                onClick={() => applicantId && triggerCompletion(applicantId)}
                disabled={completing}
                className="text-xs text-amber-400/70 hover:text-amber-400 transition"
              >
                I've answered everything — score my assessment →
              </button>
            </div>
          )}
          <div className="flex items-end gap-2 bg-white/[0.06] border border-white/[0.08] rounded-2xl px-4 py-2.5 focus-within:border-white/20 transition">
            <textarea
              ref={textareaRef}
              rows={1}
              className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 resize-none focus:outline-none leading-relaxed"
              placeholder="Type your reply…"
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              disabled={loading || completing}
              style={{ maxHeight: "120px" }}
            />
            <button
              onClick={send}
              disabled={loading || completing || !input.trim()}
              className="w-7 h-7 bg-amber-400 text-forge-night rounded-lg flex items-center justify-center flex-shrink-0 hover:bg-amber-300 disabled:opacity-30 transition mb-0.5"
              aria-label="Send"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 11L11 1M11 1H4M11 1V8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
