"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

interface EvalResult {
  score: number;
  feedback: string;
  readyForExit: boolean;
}

function ProjectContent() {
  const params = useSearchParams();
  const applicantId = params.get("applicantId");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EvalResult | null>(null);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!url.trim() || !applicantId) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/prep/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicantId, githubUrl: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Evaluation failed");
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bone-white p-6">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link href={`/prep?applicantId=${applicantId}`} className="text-sm text-gray-400 hover:text-gray-600">← Back</Link>
          <h1 className="text-xl font-bold text-gray-800">Mini-Project Submission</h1>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <div>
            <p className="font-semibold text-gray-700 text-sm mb-2">What to submit</p>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>A public GitHub repository</li>
              <li>Contains <code className="bg-gray-100 px-1 rounded">market_summary.py</code></li>
              <li>Contains <code className="bg-gray-100 px-1 rounded">prices.csv</code> with columns: item, price_ugx, vendor</li>
              <li>Script prints: total items, cheapest, most expensive, average price</li>
            </ul>
          </div>
          {!result && (
            <>
              <input
                type="url"
                placeholder="https://github.com/yourname/repo"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-foundry-green"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                onClick={submit}
                disabled={loading || !url.trim()}
                className="w-full bg-foundry-green text-white py-2 rounded-xl text-sm font-medium hover:bg-foundry-green-light disabled:opacity-40"
              >
                {loading ? "Evaluating…" : "Submit for evaluation →"}
              </button>
            </>
          )}
          {result && (
            <div className="space-y-4">
              <div className="text-center">
                <p className={`text-4xl font-bold ${result.score >= 70 ? "text-green-600" : "text-amber-500"}`}>{result.score}%</p>
                <p className="text-sm text-gray-500 mt-1">{result.score >= 70 ? "Passed ✓" : "Not quite yet"}</p>
              </div>
              <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl">{result.feedback}</p>
              {result.readyForExit ? (
                <Link
                  href={`/assess?prep=true&applicantId=${applicantId}`}
                  className="block w-full bg-foundry-green text-white py-3 rounded-xl font-medium text-center hover:bg-foundry-green-light"
                >
                  Take exit assessment →
                </Link>
              ) : (
                <button
                  onClick={() => setResult(null)}
                  className="w-full border border-gray-300 text-gray-600 py-2 rounded-xl text-sm hover:bg-gray-50"
                >
                  Fix and resubmit
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProjectPage() {
  return (
    <Suspense fallback={<p className="text-center text-gray-400 mt-20">Loading…</p>}>
      <ProjectContent />
    </Suspense>
  );
}
