"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MAX_ASSESSMENT_MESSAGES } from "@/lib/constants";

type Message = { role: "user" | "assistant"; content: string };

const PAGE_CSS = `
  .assess-shell { background: var(--ink); color: var(--cream); min-height: 100vh; display: flex; flex-direction: column; }

  /* NAV */
  .assess-nav { background: var(--ink); border-bottom: 1px solid var(--line-dk); height: 76px; display: flex; align-items: center; flex-shrink: 0; }
  .assess-nav .wrap { display: flex; align-items: center; justify-content: space-between; }
  .assess-nav .lockup { display: flex; align-items: center; gap: 12px; }
  .assess-nav .lockup .mark { width: 34px; height: 34px; background: var(--marigold); border-radius: 9px; display: grid; place-items: center; transform: rotate(-6deg); flex-shrink: 0; }
  .assess-nav .lockup .mark span { font-family: "Bricolage Grotesque"; font-weight: 900; font-size: 18px; color: var(--ink); transform: rotate(6deg); display: block; line-height: 1; }
  .assess-nav .lockup .name { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 16px; letter-spacing: 0.01em; white-space: nowrap; }
  .assess-nav .lockup .name em { font-style: normal; color: var(--marigold); }

  /* START SCREEN */
  .assess-start { flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px 20px; }
  .start-card { background: var(--ink-2); border: 1px solid var(--line-dk); border-radius: 24px; padding: 44px 40px; width: 100%; max-width: 440px; }
  .start-card .lead { font-family: "Space Mono"; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--marigold); margin-bottom: 16px; }
  .start-card h1 { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 34px; letter-spacing: -0.02em; line-height: 1.05; }
  .start-card p { font-size: 15px; line-height: 1.6; color: var(--muted-dk); margin-top: 14px; }
  .start-card .field { margin-top: 28px; }
  .start-card .field label { font-family: "Space Mono"; font-size: 11.5px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted-dk); display: block; margin-bottom: 10px; }
  .start-card .field input { width: 100%; background: var(--ink); border: 1.5px solid var(--line-dk); border-radius: 12px; padding: 15px 18px; color: var(--cream); font-family: "Archivo"; font-size: 15.5px; outline: none; transition: border-color .15s; }
  .start-card .field input::placeholder { color: var(--muted-lt); }
  .start-card .field input:focus { border-color: var(--marigold); }
  .start-card .btn-start { margin-top: 24px; width: 100%; justify-content: center; }
  .start-card .note { font-family: "Space Mono"; font-size: 11.5px; color: var(--muted-dk); text-align: center; margin-top: 18px; }
  .start-card .err { color: var(--clay); font-size: 14px; margin-top: 12px; text-align: center; }

  /* CHAT SCREEN */
  .assess-body { position: relative; overflow: hidden; flex: 1; }
  .assess-bg { position: absolute; inset: 0; z-index: 0;
    background:
      radial-gradient(1000px 520px at 85% -10%, rgba(216,84,43,0.22), transparent 56%),
      radial-gradient(720px 480px at 0% 110%, rgba(31,94,69,0.28), transparent 60%);
  }
  .assess-wrap { position: relative; z-index: 2; padding-top: 44px; padding-bottom: 64px; }

  .assess-head { display: flex; align-items: center; justify-content: space-between; gap: 24px; margin-bottom: 30px; }
  .assess-head .lead { font-family: "Space Mono"; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--marigold); }
  .assess-head .q-of { font-family: "Space Mono"; font-size: 12px; color: var(--muted-dk); letter-spacing: 0.08em; }
  .pbar { height: 6px; border-radius: 999px; background: rgba(244,236,221,0.1); overflow: hidden; margin-bottom: 40px; }
  .pbar span { display: block; height: 100%; background: linear-gradient(90deg, var(--marigold), var(--clay)); border-radius: 999px; transition: width .5s ease; }

  .assess-grid { display: grid; grid-template-columns: 1fr 320px; gap: 40px; align-items: start; }

  .conv { display: flex; flex-direction: column; gap: 26px; }
  .row { display: flex; gap: 14px; max-width: 680px; }
  .row .av { width: 38px; height: 38px; border-radius: 11px; flex: none; display: grid; place-items: center; font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 16px; flex-shrink: 0; }
  .row.bot .av { background: linear-gradient(150deg, var(--marigold), var(--clay)); color: var(--ink); }
  .row.you { margin-left: auto; flex-direction: row-reverse; }
  .row.you .av { background: var(--ink-2); border: 1px solid var(--line-dk); color: var(--muted-dk); font-family: "Space Mono"; font-size: 12px; font-weight: 700; }
  .who { font-family: "Space Mono"; font-size: 10.5px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted-dk); margin-bottom: 7px; }
  .row.you .who { text-align: right; }
  .msg { font-size: 15.5px; line-height: 1.58; padding: 15px 19px; border-radius: 16px; }
  .row.bot .msg { background: var(--ink-2); border: 1px solid var(--line-dk); border-top-left-radius: 5px; color: var(--cream); }
  .row.you .msg { background: var(--clay); color: var(--ink); font-weight: 600; border-top-right-radius: 5px; white-space: pre-wrap; }

  .assess-md { color: var(--cream); }
  .assess-md p { margin: 0 0 12px; }
  .assess-md p:last-child { margin-bottom: 0; }
  .assess-md strong { font-weight: 700; }
  .assess-md em { font-style: italic; }
  .assess-md h1, .assess-md h2, .assess-md h3 { font-family: "Bricolage Grotesque"; font-weight: 700; margin: 14px 0 6px; color: var(--cream); }
  .assess-md h1 { font-size: 20px; }
  .assess-md h2 { font-size: 17px; }
  .assess-md h3 { font-size: 15.5px; }
  .assess-md ul, .assess-md ol { padding-left: 20px; margin: 6px 0 12px; display: flex; flex-direction: column; gap: 4px; }
  .assess-md ul { list-style: disc; }
  .assess-md ol { list-style: decimal; }
  .assess-md li { line-height: 1.58; color: var(--cream); }
  .assess-md code { font-family: "Space Mono"; font-size: 13px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); border-radius: 4px; padding: 1px 6px; color: var(--marigold); }
  .assess-md pre { background: rgba(0,0,0,0.35); border-radius: 10px; padding: 14px 16px; margin: 10px 0; overflow-x: auto; border: 1px solid var(--line-dk); }
  .assess-md pre code { background: none; border: none; padding: 0; color: var(--muted-dk); font-size: 13px; line-height: 1.6; }
  .assess-md blockquote { border-left: 3px solid var(--line-dk); padding-left: 12px; margin: 8px 0; color: var(--muted-dk); font-style: italic; }

  .input-area { margin-top: 36px; max-width: 680px; }
  .input-bar { display: flex; align-items: center; gap: 12px; background: var(--ink-2); border: 1.5px solid var(--line-dk); border-radius: 16px; padding: 8px 8px 8px 20px; }
  .input-bar textarea { flex: 1; background: transparent; border: none; outline: none; color: var(--cream); font-family: "Archivo"; font-size: 15.5px; resize: none; }
  .input-bar textarea::placeholder { color: var(--muted-dk); }
  .input-bar .send { width: 44px; height: 44px; border-radius: 11px; background: var(--clay); color: var(--ink); border: none; display: grid; place-items: center; font-size: 19px; cursor: pointer; transition: background .15s; flex-shrink: 0; }
  .input-bar .send:hover { background: var(--clay-deep); }
  .input-bar .send:disabled { opacity: 0.4; cursor: default; }
  .escape { margin-top: 14px; text-align: center; }
  .escape button { font-family: "Space Mono"; font-size: 12px; color: rgba(242,178,62,0.7); background: none; border: none; cursor: pointer; }
  .escape button:hover { color: var(--marigold); }

  .rail { background: var(--ink-2); border: 1px solid var(--line-dk); border-radius: 20px; padding: 26px 24px; position: sticky; top: 100px; }
  .rail h3 { font-family: "Space Mono"; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted-dk); }
  .rail .sub { font-size: 13.5px; color: var(--muted-dk); margin-top: 12px; line-height: 1.5; }
  .signals { margin-top: 22px; display: flex; flex-direction: column; gap: 2px; }
  .sig { display: flex; align-items: center; gap: 12px; padding: 11px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
  .sig:last-child { border-bottom: none; }
  .sig .tick { width: 22px; height: 22px; border-radius: 50%; flex: none; display: grid; place-items: center; font-size: 12px; font-weight: 700; flex-shrink: 0; }
  .sig.done .tick { background: var(--forest); color: var(--cream); }
  .sig.active .tick { background: var(--marigold); color: var(--ink); box-shadow: 0 0 0 4px rgba(242,178,62,0.15); }
  .sig.todo .tick { background: transparent; border: 1.5px solid var(--line-dk); color: var(--muted-dk); }
  .sig .snm { font-size: 14px; font-weight: 500; }
  .sig.todo .snm { color: var(--muted-dk); }
  .sig.active .snm { color: var(--marigold); font-weight: 600; }
  .rail .foretell { margin-top: 24px; padding-top: 22px; border-top: 1px solid var(--line-dk); }
  .rail .foretell .lbl { font-family: "Space Mono"; font-size: 10.5px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted-dk); }
  .rail .foretell .lean { display: flex; align-items: center; gap: 10px; margin-top: 12px; }
  .rail .foretell .lean .dot { width: 10px; height: 10px; border-radius: 50%; background: var(--clay); flex-shrink: 0; }
  .rail .foretell .lean .nm { font-family: "Bricolage Grotesque"; font-weight: 700; font-size: 19px; }
  .rail .foretell .conf { font-size: 12.5px; color: var(--muted-dk); margin-top: 6px; }

  @media (max-width: 900px) {
    .assess-grid { grid-template-columns: 1fr; }
    .rail { position: static; }
  }
`;

