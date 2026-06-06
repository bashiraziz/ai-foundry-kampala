"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ChatWindow from "@/components/ChatWindow";
import { WEEK_TOPICS } from "@/lib/quiz";

export default function ChatPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [track, setTrack] = useState("DEVELOPER");
  const [week, setWeek] = useState(1);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const n = localStorage.getItem("kc_name");
    const t = localStorage.getItem("kc_track");
    const w = localStorage.getItem("kc_week");
    if (!n || !t || !w) { router.push("/start"); return; }
    setName(n);
    setTrack(t);
    setWeek(Number(w));
    setReady(true);
  }, [router]);

  if (!ready) return null;

  const topics = WEEK_TOPICS[track] as Record<number, string>;
  const weekLabel = topics[week] ?? "";

  return (
    <div className="min-h-screen flex flex-col max-w-2xl mx-auto">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/favicon.svg" alt="Mshauri" className="w-7 h-7" />
          <div>
            <p className="font-semibold text-gray-800 text-sm">AI Foundry Kampala</p>
            <p className="text-xs text-gray-400">
              {track === "DEVELOPER" ? "Developer" : "Professional"} · Week {week}: {weekLabel}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <a
            href="/quiz"
            className="text-xs bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg font-medium hover:bg-amber-200"
          >
            Take quiz →
          </a>
          <a
            href="/start"
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            ← Back
          </a>
        </div>
      </header>
      <div className="flex-1 flex flex-col bg-bone-white">
        <ChatWindow track={track} week={week} weekLabel={weekLabel} />
      </div>
      <p className="sr-only">{name}</p>
    </div>
  );
}
