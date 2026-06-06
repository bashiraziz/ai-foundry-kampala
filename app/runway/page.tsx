"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

const MODULES = [
  { id: 1, title: "The Terminal", desc: "Navigate your computer with text commands" },
  { id: 2, title: "Git", desc: "Track changes and push your code to GitHub" },
  { id: 3, title: "Python Basics", desc: "Variables, loops, functions, and CSV files" },
  { id: 4, title: "The Mini-Project", desc: "Build and ship a real Python script" },
];

interface Enrollment {
  currentModule: number;
  moduleProgress: Record<string, string>;
  miniProjectScore: number | null;
  status: string;
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-300">
      <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 7V5a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PrepContent() {
  const params = useSearchParams();
  const router = useRouter();
  const applicantId = params.get("applicantId");
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);

  useEffect(() => {
    if (!applicantId) { router.push("/assess"); return; }
    fetch(`/api/runway?applicantId=${applicantId}`)
      .then((r) => r.json())
      .then((d) => setEnrollment(d.enrollment));
  }, [applicantId, router]);

  if (!enrollment) {
    return (
      <div className="min-h-screen bg-forge-deep flex items-center justify-center">
        <div className="text-center space-y-3 animate-fade-in">
          <img src="/brand/hero-mark.svg" alt="Mshauri" className="w-10 h-10 mx-auto animate-pulse" />
          <p className="text-gray-500 text-sm">Loading your progress…</p>
        </div>
      </div>
    );
  }

  const completedCount = Object.values(enrollment.moduleProgress).filter((v) => v === "COMPLETE").length;
  const progressPct = (completedCount / 4) * 100;

  const statusOf = (moduleId: number) => enrollment.moduleProgress[String(moduleId)];
  const isLocked = (moduleId: number) => moduleId > 1 && statusOf(moduleId - 1) !== "COMPLETE";

  return (
    <div className="min-h-screen bg-forge-deep flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-white/[0.06] px-4 py-4">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/brand/hero-mark.svg" alt="Mshauri" className="w-7 h-7" />
            <div>
              <p className="text-white font-semibold text-sm">Runway</p>
              <p className="text-gray-500 text-xs">Foundation track · {completedCount}/4 modules complete</p>
            </div>
          </div>
          <Link href="/" className="text-xs text-gray-500 hover:text-gray-300 transition">← Home</Link>
        </div>
      </header>

      <div className="flex-1 px-4 py-8">
        <div className="max-w-xl mx-auto space-y-6">
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Your progress</span>
              <span className="text-gray-400">{completedCount} of 4 complete</span>
            </div>
            <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Module cards */}
          <div className="space-y-3">
            {MODULES.map((m) => {
              const locked = isLocked(m.id);
              const status = statusOf(m.id);
              const complete = status === "COMPLETE";
              const inProgress = status === "IN_PROGRESS";

              return (
                <div
                  key={m.id}
                  className={`rounded-2xl border p-5 transition-all ${
                    locked
                      ? "border-white/[0.05] bg-white/[0.02] opacity-50"
                      : complete
                      ? "border-foundry-green/30 bg-foundry-green/[0.06]"
                      : "border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.07]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-gray-500">0{m.id}</span>
                        <p className={`font-semibold text-sm ${locked ? "text-gray-500" : complete ? "text-green-400" : "text-white"}`}>
                          {m.title}
                        </p>
                        {complete && (
                          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-medium">Complete</span>
                        )}
                        {inProgress && (
                          <span className="text-xs bg-amber-400/20 text-amber-400 px-2 py-0.5 rounded-full font-medium">In progress</span>
                        )}
                      </div>
                      <p className={`text-xs leading-relaxed ${locked ? "text-gray-600" : "text-gray-400"}`}>{m.desc}</p>
                    </div>
                    {locked ? (
                      <div className="flex-shrink-0 mt-0.5"><LockIcon /></div>
                    ) : (
                      <Link
                        href={`/runway/${m.id}?applicantId=${applicantId}`}
                        className={`flex-shrink-0 text-xs font-medium px-4 py-2 rounded-lg transition ${
                          complete
                            ? "bg-white/[0.08] text-gray-300 hover:bg-white/[0.12]"
                            : "bg-amber-400 text-forge-night hover:bg-amber-300"
                        }`}
                      >
                        {complete ? "Review" : "Start →"}
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom CTAs */}
          {statusOf(4) === "COMPLETE" && (
            <Link
              href={`/runway/project?applicantId=${applicantId}`}
              className="block w-full bg-amber-400 text-forge-night font-semibold py-3 rounded-xl text-center text-sm hover:bg-amber-300 transition"
            >
              Submit mini-project →
            </Link>
          )}
          {enrollment.status === "READY_FOR_EXIT" && (
            <Link
              href={`/assess?prep=true&applicantId=${applicantId}`}
              className="block w-full bg-foundry-green text-white font-semibold py-3 rounded-xl text-center text-sm hover:bg-foundry-green-light transition"
            >
              Take exit assessment →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PrepPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-forge-deep flex items-center justify-center">
        <p className="text-gray-500 text-sm">Loading…</p>
      </div>
    }>
      <PrepContent />
    </Suspense>
  );
}
