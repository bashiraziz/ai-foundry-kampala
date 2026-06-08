"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QuizCard from "@/components/QuizCard";
import { WEEK_TOPICS } from "@/lib/quiz";
import Link from "next/link";

const PAGE_CSS = `
  .quiz-shell { min-height: 100vh; background: var(--ink); display: flex; flex-direction: column; max-width: 580px; margin: 0 auto; }

  .quiz-header { flex-shrink: 0; background: var(--ink-2); border-bottom: 1px solid var(--line-dk); padding: 14px 24px; display: flex; align-items: center; justify-content: space-between; }
  .quiz-header .left { display: flex; align-items: center; gap: 12px; }
  .quiz-header .mark { width: 28px; height: 28px; border-radius: 7px; background: var(--marigold); display: grid; place-items: center; transform: rotate(-6deg); flex-shrink: 0; }
  .quiz-header .mark span { font-family: "Bricolage Grotesque"; font-weight: 900; font-size: 14px; color: var(--ink); transform: rotate(6deg); display: block; line-height: 1; }
  .quiz-header .hinfo .nm { font-family: "Bricolage Grotesque"; font-weight: 700; font-size: 15px; color: var(--cream); }
  .quiz-header .hinfo .meta { display: flex; align-items: center; gap: 6px; font-family: "Space Mono"; font-size: 10.5px; color: var(--muted-dk); margin-top: 2px; }
  .quiz-header .hinfo .meta .dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .quiz-header .back { font-family: "Space Mono"; font-size: 11px; color: var(--muted-dk); text-decoration: none; transition: color .15s; }
  .quiz-header .back:hover { color: var(--marigold); }

  .quiz-body { flex: 1; padding: 20px 16px; }
  .quiz-card-wrap { background: #fff; border-radius: 20px; overflow: hidden; border: 1px solid var(--line-lt); }
`;

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
    <>
      <style>{PAGE_CSS}</style>
      <div className="quiz-shell">
        <header className="quiz-header">
          <div className="left">
            <span className="mark"><span>F</span></span>
            <div className="hinfo">
              <div className="nm">Weekly Quiz</div>
              <div className="meta">
                <span className="dot" style={{ background: isDev ? "var(--clay)" : "var(--forest)" }} />
                Week {week}: {weekLabel}
              </div>
            </div>
          </div>
          <Link href="/chat" className="back">← Back to chat</Link>
        </header>

        <div className="quiz-body">
          <div className="quiz-card-wrap">
            <QuizCard track={track} week={week} />
          </div>
        </div>
      </div>
    </>
  );
}
