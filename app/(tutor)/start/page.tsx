"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { WEEK_TOPICS } from "@/lib/quiz";
import Link from "next/link";

export default function StartPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [track, setTrack] = useState<"DEVELOPER" | "PROFESSIONAL">("DEVELOPER");
  const [week, setWeek] = useState(1);

  const start = () => {
    if (!name.trim()) return;
    localStorage.setItem("mshauri_name", name.trim());
    localStorage.setItem("mshauri_track", track);
    localStorage.setItem("mshauri_week", String(week));
    router.push("/chat");
  };

  const topics = WEEK_TOPICS[track];

  return (
    <div className="min-h-screen bg-forge-deep flex flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="mb-8 opacity-60 hover:opacity-90 transition">
        <img src="/brand/lockup-horizontal.svg" alt="The AI Foundry Kampala" className="h-7" />
      </Link>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 space-y-6 animate-scale-in">
        <div>
          <h1 className="text-xl font-bold text-forge-night">Talk to Mshauri</h1>
          <p className="text-sm text-stone-grey mt-1">Your AI tutor — trained on the Foundry curriculum, available any time.</p>
        </div>

        <div className="space-y-5">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block">Your name</label>
            <input
              type="text"
              placeholder="e.g. Tendo Nakabiri"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && start()}
              autoFocus
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-foundry-green/20 focus:border-foundry-green transition"
            />
          </div>

          {/* Track */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block">Track</label>
            <div className="grid grid-cols-2 gap-2">
              {(["DEVELOPER", "PROFESSIONAL"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTrack(t)}
                  className={`py-3 px-4 rounded-xl text-sm font-medium border transition-all text-left ${
                    track === t
                      ? t === "DEVELOPER"
                        ? "bg-foundry-green text-white border-foundry-green"
                        : "bg-amber-400 text-forge-night border-amber-400"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <span className="block font-semibold">{t === "DEVELOPER" ? "Developer" : "Professional"}</span>
                  <span className={`block text-xs mt-0.5 ${track === t ? "opacity-80" : "text-gray-400"}`}>
                    {t === "DEVELOPER" ? "Code-first" : "No-code friendly"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Week */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block">Current week</label>
            <select
              value={week}
              onChange={(e) => setWeek(Number(e.target.value))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-foundry-green/20 focus:border-foundry-green transition appearance-none bg-white"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((w) => (
                <option key={w} value={w}>
                  Week {w} — {topics[w]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={start}
          disabled={!name.trim()}
          className="w-full bg-foundry-green text-white py-3 rounded-xl font-semibold hover:bg-foundry-green-light disabled:opacity-40 transition text-sm"
        >
          Start session →
        </button>

        <p className="text-center text-xs text-gray-400">
          Applying?{" "}
          <Link href="/assess" className="text-foundry-green hover:underline">Take the intake assessment →</Link>
        </p>
      </div>
    </div>
  );
}
