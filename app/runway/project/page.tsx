"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

const PAGE_CSS = `
  .proj-shell { min-height: 100vh; background: var(--ink); display: flex; flex-direction: column; }

  .proj-header { flex-shrink: 0; border-bottom: 1px solid var(--line-dk); padding: 18px 28px; display: flex; align-items: center; justify-content: space-between; }
  .proj-header .brand { display: flex; align-items: center; gap: 10px; }
  .proj-header .mark { width: 28px; height: 28px; border-radius: 7px; background: var(--plum); display: grid; place-items: center; font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 13px; color: var(--cream); }
  .proj-header .hname { font-family: "Bricolage Grotesque"; font-weight: 700; font-size: 16px; color: var(--cream); }
  .proj-header .back { font-family: "Space Mono"; font-size: 11px; color: var(--muted-dk); text-decoration: none; transition: color .15s; }
  .proj-header .back:hover { color: var(--cream); }

  .proj-body { flex: 1; padding: 40px 28px 60px; max-width: 600px; width: 100%; margin: 0 auto; display: flex; flex-direction: column; gap: 24px; }

  .proj-eyebrow { font-family: "Space Mono"; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--plum); }
  .proj-title { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 28px; color: var(--cream); letter-spacing: -0.015em; margin-top: 6px; }

  .req-card { background: var(--ink-2); border: 1px solid var(--line-dk); border-radius: 16px; padding: 20px 22px; }
  .req-card h3 { font-family: "Bricolage Grotesque"; font-weight: 700; font-size: 15px; color: var(--cream); margin-bottom: 12px; }
  .req-list { display: flex; flex-direction: column; gap: 8px; }
  .req-item { display: flex; align-items: flex-start; gap: 10px; font-family: "Archivo"; font-size: 13.5px; color: var(--muted-dk); line-height: 1.45; }
  .req-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--plum); flex-shrink: 0; margin-top: 6px; }
  .req-code { font-family: "Space Mono"; font-size: 12px; background: var(--ink); color: var(--muted-dk); border: 1px solid var(--line-dk); padding: 1px 6px; border-radius: 5px; }

  .form-card { background: var(--ink-2); border: 1px solid var(--line-dk); border-radius: 16px; padding: 24px; display: flex; flex-direction: column; gap: 16px; }
  .form-label { font-family: "Space Mono"; font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted-dk); display: block; margin-bottom: 8px; }
  .url-input { width: 100%; background: var(--ink); border: 1px solid var(--line-dk); border-radius: 10px; padding: 12px 16px; font-family: "Archivo"; font-size: 14px; color: var(--cream); outline: none; transition: border-color .15s; box-sizing: border-box; }
  .url-input::placeholder { color: var(--muted-dk); }
  .url-input:focus { border-color: var(--muted-dk); }
  .submit-btn { font-family: "Archivo"; font-weight: 700; font-size: 15px; padding: 14px 20px; border-radius: 12px; background: var(--marigold); color: #1a0d06; border: none; cursor: pointer; transition: all .15s; width: 100%; }
  .submit-btn:hover:not(:disabled) { background: #f5c060; }
  .submit-btn:disabled { opacity: 0.4; cursor: default; }
  .form-error { font-family: "Space Mono"; font-size: 12px; color: var(--clay); }

  .result-card { background: var(--ink-2); border: 1px solid var(--line-dk); border-radius: 16px; padding: 28px 24px; display: flex; flex-direction: column; gap: 20px; text-align: center; }
  .result-score { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 56px; letter-spacing: -0.02em; line-height: 1; }
  .result-score.pass { color: var(--marigold); }
  .result-score.fail { color: var(--clay); }
  .result-verdict { font-family: "Space Mono"; font-size: 12px; color: var(--muted-dk); margin-top: 4px; }
  .result-feedback { font-family: "Archivo"; font-size: 14px; line-height: 1.65; color: var(--cream); background: var(--ink); border: 1px solid var(--line-dk); border-radius: 12px; padding: 16px 18px; text-align: left; }
  .result-cta { font-family: "Archivo"; font-weight: 700; font-size: 15px; padding: 14px 20px; border-radius: 12px; text-decoration: none; display: block; transition: all .15s; }
  .result-cta.exit { background: var(--plum); color: var(--cream); }
  .result-cta.exit:hover { background: color-mix(in srgb, var(--plum) 85%, var(--ink)); }
  .result-cta.retry { background: transparent; color: var(--muted-dk); border: 1px solid var(--line-dk); cursor: pointer; }
  .result-cta.retry:hover { border-color: var(--muted-dk); color: var(--cream); }

  .loading { min-height: 100vh; background: var(--ink); display: flex; align-items: center; justify-content: center; }
`;

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
      const res = await fetch("/api/runway/evaluate", {
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
    <div className="proj-shell">
      <style>{PAGE_CSS}</style>

      <header className="proj-header">
        <div className="brand">
          <div className="mark">F</div>
          <div className="hname">Mini-Project Submission</div>
        </div>
        <Link href={`/runway?applicantId=${applicantId}`} className="back">← Runway</Link>
      </header>

      <div className="proj-body">
        <div>
          <div className="proj-eyebrow">Module 4</div>
          <div className="proj-title">Submit your project</div>
        </div>

        <div className="req-card">
          <h3>What to include</h3>
          <div className="req-list">
            {[
              "A public GitHub repository",
              <span key="1">Contains <span className="req-code">market_summary.py</span></span>,
              <span key="2">Contains <span className="req-code">prices.csv</span> with columns: item, price_ugx, vendor</span>,
              "Script prints: total items, cheapest, most expensive, average price",
            ].map((item, i) => (
              <div key={i} className="req-item">
                <span className="req-dot" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {!result ? (
          <div className="form-card">
            <div>
              <label className="form-label">GitHub repository URL</label>
              <input
                className="url-input"
                type="url"
                placeholder="https://github.com/yourname/repo"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
              />
            </div>
            {error && <p className="form-error">{error}</p>}
            <button
              className="submit-btn"
              onClick={submit}
              disabled={loading || !url.trim()}
            >
              {loading ? "Evaluating…" : "Submit for evaluation →"}
            </button>
          </div>
        ) : (
          <div className="result-card">
            <div>
              <div className={`result-score ${result.score >= 70 ? "pass" : "fail"}`}>{result.score}%</div>
              <div className="result-verdict">{result.score >= 70 ? "Passed ✓" : "Not quite yet"}</div>
            </div>
            <div className="result-feedback">{result.feedback}</div>
            {result.readyForExit ? (
              <Link
                href={`/assess?prep=true&applicantId=${applicantId}`}
                className="result-cta exit"
              >
                Take exit assessment →
              </Link>
            ) : (
              <button className="result-cta retry" onClick={() => setResult(null)}>
                Fix and resubmit
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProjectPage() {
  return (
    <Suspense fallback={
      <div className="loading">
        <style>{PAGE_CSS}</style>
      </div>
    }>
      <ProjectContent />
    </Suspense>
  );
}
