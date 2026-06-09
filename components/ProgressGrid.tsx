"use client";

interface Week { week: number; status: "PENDING" | "IN_PROGRESS" | "COMPLETE" }

interface Student {
  id: string;
  name: string;
  track: "DEVELOPER" | "PROFESSIONAL";
  progress: Week[];
  latestScore: number | null;
  sessionCount: number;
}

const CSS = `
  .pg-empty { padding: 56px 24px; text-align: center; font-family: "Space Mono"; font-size: 13px; color: var(--muted-lt); }

  .pg-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  @media (max-width: 1200px) { .pg-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 760px)  { .pg-grid { grid-template-columns: 1fr; } }

  .pg-card { background: #fff; border: 1px solid var(--line-lt); border-radius: 16px; padding: 18px 20px; text-decoration: none; color: var(--ink); transition: border-color .15s, box-shadow .15s; display: block; }
  .pg-card:hover { border-color: var(--ink); box-shadow: 0 4px 18px rgba(0,0,0,0.06); }

  .pg-card-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 14px; }
  .pg-card-top .nm { font-size: 14.5px; font-weight: 600; }
  .pg-card-top .meta { font-family: "Space Mono"; font-size: 11px; color: var(--muted-lt); margin-top: 3px; }
  .pg-track-pill { font-family: "Space Mono"; font-size: 10px; font-weight: 700; padding: 4px 9px; border-radius: 999px; flex-shrink: 0; }
  .pg-track-pill.dev { background: var(--clay); color: var(--ink); }
  .pg-track-pill.pro { background: var(--forest); color: var(--cream); }

  .pg-dots { display: flex; gap: 3px; margin-bottom: 12px; }
  .pg-dot { flex: 1; height: 5px; border-radius: 999px; }
  .pg-dot.complete { background: var(--forest); }
  .pg-dot.in-progress { background: var(--marigold); }
  .pg-dot.pending { background: var(--line-lt); }

  .pg-score-row { display: flex; align-items: center; justify-content: space-between; }
  .pg-score-row .lbl { font-family: "Space Mono"; font-size: 11px; color: var(--muted-lt); }
  .pg-score-row .val { font-family: "Space Mono"; font-size: 12px; font-weight: 700; }
  .pg-score-row .val.pass { color: var(--forest); }
  .pg-score-row .val.fail { color: var(--clay-deep); }
`;

export default function ProgressGrid({ students }: { students: Student[] }) {
  if (students.length === 0) {
    return (
      <>
        <style>{CSS}</style>
        <div className="pg-empty">No students yet.</div>
      </>
    );
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="pg-grid">
        {students.map((s) => {
          const dots = Array.from({ length: 12 }, (_, i) => {
            const w = s.progress.find((p) => p.week === i + 1);
            return w?.status ?? "PENDING";
          });
          const completed = dots.filter((d) => d === "COMPLETE").length;
          const isDev = s.track === "DEVELOPER";

          return (
            <a key={s.id} href={`/dashboard/students/${s.id}`} className="pg-card">
              <div className="pg-card-top">
                <div>
                  <div className="nm">{s.name}</div>
                  <div className="meta">{completed}/12 weeks · {s.sessionCount} session{s.sessionCount !== 1 ? "s" : ""}</div>
                </div>
                <span className={`pg-track-pill ${isDev ? "dev" : "pro"}`}>{isDev ? "Dev" : "Pro"}</span>
              </div>

              <div className="pg-dots">
                {dots.map((status, i) => (
                  <div
                    key={i}
                    title={`Week ${i + 1}: ${status}`}
                    className={`pg-dot ${status === "COMPLETE" ? "complete" : status === "IN_PROGRESS" ? "in-progress" : "pending"}`}
                  />
                ))}
              </div>

              {s.latestScore !== null && (
                <div className="pg-score-row">
                  <span className="lbl">Latest quiz</span>
                  <span className={`val ${s.latestScore >= 70 ? "pass" : "fail"}`}>{s.latestScore}%</span>
                </div>
              )}
            </a>
          );
        })}
      </div>
    </>
  );
}
