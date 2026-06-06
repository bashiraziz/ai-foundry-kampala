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
    label: "Developer track",
    headline: "You qualify for the Developer track.",
    sub: "The facilitator will be in touch with your cohort start date.",
    pill: "bg-green-100 text-green-800",
    bar: "bg-foundry-green",
    cta: null,
  },
  PROFESSIONAL: {
    label: "Professional track",
    headline: "Strong fit for the Professional track.",
    sub: "The facilitator will be in touch with your cohort start date.",
    pill: "bg-amber-100 text-amber-800",
    bar: "bg-amber-400",
    cta: null,
  },
  PREP: {
    label: "Runway program",
    headline: "Your path in starts with Runway.",
    sub: "You've been enrolled in Runway — a short program to build the foundation for the Developer track.",
    pill: "bg-amber-100 text-amber-800",
    bar: "bg-amber-400",
    cta: "Begin Runway →",
  },
  NOT_READY: {
    label: "Not ready yet",
    headline: "Not quite yet — here is what to do first.",
    sub: "Come back when you're ready. New cohorts run regularly.",
    pill: "bg-gray-100 text-gray-600",
    bar: "bg-gray-300",
    cta: null,
  },
} as const;

function ScoreBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500">{label}</span>
        <span className="font-semibold text-gray-700">{value}</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

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
      <div className="min-h-screen bg-forge-deep flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-sm animate-scale-in">
          <img src="/brand/hero-mark.svg" alt="Mshauri" className="w-12 h-12 mx-auto opacity-30" />
          <div>
            <p className="text-white font-semibold">Something went wrong</p>
            <p className="text-gray-400 text-sm mt-1 leading-relaxed">
              We couldn't calculate your result. A facilitator will review your assessment manually.
            </p>
          </div>
          <Link href="/assess" className="inline-block text-sm text-amber-400 hover:text-amber-300 transition">
            ← Start a new assessment
          </Link>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-forge-deep flex items-center justify-center">
        <div className="text-center space-y-4 animate-fade-in">
          <img src="/brand/hero-mark.svg" alt="Mshauri" className="w-12 h-12 mx-auto animate-pulse" />
          <div>
            <p className="text-white font-semibold">Calculating your result…</p>
            <p className="text-gray-500 text-sm mt-1">This takes a few seconds</p>
          </div>
        </div>
      </div>
    );
  }

  const cfg = CONFIG[result.recommendation];

  return (
    <div className="min-h-screen bg-forge-deep flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-4 animate-scale-in">
        <div className="text-center mb-6">
          <Link href="/">
            <img src="/brand/lockup-horizontal.svg" alt="The AI Foundry Kampala" className="h-7 mx-auto opacity-60 hover:opacity-90 transition" />
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className={`h-1.5 ${cfg.bar}`} />
          <div className="p-8 space-y-5">
            <div>
              <span className={`inline-block text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full ${cfg.pill}`}>
                {cfg.label}
              </span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-forge-night leading-tight">{cfg.headline}</h1>
              <p className="text-sm text-stone-grey mt-2 leading-relaxed">{result.reasoning}</p>
              <p className="text-sm text-gray-400 mt-2">{cfg.sub}</p>
            </div>

            {/* Score breakdown */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Assessment scores</p>
              <ScoreBar label="Developer" value={result.developerScore} max={13} color="bg-foundry-green" />
              <ScoreBar label="Professional" value={result.professionalScore} max={8} color="bg-amber-400" />
              <ScoreBar label="Runway readiness" value={result.prepScore} max={6} color="bg-gray-400" />
            </div>

            {cfg.cta && (
              <Link
                href={`/runway?applicantId=${id}`}
                className="block w-full text-center bg-amber-400 text-forge-night font-semibold py-3 rounded-xl hover:bg-amber-300 transition text-sm"
              >
                {cfg.cta}
              </Link>
            )}

            <div className="text-center pt-1">
              <Link href="/assess" className="text-sm text-gray-400 hover:text-gray-600 transition">
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
      <div className="min-h-screen bg-forge-deep flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading…</p>
      </div>
    }>
      <CompleteContent />
    </Suspense>
  );
}
