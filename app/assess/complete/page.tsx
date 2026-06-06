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

const CONFIG = {
  DEVELOPER: {
    headline: "Developer track — you qualify.",
    sub: "The facilitator will be in touch with your cohort start date.",
    accentClass: "text-foundry-green",
    barClass: "bg-foundry-green",
    pill: "bg-green-100 text-green-700",
  },
  PROFESSIONAL: {
    headline: "Professional track — strong fit.",
    sub: "The facilitator will be in touch with your cohort start date.",
    accentClass: "text-amber-400",
    barClass: "bg-amber-400",
    pill: "bg-amber-100 text-amber-700",
  },
  PREP: {
    headline: "Runway — your path in starts here.",
    sub: "You have been enrolled in the Runway program. Begin below.",
    accentClass: "text-amber-400",
    barClass: "bg-amber-400",
    pill: "bg-amber-100 text-amber-700",
  },
  NOT_READY: {
    headline: "Not quite yet — here is what to do first.",
    sub: "Come back when you are ready. New cohorts run regularly.",
    accentClass: "text-gray-300",
    barClass: "bg-gray-400",
    pill: "bg-gray-100 text-gray-500",
  },
} as const;

function CompleteContent() {
  const params = useSearchParams();
  const id = params.get("id");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/assess/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicantId: id }),
    })
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data) => { if (data.error) throw new Error(); setResult(data); })
      .catch(() => setError(true));
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen bg-forge-night flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-sm">
          <img src="/brand/hero-mark.svg" alt="Mshauri" className="w-12 h-12 mx-auto opacity-40" />
          <p className="text-white font-semibold">Something went wrong</p>
          <p className="text-gray-400 text-sm">We could not calculate your result. A facilitator will review your assessment manually.</p>
          <Link href="/assess" className="inline-block text-sm text-amber-400 hover:underline">← Start a new assessment</Link>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-forge-night flex items-center justify-center">
        <div className="text-center space-y-3">
          <img src="/brand/hero-mark.svg" alt="Mshauri" className="w-12 h-12 mx-auto animate-pulse" />
          <p className="text-gray-400 text-sm">Calculating your result…</p>
        </div>
      </div>
    );
  }

  const cfg = CONFIG[result.recommendation];

  return (
    <div className="min-h-screen bg-forge-night flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/">
            <img src="/brand/lockup-horizontal.svg" alt="The AI Foundry Kampala" className="h-7 mx-auto opacity-80" />
          </Link>
        </div>
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
          <div className={`h-1.5 ${cfg.barClass}`} />
          <div className="p-8 space-y-4">
            <span className={`text-xs font-mono font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full ${cfg.pill}`}>
              {result.recommendation === "NOT_READY" ? "Not ready" : result.recommendation}
            </span>
            <h1 className={`text-xl font-bold ${cfg.accentClass}`}>{cfg.headline}</h1>
            <p className="text-stone-grey text-sm leading-relaxed">{result.reasoning}</p>
            <p className="text-gray-400 text-sm">{cfg.sub}</p>

            {result.recommendation === "PREP" && (
              <Link
                href={`/runway?applicantId=${id}`}
                className="block w-full text-center bg-amber-400 text-forge-night font-semibold py-3 rounded-xl hover:bg-amber-300 transition"
              >
                Begin Runway →
              </Link>
            )}
            <div className="text-center">
              <Link href="/assess" className="text-sm text-stone-grey hover:text-forge-night transition">
                ← Start a new assessment
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CompletePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-forge-night flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading…</p>
      </div>
    }>
      <CompleteContent />
    </Suspense>
  );
}
