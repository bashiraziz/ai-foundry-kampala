import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const revalidate = 60;

const STATUS_BADGE: Record<string, string> = {
  ACTIVE:          "bg-blue-50 text-blue-600",
  READY_FOR_EXIT:  "bg-amber-100 text-amber-700",
  GRADUATED:       "bg-green-100 text-green-700",
  DEFERRED:        "bg-gray-100 text-gray-400",
};

const STATUS_LABEL: Record<string, string> = {
  ACTIVE:          "Active",
  READY_FOR_EXIT:  "Ready for exit",
  GRADUATED:       "Graduated",
  DEFERRED:        "Deferred",
};

export default async function PrepDashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const enrollments = await prisma.prepEnrollment.findMany({
    include: { applicant: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-bone-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-gray-600 transition">← Dashboard</Link>
          <h1 className="text-xl font-bold text-forge-night">Runway students</h1>
          <span className="text-sm text-gray-400 font-normal">{enrollments.length} enrolled</span>
        </div>

        {enrollments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <p className="text-sm text-gray-400">No Runway students yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enrollments.map((e) => {
              const progress = e.moduleProgress as Record<string, string>;
              const completedModules = Object.values(progress).filter((v) => v === "COMPLETE").length;
              const daysSince = Math.floor((Date.now() - new Date(e.createdAt).getTime()) / (1000 * 60 * 60 * 24));

              return (
                <Link
                  key={e.id}
                  href={`/dashboard/runway/${e.id}`}
                  className="block bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:border-gray-200 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-800">{e.applicant.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{daysSince}d enrolled</p>
                    </div>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium flex-shrink-0 ${STATUS_BADGE[e.status]}`}>
                      {STATUS_LABEL[e.status] ?? e.status}
                    </span>
                  </div>

                  {/* Module progress bars */}
                  <div className="flex gap-1.5 mb-3">
                    {[1, 2, 3, 4].map((m) => (
                      <div
                        key={m}
                        className={`flex-1 h-2 rounded-full ${
                          progress[String(m)] === "COMPLETE"
                            ? "bg-foundry-green"
                            : progress[String(m)] === "IN_PROGRESS"
                            ? "bg-amber-300"
                            : "bg-gray-100"
                        }`}
                        title={`Module ${m}: ${progress[String(m)] ?? "not started"}`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{completedModules}/4 modules complete</span>
                    {e.miniProjectScore !== null && (
                      <span className="font-medium text-foundry-green">Project: {e.miniProjectScore}%</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
