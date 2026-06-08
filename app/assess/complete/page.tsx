"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type TrackKey = "runway" | "developer" | "professional";

interface TrackConfig {
  accent: string;
  headlineLead: string;
  track: string;
  lede: string;
  note: string;
  blurb: string;
  gains: string[];
  ctaLabel: string;
  ctaHref: string;
  micro: string;
}

const TRACKS: Record<TrackKey, TrackConfig> = {
  runway: {
    accent: "var(--plum)",
    headlineLead: "Your starting point is ",
    track: "Runway",
    lede: "You've taken the first real step into the Foundry. Based on our chat, we've found the track where you'll build the strongest momentum — and grow the fastest.",
    note: "Here's what I noticed: you're motivated, curious, and ready to build. **Runway** is exactly where I'd start you — it's our launchpad, designed to give you the hands-on foundations that every Foundry developer relies on. Move through it and you'll step into the Developer track with real confidence behind you.",
    blurb: "The Foundry's launchpad. A focused, supportive start where you'll get comfortable with the tools real builders use every day — and finish ready for what's next.",
    gains: [
      "Real fluency in the **terminal, Git, and Python** — the everyday toolkit of every developer.",
      "A **mini-project you build end to end**, so you leave with something real, not just notes.",
      "A **clear, confident path into the Developer track** — Runway is where that journey begins.",
    ],
    ctaLabel: "See what Runway covers",
    ctaHref: "/tracks/runway",
    micro: "**Most builders start on Runway.** It's the fastest way to get the foundations solid — you'll move up sooner than you think.",
  },
  developer: {
    accent: "var(--clay)",
    headlineLead: "You're matched to ",
    track: "Developer",
    lede: "You've taken the first real step into the Foundry. From our chat, it's clear you're ready to build — so we've matched you to the track where you'll go furthest, fastest.",
    note: "Here's what I noticed: you already think like a builder, and you're hungry to put AI to work for real. The **Developer** track is exactly that — twelve intensive weeks designing, building, and shipping production AI systems alongside a cohort moving at your pace. You'll leave with a capstone you're proud to show.",
    blurb: "The Foundry's core track. Twelve focused weeks building real AI systems — and a capstone you can put in front of a real client.",
    gains: [
      "Ship a **working AI agent** that uses real tools and handles real inputs — not a notebook demo.",
      "Build **retrieval that works** — a RAG pipeline you can actually measure and trust.",
      "**Deploy to production**: live, monitored, and cost-controlled — and keep it running.",
    ],
    ctaLabel: "See what Developer covers",
    ctaHref: "/tracks/developer",
    micro: "**This is where builders go to ship.** Bring your momentum — your cohort starts soon.",
  },
  professional: {
    accent: "var(--forest)",
    headlineLead: "You're matched to ",
    track: "Professional",
    lede: "You've taken the first real step into the Foundry. From our chat, your strength is clear — so we've matched you to the track built to put it to work with AI.",
    note: "Here's what I noticed: you bring real domain expertise and a sharp sense of where AI creates value — something many builders don't have. The **Professional** track is made for you: you'll learn to automate real workflows, judge AI systems, and lead AI projects in your field — no code required, ever.",
    blurb: "For experts and leaders. Twelve weeks to bring AI into your work — automating workflows, auditing systems, and leading change in your organisation, without writing a line of code.",
    gains: [
      "**Automate a real workflow** from your job using AI and no-code automation tools.",
      "**Write an AI project spec** a developer or vendor can build from — and judge their work.",
      "**Lead an AI initiative** end to end: scope it, pilot it, and pitch it to decision-makers.",
    ],
    ctaLabel: "See what Professional covers",
    ctaHref: "/tracks/professional",
    micro: "**Your expertise is the hard part — you already have it.** The Professional track adds the AI.",
  },
};

function mapRecommendation(rec: string): TrackKey {
  if (rec === "DEVELOPER") return "developer";
  if (rec === "PROFESSIONAL") return "professional";
  return "runway";
}

