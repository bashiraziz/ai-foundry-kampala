import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashShell from "@/components/DashShell";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const SESSION_PREVIEW_COUNT = 10;

const PAGE_CSS = `
  .topbar { display: flex; align-items: center; justify-content: space-between; padding: 22px 36px; background: #fff; border-bottom: 1px solid var(--line-lt); position: sticky; top: 0; z-index: 10; }
  .topbar h1 { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 24px; letter-spacing: -0.015em; }
  .topbar .sub { font-family: "Space Mono"; font-size: 12px; color: var(--muted-lt); margin-top: 3px; }
  .topbar .back { font-family: "Space Mono"; font-size: 12px; color: var(--muted-lt); text-decoration: none; }
  .topbar .back:hover { color: var(--ink); }
  .topbar .pills { display: flex; align-items: center; gap: 10px; }
  .pill { font-family: "Space Mono"; font-size: 11px; font-weight: 700; padding: 5px 11px; border-radius: 999px; color: var(--cream); }
  .pill.dev { background: var(--clay); color: #1a0d06; }
  .pill.pro { background: var(--forest); }

  .content { padding: 28px 36px 48px; max-width: 860px; display: flex; flex-direction: column; gap: 20px; }

  .panel { background: #fff; border: 1px solid var(--line-lt); border-radius: 18px; overflow: hidden; }
  .panel .p-head { display: flex; align-items: center; justify-content: space-between; padding: 20px 26px; border-bottom: 1px solid var(--line-lt); }
  .panel .p-head h2 { font-family: "Bricolage Grotesque"; font-weight: 700; font-size: 17px; }
  .panel .p-head .ph { font-family: "Space Mono"; font-size: 11px; color: var(--muted-lt); }
  .panel .p-body { padding: 22px 26px; }

  .quiz-row { display: flex; align-items: center; justify-content: space-between; padding: 11px 0; border-bottom: 1px solid var(--line-lt); }
  .quiz-row:last-child { border-bottom: none; }
  .quiz-row .q-lbl { font-size: 14px; font-weight: 600; }
  .quiz-row .q-date { font-family: "Space Mono"; font-size: 11px; color: var(--muted-lt); margin-top: 2px; }
  .quiz-row .q-right { display: flex; align-items: center; gap: 10px; }
  .q-bar { width: 72px; height: 6px; border-radius: 999px; background: var(--line-lt); overflow: hidden; }
  .q-bar span { display: block; height: 100%; border-radius: 999px; }
  .q-bar span.pass { background: var(--forest); }
  .q-bar span.fail { background: var(--marigold); }
  .q-score { font-family: "Space Mono"; font-size: 13px; font-weight: 700; }
  .q-score.pass { color: var(--forest); }
  .q-score.fail { color: var(--clay-deep); }

  .sess-item { border: 1px solid var(--line-lt); border-radius: 14px; overflow: hidden; margin-bottom: 10px; }
  .sess-item:last-child { margin-bottom: 0; }
  .sess-summary { display: flex; align-items: center; justify-content: space-between; padding: 13px 18px; cursor: pointer; font-size: 14px; color: var(--ink); list-style: none; }
  .sess-summary:hover { background: var(--cream-2); }
  .sess-summary .s-date { font-family: "Space Mono"; font-size: 11px; color: var(--muted-lt); }
  .sess-body { padding: 14px 18px; display: flex; flex-direction: column; gap: 8px; background: var(--cream-2); border-top: 1px solid var(--line-lt); }
  .sess-msg { font-size: 13px; line-height: 1.55; padding: 10px 14px; border-radius: 10px; }
  .sess-msg.user { background: #fff; border: 1px solid var(--line-lt); white-space: pre-wrap; }
  .sess-msg.bot { background: var(--ink-2); color: var(--cream); }
  .sess-msg .who { font-family: "Space Mono"; font-size: 10px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted-lt); margin-bottom: 4px; }
  .sess-msg.bot .who { color: var(--muted-dk); }

  .sess-md { color: var(--cream); }
  .sess-md p { margin: 0 0 8px; }
  .sess-md p:last-child { margin-bottom: 0; }
  .sess-md strong { font-weight: 700; }
  .sess-md em { font-style: italic; }
  .sess-md h1, .sess-md h2, .sess-md h3 { font-family: "Bricolage Grotesque"; font-weight: 700; margin: 10px 0 4px; color: var(--cream); }
  .sess-md h1 { font-size: 15px; }
  .sess-md h2 { font-size: 13.5px; }
  .sess-md h3 { font-size: 13px; }
  .sess-md ul, .sess-md ol { padding-left: 16px; margin: 4px 0 8px; display: flex; flex-direction: column; gap: 2px; }
  .sess-md ul { list-style: disc; }
  .sess-md ol { list-style: decimal; }
  .sess-md li { line-height: 1.5; color: var(--cream); }
  .sess-md code { font-family: "Space Mono"; font-size: 11px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); border-radius: 3px; padding: 1px 4px; color: var(--marigold); }
  .sess-md pre { background: rgba(0,0,0,0.35); border-radius: 8px; padding: 10px 12px; margin: 6px 0; overflow-x: auto; border: 1px solid var(--line-dk); }
  .sess-md pre code { background: none; border: none; padding: 0; color: var(--muted-dk); font-size: 11.5px; line-height: 1.6; }

  .show-all-link { font-family: "Space Mono"; font-size: 12px; color: var(--clay-deep); text-decoration: none; display: block; text-align: center; margin-top: 14px; }
  .show-all-link:hover { text-decoration: underline; }

  .empty { font-family: "Space Mono"; font-size: 13px; color: var(--muted-lt); }
`;

