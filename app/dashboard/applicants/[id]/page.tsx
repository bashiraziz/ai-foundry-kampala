import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AcceptRejectButtons from "./AcceptRejectButtons";

const BADGE: Record<string, string> = {
  DEVELOPER: "bg-green-100 text-green-700",
  PROFESSIONAL: "bg-purple-100 text-purple-700",
  PREP: "bg-amber-100 text-amber-700",
  NOT_READY: "bg-gray-100 text-gray-500",
};

export default async function ApplicantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const applicant = await prisma.applicant.findUnique({ where: { id } });
  if (!applicant) notFound();

  const messages = applicant.messages as { role: string; content: string }[];
  const scores = applicant.scores as Record<string, number | string> | null;

  return (
    <div className="min-h-screen bg-[#f7f6f2] p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/applicants" className="text-sm text-gray-400 hover:text-gray-600">← Applicants</Link>
          <h1 className="text-xl font-bold text-gray-800">{applicant.name}</h1>
          {applicant.recommendation && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${BADGE[applicant.recommendation]}`}>
              {applicant.recommendation}
            </span>
          )}
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-2xl font-bold text-green-600">{applicant.developerScore ?? "—"}</p>
            <p className="text-xs text-gray-400 mt-1">Developer score</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-2xl font-bold text-purple-600">{applicant.professionalScore ?? "—"}</p>
            <p className="text-xs text-gray-400 mt-1">Professional score</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-2xl font-bold text-amber-500">{applicant.prepScore ?? "—"}</p>
            <p className="text-xs text-gray-400 mt-1">Prep score</p>
          </div>
        </div>
        {scores && (
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <p className="font-semibold text-gray-700 text-sm mb-3">Signal breakdown</p>
            <table className="w-full text-sm">
              <tbody>
                {Object.entries(scores).filter(([k]) => k.startsWith("signal_")).map(([k, v]) => (
                  <tr key={k} className="border-b border-gray-50">
                    <td className="py-1.5 text-gray-500">{k.replace("signal_", "").replace(/_/g, " ")}</td>
                    <td className="py-1.5 text-right font-medium">{String(v)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {applicant.reasoning && (
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <p className="font-semibold text-gray-700 text-sm mb-2">KampalaClaw&apos;s assessment</p>
            <p className="text-sm text-gray-600 leading-relaxed">{applicant.reasoning}</p>
          </div>
        )}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <p className="font-semibold text-gray-700 text-sm mb-3">Conversation transcript</p>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {messages.map((m, i) => (
              <div key={i} className={`text-xs p-2 rounded-lg ${m.role === "user" ? "bg-blue-50 text-blue-800" : "bg-gray-50 text-gray-600"}`}>
                <span className="font-medium">{m.role === "user" ? applicant.name : "KampalaClaw"}: </span>
                {m.content}
              </div>
            ))}
          </div>
        </div>
        <AcceptRejectButtons applicantId={id} currentStatus={applicant.status} />
      </div>
    </div>
  );
}
