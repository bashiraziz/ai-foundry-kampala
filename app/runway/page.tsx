"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

const PAGE_CSS = `
  .rw-shell { min-height: 100vh; background: var(--ink); display: flex; flex-direction: column; }

  .rw-header { flex-shrink: 0; border-bottom: 1px solid var(--line-dk); padding: 18px 28px; display: flex; align-items: center; justify-content: space-between; }
  .rw-header .brand { display: flex; align-items: center; gap: 10px; }
  .rw-header .brand .mark { width: 30px; height: 30px; border-radius: 8px; background: var(--plum); display: grid; place-items: center; font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 14px; color: var(--cream); }
  .rw-header .brand-text .nm { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 16px; color: var(--cream); }
  .rw-header .brand-text .sub { font-family: "Space Mono"; font-size: 11px; color: var(--muted-dk); margin-top: 1px; }
  .rw-header .back { font-family: "Space Mono"; font-size: 11px; color: var(--muted-dk); text-decoration: none; transition: color .15s; }
  .rw-header .back:hover { color: var(--cream); }

  .rw-body { flex: 1; padding: 36px 28px; max-width: 640px; width: 100%; margin: 0 auto; display: flex; flex-direction: column; gap: 28px; }

  .prog-wrap { display: flex; flex-direction: column; gap: 8px; }
  .prog-meta { display: flex; justify-content: space-between; font-family: "Space Mono"; font-size: 11px; color: var(--muted-dk); }
  .prog-bar { height: 4px; background: var(--line-dk); border-radius: 999px; overflow: hidden; }
  .prog-bar span { display: block; height: 100%; background: var(--plum); border-radius: 999px; transition: width .5s ease; }

  .modules { display: flex; flex-direction: column; gap: 10px; }

  .mod-card { border-radius: 16px; padding: 20px 22px; border: 1px solid var(--line-dk); display: flex; align-items: center; justify-content: space-between; gap: 16px; transition: border-color .15s; }
  .mod-card.locked { opacity: 0.45; pointer-events: none; }
  .mod-card.complete { border-color: color-mix(in srgb, var(--plum) 40%, transparent); background: color-mix(in srgb, var(--plum) 6%, transparent); }
  .mod-card.available { background: var(--ink-2); }
  .mod-card.available:hover { border-color: var(--muted-dk); }

  .mod-left { display: flex; align-items: center; gap: 16px; flex: 1; min-width: 0; }
  .mod-num { font-family: "Space Mono"; font-size: 11px; color: var(--muted-dk); width: 20px; flex-shrink: 0; }
  .mod-info .nm { font-family: "Bricolage Grotesque"; font-weight: 700; font-size: 16px; color: var(--cream); }
  .mod-card.complete .mod-info .nm { color: color-mix(in srgb, var(--plum) 60%, var(--cream)); }
  .mod-info .desc { font-family: "Archivo"; font-size: 13px; color: var(--muted-dk); margin-top: 3px; }

  .mod-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
  .mod-tag { font-family: "Space Mono"; font-size: 10px; font-weight: 700; padding: 4px 9px; border-radius: 999px; }
  .mod-tag.done { background: color-mix(in srgb, var(--plum) 20%, transparent); color: color-mix(in srgb, var(--plum) 70%, var(--cream)); border: 1px solid color-mix(in srgb, var(--plum) 30%, transparent); }
  .mod-tag.prog { background: color-mix(in srgb, var(--marigold) 15%, transparent); color: var(--marigold); border: 1px solid color-mix(in srgb, var(--marigold) 25%, transparent); }

  .mod-btn { font-family: "Archivo"; font-weight: 700; font-size: 13px; padding: 9px 18px; border-radius: 999px; text-decoration: none; transition: all .15s; border: none; cursor: pointer; }
  .mod-btn.primary { background: var(--marigold); color: var(--ink); }
  .mod-btn.primary:hover { background: color-mix(in srgb, var(--marigold) 82%, white); }
  .mod-btn.secondary { background: transparent; color: var(--muted-dk); border: 1px solid var(--line-dk); }
  .mod-btn.secondary:hover { border-color: var(--muted-dk); color: var(--cream); }

  .lock-icon { color: var(--line-dk); }

  .bottom-cta { display: flex; flex-direction: column; gap: 10px; }
  .cta-btn { display: block; text-align: center; font-family: "Archivo"; font-weight: 700; font-size: 15px; padding: 16px 24px; border-radius: 14px; text-decoration: none; transition: all .15s; }
  .cta-btn.exit { background: var(--plum); color: var(--cream); }
  .cta-btn.exit:hover { background: color-mix(in srgb, var(--plum) 80%, var(--cream)); }
  .cta-btn.project { background: var(--marigold); color: var(--ink); }
  .cta-btn.project:hover { background: color-mix(in srgb, var(--marigold) 82%, white); }

  .loading { min-height: 100vh; background: var(--ink); display: flex; align-items: center; justify-content: center; }
  .loading-mark { width: 36px; height: 36px; border-radius: 10px; background: var(--plum); display: grid; place-items: center; font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 18px; color: var(--cream); animation: pulse 1.4s ease-in-out infinite; }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
`;

