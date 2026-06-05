"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

const MODULES = [
  { id: 1, title: "The Terminal" },
  { id: 2, title: "Git" },
  { id: 3, title: "Python Basics" },
  { id: 4, title: "The Mini-Project" },
];

interface Enrollment {
  currentModule: number;
  moduleProgress: Record<string, string>;
  miniProjectScore: number | null;
  status: string;
}

function PrepContent() {
  const params = useSearchParams();
  const router = useRouter();
  const applicantId = params.get("applicantId");
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);

  useEffect(() => {
    if (!applicantId) { router.push("/assess"); return; }
    fetch(`/api/prep?applicantId=${applicantId}`)
      .then((r) => r.json())
      .then((d) => setEnrollment(d.enrollment));
  }, [applicantId, router]);

  if (!enrollment) return <p className="text-center text-slate-400 mt-20 animate-pulse">Loading your progress…</p>;

  const statusBadge = (moduleId: number) => {
    const s = enrollment.moduleProgress[String(moduleId)];
    if (s === "COMPLETE") return <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Complete</span>;
    if (s === "IN_PROGRESS") return <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">In progress</span>;
    return <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Not started</span>;
  };

  const isLocked = (moduleId: number) => {
    if (moduleId === 1) return false;
    return enrollment.moduleProgress[String(moduleId - 1)] !== "COMPLETE";
  };

  return (
    <div className="min-h-screen bg-bone-white p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <img src="/favicon.svg" alt="Mshauri" className="w-7 h-7" />
          <div>
            <h1 className="text-xl font-bold text-gray-800">Runway</h1>
            <p className="text-sm text-gray-500">Build your foundation for the Developer track</p>
          </div>
        </div>
        <div className="space-y-3">
          {MODULES.map((m) => {
            const locked = isLocked(m.id);
            return (
              <div key={m.id} className={`bg-white rounded-2xl p-4 shadow-sm border ${locked ? "opacity-50" : ""}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">Module {m.id}: {m.title}</p>
                    <div className="mt-1">{statusBadge(m.id)}</div>
                  </div>
                  {locked ? (
                    <span className="text-gray-300 text-xl">🔒</span>
                  ) : (
                    <Link
                      href={`/prep/${m.id}?applicantId=${applicantId}`}
                      className="text-sm bg-foundry-green text-white px-4 py-1.5 rounded-lg hover:bg-foundry-green-light"
                    >
                      {enrollment.moduleProgress[String(m.id)] === "COMPLETE" ? "Review" : "Start →"}
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {enrollment.moduleProgress["4"] === "COMPLETE" && (
          <Link
            href={`/prep/project?applicantId=${applicantId}`}
            className="block w-full bg-amber-500 text-white py-3 rounded-xl font-medium text-center hover:bg-amber-600"
          >
            Submit mini-project →
          </Link>
        )}
        {enrollment.status === "READY_FOR_EXIT" && (
          <Link
            href={`/assess?prep=true&applicantId=${applicantId}`}
            className="block w-full bg-foundry-green text-white py-3 rounded-xl font-medium text-center hover:bg-foundry-green-light"
          >
            Take exit assessment →
          </Link>
        )}
      </div>
    </div>
  );
}

export default function PrepPage() {
  return (
    <Suspense fallback={<p className="text-center text-gray-400 mt-20">Loading…</p>}>
      <PrepContent />
    </Suspense>
  );
}
