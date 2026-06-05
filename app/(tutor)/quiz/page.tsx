"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QuizCard from "@/components/QuizCard";
import { WEEK_TOPICS } from "@/lib/quiz";

export default function QuizPage() {
  const router = useRouter();
  const [track, setTrack] = useState("DEVELOPER");
  const [week, setWeek] = useState(1);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem("kc_track");
    const w = localStorage.getItem("kc_week");
    if (!t || !w) { router.push("/"); return; }
    setTrack(t);
    setWeek(Number(w));
    setReady(true);
  }, [router]);

  if (!ready) return null;

  const topics = WEEK_TOPICS[track] as Record<number, string>;
  const weekLabel = topics[week] ?? "";

  return (
    <div className="min-h-screen max-w-2xl mx-auto">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/favicon.svg" alt="Mshauri" className="w-7 h-7" />
          <div>
            <p className="font-semibold text-gray-800 text-sm">Weekly Quiz</p>
            <p className="text-xs text-gray-400">Week {week}: {weekLabel}</p>
          </div>
        </div>
        <a href="/chat" className="text-xs text-gray-400 hover:text-gray-600">← Back to chat</a>
      </header>
      <div className="bg-white mt-4 mx-4 rounded-2xl shadow-sm">
        <QuizCard track={track} week={week} />
      </div>
    </div>
  );
}