export default async function StudentPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ sessions?: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const [{ id }, { sessions: sessionsParam }] = await Promise.all([params, searchParams]);
  const showAll = sessionsParam === "all";

  const student = await prisma.student.findUnique({
    where: { id },
    include: {
      sessions: {
        orderBy: { createdAt: "desc" },
        take: showAll ? undefined : SESSION_PREVIEW_COUNT,
      },
      quizzes: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!student) notFound();

  const totalSessions = await prisma.session.count({ where: { studentId: id } });
  const hasMore = !showAll && totalSessions > SESSION_PREVIEW_COUNT;
  const isDev = student.track === "DEVELOPER";

  return (
    <DashShell activePage="students">
      <style>{PAGE_CSS}</style>
      <div className="topbar">
        <div>
          <Link href="/dashboard" className="back">← Dashboard</Link>
          <h1 style={{ marginTop: 6 }}>{student.name}</h1>
        </div>
        <div className="pills">
          <span className={`pill ${isDev ? "dev" : "pro"}`}>
            {isDev ? "Developer" : "Professional"}
          </span>
        </div>
      </div>

      <div className="content">
        {/* Quiz history */}
        <div className="panel">
          <div className="p-head">
            <h2>Quiz history</h2>
            <span className="ph">{student.quizzes.length} quizzes</span>
          </div>
          <div className="p-body">
            {student.quizzes.length > 0 ? (
              student.quizzes.map((q) => {
                const pass = q.score >= 70;
                return (
                  <div key={q.id} className="quiz-row">
                    <div>
                      <div className="q-lbl">Week {q.week}</div>
                      <div className="q-date">{new Date(q.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</div>
                    </div>
                    <div className="q-right">
                      <div className="q-bar">
                        <span className={pass ? "pass" : "fail"} style={{ width: `${q.score}%` }} />
                      </div>
                      <span className={`q-score ${pass ? "pass" : "fail"}`}>{q.score}%</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="empty">No quizzes yet.</p>
            )}
          </div>
        </div>

        {/* Session history */}
        <div className="panel">
          <div className="p-head">
            <h2>Session history</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span className="ph">{totalSessions} total</span>
              {showAll && totalSessions > SESSION_PREVIEW_COUNT && (
                <Link href={`/dashboard/students/${id}`} className="ph" style={{ color: "var(--clay-deep)", textDecoration: "none" }}>
                  Show recent only
                </Link>
              )}
            </div>
          </div>
          <div className="p-body">
            {student.sessions.length > 0 ? (
              <>
                {student.sessions.map((s) => {
                  const msgs = s.messages as { role: string; content: string }[];
                  return (
                    <details key={s.id} className="sess-item">
                      <summary className="sess-summary">
                        <span>Week {s.week} · {new Date(s.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                        <span className="s-date">{msgs.length} messages</span>
                      </summary>
                      <div className="sess-body">
                        {msgs.map((m, i) => (
                          <div key={i} className={`sess-msg ${m.role === "user" ? "user" : "bot"}`}>
                            <div className="who">{m.role === "user" ? student.name : "Mshauri"}</div>
                            {m.role === "assistant" ? (
                              <div className="sess-md">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                              </div>
                            ) : m.content}
                          </div>
                        ))}
                      </div>
                    </details>
                  );
                })}
                {hasMore && (
                  <Link href={`/dashboard/students/${id}?sessions=all`} className="show-all-link">
                    Show all {totalSessions} sessions →
                  </Link>
                )}
              </>
            ) : (
              <p className="empty">No sessions yet.</p>
            )}
          </div>
        </div>
      </div>
    </DashShell>
  );
}
