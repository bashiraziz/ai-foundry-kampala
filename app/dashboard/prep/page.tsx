import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const revalidate = 60;

export default async function PrepDashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const enrollments = await prisma.prepEnrollment.findMany({
    include: { applicant: true },
    orderBy: { createdAt: "desc" },
  });

  const STATUS_BADGE: Record<string, string> = {
    ACTIVE: "bg-blue-100 text-blue-700",
    READY_FOR_EXIT: "bg-amber-100 text-amber-700",
    GRADUATED: "bg-green-100 text-green-700",
    DEFERRED: "bg-gray-100 text-gray-400",
  };

  return (
    <div className="min-h-screen bg-[#f7f6f2] p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-gray-600">← Dashboard</Link>
          <h1 className="text-xl font-bold text-gray-800">Runway Students</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {enrollments.map((e) => {
            const progress = e.moduleProgress as Record<string, string>;
            const completedModules = Object.values(progress).filter((v) => v === "COMPLETE").length;
            const daysSince = Math.floor((Date.now() - new Date(e.createdAt).getTime()) / (1000 * 60 * 60 * 24));
            return (
              <Link
                key={e.id}
                href={`/dashboard/prep/${e.id}`}
                className="block bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-800">{e.applicant.name}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[e.status]}`}>
                    {e.status.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4].map((m) => (
                    <div key={m} className={`flex-1 h-2 rounded-full ${progress[String(m)] === "COMPLETE" ? "bg-green-400" : progress[String(m)] === "IN_PROGRESS" ? "bg-amber-300" : "bg-gray-100"}`} />
                  ))}
                </div>
                <div className="flex gap-4 text-xs text-gray-400">
                  <span>Module {e.currentModule} of 4</span>
                  <span>{completedModules} complete</span>
                  <span>{daysSince}d enrolled</span>
                  {e.miniProjectScore !== null && <span>Project: {e.miniProjectScore}%</span>}
                </div>
              </Link>
            );
          })}
          {enrollments.length === 0 && <p className="text-gray-400 text-sm col-span-2">No Runway students yet.</p>}
        </div>
      </div>
    </div>
  );
}
