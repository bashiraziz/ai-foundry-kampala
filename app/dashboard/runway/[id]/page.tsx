import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashShell from "@/components/DashShell";
import Link from "next/link";

const MODULE_TITLES: Record<number, string> = {
  1: "The Terminal",
  2: "Git",
  3: "Python Basics",
  4: "The Mini-Project",
};

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

const PAGE_CSS = `
  .topbar { display: flex; align-items: center; justify-content: space-between; padding: 22px 36px; background: #fff; border-bottom: 1px solid var(--line-lt); position: sticky; top: 0; z-index: 10; }
  .topbar h1 { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 24px; letter-spacing: -0.015em; }
  .topbar .back { font-family: "Space Mono"; font-size: 12px; color: var(--muted-lt); text-decoration: none; }
  .topbar .back:hover { color: var(--ink); }
  .topbar .pills { display: flex; align-items: center; gap: 10px; }
  .pill { font-family: "Space Mono"; font-size: 11px; font-weight: 700; padding: 5px 11px; border-radius: 999px; }
  .pill.active { background: var(--forest); color: var(--cream); }
  .pill.ready { background: var(--marigold); color: #1a0d06; }
  .pill.graduated { background: var(--ink); color: var(--cream); }
  .pill.deferred { background: var(--cream-2); color: var(--muted-lt); }

  .content { padding: 28px 36px 48px; max-width: 760px; display: flex; flex-direction: column; gap: 20px; }

  .panel { background: #fff; border: 1px solid var(--line-lt); border-radius: 18px; overflow: hidden; }
  .panel .p-head { padding: 20px 26px; border-bottom: 1px solid var(--line-lt); }
  .panel .p-head h2 { font-family: "Bricolage Grotesque"; font-weight: 700; font-size: 17px; }
  .panel .p-body { padding: 22px 26px; display: flex; flex-direction: column; gap: 12px; }

  .mod-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--line-lt); }
  .mod-row:last-child { border-bottom: none; }
  .mod-row .m-nm { font-size: 14px; color: var(--ink); }
  .mod-row .m-num { font-family: "Space Mono"; font-size: 11px; color: var(--muted-lt); margin-top: 2px; }
  .mod-tag { font-family: "Space Mono"; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 999px; }
  .mod-tag.done { background: var(--forest); color: var(--cream); }
  .mod-tag.prog { background: var(--marigold); color: #1a0d06; }
  .mod-tag.pend { background: var(--cream-2); color: var(--muted-lt); }

  .meta-row { display: flex; gap: 8px; font-size: 14px; padding: 6px 0; border-bottom: 1px solid var(--line-lt); }
  .meta-row:last-child { border-bottom: none; }
  .meta-row .mk { font-weight: 600; color: var(--ink); min-width: 130px; }
  .meta-row .mv { color: var(--muted-lt); font-family: "Space Mono"; font-size: 12px; }

  .proj-url { font-family: "Space Mono"; font-size: 12px; color: var(--clay-deep); text-decoration: none; word-break: break-all; }
  .proj-url:hover { text-decoration: underline; }
  .proj-feedback { font-size: 14px; line-height: 1.58; color: var(--ink); background: var(--cream-2); border-radius: 12px; padding: 14px 16px; margin-top: 4px; }
  .score-val { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 28px; color: var(--forest); }
`;

export default async function PrepStudentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const enrollment = await prisma.prepEnrollment.findUnique({
    where: { id },
    include: { applicant: true },
  });
  if (!enrollment) notFound();

  const progress = enrollment.moduleProgress as Record<string, string>;
  const pillClass = STATUS_PILL[enrollment.status] ?? "active";
  const pillLabel = STATUS_LABEL[enrollment.status] ?? enrollment.status;
  const daysSince = Math.floor((Date.now() - new Date(enrollment.createdAt).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <DashShell activePage="runway">
      <style>{PAGE_CSS}</style>
      <div className="topbar">
        <div>
          <Link href="/dashboard/runway" className="back">← Runway students</Link>
          <h1 style={{ marginTop: 6 }}>{enrollment.applicant.name}</h1>
        </div>
        <div className="pills">
          <span className={`pill ${pillClass}`}>{pillLabel}</span>
        </div>
      </div>

      <div className="content">
        {/* Module progress */}
        <div className="panel">
          <div className="p-head"><h2>Module progress</h2></div>
          <div className="p-body" style={{ gap: 0 }}>
            {[1, 2, 3, 4].map((m) => {
              const status = progress[String(m)] ?? "PENDING";
              const tagClass = status === "COMPLETE" ? "done" : status === "IN_PROGRESS" ? "prog" : "pend";
              const tagLabel = status === "COMPLETE" ? "Complete" : status === "IN_PROGRESS" ? "In progress" : "Not started";
              return (
                <div key={m} className="mod-row">
                  <div>
                    <div className="m-nm">{MODULE_TITLES[m]}</div>
                    <div className="m-num">Module {m}</div>
                  </div>
                  <span className={`mod-tag ${tagClass}`}>{tagLabel}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mini-project */}
        {enrollment.miniProjectUrl && (
          <div className="panel">
            <div className="p-head"><h2>Mini-project</h2></div>
            <div className="p-body">
              {enrollment.miniProjectScore != null && (
                <div className="score-val">{enrollment.miniProjectScore}%</div>
              )}
              <a href={enrollment.miniProjectUrl} target="_blank" rel="noopener noreferrer" className="proj-url">
                {enrollment.miniProjectUrl}
              </a>
              {enrollment.miniProjectFeedback && (
                <div className="proj-feedback">{enrollment.miniProjectFeedback}</div>
              )}
            </div>
          </div>
        )}

        {/* Meta */}
        <div className="panel">
          <div className="p-head"><h2>Enrollment details</h2></div>
          <div className="p-body" style={{ gap: 0 }}>
            <div className="meta-row">
              <span className="mk">Status</span>
              <span className="mv">{enrollment.status}</span>
            </div>
            <div className="meta-row">
              <span className="mk">Enrolled</span>
              <span className="mv">{new Date(enrollment.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} · {daysSince}d ago</span>
            </div>
            {enrollment.exitAssessmentId && (
              <div className="meta-row">
                <span className="mk">Exit assessment</span>
                <Link href={`/dashboard/applicants/${enrollment.exitAssessmentId}`} className="proj-url">
                  View assessment →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashShell>
  );
}
