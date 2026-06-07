"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ChatWindow from "@/components/ChatWindow";
import { WEEK_TOPICS } from "@/lib/quiz";
import Link from "next/link";

const PAGE_CSS = `
  body { background: var(--ink); }
  .chat-shell { height: 100vh; display: grid; grid-template-columns: 260px 1fr; background: var(--ink); color: var(--cream); }

  .chat-side { background: var(--ink-2); border-right: 1px solid var(--line-dk); display: flex; flex-direction: column; padding: 20px 16px; }
  .chat-side .brand { display: flex; align-items: center; gap: 10px; padding: 6px 8px 18px; border-bottom: 1px solid var(--line-dk); }
  .chat-side .brand .mark { width: 30px; height: 30px; background: var(--marigold); border-radius: 8px; display: grid; place-items: center; transform: rotate(-6deg); flex-shrink: 0; }
  .chat-side .brand .mark span { font-family: "Bricolage Grotesque"; font-weight: 900; font-size: 15px; color: var(--ink); transform: rotate(6deg); display: block; line-height: 1; }
  .chat-side .brand .nm { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 13px; line-height: 1.1; }
  .chat-side .brand .nm em { font-style: normal; color: var(--marigold); }
  .chat-side .me { display: flex; align-items: center; gap: 10px; padding: 14px 8px; border-bottom: 1px solid var(--line-dk); margin-bottom: 16px; }
  .chat-side .me .pic { width: 36px; height: 36px; border-radius: 10px; display: grid; place-items: center; font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 14px; flex-shrink: 0; }
  .chat-side .me .nm { font-size: 14px; font-weight: 600; }
  .chat-side .me .ctx { font-family: "Space Mono"; font-size: 10.5px; color: var(--muted-dk); margin-top: 2px; }
  .sect { font-family: "Space Mono"; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted-dk); padding: 5px 8px; margin-top: 8px; }
  .thread { display: block; padding: 9px 10px; border-radius: 9px; font-size: 13.5px; color: var(--muted-dk); cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; transition: background .15s, color .15s; }
  .thread:hover, .thread.active { background: rgba(242,178,62,0.1); color: var(--cream); }
  .chat-side .foot-link { margin-top: auto; padding-top: 16px; border-top: 1px solid var(--line-dk); }
  .chat-side .foot-link a { font-family: "Space Mono"; font-size: 11.5px; color: var(--muted-dk); display: flex; align-items: center; gap: 8px; padding: 7px 8px; text-decoration: none; }
  .chat-side .foot-link a:hover { color: var(--marigold); }

  .chat-main { display: flex; flex-direction: column; overflow: hidden; }
  .chat-header { flex-shrink: 0; display: flex; align-items: center; justify-content: space-between; padding: 16px 32px; border-bottom: 1px solid var(--line-dk); background: rgba(26,20,16,0.8); backdrop-filter: blur(8px); }
  .chat-header .h-left .name { font-family: "Bricolage Grotesque"; font-weight: 700; font-size: 17px; }
  .chat-header .h-left .meta { font-family: "Space Mono"; font-size: 11px; color: var(--muted-dk); margin-top: 2px; display: flex; align-items: center; gap: 6px; }
  .chat-header .h-left .meta .dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
  .chat-header .h-right { display: flex; align-items: center; gap: 12px; }
  .chat-header .h-right a { font-family: "Space Mono"; font-size: 12px; color: var(--muted-dk); text-decoration: none; }
  .chat-header .h-right a:hover { color: var(--marigold); }
  .chat-header .h-right .quiz-btn { background: rgba(242,178,62,0.12); border: 1px solid rgba(242,178,62,0.22); color: var(--marigold); padding: 7px 14px; border-radius: 8px; font-family: "Space Mono"; font-size: 11.5px; font-weight: 700; }

  .chat-body { flex: 1; min-height: 0; overflow: hidden; }

  @media (max-width: 860px) {
    .chat-shell { grid-template-columns: 1fr; }
    .chat-side { display: none; }
    .chat-header { padding: 14px 20px; }
  }
`;

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
    <>
      <style>{PAGE_CSS}</style>
      <div className="chat-shell">
        <aside className="chat-side">
          <div className="brand">
            <span className="mark"><span>F</span></span>
            <span className="nm">THE AI FOUNDRY <em>KAMPALA</em></span>
          </div>
          <div className="me">
            <div className="pic" style={{ background: isDev ? "linear-gradient(150deg, var(--marigold), var(--clay))" : "linear-gradient(150deg, var(--forest-2), var(--forest))", color: isDev ? "#1a0d06" : "var(--cream)" }}>
              {name.slice(0,2).toUpperCase()}
            </div>
            <div>
              <div className="nm">{name}</div>
              <div className="ctx">{isDev ? "Developer" : "Professional"} · Week {week}</div>
            </div>
          </div>
          <div className="sect">Today</div>
          <span className="thread active">{weekLabel || "Current session"}</span>
          <div className="sect">Quick links</div>
          <Link href="/quiz" className="thread">Weekly quiz →</Link>
          <Link href="/start" className="thread">Change week</Link>
          <div className="foot-link">
            <Link href="/">← Back to the Foundry</Link>
          </div>
        </aside>

        <div className="chat-main">
          <div className="chat-header">
            <div className="h-left">
              <div className="name">Mshauri</div>
              <div className="meta">
                <span className="dot" style={{ background: isDev ? "var(--marigold)" : "var(--forest-2)" }} />
                {isDev ? "Developer" : "Professional"} · Week {week}: {weekLabel}
              </div>
            </div>
            <div className="h-right">
              <Link href="/quiz" className="quiz-btn">Weekly quiz →</Link>
              <Link href="/start">Change week</Link>
            </div>
          </div>
          <div className="chat-body">
            <ChatWindow track={track} week={week} weekLabel={weekLabel} />
          </div>
        </div>
      </div>
    </>
  );
}
