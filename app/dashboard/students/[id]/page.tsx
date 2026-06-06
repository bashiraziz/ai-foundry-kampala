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

  return (
    <div className="min-h-screen bg-bone-white p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-gray-600">← Dashboard</Link>
          <h1 className="text-xl font-bold text-gray-800">{student.name}</h1>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${student.track === "DEVELOPER" ? "bg-green-100 text-green-700" : "bg-purple-100 text-purple-700"}`}>
            {student.track}
          </span>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-600 mb-2">Quiz history</h2>
          <div className="space-y-2">
            {student.quizzes.map((q) => (
              <div key={q.id} className="bg-white rounded-xl p-4 shadow-sm text-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-500">Week {q.week} · {new Date(q.createdAt).toLocaleDateString()}</span>
                  <span className="font-bold text-foundry-green">{q.score}%</span>
                </div>
              </div>
            ))}
            {student.quizzes.length === 0 && <p className="text-gray-400 text-sm">No quizzes yet.</p>}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-gray-600">
              Session history
              <span className="ml-2 text-gray-400 font-normal">({totalSessions} total)</span>
            </h2>
            {showAll && totalSessions > SESSION_PREVIEW_COUNT && (
              <Link
                href={`/dashboard/students/${id}`}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                Show recent only
              </Link>
            )}
          </div>
          <div className="space-y-2">
            {student.sessions.map((s) => {
              const msgs = s.messages as { role: string; content: string }[];
              return (
                <details key={s.id} className="bg-white rounded-xl shadow-sm">
                  <summary className="p-4 cursor-pointer text-sm text-gray-600">
                    Week {s.week} · {new Date(s.createdAt).toLocaleDateString()} · {msgs.length} messages
                  </summary>
                  <div className="px-4 pb-4 space-y-2">
                    {msgs.map((m, i) => (
                      <div key={i} className={`text-xs p-2 rounded-lg ${m.role === "user" ? "bg-green-50 text-green-800" : "bg-gray-50 text-gray-600"}`}>
                        <span className="font-medium">{m.role === "user" ? student.name : "Mshauri"}: </span>
                        {m.content}
                      </div>
                    ))}
                  </div>
                </details>
              );
            })}
            {student.sessions.length === 0 && <p className="text-gray-400 text-sm">No sessions yet.</p>}
          </div>

          {hasMore && (
            <div className="mt-3 text-center">
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
