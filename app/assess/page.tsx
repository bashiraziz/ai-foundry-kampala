"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Message = { role: "user" | "assistant"; content: string };

export default function AssessPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [applicantId, setApplicantId] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const startAssessment = async () => {
    if (!name.trim()) return;
    setStarted(true);
    setLoading(true);
    setError(null);
    const greeting: Message = { role: "user", content: `Hi, my name is ${name.trim()}` };
    try {
      const res = await fetch("/api/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [greeting], name: name.trim() }),
      });
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      setApplicantId(data.applicantId);
      setMessages([greeting, { role: "assistant", content: data.reply }]);
      setQuestionCount(1);
    } catch {
      setError("Could not connect to Mshauri — check your connection and try again.");
      setStarted(false);
    } finally {
      setLoading(false);
    }
  };

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, applicantId }),
      });
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      const reply = data.reply.replace("[ASSESSMENT_COMPLETE]", "").trim();
      setMessages([...next, { role: "assistant", content: reply }]);
      setQuestionCount((q) => q + 1);

      if (data.complete) {
        await fetch("/api/assess/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ applicantId: data.applicantId }),
        });
        setTimeout(() => router.push(`/assess/complete?id=${data.applicantId}`), 1500);
      }
    } catch {
      setError("Mshauri is unavailable right now — check your connection and try again.");
      setMessages(messages);
      setInput(text);
    } finally {
      setLoading(false);
    }
  };

  if (!started) {
    return (
      <div className="min-h-screen bg-forge-night flex items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link href="/">
              <img src="/brand/lockup-horizontal.svg" alt="The AI Foundry Kampala" className="h-8 mx-auto opacity-90" />
            </Link>
          </div>
          <div className="bg-white rounded-2xl p-8 space-y-6 shadow-lg">
            <div>
              <h1 className="text-xl font-bold text-forge-night">Intake Assessment</h1>
              <p className="text-stone-grey text-sm mt-1">
                A 10-minute conversation with Mshauri to find your path — Developer, Professional, or Runway.
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Your name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && startAssessment()}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foundry-green"
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button
              onClick={startAssessment}
              disabled={!name.trim()}
              className="w-full bg-amber-400 text-forge-night font-semibold py-3 rounded-xl hover:bg-amber-300 disabled:opacity-40 transition"
            >
              Start assessment →
            </button>
            <p className="text-center text-xs text-stone-grey">
              Not applying yet?{" "}
              <Link href="/start" className="text-foundry-green hover:underline">
                Talk to Mshauri
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-forge-night flex flex-col max-w-2xl mx-auto">
      <header className="bg-forge-night border-b border-white/10 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <img src="/brand/hero-mark.svg" alt="Mshauri" className="w-7 h-7" />
          <div>
            <p className="font-semibold text-white text-sm">Track Assessment</p>
            <p className="text-xs text-gray-400">Getting to know you — question {Math.min(questionCount, 8)} of 8</p>
          </div>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "assistant" && (
              <img src="/brand/hero-mark.svg" alt="Mshauri" className="w-7 h-7 mr-2 flex-shrink-0" />
            )}
            <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap leading-relaxed ${
              m.role === "user"
                ? "bg-foundry-green text-white"
                : "bg-white/10 border border-white/10 text-gray-100"
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <img src="/brand/hero-mark.svg" alt="Mshauri" className="w-7 h-7 mr-2 flex-shrink-0" />
            <div className="bg-white/10 border border-white/10 rounded-2xl px-4 py-2.5 text-gray-400 text-sm animate-pulse">
              Thinking…
            </div>
          </div>
        )}
        {error && (
          <div className="flex justify-start">
            <img src="/brand/hero-mark.svg" alt="Mshauri" className="w-7 h-7 mr-2 flex-shrink-0 opacity-40" />
            <div className="max-w-[75%] rounded-2xl px-4 py-2.5 text-sm bg-red-900/20 border border-red-500/30 text-red-300">
              {error}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="border-t border-white/10 p-4 flex gap-2">
        <input
          className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-foundry-green"
          placeholder="Your answer…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          disabled={loading}
          autoFocus
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          className="bg-foundry-green text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-foundry-green-light disabled:opacity-50 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