const SIGNALS = [
  "Motivation & goals",
  "Coding background",
  "Time commitment",
  "Comfort with logic",
  "Domain expertise",
  "Learning style",
  "Tooling familiarity",
  "Project ambition",
];

export default function AssessPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<"start" | "chat" | "completing">("start");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [pinConfirm, setPinConfirm] = useState("");
  const [applicantId, setApplicantId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const triggerCompletion = async (id: string) => {
    if (completing) return;
    setCompleting(true);
    setPhase("completing");
    router.push(`/assess/complete?id=${id}`);
  };

  const startAssessment = async () => {
    if (!name.trim()) return;
    if (pin && pin !== pinConfirm) { setError("PINs do not match"); return; }
    if (pin && !/^\d{4}$/.test(pin)) { setError("PIN must be exactly 4 digits"); return; }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [], name: name.trim(), phone: phone.trim() || undefined, pin: pin || undefined }),
      });
      const data = await res.json();
      setApplicantId(data.applicantId);
      setMessages([{ role: "assistant", content: data.reply }]);
      setMessageCount(1);
      setPhase("chat");
    } catch {
      setError("Could not connect — check your internet and try again.");
    } finally {
      setLoading(false);
    }
  };

  const send = async () => {
    const text = input.trim();
    if (!text || loading || completing) return;
    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, applicantId, name }),
      });
      const data = await res.json();
      const withReply: Message[] = [...next, { role: "assistant", content: data.reply }];
      setMessages(withReply);
      const nextCount = messageCount + 1;
      setMessageCount(nextCount);

      if (data.complete || nextCount >= MAX_ASSESSMENT_MESSAGES) {
        await triggerCompletion(data.applicantId ?? applicantId!);
      }
    } catch {
      setError("Connection lost — please try again.");
      setMessages(messages);
      setInput(text);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  const progressPct = Math.min((messageCount / MAX_ASSESSMENT_MESSAGES) * 100, 100);
  const showEscapeHatch = messageCount >= 5 && !completing;
  const doneCount = Math.min(Math.floor(messageCount / 1.5), 8);

  if (phase === "completing") {
    return (
      <div className="assess-shell" style={{ alignItems: "center", justifyContent: "center" }}>
        <style>{PAGE_CSS}</style>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: "linear-gradient(150deg, var(--marigold), var(--clay))", display: "grid", placeItems: "center", margin: "0 auto 24px", fontSize: 28 }}>M</div>
          <p style={{ fontFamily: '"Bricolage Grotesque"', fontWeight: 700, fontSize: 22 }}>Scoring your assessment…</p>
          <p style={{ color: "var(--muted-dk)", fontSize: 14, marginTop: 8 }}>This takes a few seconds</p>
        </div>
      </div>
    );
  }

  if (phase === "start") {
    return (
      <div className="assess-shell">
        <style>{PAGE_CSS}</style>
        <nav className="assess-nav">
          <div className="wrap">
            <Link href="/" className="lockup">
              <span className="mark"><span>F</span></span>
              <span className="name">THE AI FOUNDRY <em>KAMPALA</em></span>
            </Link>
          </div>
        </nav>
        <div className="assess-start">
          <div className="start-card">
            <div className="lead">Intake Assessment · with Mshauri</div>
            <h1>Find your track.</h1>
            <p>A 10-minute conversation with Mshauri to place you on the right path. No exam — just a chat. No wrong answers.</p>
            <div className="field">
              <label htmlFor="name">Your name</label>
              <input
                id="name"
                type="text"
                placeholder="e.g. Tendo Nakabiri"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="field">
              <label htmlFor="phone">Phone number <span style={{color:"var(--muted-dk)",fontWeight:400}}>(to log back in)</span></label>
              <input
                id="phone"
                type="tel"
                placeholder="0771234567 or +256771234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <p style={{fontFamily:'"Space Mono"',fontSize:11,color:"var(--muted-dk)",marginTop:7}}>Uganda: 07xx or +2567xx · Any country format accepted</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="field" style={{ marginTop: 0 }}>
                <label htmlFor="pin">4-digit PIN</label>
                <input
                  id="pin"
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="••••"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                />
              </div>
              <div className="field" style={{ marginTop: 0 }}>
                <label htmlFor="pinConfirm">Confirm PIN</label>
                <input
                  id="pinConfirm"
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="••••"
                  value={pinConfirm}
                  onChange={(e) => setPinConfirm(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  onKeyDown={(e) => e.key === "Enter" && startAssessment()}
                />
              </div>
            </div>
            {error && <p className="err">{error}</p>}
            <button
              className="btn btn-clay btn-lg btn-start"
              onClick={startAssessment}
              disabled={!name.trim() || loading}
            >
              {loading ? "Starting…" : "Begin assessment →"}
            </button>
            <p className="note">Takes about 10 minutes</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="assess-shell">
      <style>{PAGE_CSS}</style>
      <nav className="assess-nav">
        <div className="wrap">
          <Link href="/" className="lockup">
            <span className="mark"><span>F</span></span>
            <span className="name">THE AI FOUNDRY <em>KAMPALA</em></span>
          </Link>
          <Link href="/" style={{ fontFamily: '"Space Mono"', fontSize: 12, color: "var(--muted-dk)" }}>Exit</Link>
        </div>
      </nav>

      <div className="assess-body">
        <div className="assess-bg" />
        <div className="wrap assess-wrap">
          <div className="assess-head">
            <div className="lead">Intake Assessment · with Mshauri</div>
            <div className="q-of">Question {Math.min(messageCount + 1, 8)} of 8</div>
          </div>
          <div className="pbar"><span style={{ width: `${progressPct}%` }} /></div>

          <div className="assess-grid">
            <div>
              <div className="conv">
                {messages.map((m, i) => (
                  <div key={i} className={`row ${m.role === "assistant" ? "bot" : "you"}`}>
                    <div className="av">{m.role === "assistant" ? "M" : "You"}</div>
                    <div>
                      <div className="who">{m.role === "assistant" ? "Mshauri" : name}</div>
                      <div className="msg">
                        {m.role === "assistant" ? (
                          <div className="assess-md">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                          </div>
                        ) : m.content}
                      </div>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="row bot">
                    <div className="av">M</div>
                    <div>
                      <div className="who">Mshauri</div>
                      <div className="msg" style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--muted-dk)" }}>
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="row bot">
                    <div className="av" style={{ opacity: 0.4 }}>M</div>
                    <div>
                      <div className="msg" style={{ background: "color-mix(in srgb, var(--clay) 10%, transparent)", border: "1px solid color-mix(in srgb, var(--clay) 20%, transparent)", color: "var(--clay)", borderRadius: 16 }}>{error}</div>
                    </div>
                  </div>
                )}

                <div ref={bottomRef} />
              </div>

              <div className="input-area">
                <div className="input-bar">
                  <textarea
                    ref={textareaRef}
                    rows={1}
                    placeholder="Type your reply…"
                    value={input}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                    disabled={loading || completing}
                    style={{ maxHeight: 120 }}
                  />
                  <button
                    className="send"
                    onClick={send}
                    disabled={loading || completing || !input.trim()}
                    aria-label="Send"
                  >
                    ↑
                  </button>
                </div>
                {showEscapeHatch && (
                  <div className="escape">
                    <button onClick={() => applicantId && triggerCompletion(applicantId)} disabled={completing}>
                      I&apos;ve answered everything — score my assessment →
                    </button>
                  </div>
                )}
              </div>
            </div>

            <aside className="rail">
              <h3>What Mshauri is learning</h3>
              <div className="sub">Eight signals shape your placement. Nothing here is pass-or-fail.</div>
              <div className="signals">
                {SIGNALS.map((sig, i) => {
                  const state = i < doneCount ? "done" : i === doneCount ? "active" : "todo";
                  return (
                    <div key={sig} className={`sig ${state}`}>
                      <span className="tick">{state === "done" ? "✓" : i + 1}</span>
                      <span className="snm">{sig}</span>
                    </div>
                  );
                })}
              </div>
              {messageCount >= 2 && (
                <div className="foretell">
                  <div className="lbl">Leaning toward</div>
                  <div className="lean"><span className="dot" /><span className="nm">Developer track</span></div>
                  <div className="conf">Early read · confidence builds as we go</div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
