"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RunwayLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async () => {
    if (!phone.trim() || pin.length !== 4) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/applicant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), pin }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Login failed"); return; }
      router.push(`/runway?applicantId=${data.applicantId}`);
    } catch {
      setError("Could not connect — check your internet and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "var(--ink)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>

        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40, textDecoration: "none" }}>
          <span style={{ width: 34, height: 34, borderRadius: 9, background: "var(--marigold)", display: "grid", placeItems: "center", transform: "rotate(-6deg)", flexShrink: 0 }}>
            <span style={{ fontFamily: '"Bricolage Grotesque"', fontWeight: 900, fontSize: 18, color: "var(--ink)", transform: "rotate(6deg)", display: "block" }}>F</span>
          </span>
          <span style={{ fontFamily: '"Bricolage Grotesque"', fontWeight: 800, fontSize: 15, color: "var(--cream)", letterSpacing: "0.01em" }}>
            THE AI FOUNDRY <em style={{ fontStyle: "normal", color: "var(--marigold)" }}>KAMPALA</em>
          </span>
        </Link>

        <div style={{ background: "var(--ink-2)", border: "1px solid var(--line-dk)", borderRadius: 24, padding: "40px 36px" }}>
          <p style={{ fontFamily: '"Space Mono"', fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--marigold)", marginBottom: 14 }}>Welcome back</p>
          <h1 style={{ fontFamily: '"Bricolage Grotesque"', fontWeight: 800, fontSize: 30, letterSpacing: "-0.02em", color: "var(--cream)", lineHeight: 1.1, margin: "0 0 8px" }}>
            Continue on Runway
          </h1>
          <p style={{ fontSize: 14, color: "var(--muted-dk)", lineHeight: 1.6, margin: "0 0 32px" }}>
            Enter the phone number and 4-digit PIN you set during your assessment.
          </p>

          <div style={{ marginBottom: 18 }}>
            <label style={{ fontFamily: '"Space Mono"', fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted-dk)", display: "block", marginBottom: 9 }}>
              Phone number
            </label>
            <input
              type="tel"
              placeholder="0771234567 or +256771234567"
              value={phone}
              autoFocus
              onChange={(e) => setPhone(e.target.value)}
              style={{ width: "100%", background: "var(--ink)", border: "1.5px solid var(--line-dk)", borderRadius: 12, padding: "14px 16px", color: "var(--cream)", fontFamily: '"Archivo"', fontSize: 15, outline: "none", boxSizing: "border-box" }}
              onFocus={(e) => (e.target.style.borderColor = "var(--marigold)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--line-dk)")}
            />
            <p style={{ fontFamily: '"Space Mono"', fontSize: 11, color: "var(--muted-dk)", marginTop: 7 }}>
              Enter it exactly as you registered — Uganda: 07xx or +2567xx
            </p>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontFamily: '"Space Mono"', fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted-dk)", display: "block", marginBottom: 9 }}>
              4-digit PIN
            </label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              placeholder="••••"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
              onKeyDown={(e) => e.key === "Enter" && login()}
              style={{ width: "100%", background: "var(--ink)", border: "1.5px solid var(--line-dk)", borderRadius: 12, padding: "14px 16px", color: "var(--cream)", fontFamily: '"Archivo"', fontSize: 28, letterSpacing: "0.4em", outline: "none", boxSizing: "border-box" }}
              onFocus={(e) => (e.target.style.borderColor = "var(--marigold)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--line-dk)")}
            />
          </div>

          {error && (
            <p style={{ color: "var(--clay)", fontSize: 14, marginBottom: 16, textAlign: "center" }}>{error}</p>
          )}

          <button
            onClick={login}
            disabled={!phone.trim() || pin.length !== 4 || loading}
            style={{
              width: "100%", background: "var(--clay)", color: "var(--ink)", border: "none",
              borderRadius: 12, padding: "15px 0", fontFamily: '"Bricolage Grotesque"',
              fontWeight: 700, fontSize: 16, cursor: "pointer", transition: "opacity 0.15s",
              opacity: (!phone.trim() || pin.length !== 4 || loading) ? 0.4 : 1,
            }}
          >
            {loading ? "Logging in…" : "Continue →"}
          </button>

          <p style={{ textAlign: "center", marginTop: 24, fontFamily: '"Space Mono"', fontSize: 12, color: "var(--muted-dk)" }}>
            New here?{" "}
            <Link href="/assess" style={{ color: "var(--marigold)", textDecoration: "underline" }}>Take the assessment</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
