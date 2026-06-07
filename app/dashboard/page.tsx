import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ProgressGrid from "@/components/ProgressGrid";
import Link from "next/link";

export const revalidate = 300;

const PAGE_CSS = `
  body { background: var(--cream); }
  .dash-shell { display: grid; grid-template-columns: 248px 1fr; min-height: 100vh; }

  .dash-side { background: var(--ink); color: var(--cream); display: flex; flex-direction: column; padding: 24px 16px; position: sticky; top: 0; height: 100vh; overflow-y: auto; }
  .dash-side .brand { display: flex; align-items: center; gap: 11px; padding: 6px 10px 22px; border-bottom: 1px solid var(--line-dk); }
  .dash-side .brand .mark { width: 32px; height: 32px; background: var(--marigold); border-radius: 9px; display: grid; place-items: center; transform: rotate(-6deg); flex-shrink: 0; }
  .dash-side .brand .mark span { font-family: "Bricolage Grotesque"; font-weight: 900; font-size: 17px; color: var(--ink); transform: rotate(6deg); display: block; line-height: 1; }
  .dash-side .brand .nm { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 14px; line-height: 1.1; }
  .dash-side .brand .nm em { font-style: normal; color: var(--marigold); display: block; font-size: 11px; }
  .navsec { font-family: "Space Mono"; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: #6f6452; padding: 18px 12px 8px; }
  .navlink { display: flex; align-items: center; gap: 12px; padding: 11px 12px; border-radius: 10px; font-size: 14.5px; font-weight: 500; color: var(--muted-dk); cursor: pointer; transition: background .15s, color .15s; text-decoration: none; }
  .navlink:hover { background: rgba(255,255,255,0.04); color: var(--cream); }
  .navlink.on { background: rgba(242,178,62,0.13); color: var(--cream); }
  .navlink .ic { width: 20px; text-align: center; opacity: 0.9; flex-shrink: 0; }
  .navlink .badge { margin-left: auto; font-family: "Space Mono"; font-size: 11px; background: var(--clay); color: #1a0d06; padding: 2px 8px; border-radius: 999px; font-weight: 700; }
  .dash-side .me { margin-top: auto; display: flex; align-items: center; gap: 11px; padding: 14px 10px 6px; border-top: 1px solid var(--line-dk); }
  .dash-side .me .pic { width: 34px; height: 34px; border-radius: 9px; background: linear-gradient(150deg, var(--forest-2), var(--forest)); display: grid; place-items: center; font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 13px; flex-shrink: 0; color: var(--cream); }
  .dash-side .me .nm { font-size: 13.5px; font-weight: 600; }
  .dash-side .me .rl { font-family: "Space Mono"; font-size: 10.5px; color: var(--muted-dk); }
  .dash-side .me .out { margin-left: auto; }
  .dash-side .me .out a { font-size: 16px; color: var(--muted-dk); text-decoration: none; }

  .dash-main { overflow: hidden; background: var(--cream); }
  .topbar { display: flex; align-items: center; justify-content: space-between; padding: 22px 36px; background: #fff; border-bottom: 1px solid var(--line-lt); position: sticky; top: 0; z-index: 10; }
  .topbar h1 { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 24px; letter-spacing: -0.015em; }
  .topbar .sub { font-family: "Space Mono"; font-size: 12px; color: var(--muted-lt); margin-top: 3px; }
  .topbar .actions { display: flex; align-items: center; gap: 12px; }
  .search { display: flex; align-items: center; gap: 9px; background: var(--cream); border: 1px solid var(--line-lt); border-radius: 10px; padding: 9px 14px; font-size: 13.5px; color: var(--muted-lt); width: 240px; }

  .content { padding: 32px 36px 48px; }
  .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; margin-bottom: 28px; }
  .scard { background: #fff; border: 1px solid var(--line-lt); border-radius: 16px; padding: 22px 24px; }
  .scard .top { display: flex; align-items: center; justify-content: space-between; }
  .scard .lbl { font-family: "Space Mono"; font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted-lt); }
  .scard .dot { width: 9px; height: 9px; border-radius: 50%; }
  .scard .n { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 40px; letter-spacing: -0.02em; margin-top: 14px; line-height: 1; }
  .scard .delta { font-size: 13px; margin-top: 10px; color: var(--muted-lt); }
  .scard .delta b { font-weight: 700; }
  .scard .delta.up b { color: var(--forest); }
  .scard .delta.warn b { color: var(--clay-deep); }

  .track-tabs { display: flex; gap: 8px; margin-bottom: 24px; }
  .tab { font-family: "Archivo"; font-weight: 600; font-size: 13.5px; padding: 8px 18px; border-radius: 999px; border: 1.5px solid var(--line-lt); background: #fff; color: var(--muted-lt); text-decoration: none; transition: all .15s; }
  .tab:hover { border-color: var(--ink); color: var(--ink); }
  .tab.on { background: var(--ink); border-color: var(--ink); color: var(--cream); }

  .dash-grid { display: grid; grid-template-columns: 1.6fr 1fr; gap: 22px; margin-top: 28px; }
  .panel { background: #fff; border: 1px solid var(--line-lt); border-radius: 18px; overflow: hidden; }
  .panel .p-head { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid var(--line-lt); }
  .panel .p-head h2 { font-family: "Bricolage Grotesque"; font-weight: 700; font-size: 18px; }
  .panel .p-head .link { font-family: "Space Mono"; font-size: 12px; color: var(--clay-deep); text-decoration: none; }

  .stack { display: flex; flex-direction: column; gap: 22px; }
  .cohort .p-body { padding: 22px 24px; }
  .cohort .c-name { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 22px; }
  .cohort .c-meta { font-family: "Space Mono"; font-size: 12px; color: var(--muted-lt); margin-top: 4px; }
  .cohort .prog { margin-top: 20px; }
  .cohort .prog .pl { display: flex; justify-content: space-between; font-size: 13px; color: var(--muted-lt); margin-bottom: 8px; white-space: nowrap; }
  .cohort .prog .track-line { height: 9px; border-radius: 999px; background: var(--cream-2); overflow: hidden; }
  .cohort .prog .track-line span { display: block; height: 100%; background: var(--clay); border-radius: 999px; }
  .weeks { display: flex; gap: 5px; margin-top: 18px; }
  .weeks .wk { flex: 1; height: 30px; border-radius: 6px; background: var(--cream-2); display: grid; place-items: center; font-family: "Space Mono"; font-size: 10px; color: var(--muted-lt); }
  .weeks .wk.done { background: var(--forest); color: var(--cream); }
  .weeks .wk.now { background: var(--marigold); color: #1a0d06; font-weight: 700; }

  .sched .p-body { padding: 8px 0; }
  .ev { display: flex; gap: 14px; padding: 13px 24px; align-items: flex-start; }
  .ev .time { font-family: "Space Mono"; font-size: 11.5px; color: var(--muted-lt); width: 54px; flex: none; padding-top: 2px; }
  .ev .bar2 { width: 3px; align-self: stretch; border-radius: 999px; flex: none; }
  .ev.c1 .bar2 { background: var(--clay); }
  .ev.c2 .bar2 { background: var(--forest); }
  .ev.c3 .bar2 { background: var(--plum); }
  .ev .t { font-size: 14px; font-weight: 600; line-height: 1.3; }
  .ev .d { font-size: 12.5px; color: var(--muted-lt); margin-top: 2px; }

  @media (max-width: 1040px) { .stats { grid-template-columns: repeat(2,1fr); } .dash-grid { grid-template-columns: 1fr; } }
  @media (max-width: 820px) { .dash-shell { grid-template-columns: 1fr; } .dash-side { display: none; } }
`;

