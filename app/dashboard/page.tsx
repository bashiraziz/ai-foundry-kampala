import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ProgressGrid from "@/components/ProgressGrid";
import Link from "next/link";

export const revalidate = 300;

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const students = await prisma.student.findMany({
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

  return (
    <div className="min-h-screen bg-bone-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/brand/lockup-horizontal.svg" alt="The AI Foundry Kampala" className="h-10" />
          </div>
          <div className="flex gap-4">
            <Link href="/dashboard/applicants" className="text-sm text-stone-grey hover:text-forge-night">Applicants</Link>
            <Link href="/dashboard/prep" className="text-sm text-stone-grey hover:text-forge-night">Runway</Link>
            <Link href="/start" className="text-sm text-foundry-green hover:underline">Student tutor →</Link>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <p className="text-3xl font-bold text-foundry-green">{formatted.length}</p>
            <p className="text-sm text-gray-500 mt-1">Active students</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <p className="text-3xl font-bold text-foundry-green">{Math.round(avgScore)}%</p>
            <p className="text-sm text-gray-500 mt-1">Avg quiz score</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <p className="text-3xl font-bold text-foundry-green">
              {formatted.reduce((a: number, s) => a + s.sessionCount, 0)}
            </p>
            <p className="text-sm text-gray-500 mt-1">Total sessions</p>
          </div>
        </div>
        <ProgressGrid students={formatted} />
      </div>
    </div>
  );
}
