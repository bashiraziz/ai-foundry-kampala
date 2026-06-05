import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

const MODULE_TITLES: Record<number, string> = {
  1: "The Terminal",
  2: "Git",
  3: "Python Basics",
  4: "The Mini-Project",
};

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

  return (
    <div className="min-h-screen bg-bone-white p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/prep" className="text-sm text-gray-400 hover:text-gray-600">← Runway</Link>
          <h1 className="text-xl font-bold text-gray-800">{enrollment.applicant.name}</h1>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
          <p className="font-semibold text-gray-700 text-sm">Module progress</p>
          {[1, 2, 3, 4].map((m) => {
            const status = progress[String(m)] ?? "PENDING";
            return (
              <div key={m} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Module {m}: {MODULE_TITLES[m]}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  status === "COMPLETE" ? "bg-green-100 text-green-700" :
                  status === "IN_PROGRESS" ? "bg-amber-100 text-amber-700" :
                  "bg-gray-100 text-gray-400"
                }`}>{status}</span>
              </div>
            );
          })}
        </div>
        {enrollment.miniProjectUrl && (
          <div className="bg-white rounded-2xl shadow-sm p-4 space-y-2">
            <p className="font-semibold text-gray-700 text-sm">Mini-project</p>
            <a href={enrollment.miniProjectUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-foundry-green hover:underline break-all">
              {enrollment.miniProjectUrl}
            </a>
            {enrollment.miniProjectScore !== null && (
              <p className="text-sm text-gray-500">Score: <span className="font-bold">{enrollment.miniProjectScore}%</span></p>
            )}
            {enrollment.miniProjectFeedback && (
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">{enrollment.miniProjectFeedback}</p>
            )}
          </div>
        )}
        <div className="bg-white rounded-2xl shadow-sm p-4 text-sm text-gray-600 space-y-1">
          <p><span className="font-medium">Status:</span> {enrollment.status}</p>
          <p><span className="font-medium">Enrolled:</span> {new Date(enrollment.createdAt).toLocaleDateString()}</p>
          {enrollment.exitAssessmentId && (
            <p><span className="font-medium">Exit assessment:</span> <Link href={`/dashboard/applicants/${enrollment.exitAssessmentId}`} className="text-foundry-green hover:underline">View →</Link></p>
          )}
        </div>
      </div>
    </div>
  );
}