const TRACK_TABS = [
  { label: "All", value: "" },
  { label: "Developer", value: "DEVELOPER" },
  { label: "Professional", value: "PROFESSIONAL" },
];

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ track?: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const { track: trackFilter = "" } = await searchParams;
  const validTrack = trackFilter === "DEVELOPER" || trackFilter === "PROFESSIONAL" ? trackFilter : undefined;

  const students = await prisma.student.findMany({
    where: validTrack ? { track: validTrack } : undefined,
    include: { progress: true, quizzes: { orderBy: { createdAt: "desc" } }, sessions: true },
  });

  const formatted = students.map((s) => ({
    id: s.id,
    name: s.name,
    track: s.track,
    progress: s.progress.map((p) => ({ week: p.week, status: p.status })),
    latestScore: s.quizzes[0]?.score ?? null,
    sessionCount: s.sessions.length,
  }));

  const scores = formatted.flatMap((s) => (s.latestScore !== null ? [s.latestScore] : []));
  const avgScore = scores.reduce((a: number, b: number) => a + b, 0) / (scores.length || 1);
  const totalSessions = formatted.reduce((a: number, s) => a + s.sessionCount, 0);

  return (
    <>
      <style>{PAGE_CSS}</style>
      <div className="dash-shell">
        <aside className="dash-side">
          <div className="brand">
            <span className="mark"><span>F</span></span>
            <span className="nm">THE AI FOUNDRY <em>KAMPALA</em></span>
          </div>
          <div className="navsec">Programme</div>
          <Link href="/dashboard" className="navlink on"><span className="ic">▦</span> Overview</Link>
          <Link href="/dashboard/applicants" className="navlink"><span className="ic">✦</span> Applications <span className="badge">14</span></Link>
          <span className="navlink"><span className="ic">◷</span> Cohorts</span>
          <span className="navlink"><span className="ic">◢</span> Students</span>
          <span className="navlink"><span className="ic">▤</span> Capstones</span>
          <div className="navsec">Floor</div>
          <span className="navlink"><span className="ic">▣</span> Schedule</span>
          <Link href="/dashboard/runway" className="navlink"><span className="ic">◑</span> Mshauri logs</Link>
          <span className="navlink"><span className="ic">⚙</span> Settings</span>
          <div className="me">
            <span className="pic">RA</span>
            <div>
              <div className="nm">Ruth A.</div>
              <div className="rl">Developer lead</div>
            </div>
            <span className="out"><Link href="/login" title="Sign out">⏻</Link></span>
          </div>
        </aside>

        <main className="dash-main">
          <div className="topbar">
            <div>
              <h1>Overview</h1>
              <div className="sub">Facilitator dashboard · Cohort 6 intake open</div>
            </div>
            <div className="actions">
              <div className="search">⌕ Search students, applications…</div>
              <button className="btn btn-clay">+ New cohort</button>
            </div>
          </div>

          <div className="content">
            <div className="stats">
              <div className="scard">
                <div className="top"><span className="lbl">Active students</span><span className="dot" style={{ background: "var(--forest)" }} /></div>
                <div className="n">{formatted.length}</div>
                <div className="delta up"><b>96%</b> weekly active</div>
              </div>
              <div className="scard">
                <div className="top"><span className="lbl">Avg quiz score</span><span className="dot" style={{ background: "var(--marigold)" }} /></div>
                <div className="n">{Math.round(avgScore)}<span style={{ fontSize: 22 }}>%</span></div>
                <div className="delta">across all students</div>
              </div>
              <div className="scard">
                <div className="top"><span className="lbl">Mshauri sessions</span><span className="dot" style={{ background: "var(--clay)" }} /></div>
                <div className="n">{totalSessions}</div>
                <div className="delta">total sessions logged</div>
              </div>
              <div className="scard">
                <div className="top"><span className="lbl">Pending applications</span><span className="dot" style={{ background: "var(--plum)" }} /></div>
                <div className="n">14</div>
                <div className="delta warn"><b>6 new</b> since yesterday</div>
              </div>
            </div>

            <div className="track-tabs">
              {TRACK_TABS.map(({ label, value }) => {
                const active = (validTrack ?? "") === value;
                const href = value ? `/dashboard?track=${value}` : "/dashboard";
                return (
                  <Link key={label} href={href} className={`tab${active ? " on" : ""}`}>
                    {label}
                  </Link>
                );
              })}
            </div>

            <ProgressGrid students={formatted} />

            <div className="dash-grid">
              <div className="panel cohort">
                <div className="p-head"><h2>Cohort 5 · Developer</h2><Link href="#" className="link">Details →</Link></div>
                <div className="p-body">
                  <div className="c-name">Week 9 of 12</div>
                  <div className="c-meta">22 students · Module 03: Agents &amp; tools</div>
                  <div className="prog">
                    <div className="pl"><span>Overall progress</span><span>74%</span></div>
                    <div className="track-line"><span style={{ width: "74%" }} /></div>
                  </div>
                  <div className="weeks">
                    {[1,2,3,4,5,6,7,8].map(w => <div key={w} className="wk done">{w}</div>)}
                    <div className="wk now">9</div>
                    {[10,11,12].map(w => <div key={w} className="wk">{w}</div>)}
                  </div>
                </div>
              </div>

              <div className="stack">
                <div className="panel sched">
                  <div className="p-head"><h2>Today on the floor</h2><Link href="#" className="link">Calendar →</Link></div>
                  <div className="p-body">
                    <div className="ev c1"><span className="time">09:00</span><span className="bar2" /><div><div className="t">Fusion Lab — Agents</div><div className="d">Cohort 5 · Lab room A</div></div></div>
                    <div className="ev c2"><span className="time">11:30</span><span className="bar2" /><div><div className="t">Capstone scoping</div><div className="d">3 students · 1:1 with Ruth</div></div></div>
                    <div className="ev c3"><span className="time">14:00</span><span className="bar2" /><div><div className="t">Runway check-ins</div><div className="d">Self-paced cohort · async</div></div></div>
                    <div className="ev c1"><span className="time">16:00</span><span className="bar2" /><div><div className="t">Intake reviews</div><div className="d">14 pending · panel</div></div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
