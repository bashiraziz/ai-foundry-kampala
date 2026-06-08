import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashShell from "@/components/DashShell";
import Link from "next/link";

export const revalidate = 60;

const PAGE_CSS = `
  .topbar { display: flex; align-items: center; justify-content: space-between; padding: 22px 36px; background: #fff; border-bottom: 1px solid var(--line-lt); position: sticky; top: 0; z-index: 10; }
  .topbar h1 { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 24px; letter-spacing: -0.015em; }
  .topbar .sub { font-family: "Space Mono"; font-size: 12px; color: var(--muted-lt); margin-top: 3px; }

  .content { padding: 28px 36px 48px; }
  .rw-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; }
  .rw-card { background: #fff; border: 1px solid var(--line-lt); border-radius: 18px; padding: 22px 24px; display: flex; flex-direction: column; gap: 14px; text-decoration: none; color: var(--ink); transition: border-color .15s, box-shadow .15s; }
  .rw-card:hover { border-color: var(--ink); box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
  .rw-card .rw-top { display: flex; align-items: flex-start; justify-content: space-between; }
  .rw-card .nm { font-family: "Bricolage Grotesque"; font-weight: 700; font-size: 18px; }
  .rw-card .days { font-family: "Space Mono"; font-size: 11px; color: var(--muted-lt); margin-top: 3px; }
  .pill { font-family: "Space Mono"; font-size: 11px; font-weight: 700; padding: 5px 11px; border-radius: 999px; }
  .pill.active { background: var(--forest); color: var(--cream); }
  .pill.ready { background: var(--marigold); color: #1a0d06; }
  .pill.graduated { background: var(--ink); color: var(--cream); }
  .pill.deferred { background: var(--cream-2); color: var(--muted-lt); }
  .mod-bars { display: flex; gap: 6px; }
  .mod-bar { flex: 1; height: 8px; border-radius: 4px; background: var(--cream-2); }
  .mod-bar.done { background: var(--forest); }
  .mod-bar.prog { background: var(--marigold); }
  .rw-card .foot { display: flex; justify-content: space-between; font-family: "Space Mono"; font-size: 12px; color: var(--muted-lt); }
  .rw-card .foot .score { color: var(--forest); font-weight: 700; }

  .empty { background: #fff; border: 1px solid var(--line-lt); border-radius: 18px; padding: 56px 24px; text-align: center; font-family: "Space Mono"; font-size: 13px; color: var(--muted-lt); }

  @media (max-width: 900px) { .rw-grid { grid-template-columns: 1fr; } }
`;

const STATUS_PILL: Record<string, string> = {
  ACTIVE: "active",
  READY_FOR_EXIT: "ready",
  GRADUATED: "graduated",
  DEFERRED: "deferred",
};

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: "Active",
  READY_FOR_EXIT: "Ready for exit",
  GRADUATED: "Graduated",
  DEFERRED: "Deferred",
};

export default async function PrepDashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const enrollments = await prisma.prepEnrollment.findMany({
    include: { applicant: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <DashShell activePage="runway">
      <style>{PAGE_CSS}</style>
      <div className="topbar">
        <div>
          <h1>Runway students</h1>
          <div className="sub">{enrollments.length} enrolled</div>
        </div>
      </div>

      <div className="content">
        {enrollments.length === 0 ? (
          <div className="empty">No Runway students enrolled yet.</div>
        ) : (
          <div className="rw-grid">
            {enrollments.map((e) => {
              const progress = e.moduleProgress as Record<string, string>;
              const completedModules = Object.values(progress).filter((v) => v === "COMPLETE").length;
              const daysSince = Math.floor(
                (Date.now() - new Date(e.createdAt).getTime()) / (1000 * 60 * 60 * 24)
              );
              const pillClass = STATUS_PILL[e.status] ?? "active";
              const pillLabel = STATUS_LABEL[e.status] ?? e.status;

              return (
                <Link key={e.id} href={`/dashboard/runway/${e.id}`} className="rw-card">
                  <div className="rw-top">
                    <div>
                      <div className="nm">{e.applicant.name}</div>
                      <div className="days">{daysSince}d enrolled</div>
                    </div>
                    <span className={`pill ${pillClass}`}>{pillLabel}</span>
                  </div>

                  <div className="mod-bars">
                    {[1, 2, 3, 4].map((m) => {
                      const s = progress[String(m)];
                      const cls = s === "COMPLETE" ? "done" : s === "IN_PROGRESS" ? "prog" : "";
                      return <div key={m} className={`mod-bar${cls ? ` ${cls}` : ""}`} title={`Module ${m}: ${s ?? "not started"}`} />;
                    })}
                  </div>

                  <div className="foot">
                    <span>{completedModules}/4 modules complete</span>
                    {e.miniProjectScore != null && (
                      <span className="score">Project: {e.miniProjectScore}%</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </DashShell>
  );
}
