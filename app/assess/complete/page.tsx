"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

interface Result {
  recommendation: "DEVELOPER" | "PROFESSIONAL" | "PREP" | "NOT_READY";
  reasoning: string;
  developerScore: number;
  professionalScore: number;
  prepScore: number;
}

function CompleteContent() {
  const params = useSearchParams();
  const id = params.get("id");
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/assess/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicantId: id }),
    })
      .then((r) => r.json())
      .then(setResult);
  }, [id]);

  if (!result) return <p className="text-center text-slate-400 mt-20 animate-pulse">Calculating your result…</p>;

  const config = {
    DEVELOPER: {
      icon: "✅",
      headline: "Developer track — you qualify.",
      sub: "The facilitator will be in touch with your cohort start date.",
      cls: "text-green-400",
    },
    PROFESSIONAL: {
      icon: "✅",
      headline: "Professional track — strong fit.",
      sub: "The facilitator will be in touch with your cohort start date.",
      cls: "text-green-400",
    },
    PREP: {
      icon: "🛤️",
      headline: "Runway — your path in starts here.",
      sub: "You have been enrolled in the Runway program.",
      cls: "text-amber-400",
    },
    NOT_READY: {
      icon: "⏳",
      headline: "Not quite yet — here is what to do first.",
      sub: "Come back when you are ready. The club runs new cohorts regularly.",
      cls: "text-slate-300",
    },
  }[result.recommendation];

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
      <div className="bg-[#1e293b] rounded-2xl p-8 w-full max-w-md space-y-4 text-white text-center">
        <div className="text-5xl">{config.icon}</div>
        <h1 className={`text-xl font-bold ${config.cls}`}>{config.headline}</h1>
        <p className="text-slate-300 text-sm leading-relaxed">{result.reasoning}</p>
        <p className="text-slate-400 text-sm">{config.sub}</p>
        {result.recommendation === "PREP" && (
          <Link
            href={`/prep?applicantId=${id}`}
            className="block w-full bg-amber-500 text-white py-3 rounded-xl font-medium hover:bg-amber-600 mt-4"
          >
            Begin Runway →
          </Link>
        )}
        <Link href="/assess" className="block text-slate-500 text-sm mt-2 hover:text-slate-300">
          ← Start a new assessment
        </Link>
      </div>
    </div>
  );
}

export default function CompletePage() {
  return (
    <Suspense fallback={<p className="text-center text-slate-400 mt-20">Loading…</p>}>
      <CompleteContent />
    </Suspense>
  );
}
