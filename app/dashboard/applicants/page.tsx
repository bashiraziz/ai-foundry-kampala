import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

const PAGE_SIZE = 50;

const BADGE: Record<string, string> = {
  DEVELOPER: "bg-green-100 text-green-700",
  PROFESSIONAL: "bg-purple-100 text-purple-700",
  PREP: "bg-amber-100 text-amber-700",
  NOT_READY: "bg-gray-100 text-gray-500",
};

export default async function ApplicantsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const { q = "", page: pageStr = "0" } = await searchParams;
  const page = Math.max(0, parseInt(pageStr) || 0);
  const search = q.trim();

  const where = search ? { name: { contains: search, mode: "insensitive" as const } } : undefined;

  const [applicants, filteredTotal, counts] = await Promise.all([
    prisma.applicant.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip: page * PAGE_SIZE,
    }),
    prisma.applicant.count({ where }),
    Promise.all([
      prisma.applicant.count(),
      prisma.applicant.count({ where: { status: "PENDING" } }),
      prisma.applicant.count({ where: { recommendation: "DEVELOPER" } }),
      prisma.applicant.count({ where: { recommendation: "PROFESSIONAL" } }),
      prisma.applicant.count({ where: { recommendation: "PREP" } }),
      prisma.applicant.count({ where: { recommendation: "NOT_READY" } }),
    ]),
  ]);

  const [total, pending, developer, professional, prep, notReady] = counts;
  const totalPages = Math.ceil(filteredTotal / PAGE_SIZE);

  const pageUrl = (p: number) => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (p > 0) params.set("page", String(p));
    const qs = params.toString();
    return `/dashboard/applicants${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="min-h-screen bg-bone-white p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-sm text-gray-400 hover:text-gray-600">← Dashboard</Link>
            <h1 className="text-xl font-bold text-gray-800">Applicants</h1>
          </div>
        </div>

        {/* Summary counts — always reflect the full dataset, not the filtered view */}
        <div className="grid grid-cols-6 gap-3 text-center">
          {[
            { label: "Total", value: total },
            { label: "Pending", value: pending },
            { label: "Developer", value: developer },
            { label: "Professional", value: professional },
            { label: "Runway", value: prep },
            { label: "Not ready", value: notReady },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-xl p-3 shadow-sm">
              <p className="text-2xl font-bold text-gray-800">{value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <form method="get" action="/dashboard/applicants" className="flex gap-2">
          <input
            name="q"
            type="search"
            defaultValue={search}
            placeholder="Search by name…"
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-foundry-green bg-white"
          />
          <button
            type="submit"
            className="bg-foundry-green text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-foundry-green-light transition"
          >
            Search
          </button>
          {search && (
            <Link
              href="/dashboard/applicants"
              className="px-4 py-2 rounded-xl text-sm text-gray-500 hover:text-gray-700 border border-gray-200 bg-white"
            >
              Clear
            </Link>
          )}
        </form>

        {/* Table */}
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
                    <Link href={`/dashboard/applicants/${a.id}`} className="text-xs text-foundry-green hover:underline">
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
              {applicants.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400 text-sm">
                    {search ? `No applicants matching "${search}"` : "No applicants yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-sm">
              <p className="text-gray-400">
                Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filteredTotal)} of {filteredTotal}
              </p>
              <div className="flex gap-2">
                {page > 0 && (
                  <Link href={pageUrl(page - 1)} className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
                    ← Prev
                  </Link>
                )}
                {page < totalPages - 1 && (
                  <Link href={pageUrl(page + 1)} className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
                    Next →
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
