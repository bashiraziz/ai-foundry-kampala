"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

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
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const startAssessment = async () => {
    if (!name.trim()) return;
    setStarted(true);
    setLoading(true);
    const greeting: Message = { role: "user", content: `Hi, my name is ${name.trim()}` };
    const res = await fetch("/api/assess", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [greeting], name: name.trim() }),
    });
    const data = await res.json();
    setApplicantId(data.applicantId);
    setMessages([greeting, { role: "assistant", content: data.reply }]);
    setQuestionCount(1);
    setLoading(false);
  };

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/assess", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: next, applicantId }),
    });
    const data = await res.json();
    const reply = data.reply.replace("[ASSESSMENT_COMPLETE]", "").trim();
    setMessages([...next, { role: "assistant", content: reply }]);
    setQuestionCount((q) => q + 1);
    setLoading(false);

    if (data.complete) {
      await fetch("/api/assess/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicantId: data.applicantId }),
      });
      setTimeout(() => router.push(`/assess/complete?id=${data.applicantId}`), 1500);
    }
  };

  if (!started) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
        <div className="bg-[#1e293b] rounded-2xl p-8 w-full max-w-md space-y-6 text-white">
          <div className="text-center">
            <span className="text-5xl">🦁</span>
            <h1 className="text-2xl font-bold mt-2">The AI Foundry Kampala — Intake Assessment</h1>
            <p className="text-slate-400 text-sm mt-1">Ask Mshauri — your AI advisor</p>
          </div>
          <p className="text-slate-300 text-sm">
            This is a short conversation to help us find the right path for you — Developer track, Professional track, or our Prep program. It takes about 10 minutes.
          </p>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && startAssessment()}
            className="w-full bg-[#0f172a] border border-slate-600 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={startAssessment}
            disabled={!name.trim()}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-40"
          >
            Start →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col max-w-2xl mx-auto">
      <header className="bg-[#1e293b] border-b border-slate-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🦁</span>
          <div>
            <p className="font-semibold text-white text-sm">Track Assessment</p>
            <p className="text-xs text-slate-400">Getting to know you — question {Math.min(questionCount, 8)} of 8</p>
          </div>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "assistant" && <span className="mr-2 text-xl">🦁</span>}
            <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap ${
              m.role === "user" ? "bg-blue-600 text-white" : "bg-[#1e293b] border border-slate-700 text-slate-200"
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <span className="mr-2 text-xl">🦁</span>
            <div className="bg-[#1e293b] border border-slate-700 rounded-2xl px-4 py-2 text-slate-400 text-sm animate-pulse">Thinking…</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="border-t border-slate-700 p-4 flex gap-2">
        <input
          className="flex-1 bg-[#1e293b] border border-slate-600 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Your answer…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          disabled={loading}
        />
        <button
          onClick={send}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