const PAGE_CSS = `
  body { background: var(--ink); }
  .done { position: relative; overflow: hidden; min-height: calc(100vh - 76px); display: flex; align-items: center; background: var(--ink); }
  .done-bg { position: absolute; inset: 0; z-index: 0;
    background:
      radial-gradient(1100px 560px at 84% -12%, rgba(242,178,62,0.18), transparent 58%),
      radial-gradient(820px 520px at -4% 112%, rgba(31,94,69,0.30), transparent 60%);
  }
  .done .wrap { position: relative; z-index: 2; padding-top: 70px; padding-bottom: 90px; }
  .done-col { max-width: 720px; margin: 0 auto; }

  .done-eyebrow { display: inline-flex; align-items: center; gap: 11px; font-family: "Space Mono"; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--marigold); }
  .done-eyebrow .ck { width: 24px; height: 24px; border-radius: 50%; background: var(--forest); color: var(--cream); display: grid; place-items: center; font-size: 13px; }

  .done h1 { font-family: "Bricolage Grotesque", sans-serif; font-weight: 800; font-size: clamp(36px, 5.4vw, 60px); line-height: 1.02; letter-spacing: -0.02em; margin-top: 26px; }
  .done h1 em { font-style: normal; color: var(--marigold); }
  .done-lede { font-size: clamp(17px, 1.7vw, 19px); line-height: 1.6; color: #E7DCC8; margin-top: 22px; max-width: 600px; }

  .msh-note { display: flex; gap: 16px; margin-top: 40px; max-width: 640px; }
  .msh-note .av { width: 44px; height: 44px; border-radius: 13px; flex: none; display: grid; place-items: center; font-family: "Bricolage Grotesque", sans-serif; font-weight: 800; font-size: 18px; background: linear-gradient(150deg, var(--marigold), var(--clay)); color: #1a0d06; }
  .msh-note .who { font-family: "Space Mono"; font-size: 10.5px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted-dk); margin-bottom: 8px; }
  .msh-note .msg { background: var(--ink-2); border: 1px solid var(--line-dk); border-top-left-radius: 5px; border-radius: 16px; padding: 17px 21px; font-size: 15.5px; line-height: 1.62; }
  .msh-note .msg strong { color: var(--marigold); font-weight: 600; }
  .msh-note .msg p { margin: 0; }

  .match-card { margin-top: 40px; background: var(--ink-2); border: 1px solid var(--line-dk); border-radius: 22px; overflow: hidden; }
  .match-card .top { padding: 30px 32px 26px; border-bottom: 1px solid var(--line-dk); background: radial-gradient(620px 200px at 100% 0%, color-mix(in srgb, var(--track-accent) 42%, transparent), transparent 70%); }
  .match-card .tag { font-family: "Space Mono"; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted-dk); }
  .match-card .nm { font-family: "Bricolage Grotesque", sans-serif; font-weight: 800; font-size: clamp(28px, 3.4vw, 38px); letter-spacing: -0.015em; margin-top: 12px; display: flex; align-items: baseline; gap: 14px; }
  .match-card .nm .dot { width: 13px; height: 13px; border-radius: 50%; background: var(--track-accent); flex: none; transform: translateY(-2px); }
  .match-card .blurb { font-size: 15.5px; line-height: 1.62; color: #E7DCC8; margin-top: 16px; max-width: 560px; }

  .gains { padding: 26px 32px 30px; display: grid; gap: 16px; }
  .gains .g-h { font-family: "Space Mono"; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted-dk); }
  .gain { display: flex; gap: 14px; align-items: flex-start; }
  .gain .gi { width: 26px; height: 26px; border-radius: 8px; flex: none; display: grid; place-items: center; background: rgba(242,178,62,0.14); color: var(--marigold); font-size: 14px; margin-top: 1px; }
  .gain .gt { font-size: 15.5px; line-height: 1.5; }
  .gain .gt strong { font-weight: 700; }
  .gain .gt p { margin: 0; }

  .done-cta { margin-top: 38px; display: flex; align-items: center; gap: 18px; flex-wrap: wrap; }
  .done-micro { font-family: "Space Mono"; font-size: 12.5px; color: var(--muted-dk); margin-top: 22px; line-height: 1.5; max-width: 600px; }
  .done-micro strong { color: #E7DCC8; font-weight: 400; }
  .done-micro p { margin: 0; }

  .done-loading { min-height: 100vh; background: var(--ink); display: flex; align-items: center; justify-content: center; }
  .done-loading .spin { width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(150deg, var(--marigold), var(--clay)); display: grid; place-items: center; font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 20px; color: #1a0d06; animation: pulse 1.8s ease-in-out infinite; }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
  .done-loading p { font-family: "Space Mono"; font-size: 13px; color: var(--muted-dk); margin-top: 18px; letter-spacing: 0.06em; text-align: center; }

  @media (max-width: 620px) {
    .msh-note { flex-direction: column; gap: 12px; }
    .match-card .top, .gains { padding-left: 22px; padding-right: 22px; }
  }
`;

