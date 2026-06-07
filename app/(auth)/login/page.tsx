"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const PAGE_CSS = `
  body { background: var(--ink); }
  .auth { min-height: 100vh; display: grid; grid-template-columns: 1.1fr 1fr; background: var(--ink); color: var(--cream); }

  .auth-brand { position: relative; overflow: hidden; padding: 48px 56px; display: flex; flex-direction: column; justify-content: space-between; border-right: 1px solid var(--line-dk); }
  .auth-brand-bg { position: absolute; inset: 0; z-index: 0; background: radial-gradient(900px 520px at 20% 0%, rgba(216,84,43,0.30), transparent 56%), radial-gradient(700px 520px at 90% 100%, rgba(31,94,69,0.34), transparent 60%); }
  .auth-brand > * { position: relative; z-index: 2; }
  .auth-brand .lockup { display: flex; align-items: center; gap: 12px; }
  .auth-brand .lockup .mark { width: 34px; height: 34px; background: var(--marigold); border-radius: 9px; display: grid; place-items: center; transform: rotate(-6deg); flex-shrink: 0; }
  .auth-brand .lockup .mark span { font-family: "Bricolage Grotesque"; font-weight: 900; font-size: 18px; color: var(--ink); transform: rotate(6deg); display: block; line-height: 1; }
  .auth-brand .lockup .name { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 17px; letter-spacing: 0.01em; white-space: nowrap; }
  .auth-brand .lockup .name em { font-style: normal; color: var(--marigold); }
  .auth-brand .pitch h1 { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: clamp(34px, 4vw, 54px); letter-spacing: -0.025em; line-height: 1.0; max-width: 14ch; }
  .auth-brand .pitch p { font-size: 16px; line-height: 1.6; color: var(--muted-dk); margin-top: 20px; max-width: 380px; }
  .auth-brand .foot { font-family: "Space Mono"; font-size: 11.5px; color: var(--muted-dk); letter-spacing: 0.06em; }

  .auth-form { display: flex; flex-direction: column; justify-content: center; padding: 48px clamp(40px, 6vw, 96px); }
  .auth-form .lead { font-family: "Space Mono"; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--marigold); }
  .auth-form h2 { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 36px; letter-spacing: -0.02em; margin-top: 14px; }
  .auth-form .sub { font-size: 15px; color: var(--muted-dk); margin-top: 10px; }
  .field { margin-top: 24px; }
  .field label { font-family: "Space Mono"; font-size: 11.5px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted-dk); display: block; margin-bottom: 9px; }
  .field input { width: 100%; background: var(--ink-2); border: 1.5px solid var(--line-dk); border-radius: 12px; padding: 15px 18px; color: var(--cream); font-family: "Archivo"; font-size: 15.5px; outline: none; transition: border-color .15s; }
  .field input::placeholder { color: #7a6e5b; }
  .field input:focus { border-color: var(--marigold); }
  .row-between { display: flex; align-items: center; justify-content: space-between; margin-top: 18px; }
  .remember { display: flex; align-items: center; gap: 10px; font-size: 14px; color: var(--muted-dk); }
  .remember .box { width: 18px; height: 18px; border-radius: 5px; border: 1.5px solid var(--line-dk); background: var(--ink-2); flex-shrink: 0; }
  .forgot { font-family: "Space Mono"; font-size: 12.5px; color: var(--muted-dk); }
  .forgot:hover { color: var(--marigold); }
  .signin { margin-top: 28px; width: 100%; justify-content: center; }
  .divider { display: flex; align-items: center; gap: 16px; margin: 26px 0; font-family: "Space Mono"; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted-dk); }
  .divider::before, .divider::after { content: ""; height: 1px; flex: 1; background: var(--line-dk); }
  .sso { width: 100%; justify-content: center; background: var(--ink-2); color: var(--cream); border: 1.5px solid var(--line-dk); }
  .sso:hover { border-color: var(--muted-dk); }
  .note { font-family: "Space Mono"; font-size: 11.5px; color: var(--muted-dk); text-align: center; margin-top: 28px; line-height: 1.6; }
  .back { margin-top: 22px; text-align: center; }
  .back a { font-family: "Space Mono"; font-size: 12.5px; color: var(--muted-dk); }
  .back a:hover { color: var(--marigold); }
  .err-msg { color: #ff6b5b; font-size: 13.5px; margin-top: 14px; text-align: center; font-family: "Space Mono"; }

  @media (max-width: 860px) { .auth { grid-template-columns: 1fr; } .auth-brand { display: none; } }
`;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/sign-in/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Invalid credentials");
      router.push("/dashboard");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{PAGE_CSS}</style>
      <div className="auth">
        <div className="auth-brand">
          <div className="auth-brand-bg" />
          <Link href="/" className="lockup">
            <span className="mark"><span>F</span></span>
            <span className="name">THE AI FOUNDRY <em>KAMPALA</em></span>
          </Link>
          <div className="pitch">
            <h1>The facilitator floor.</h1>
            <p>Review applications, track cohorts, and keep every learner moving. Mshauri does the first pass — you make the calls.</p>
          </div>
          <div className="foot">STAFF ACCESS · KAMPALA, UG · 00°19′N 32°35′E</div>
        </div>

        <div className="auth-form">
          <div className="lead">Staff access</div>
          <h2>Sign in</h2>
          <div className="sub">Facilitators and programme staff only.</div>

          <div className="field">
            <label htmlFor="email">Work email</label>
            <input
              id="email"
              type="email"
              placeholder="you@aifoundry.ug"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="pw">Password</label>
            <input
              id="pw"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
            />
          </div>
          <div className="row-between">
            <div className="remember"><span className="box" /> Keep me signed in</div>
            <span className="forgot">Forgot password?</span>
          </div>

          {error && <p className="err-msg">{error}</p>}

          <button
            className="btn btn-clay btn-lg signin"
            onClick={login}
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign in to dashboard →"}
          </button>

          <div className="divider">or</div>
          <button className="btn btn-lg sso" disabled>Continue with Foundry SSO</button>

          <p className="note">Protected area. Access is logged.<br />Trouble signing in? Message the programme lead.</p>
          <div className="back"><Link href="/">← Back to the public site</Link></div>
        </div>
      </div>
    </>
  );
}
