import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AcceptRejectButtons from "./AcceptRejectButtons";

const REC_BADGE: Record<string, string> = {
  DEVELOPER:    "bg-green-100 text-green-700",
  PROFESSIONAL: "bg-amber-100 text-amber-700",
  PREP:         "bg-amber-100 text-amber-700",
  NOT_READY:    "bg-gray-100 text-gray-500",
};

const STATUS_BADGE: Record<string, string> = {
  PENDING:   "bg-gray-100 text-gray-500",
  ASSESSED:  "bg-blue-50 text-blue-600",
  ACCEPTED:  "bg-green-100 text-green-700",
  REJECTED:  "bg-red-50 text-red-600",
};

const SIGNAL_LABELS: Record<string, string> = {
  signal_coding_experience: "Coding experience",
  signal_terminal:          "Terminal familiarity",
  signal_git:               "Git awareness",
  signal_code_reading:      "Code reading",
  signal_business_process:  "Business process",
  signal_workflow_tools:    "Workflow & tools",
  signal_motivation:        "Motivation quality",
  signal_self_awareness:    "Self-awareness",
};

export default async function ApplicantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const applicant = await prisma.applicant.findUnique({ where: { id } });
  if (!applicant) notFound();

  const messages = applicant.messages as { role: string; content: string }[];
  const scores = applicant.scores as Record<string, number | string> | null;
  const signals = scores
    ? Object.entries(scores).filter(([k]) => k.startsWith("signal_"))
    : [];

  return (
    <div className="min-h-screen bg-bone-white p-6">
      <div className="max-w-3xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-center gap-3 flex-wrap">
          <Link href="/dashboard/applicants" className="text-sm text-gray-400 hover:text-gray-600 transition">← Applicants</Link>
          <h1 className="text-xl font-bold text-forge-night">{applicant.name}</h1>
          <div className="flex items-center gap-2">
            {applicant.recommendation && (
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${REC_BADGE[applicant.recommendation]}`}>
                {applicant.recommendation === "NOT_READY" ? "Not ready" : applicant.recommendation}
              </span>
            )}
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${STATUS_BADGE[applicant.status]}`}>
              {applicant.status}
            </span>
          </div>
        </div>

        {/* Score cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Developer", value: applicant.developerScore, max: 13, color: "text-foundry-green", bar: "bg-foundry-green" },
            { label: "Professional", value: applicant.professionalScore, max: 8, color: "text-amber-600", bar: "bg-amber-400" },
            { label: "Runway readiness", value: applicant.prepScore, max: 6, color: "text-gray-600", bar: "bg-gray-300" },
          ].map(({ label, value, max, color, bar }) => {
            const pct = value != null && max > 0 ? Math.min((value / max) * 100, 100) : 0;
            return (
              <div key={label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-2">
                <p className={`text-2xl font-bold ${color}`}>{value ?? "—"}</p>
                <p className="text-xs text-gray-400">{label}</p>
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${bar} rounded-full`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Signal breakdown */}
        {signals.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <p className="font-semibold text-gray-700 text-sm mb-4">Signal breakdown</p>
            <div className="space-y-2.5">
              {signals.map(([k, v]) => {
                const score = Number(v);
                const label = SIGNAL_LABELS[k] ?? k.replace("signal_", "").replace(/_/g, " ");
                return (
                  <div key={k} className="flex items-center gap-3">
                    <p className="text-sm text-gray-500 w-40 flex-shrink-0 truncate">{label}</p>
                    <div className="flex gap-1 flex-shrink-0">
                      {[0, 1, 2].map((n) => (
                        <div key={n} className={`w-6 h-2 rounded-sm ${score > n ? "bg-foundry-green" : "bg-gray-100"}`} />
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">{score}/2</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Mshauri's assessment */}
        {applicant.reasoning && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-3">
              <img src="/brand/hero-mark.svg" alt="Mshauri" className="w-5 h-5" />
              <p className="font-semibold text-gray-700 text-sm">Mshauri&apos;s assessment</p>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{applicant.reasoning}</p>
          </div>
        )}

        {/* Accept / Reject */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <p className="font-semibold text-gray-700 text-sm mb-4">Decision</p>
          <AcceptRejectButtons applicantId={id} currentStatus={applicant.status} />
        </div>

        {/* Transcript */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <p className="font-semibold text-gray-700 text-sm mb-3">Conversation transcript</p>
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`text-xs px-3 py-2 rounded-xl leading-relaxed ${
                  m.role === "user"
                    ? "bg-gray-50 border border-gray-100 text-gray-700"
                    : "bg-foundry-green/5 border border-foundry-green/10 text-gray-700"
                }`}
              >
                <span className="font-semibold text-gray-500 mr-1.5">
                  {m.role === "user" ? applicant.name : "Mshauri"}:
                </span>
                {m.content}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
