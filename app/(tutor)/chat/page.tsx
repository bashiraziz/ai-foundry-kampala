"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ChatWindow from "@/components/ChatWindow";
import { WEEK_TOPICS } from "@/lib/quiz";
import Link from "next/link";

export default function ChatPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [track, setTrack] = useState("DEVELOPER");
  const [week, setWeek] = useState(1);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const n = localStorage.getItem("mshauri_name");
    const t = localStorage.getItem("mshauri_track");
    const w = localStorage.getItem("mshauri_week");
    if (!n || !t || !w) { router.push("/start"); return; }
    setName(n);
    setTrack(t);
    setWeek(Number(w));
    setReady(true);
  }, [router]);

  if (!ready) return null;

  const topics = WEEK_TOPICS[track] as Record<number, string>;
  const weekLabel = topics[week] ?? "";
  const isDev = track === "DEVELOPER";

  return (
    <div className="h-screen flex flex-col max-w-2xl mx-auto">
      {/* Header */}
      <header className="flex-shrink-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/brand/hero-mark.svg" alt="Mshauri" className="w-8 h-8" />
          <div>
            <p className="font-semibold text-forge-night text-sm">Mshauri</p>
            <p className="text-xs text-stone-grey">
              <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle ${isDev ? "bg-foundry-green" : "bg-amber-400"}`} />
              {isDev ? "Developer" : "Professional"} · Week {week}: {weekLabel}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/quiz"
            className="text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition"
          >
            Weekly quiz →
          </Link>
          <Link href="/start" className="text-xs text-gray-400 hover:text-gray-600 transition">
            Change week
          </Link>
        </div>
      </header>

      {/* Chat */}
      <div className="flex-1 min-h-0 bg-gray-50/50">
        <ChatWindow track={track} week={week} weekLabel={weekLabel} />
      </div>

      <p className="sr-only">{name}</p>
    </div>
  );
}
