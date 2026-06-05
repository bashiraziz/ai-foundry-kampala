"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { WEEK_TOPICS } from "@/lib/quiz";

export default function LandingPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [track, setTrack] = useState<"DEVELOPER" | "PROFESSIONAL">("DEVELOPER");
  const [week, setWeek] = useState(1);

  const start = () => {
    if (!name.trim()) return;
    localStorage.setItem("kc_name", name.trim());
    localStorage.setItem("kc_track", track);
    localStorage.setItem("kc_week", String(week));
    router.push("/chat");
  };

  const topics = WEEK_TOPICS[track];

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-md space-y-6">
        <div className="text-center">
          <span className="text-5xl">🦁</span>
          <h1 className="text-2xl font-bold text-[#1a7f4b] mt-2">AI Foundry Kampala</h1>
          <p className="text-sm text-gray-500">Your AI advisor at The AI Foundry Kampala</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Your name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a7f4b]"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Track</label>
            <div className="grid grid-cols-2 gap-2">
              {(["DEVELOPER", "PROFESSIONAL"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTrack(t)}
                  className={`py-2 rounded-xl text-sm font-medium border transition ${
                    track === t
                      ? "bg-[#1a7f4b] text-white border-[#1a7f4b]"
                      : "border-gray-300 text-gray-600 hover:border-[#1a7f4b]"
                  }`}
                >
                  {t === "DEVELOPER" ? "Developer" : "Professional"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Current week</label>
            <select
              value={week}
              onChange={(e) => setWeek(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a7f4b]"
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
          className="w-full bg-[#1a7f4b] text-white py-3 rounded-xl font-medium hover:bg-[#15643c] disabled:opacity-40"
        >
          Start session →
        </button>
      </div>
    </div>
  );
}
