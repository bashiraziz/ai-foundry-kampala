import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashShell from "@/components/DashShell";
import Link from "next/link";

const PAGE_SIZE = 50;

const PAGE_CSS = `
  .topbar { display: flex; align-items: center; justify-content: space-between; padding: 22px 36px; background: #fff; border-bottom: 1px solid var(--line-lt); position: sticky; top: 0; z-index: 10; }
  .topbar h1 { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 24px; letter-spacing: -0.015em; }
  .topbar .sub { font-family: "Space Mono"; font-size: 12px; color: var(--muted-lt); margin-top: 3px; }
  .topbar .actions { display: flex; align-items: center; gap: 12px; }
  .search-form { display: flex; align-items: center; gap: 9px; background: var(--cream); border: 1px solid var(--line-lt); border-radius: 10px; padding: 0; overflow: hidden; }
  .search-form input { background: transparent; border: none; outline: none; font-family: "Archivo"; font-size: 13.5px; color: var(--ink); padding: 9px 14px; width: 220px; }
  .search-form input::placeholder { color: var(--muted-lt); }
  .search-form button { background: var(--ink); color: var(--cream); border: none; padding: 9px 16px; font-family: "Archivo"; font-weight: 600; font-size: 13px; cursor: pointer; }
  .search-form .clear { background: transparent; color: var(--muted-lt); border: none; padding: 9px 14px; font-family: "Space Mono"; font-size: 12px; cursor: pointer; }
  .search-form .clear:hover { color: var(--ink); }

  .content { padding: 28px 36px 48px; }
  .stats { display: grid; grid-template-columns: repeat(6, 1fr); gap: 14px; margin-bottom: 24px; }
  .scard { background: #fff; border: 1px solid var(--line-lt); border-radius: 14px; padding: 18px 20px; }
  .scard .lbl { font-family: "Space Mono"; font-size: 10px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted-lt); }
  .scard .n { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 32px; letter-spacing: -0.02em; margin-top: 10px; line-height: 1; }

  .panel { background: #fff; border: 1px solid var(--line-lt); border-radius: 18px; overflow: hidden; }
  .panel .p-head { display: flex; align-items: center; justify-content: space-between; padding: 18px 24px; border-bottom: 1px solid var(--line-lt); }
  .panel .p-head h2 { font-family: "Bricolage Grotesque"; font-weight: 700; font-size: 17px; }

  .app-row { display: grid; grid-template-columns: 1.8fr 1.2fr 1fr 1fr auto; gap: 16px; align-items: center; padding: 15px 24px; border-bottom: 1px solid var(--line-lt); }
  .app-row:last-child { border-bottom: none; }
  .app-who { display: flex; align-items: center; gap: 12px; }
  .app-who .av { width: 36px; height: 36px; border-radius: 9px; flex: none; display: grid; place-items: center; font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 13px; color: #1a0d06; background: linear-gradient(150deg, var(--marigold), var(--clay)); }
  .app-who .nm { font-weight: 600; font-size: 14.5px; }
  .app-who .meta { font-family: "Space Mono"; font-size: 11px; color: var(--muted-lt); margin-top: 2px; }
  .pill { font-family: "Space Mono"; font-size: 11px; font-weight: 700; padding: 5px 11px; border-radius: 999px; color: var(--cream); }
  .pill.dev { background: var(--clay); color: #1a0d06; }
  .pill.pro { background: var(--forest); }
  .pill.run { background: var(--plum); }
  .pill.pend { background: var(--ink-2); color: var(--muted-dk); }
  .status-tag { font-family: "Space Mono"; font-size: 11px; color: var(--muted-lt); }
  .act { display: flex; gap: 8px; }
  .mini { font-family: "Archivo"; font-weight: 600; font-size: 12.5px; padding: 8px 14px; border-radius: 8px; border: 1px solid var(--line-lt); background: #fff; cursor: pointer; color: var(--ink); text-decoration: none; transition: all .15s; }
  .mini:hover { border-color: var(--ink); }
  .mini.go { background: var(--ink); color: var(--cream); border-color: var(--ink); }
  .mini.go:hover { background: var(--ink-2); }

  .empty { padding: 56px 24px; text-align: center; font-family: "Space Mono"; font-size: 13px; color: var(--muted-lt); }

  .pagination { display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; border-top: 1px solid var(--line-lt); font-family: "Space Mono"; font-size: 12px; color: var(--muted-lt); }
  .page-btns { display: flex; gap: 8px; }
  .page-btn { font-family: "Archivo"; font-weight: 600; font-size: 13px; padding: 8px 16px; border-radius: 8px; border: 1px solid var(--line-lt); background: #fff; color: var(--ink); text-decoration: none; }
  .page-btn:hover { border-color: var(--ink); }

  .tbl-header { display: grid; grid-template-columns: 1.8fr 1.2fr 1fr 1fr auto; gap: 16px; padding: 12px 24px; border-bottom: 1px solid var(--line-lt); }
  .tbl-header span { font-family: "Space Mono"; font-size: 10.5px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted-lt); }

  @media (max-width: 1040px) { .stats { grid-template-columns: repeat(3, 1fr); } }
`;