const MODULES = [
  { id: 1, title: "The Terminal", desc: "Navigate your computer with text commands" },
  { id: 2, title: "Git", desc: "Track changes and push your code to GitHub" },
  { id: 3, title: "Python Basics", desc: "Variables, loops, functions, and CSV files" },
  { id: 4, title: "The Mini-Project", desc: "Build and ship a real Python script" },
];

interface Enrollment {
  currentModule: number;
  moduleProgress: Record<string, string>;
  miniProjectScore: number | null;
  status: string;
}

function LockIcon() {
  return (
    <svg className="lock-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 7V5a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PrepContent() {
  const params = useSearchParams();
  const router = useRouter();
  const applicantId = params.get("applicantId");
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);

  useEffect(() => {
    if (!applicantId) { router.push("/runway/login"); return; }
    fetch(`/api/runway?applicantId=${applicantId}`)
      .then((r) => r.json())
      .then((d) => setEnrollment(d.enrollment));
  }, [applicantId, router]);

  if (!enrollment) {
    return (
      <div className="loading">
        <style>{PAGE_CSS}</style>
        <div className="loading-mark">F</div>
      </div>
    );
  }

  const completedCount = Object.values(enrollment.moduleProgress).filter((v) => v === "COMPLETE").length;
  const progressPct = (completedCount / 4) * 100;
  const statusOf = (moduleId: number) => enrollment.moduleProgress[String(moduleId)];
  const isLocked = (moduleId: number) => moduleId > 1 && statusOf(moduleId - 1) !== "COMPLETE";

  return (
    <div className="rw-shell">
      <style>{PAGE_CSS}</style>

      <header className="rw-header">
        <div className="brand">
          <div className="mark">F</div>
          <div className="brand-text">
            <div className="nm">Runway</div>
            <div className="sub">{completedCount}/4 modules complete</div>
          </div>
        </div>
        <Link href="/" className="back">← Home</Link>
      </header>

      <div className="rw-body">
        <div className="prog-wrap">
          <div className="prog-meta">
            <span>Your progress</span>
            <span>{completedCount} of 4 complete</span>
          </div>
          <div className="prog-bar">
            <span style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        <div className="modules">
          {MODULES.map((m) => {
            const locked = isLocked(m.id);
            const status = statusOf(m.id);
            const complete = status === "COMPLETE";
            const inProgress = status === "IN_PROGRESS";
            const cardClass = locked ? "locked" : complete ? "complete" : "available";

            return (
              <div key={m.id} className={`mod-card ${cardClass}`}>
                <div className="mod-left">
                  <span className="mod-num">0{m.id}</span>
                  <div className="mod-info">
                    <div className="nm">{m.title}</div>
                    <div className="desc">{m.desc}</div>
                  </div>
                </div>
                <div className="mod-right">
                  {complete && <span className="mod-tag done">Complete</span>}
                  {inProgress && <span className="mod-tag prog">In progress</span>}
                  {locked ? (
                    <LockIcon />
                  ) : (
                    <Link
                      href={`/runway/${m.id}?applicantId=${applicantId}`}
                      className={`mod-btn ${complete ? "secondary" : "primary"}`}
                    >
                      {complete ? "Review" : "Start →"}
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="bottom-cta">
          {statusOf(4) === "COMPLETE" && (
            <Link
              href={`/runway/project?applicantId=${applicantId}`}
              className="cta-btn project"
            >
              Submit mini-project →
            </Link>
          )}
          {enrollment.status === "READY_FOR_EXIT" && (
            <Link
              href={`/assess?prep=true&applicantId=${applicantId}`}
              className="cta-btn exit"
            >
              Take exit assessment →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PrepPage() {
  return (
    <Suspense fallback={
      <div className="loading">
        <style>{PAGE_CSS}</style>
        <div className="loading-mark">F</div>
      </div>
    }>
      <PrepContent />
    </Suspense>
  );
}
