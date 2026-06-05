import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const revalidate = 60;

const BADGE: Record<string, string> = {
  DEVELOPER: "bg-green-100 text-green-700",
  PROFESSIONAL: "bg-purple-100 text-purple-700",
  PREP: "bg-amber-100 text-amber-700",
  NOT_READY: "bg-gray-100 text-gray-500",
};

export default async function ApplicantsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const applicants = await prisma.applicant.findMany({
    orderBy: { createdAt: "desc" },
  });

  const counts = {
    all: applicants.length,
    PENDING: applicants.filter((a) => a.status === "PENDING").length,
    DEVELOPER: applicants.filter((a) => a.recommendation === "DEVELOPER").length,
    PROFESSIONAL: applicants.filter((a) => a.recommendation === "PROFESSIONAL").length,
    PREP: applicants.filter((a) => a.recommendation === "PREP").length,
    NOT_READY: applicants.filter((a) => a.recommendation === "NOT_READY").length,
  };

  return (
    <div className="min-h-screen bg-[#f7f6f2] p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-sm text-gray-400 hover:text-gray-600">← Dashboard</Link>
            <h1 className="text-xl font-bold text-gray-800">Applicants</h1>
          </div>
        </div>
        <div className="grid grid-cols-6 gap-3 text-center">
          {Object.entries(counts).map(([k, v]) => (
            <div key={k} className="bg-white rounded-xl p-3 shadow-sm">
              <p className="text-2xl font-bold text-gray-800">{v}</p>
              <p className="text-xs text-gray-400 mt-0.5">{k === "all" ? "Total" : k.charAt(0) + k.slice(1).toLowerCase()}</p>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Name</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Recommendation</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Dev / Pro / Prep</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Date</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map((a) => (
                <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{a.name}</td>
                  <td className="px-4 py-3">
                    {a.recommendation ? (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${BADGE[a.recommendation]}`}>
                        {a.recommendation}
                      </span>
                    ) : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {a.developerScore ?? "—"} / {a.professionalScore ?? "—"} / {a.prepScore ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{a.status}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{new Date(a.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <Link href={`/dashboard/applicants/${a.id}`} className="text-xs text-[#1a7f4b] hover:underline">
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
