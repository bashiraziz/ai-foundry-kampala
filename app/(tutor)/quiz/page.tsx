"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QuizCard from "@/components/QuizCard";
import { WEEK_TOPICS } from "@/lib/quiz";
import Link from "next/link";

export default function QuizPage() {
  const router = useRouter();
  const [track, setTrack] = useState("DEVELOPER");
  const [week, setWeek] = useState(1);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem("mshauri_track");
    const w = localStorage.getItem("mshauri_week");
    if (!t || !w) { router.push("/start"); return; }
    setTrack(t);
    setWeek(Number(w));
    setReady(true);
  }, [router]);

  if (!ready) return null;

  const topics = WEEK_TOPICS[track] as Record<number, string>;
  const weekLabel = topics[week] ?? "";
  const isDev = track === "DEVELOPER";

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col max-w-xl mx-auto">
      {/* Header */}
      <header className="flex-shrink-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/brand/hero-mark.svg" alt="Mshauri" className="w-8 h-8" />
          <div>
            <p className="font-semibold text-forge-night text-sm">Weekly Quiz</p>
            <p className="text-xs text-stone-grey">
              <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle ${isDev ? "bg-foundry-green" : "bg-amber-400"}`} />
              Week {week}: {weekLabel}
            </p>
          </div>
        </div>
        <Link href="/chat" className="text-xs text-gray-400 hover:text-gray-600 transition">
          ← Back to chat
        </Link>
      </header>

      {/* Quiz card */}
      <div className="flex-1 p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <QuizCard track={track} week={week} />
        </div>
      </div>
    </div>
  );
}