const REC_PILL: Record<string, string> = {
  DEVELOPER: "dev",
  PROFESSIONAL: "pro",
  PREP: "run",
  NOT_READY: "run",
};

const REC_LABEL: Record<string, string> = {
  DEVELOPER: "Developer",
  PROFESSIONAL: "Professional",
  PREP: "Runway",
  NOT_READY: "Runway",
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

  const initials = (name: string) =>
    name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");

  return (
    <DashShell activePage="applicants">
      <style>{PAGE_CSS}</style>
      <div className="topbar">
        <div>
          <h1>Applications</h1>
          <div className="sub">{total} total · {pending} pending review</div>
        </div>
        <div className="actions">
          <form method="get" action="/dashboard/applicants" className="search-form">
            <input name="q" type="search" defaultValue={search} placeholder="⌕  Search by name…" />
            <button type="submit">Search</button>
            {search && <Link href="/dashboard/applicants" className="clear">Clear</Link>}
          </form>
        </div>
      </div>

      <div className="content">
        <div className="stats">
          {[
            { label: "Total", value: total },
            { label: "Pending", value: pending },
            { label: "Developer", value: developer },
            { label: "Professional", value: professional },
            { label: "Runway", value: prep },
            { label: "Not ready", value: notReady },
          ].map(({ label, value }) => (
            <div key={label} className="scard">
              <div className="lbl">{label}</div>
              <div className="n">{value}</div>
            </div>
          ))}
        </div>

        <div className="panel">
          <div className="p-head">
            <h2>{search ? `Results for "${search}"` : "All applicants"}</h2>
            <span style={{ fontFamily: '"Space Mono"', fontSize: 12, color: "var(--muted-lt)" }}>
              {filteredTotal} applicant{filteredTotal !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="tbl-header">
            <span>Applicant</span>
            <span>Recommendation</span>
            <span>Status</span>
            <span>Date</span>
            <span />
          </div>

          {applicants.length === 0 ? (
            <div className="empty">
              {search ? `No applicants matching "${search}"` : "No applicants yet."}
            </div>
          ) : (
            applicants.map((a) => (
              <div key={a.id} className="app-row">
                <div className="app-who">
                  <span className="av">{initials(a.name)}</span>
                  <div>
                    <div className="nm">{a.name}</div>
                    <div className="meta">{new Date(a.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}{a.email ? ` · ${a.email}` : ""}</div>
                  </div>
                </div>
                <div>
                  {a.recommendation ? (
                    <span className={`pill ${REC_PILL[a.recommendation] ?? "pend"}`}>
                      {REC_LABEL[a.recommendation] ?? a.recommendation}
                    </span>
                  ) : (
                    <span className="pill pend">Pending</span>
                  )}
                </div>
                <div className="status-tag">{a.status}</div>
                <div className="status-tag">{new Date(a.createdAt).toLocaleDateString()}</div>
                <div className="act">
                  <Link href={`/dashboard/applicants/${a.id}`} className="mini go">Review →</Link>
                </div>
              </div>
            ))
          )}

          {totalPages > 1 && (
            <div className="pagination">
              <span>
                Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filteredTotal)} of {filteredTotal}
              </span>
              <div className="page-btns">
                {page > 0 && <Link href={pageUrl(page - 1)} className="page-btn">← Prev</Link>}
                {page < totalPages - 1 && <Link href={pageUrl(page + 1)} className="page-btn">Next →</Link>}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashShell>
  );
}
