"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { WEEK_TOPICS } from "@/lib/quiz";
import Link from "next/link";

const PAGE_CSS = `
  .start-shell { min-height: 100vh; background: var(--ink); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 20px; }

  .start-brand { display: flex; align-items: center; gap: 10px; margin-bottom: 40px; }
  .start-brand .mark { width: 34px; height: 34px; border-radius: 9px; background: var(--marigold); display: grid; place-items: center; transform: rotate(-6deg); flex-shrink: 0; }
  .start-brand .mark span { font-family: "Bricolage Grotesque"; font-weight: 900; font-size: 17px; color: var(--ink); transform: rotate(6deg); display: block; line-height: 1; }
  .start-brand .nm { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 14px; color: var(--cream); letter-spacing: -0.01em; }
  .start-brand .nm em { font-style: normal; color: var(--marigold); }

  .start-card { background: var(--ink-2); border: 1px solid var(--line-dk); border-radius: 20px; width: 100%; max-width: 440px; padding: 32px 30px; display: flex; flex-direction: column; gap: 24px; }

  .start-card h1 { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 22px; color: var(--cream); letter-spacing: -0.015em; }
  .start-card .lede { font-family: "Archivo"; font-size: 14px; color: var(--muted-dk); line-height: 1.55; margin-top: -14px; }

  .field { display: flex; flex-direction: column; gap: 8px; }
  .field-label { font-family: "Space Mono"; font-size: 10.5px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted-dk); }
  .text-input { background: var(--ink); border: 1px solid var(--line-dk); border-radius: 10px; padding: 12px 16px; font-family: "Archivo"; font-size: 14.5px; color: var(--cream); outline: none; transition: border-color .15s; width: 100%; box-sizing: border-box; }
  .text-input::placeholder { color: var(--muted-dk); }
  .text-input:focus { border-color: var(--muted-dk); }

  .track-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .track-btn { padding: 14px 16px; border-radius: 12px; border: 1px solid var(--line-dk); background: var(--ink); cursor: pointer; text-align: left; transition: all .15s; }
  .track-btn:hover { border-color: var(--muted-dk); }
  .track-btn.dev.on { background: color-mix(in srgb, var(--clay) 12%, transparent); border-color: var(--clay); }
  .track-btn.pro.on { background: color-mix(in srgb, var(--forest) 15%, transparent); border-color: var(--forest); }
  .track-btn .t-nm { font-family: "Bricolage Grotesque"; font-weight: 700; font-size: 15px; color: var(--cream); }
  .track-btn.dev.on .t-nm { color: var(--clay); }
  .track-btn.pro.on .t-nm { color: color-mix(in srgb, var(--forest) 60%, var(--cream)); }
  .track-btn .t-sub { font-family: "Space Mono"; font-size: 10px; color: var(--muted-dk); margin-top: 3px; }

  .select-input { background: var(--ink); border: 1px solid var(--line-dk); border-radius: 10px; padding: 12px 16px; font-family: "Archivo"; font-size: 14.5px; color: var(--cream); outline: none; transition: border-color .15s; width: 100%; box-sizing: border-box; appearance: none; cursor: pointer; }
  .select-input:focus { border-color: var(--muted-dk); }

  .start-btn { font-family: "Archivo"; font-weight: 700; font-size: 15px; padding: 15px 20px; border-radius: 12px; background: var(--marigold); color: #1a0d06; border: none; cursor: pointer; transition: all .15s; width: 100%; }
  .start-btn:hover:not(:disabled) { background: #f5c060; }
  .start-btn:disabled { opacity: 0.4; cursor: default; }

  .start-footer { margin-top: 20px; font-family: "Space Mono"; font-size: 12px; color: var(--muted-dk); text-align: center; }
  .start-footer a { color: var(--clay); text-decoration: none; }
  .start-footer a:hover { text-decoration: underline; }
`;

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
    <>
      <style>{PAGE_CSS}</style>
      <div className="start-shell">
        <div className="start-brand">
          <span className="mark"><span>F</span></span>
          <span className="nm">THE AI FOUNDRY <em>KAMPALA</em></span>
        </div>

        <div className="start-card">
          <div>
            <h1>Talk to Mshauri</h1>
            <p className="lede">Your AI tutor — trained on the Foundry curriculum, available any time.</p>
          </div>

          <div className="field">
            <label className="field-label">Your name</label>
            <input
              className="text-input"
              type="text"
              placeholder="e.g. Tendo Nakabiri"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && start()}
              autoFocus
            />
          </div>

          <div className="field">
            <span className="field-label">Track</span>
            <div className="track-grid">
              {(["DEVELOPER", "PROFESSIONAL"] as const).map((t) => (
                <button
                  key={t}
                  className={`track-btn ${t === "DEVELOPER" ? "dev" : "pro"}${track === t ? " on" : ""}`}
                  onClick={() => setTrack(t)}
                >
                  <div className="t-nm">{t === "DEVELOPER" ? "Developer" : "Professional"}</div>
                  <div className="t-sub">{t === "DEVELOPER" ? "Code-first" : "No-code friendly"}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label className="field-label" htmlFor="week-select">Current week</label>
            <select
              id="week-select"
              className="select-input"
              value={week}
              onChange={(e) => setWeek(Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((w) => (
                <option key={w} value={w}>Week {w} — {topics[w]}</option>
              ))}
            </select>
          </div>

          <button className="start-btn" onClick={start} disabled={!name.trim()}>
            Start session →
          </button>
        </div>

        <p className="start-footer">
          Applying?{" "}
          <Link href="/assess">Take the intake assessment →</Link>
        </p>
      </div>
    </>
  );
}
