import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashShell from "@/components/DashShell";
import Link from "next/link";
import AcceptRejectButtons from "./AcceptRejectButtons";

const PAGE_CSS = `
  .topbar { display: flex; align-items: center; justify-content: space-between; padding: 22px 36px; background: #fff; border-bottom: 1px solid var(--line-lt); position: sticky; top: 0; z-index: 10; }
  .topbar h1 { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 24px; letter-spacing: -0.015em; }
  .topbar .sub { font-family: "Space Mono"; font-size: 12px; color: var(--muted-lt); margin-top: 3px; }
  .topbar .back { font-family: "Space Mono"; font-size: 12px; color: var(--muted-lt); text-decoration: none; }
  .topbar .back:hover { color: var(--ink); }
  .topbar .pills { display: flex; align-items: center; gap: 10px; }
  .pill { font-family: "Space Mono"; font-size: 11px; font-weight: 700; padding: 5px 11px; border-radius: 999px; color: var(--cream); }
  .pill.dev { background: var(--clay); color: #1a0d06; }
  .pill.pro { background: var(--forest); }
  .pill.run { background: var(--plum); }
  .pill.assessed { background: var(--forest); }
  .pill.accepted { background: var(--forest); }
  .pill.rejected { background: var(--clay-deep); }
  .pill.pending { background: var(--ink-2); color: var(--muted-dk); }

  .content { padding: 28px 36px 48px; max-width: 900px; display: flex; flex-direction: column; gap: 20px; }

  .panel { background: #fff; border: 1px solid var(--line-lt); border-radius: 18px; overflow: hidden; }
  .panel .p-head { padding: 20px 26px; border-bottom: 1px solid var(--line-lt); }
  .panel .p-head h2 { font-family: "Bricolage Grotesque"; font-weight: 700; font-size: 17px; }
  .panel .p-head .ph { font-family: "Space Mono"; font-size: 11px; color: var(--muted-lt); margin-top: 3px; }
  .panel .p-body { padding: 22px 26px; }

  .scores { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .sc { background: var(--cream-2); border-radius: 14px; padding: 18px 20px; }
  .sc .s-lbl { font-family: "Space Mono"; font-size: 10.5px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted-lt); }
  .sc .s-n { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 36px; letter-spacing: -0.02em; margin-top: 10px; line-height: 1; }
  .sc .s-bar { height: 6px; border-radius: 999px; background: var(--line-lt); overflow: hidden; margin-top: 12px; }
  .sc .s-bar span { display: block; height: 100%; border-radius: 999px; background: linear-gradient(90deg, var(--marigold), var(--clay)); }

  .signals { display: flex; flex-direction: column; gap: 2px; }
  .sig-row { display: flex; align-items: center; gap: 14px; padding: 10px 0; border-bottom: 1px solid var(--line-lt); }
  .sig-row:last-child { border-bottom: none; }
  .sig-row .s-nm { font-size: 14px; color: var(--ink); width: 180px; flex-shrink: 0; }
  .sig-pips { display: flex; gap: 5px; }
  .pip { width: 22px; height: 7px; border-radius: 3px; background: var(--line-lt); }
  .pip.on { background: var(--forest); }
  .sig-row .s-val { font-family: "Space Mono"; font-size: 12px; color: var(--muted-lt); }

  .msh-box { background: var(--ink-2); border-radius: 14px; padding: 20px 22px; }
  .msh-box .av { width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(150deg, var(--marigold), var(--clay)); display: grid; place-items: center; font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 16px; color: #1a0d06; flex-shrink: 0; }
  .msh-box .header { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
  .msh-box .who { font-family: "Space Mono"; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted-dk); }
  .msh-box p { font-size: 15px; line-height: 1.62; color: var(--cream); }

  .transcript { display: flex; flex-direction: column; gap: 12px; max-height: 480px; overflow-y: auto; }
  .tx-msg { font-size: 14px; line-height: 1.58; padding: 12px 16px; border-radius: 12px; }
  .tx-msg.user { background: var(--cream-2); border: 1px solid var(--line-lt); }
  .tx-msg.bot { background: var(--ink-2); color: var(--cream); }
  .tx-msg .tx-who { font-family: "Space Mono"; font-size: 10.5px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted-lt); margin-bottom: 5px; }
  .tx-msg.bot .tx-who { color: var(--muted-dk); }
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

const SIGNAL_LABELS: Record<string, string> = {
  signal_coding_experience: "Coding experience",
  signal_terminal: "Terminal familiarity",
  signal_git: "Git awareness",
  signal_code_reading: "Code reading",
  signal_business_process: "Business process",
  signal_workflow_tools: "Workflow & tools",
  signal_motivation: "Motivation quality",
  signal_self_awareness: "Self-awareness",
};

export default async function ApplicantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const applicant = await prisma.applicant.findUnique({ where: { id } });
  if (!applicant) notFound();

  const messages = applicant.messages as { role: string; content: string }[];
  const scores = applicant.scores as Record<string, number | string> | null;
  const signals = scores ? Object.entries(scores).filter(([k]) => k.startsWith("signal_")) : [];

  const statusPill = applicant.status.toLowerCase();

  return (
    <DashShell activePage="applicants">
      <style>{PAGE_CSS}</style>
      <div className="topbar">
        <div>
          <Link href="/dashboard/applicants" className="back">← Applicants</Link>
          <h1 style={{ marginTop: 6 }}>{applicant.name}</h1>
        </div>
        <div className="pills">
          {applicant.recommendation && (
            <span className={`pill ${REC_PILL[applicant.recommendation] ?? "pending"}`}>
              {REC_LABEL[applicant.recommendation] ?? applicant.recommendation}
            </span>
          )}
          <span className={`pill ${statusPill}`}>{applicant.status}</span>
        </div>
      </div>

      <div className="content">
        {/* Scores */}
        <div className="panel">
          <div className="p-head">
            <h2>Assessment scores</h2>
            <div className="ph">Internal facilitator view — not shown to applicants</div>
          </div>
          <div className="p-body">
            <div className="scores">
              {[
                { label: "Developer", value: applicant.developerScore, max: 13 },
                { label: "Professional", value: applicant.professionalScore, max: 8 },
                { label: "Runway readiness", value: applicant.prepScore, max: 6 },
              ].map(({ label, value, max }) => {
                const pct = value != null && max > 0 ? Math.min((value / max) * 100, 100) : 0;
                return (
                  <div key={label} className="sc">
                    <div className="s-lbl">{label}</div>
                    <div className="s-n">{value ?? "—"}</div>
                    <div className="s-bar"><span style={{ width: `${pct}%` }} /></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Signal breakdown */}
        {signals.length > 0 && (
          <div className="panel">
            <div className="p-head"><h2>Signal breakdown</h2></div>
            <div className="p-body">
              <div className="signals">
                {signals.map(([k, v]) => {
                  const score = Number(v);
                  const label = SIGNAL_LABELS[k] ?? k.replace("signal_", "").replace(/_/g, " ");
                  return (
                    <div key={k} className="sig-row">
                      <span className="s-nm">{label}</span>
                      <div className="sig-pips">
                        {[0, 1, 2].map((n) => (
                          <div key={n} className={`pip${score > n ? " on" : ""}`} />
                        ))}
                      </div>
                      <span className="s-val">{score}/2</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Mshauri's assessment */}
        {applicant.reasoning && (
          <div className="panel">
            <div className="p-head"><h2>Mshauri&apos;s assessment</h2></div>
            <div className="p-body">
              <div className="msh-box">
                <div className="header">
                  <div className="av">M</div>
                  <div className="who">Mshauri · scoring engine</div>
                </div>
                <p>{applicant.reasoning}</p>
              </div>
            </div>
          </div>
        )}

        {/* Decision */}
        <div className="panel">
          <div className="p-head"><h2>Decision</h2></div>
          <div className="p-body">
            <AcceptRejectButtons applicantId={id} currentStatus={applicant.status} />
          </div>
        </div>

        {/* Transcript */}
        <div className="panel">
          <div className="p-head">
            <h2>Conversation transcript</h2>
            <div className="ph">{messages.length} messages</div>
          </div>
          <div className="p-body">
            <div className="transcript">
              {messages.map((m, i) => (
                <div key={i} className={`tx-msg ${m.role === "user" ? "user" : "bot"}`}>
                  <div className="tx-who">{m.role === "user" ? applicant.name : "Mshauri"}</div>
                  {m.content}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashShell>
  );
}
