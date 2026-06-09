import Link from "next/link";

type ActivePage = "overview" | "applicants" | "runway" | "students";

const SHELL_CSS = `
  body { background: var(--cream); }
  .dash-shell { display: grid; grid-template-columns: 248px 1fr; min-height: 100vh; }

  .dash-side { background: var(--ink); color: var(--cream); display: flex; flex-direction: column; padding: 24px 16px; position: sticky; top: 0; height: 100vh; overflow-y: auto; }
  .dash-side .brand { display: flex; align-items: center; gap: 11px; padding: 6px 10px 22px; border-bottom: 1px solid var(--line-dk); }
  .dash-side .brand .mark { width: 32px; height: 32px; background: var(--marigold); border-radius: 9px; display: grid; place-items: center; transform: rotate(-6deg); flex-shrink: 0; }
  .dash-side .brand .mark span { font-family: "Bricolage Grotesque"; font-weight: 900; font-size: 17px; color: var(--ink); transform: rotate(6deg); display: block; line-height: 1; }
  .dash-side .brand .nm { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 14px; line-height: 1.1; }
  .dash-side .brand .nm em { font-style: normal; color: var(--marigold); display: block; font-size: 11px; }
  .navsec { font-family: "Space Mono"; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted-lt); padding: 18px 12px 8px; }
  .navlink { display: flex; align-items: center; gap: 12px; padding: 11px 12px; border-radius: 10px; font-size: 14.5px; font-weight: 500; color: var(--muted-dk); cursor: pointer; transition: background .15s, color .15s; text-decoration: none; }
  .navlink:hover { background: rgba(255,255,255,0.04); color: var(--cream); }
  .navlink.on { background: rgba(242,178,62,0.13); color: var(--cream); }
  .navlink .ic { width: 20px; text-align: center; opacity: 0.9; flex-shrink: 0; }
  .navlink .badge { margin-left: auto; font-family: "Space Mono"; font-size: 11px; background: var(--clay); color: var(--ink); padding: 2px 8px; border-radius: 999px; font-weight: 700; }
  .dash-side .me { margin-top: auto; display: flex; align-items: center; gap: 11px; padding: 14px 10px 6px; border-top: 1px solid var(--line-dk); }
  .dash-side .me .pic { width: 34px; height: 34px; border-radius: 9px; background: linear-gradient(150deg, var(--forest-2), var(--forest)); display: grid; place-items: center; font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 13px; flex-shrink: 0; color: var(--cream); }
  .dash-side .me .nm { font-size: 13.5px; font-weight: 600; }
  .dash-side .me .rl { font-family: "Space Mono"; font-size: 10.5px; color: var(--muted-dk); }
  .dash-side .me .out { margin-left: auto; }
  .dash-side .me .out a { font-size: 16px; color: var(--muted-dk); text-decoration: none; }

  .dash-main { overflow: hidden; background: var(--cream); }

  @media (max-width: 820px) {
    .dash-shell { grid-template-columns: 1fr; }
    .dash-side { display: none; }
  }
`;

export default function DashShell({
  children,
  activePage,
}: {
  children: React.ReactNode;
  activePage?: ActivePage;
}) {
  const lk = (page: ActivePage) => `navlink${activePage === page ? " on" : ""}`;

  return (
    <>
      <style>{SHELL_CSS}</style>
      <div className="dash-shell">
        <aside className="dash-side">
          <div className="brand">
            <span className="mark"><span>F</span></span>
            <span className="nm">THE AI FOUNDRY <em>KAMPALA</em></span>
          </div>
          <div className="navsec">Programme</div>
          <Link href="/dashboard" className={lk("overview")}><span className="ic">▦</span> Overview</Link>
          <Link href="/dashboard/applicants" className={lk("applicants")}><span className="ic">✦</span> Applications</Link>
          <span className="navlink"><span className="ic">◷</span> Cohorts</span>
          <Link href="/dashboard/students" className={lk("students")}><span className="ic">◢</span> Students</Link>
          <span className="navlink"><span className="ic">▤</span> Capstones</span>
          <div className="navsec">Floor</div>
          <span className="navlink"><span className="ic">▣</span> Schedule</span>
          <Link href="/dashboard/runway" className={lk("runway")}><span className="ic">◑</span> Runway / logs</Link>
          <span className="navlink"><span className="ic">⚙</span> Settings</span>
          <div className="me">
            <span className="pic">RA</span>
            <div>
              <div className="nm">Staff</div>
              <div className="rl">Facilitator</div>
            </div>
            <span className="out"><Link href="/login" title="Sign out">⏻</Link></span>
          </div>
        </aside>
        <main className="dash-main">
          {children}
        </main>
      </div>
    </>
  );
}