function CompleteContent() {
  const params = useSearchParams();
  const id = params.get("id");
  const [trackKey, setTrackKey] = useState<TrackKey | null>(null);
  const [firstName, setFirstName] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch("/api/assess/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicantId: id }),
    })
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data) => {
        if (data.error) throw new Error();
        setTrackKey(mapRecommendation(data.recommendation));
        setFirstName(data.firstName || "");
      })
      .catch(() => setError(true));
  }, [id]);

  if (error) {
    return (
      <>
        <style>{PAGE_CSS}</style>
        <div className="done-loading">
          <div style={{ textAlign: "center" }}>
            <div className="spin" style={{ opacity: 0.3, margin: "0 auto" }}>F</div>
            <p style={{ marginTop: 18 }}>Something went wrong.<br />A facilitator will review your assessment manually.</p>
            <Link href="/assess" style={{ display: "inline-block", marginTop: 20, fontFamily: "Space Mono", fontSize: 13, color: "var(--marigold)" }}>
              ← Start a new assessment
            </Link>
          </div>
        </div>
      </>
    );
  }

  if (!trackKey) {
    return (
      <>
        <style>{PAGE_CSS}</style>
        <div className="done-loading">
          <div style={{ textAlign: "center" }}>
            <div className="spin" style={{ margin: "0 auto" }}>F</div>
            <p>Calculating your match…<br />This takes a few seconds.</p>
          </div>
        </div>
      </>
    );
  }

  const t = TRACKS[trackKey];
  const greet = firstName ? `Nice work, ${firstName}.` : "Nice work — you're in.";

  return (
    <>
      <style>{PAGE_CSS}</style>
      <NavBar />
      <section className="done" style={{ color: "var(--cream)" }}>
        <div className="done-bg" />
        <div className="wrap">
          <div className="done-col">
            <div className="done-eyebrow">
              <span className="ck">✓</span> Assessment complete
            </div>

            <h1>
              {greet}<br />
              {t.headlineLead}<em>{t.track}</em>.
            </h1>
            <p className="done-lede">{t.lede}</p>

            <div className="msh-note">
              <div className="av">M</div>
              <div>
                <div className="who">Mshauri</div>
                <div className="msg">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{t.note}</ReactMarkdown>
                </div>
              </div>
            </div>

            <div className="match-card" style={{ "--track-accent": t.accent } as React.CSSProperties}>
              <div className="top">
                <div className="tag">Your matched track</div>
                <div className="nm">
                  <span className="dot" />
                  <span>{t.track}</span>
                </div>
                <div className="blurb">{t.blurb}</div>
              </div>
              <div className="gains">
                <div className="g-h">What you&apos;ll walk away with</div>
                {t.gains.map((g, i) => (
                  <div key={i} className="gain">
                    <span className="gi">›</span>
                    <span className="gt">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{g}</ReactMarkdown>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="done-cta">
              <Link href={trackKey === "runway" ? `/runway${id ? `?applicantId=${id}` : ""}` : "/assess"} className="btn btn-clay btn-lg">
                Reserve my place <span aria-hidden="true">→</span>
              </Link>
              <Link href={t.ctaHref} className="btn btn-ghost-dk btn-lg">
                {t.ctaLabel}
              </Link>
            </div>
            <div className="done-micro">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{t.micro}</ReactMarkdown>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default function CompletePage() {
  return (
    <Suspense fallback={
      <>
        <style>{PAGE_CSS}</style>
        <div className="done-loading">
          <div style={{ textAlign: "center" }}>
            <div className="spin" style={{ margin: "0 auto" }}>F</div>
            <p>Loading…</p>
          </div>
        </div>
      </>
    }>
      <CompleteContent />
    </Suspense>
  );
}
