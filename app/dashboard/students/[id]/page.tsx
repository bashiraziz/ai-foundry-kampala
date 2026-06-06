import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

const SESSION_PREVIEW_COUNT = 10;

export default async function StudentPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ sessions?: string }>;
}) {
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
    <div className="min-h-screen bg-bone-white p-6">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3 flex-wrap">
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-gray-600 transition">← Dashboard</Link>
          <h1 className="text-xl font-bold text-forge-night">{student.name}</h1>
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${isDev ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
            {isDev ? "Developer" : "Professional"}
          </span>
        </div>

        {/* Quiz history */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <p className="text-sm font-semibold text-gray-700 mb-4">Quiz history</p>
          {student.quizzes.length > 0 ? (
            <div className="space-y-2">
              {student.quizzes.map((q) => {
                const pass = q.score >= 70;
                return (
                  <div key={q.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm text-gray-700 font-medium">Week {q.week}</p>
                      <p className="text-xs text-gray-400">{new Date(q.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${pass ? "bg-foundry-green" : "bg-amber-400"}`}
                          style={{ width: `${q.score}%` }}
                        />
                      </div>
                      <span className={`text-sm font-bold ${pass ? "text-foundry-green" : "text-amber-600"}`}>
                        {q.score}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No quizzes yet.</p>
          )}
        </div>

        {/* Session history */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-gray-700">
              Session history
              <span className="ml-2 text-gray-400 font-normal text-xs">({totalSessions} total)</span>
            </p>
            {showAll && totalSessions > SESSION_PREVIEW_COUNT && (
              <Link href={`/dashboard/students/${id}`} className="text-xs text-gray-400 hover:text-gray-600 transition">
                Show recent only
              </Link>
            )}
          </div>

          {student.sessions.length > 0 ? (
            <div className="space-y-2">
              {student.sessions.map((s) => {
                const msgs = s.messages as { role: string; content: string }[];
                return (
                  <details key={s.id} className="border border-gray-100 rounded-xl overflow-hidden">
                    <summary className="px-4 py-3 cursor-pointer text-sm text-gray-600 hover:bg-gray-50 transition list-none flex items-center justify-between">
                      <span>Week {s.week} · {new Date(s.createdAt).toLocaleDateString()}</span>
                      <span className="text-xs text-gray-400">{msgs.length} messages</span>
                    </summary>
                    <div className="px-4 pb-4 space-y-1.5 bg-gray-50/50">
                      {msgs.map((m, i) => (
                        <div
                          key={i}
                          className={`text-xs px-3 py-2 rounded-lg leading-relaxed ${
                            m.role === "user"
                              ? "bg-green-50 border border-green-100 text-green-900"
                              : "bg-white border border-gray-100 text-gray-600"
                          }`}
                        >
                          <span className="font-semibold mr-1.5">
                            {m.role === "user" ? student.name : "Mshauri"}:
                          </span>
                          {m.content}
                        </div>
                      ))}
                    </div>
                  </details>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No sessions yet.</p>
          )}

          {hasMore && (
            <div className="mt-4 text-center">
              <Link
                href={`/dashboard/students/${id}?sessions=all`}
                className="text-sm text-foundry-green hover:underline"
              >
                Show all {totalSessions} sessions
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
