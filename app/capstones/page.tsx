"use client";
import { useState } from "react";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const PAGE_CSS = `
  .c-hero { background: var(--ink); color: var(--cream); position: relative; overflow: hidden; }
  .c-hero-bg { position: absolute; inset: 0; z-index: 0; background: radial-gradient(900px 480px at 84% -12%, rgba(216,84,43,0.26), transparent 56%), radial-gradient(620px 420px at 6% 20%, rgba(31,94,69,0.24), transparent 60%); }
  .c-hero .wrap { position: relative; z-index: 2; padding-top: 40px; padding-bottom: 60px; }
  .c-hero .crumb { margin-bottom: 36px; }
  .c-hero h1 { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: clamp(50px, 6.5vw, 88px); letter-spacing: -0.03em; line-height: 0.95; max-width: 16ch; }
  .c-hero .lede { font-size: 20px; line-height: 1.55; color: var(--muted-dk); margin-top: 26px; max-width: 620px; }
  .c-hero .kpis { display: flex; gap: 48px; margin-top: 44px; }
  .c-hero .kpi .n { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 40px; letter-spacing: -0.02em; }
  .c-hero .kpi .n em { color: var(--clay); font-style: normal; }
  .c-hero .kpi .l { font-family: "Space Mono"; font-size: 11.5px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted-dk); margin-top: 6px; }

  .filterbar { background: var(--cream); border-bottom: 1px solid var(--line-lt); position: sticky; top: 76px; z-index: 30; }
  .filterbar .wrap { display: flex; align-items: center; gap: 14px; padding-top: 20px; padding-bottom: 20px; }
  .filterbar .lbl { font-family: "Space Mono"; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted-lt); margin-right: 6px; }
  .fchip { font-family: "Archivo"; font-weight: 600; font-size: 14px; padding: 10px 18px; border-radius: 999px; border: 1.5px solid var(--line-lt); background: #fff; color: var(--muted-lt); cursor: pointer; transition: all .15s; }
  .fchip:hover { border-color: var(--ink); color: var(--ink); }
  .fchip.on { background: var(--ink); border-color: var(--ink); color: var(--cream); }
  .filterbar .count { margin-left: auto; font-family: "Space Mono"; font-size: 12px; color: var(--muted-lt); }

  .gallery { background: var(--cream); padding: 56px 0 100px; }
  .feature { display: grid; grid-template-columns: 1.1fr 1fr; gap: 0; border-radius: 24px; overflow: hidden; margin-bottom: 22px; border: 1px solid var(--line-lt); }
  .feature .f-art { background: var(--clay); padding: 46px; color: var(--cream); position: relative; display: flex; flex-direction: column; }
  .feature .f-art .badge { font-family: "Space Mono"; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; background: rgba(0,0,0,0.18); width: fit-content; padding: 7px 14px; border-radius: 999px; }
  .feature .f-art h2 { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 46px; letter-spacing: -0.02em; margin-top: 20px; line-height: 1; }
  .feature .f-art .sub { font-size: 17px; margin-top: 12px; opacity: 0.92; font-weight: 500; }
  .feature .f-art .glyph { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 200px; line-height: 1; position: absolute; right: 30px; bottom: -28px; opacity: 0.12; }
  .feature .f-art .by { margin-top: auto; font-family: "Space Mono"; font-size: 12.5px; opacity: 0.85; padding-top: 30px; }
  .feature .f-body { background: #fff; padding: 46px; display: flex; flex-direction: column; }
  .feature .f-body .problem { font-family: "Space Mono"; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--clay-deep); }
  .feature .f-body p { font-size: 16px; line-height: 1.6; color: var(--muted-lt); margin-top: 14px; }
  .feature .f-body p.big { color: var(--ink); font-size: 17px; }
  .feature .f-body .stack { display: flex; flex-wrap: wrap; gap: 8px; margin-top: auto; padding-top: 28px; }
  .feature .f-body .stack span { font-family: "Space Mono"; font-size: 12px; padding: 6px 12px; border-radius: 999px; background: var(--cream-2); color: var(--muted-lt); }

  .cap-gal { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
  .card { background: #fff; border: 1px solid var(--line-lt); border-radius: 20px; overflow: hidden; display: flex; flex-direction: column; }
  .card .c-top { padding: 26px 26px 24px; color: var(--cream); position: relative; overflow: hidden; }
  .card.k-clay .c-top { background: var(--clay); }
  .card.k-forest .c-top { background: var(--forest); }
  .card.k-plum .c-top { background: var(--plum); }
  .card.k-marigold .c-top { background: var(--marigold); color: #1a0d06; }
  .card .c-top .tag { font-family: "Space Mono"; font-size: 10.5px; letter-spacing: 0.08em; text-transform: uppercase; opacity: 0.82; }
  .card .c-top h3 { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 26px; margin-top: 10px; letter-spacing: -0.01em; }
  .card .c-top .sub { font-size: 14px; margin-top: 6px; opacity: 0.92; font-weight: 500; }
  .card .c-top .glyph { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 120px; position: absolute; right: 12px; bottom: -34px; opacity: 0.13; line-height: 1; }
  .card .c-in { padding: 24px 26px 26px; display: flex; flex-direction: column; flex: 1; }
  .card .c-in p { font-size: 14.5px; line-height: 1.55; color: var(--muted-lt); }
  .card .c-in .stack { display: flex; flex-wrap: wrap; gap: 7px; margin: 18px 0; }
  .card .c-in .stack span { font-family: "Space Mono"; font-size: 11.5px; padding: 5px 11px; border-radius: 999px; background: var(--cream-2); color: var(--muted-lt); }
  .card .c-in .by { margin-top: auto; padding-top: 18px; border-top: 1px solid var(--line-lt); font-family: "Space Mono"; font-size: 12px; color: var(--muted-lt); display: flex; justify-content: space-between; }

  .c-final { background: var(--forest); color: var(--cream); text-align: center; }
  .c-final .wrap { padding-top: 92px; padding-bottom: 92px; }
  .c-final h2 { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: clamp(38px, 5.5vw, 64px); letter-spacing: -0.02em; line-height: 0.98; }
  .c-final p { font-size: 18px; margin-top: 20px; color: #d8e6df; max-width: 520px; margin-inline: auto; }
  .c-final .cta-row { display: flex; gap: 14px; justify-content: center; margin-top: 34px; }

  @media (max-width: 900px) {
    .feature, .cap-gal { grid-template-columns: 1fr; }
    .filterbar .wrap { flex-wrap: wrap; }
    .c-hero .kpis { flex-wrap: wrap; gap: 28px; }
  }
`;

type Filter = "all" | "developer" | "professional";

export default function CapstoneGalleryPage() {
  const [filter, setFilter] = useState<Filter>("all");

  const devCards = [
    { id: "boda", color: "k-forest", tag: "Developer · Cohort 5", title: "Boda Dispatch", sub: "Intelligent route & load dispatch", glyph: "→", desc: "Assigns delivery jobs to boda boda riders by location, capacity, and live traffic, sends WhatsApp confirmations, and logs every drop for the rider's record.", stack: ["Python", "Agents", "Maps API", "WhatsApp"], by: "David O.", status: "In pilot" },
    { id: "market", color: "k-clay", tag: "Developer · Cohort 4", title: "Market Price Bot", sub: "Daily produce prices by SMS", glyph: "¤", desc: "Crowdsources produce prices from market vendors, validates outliers, and texts farmers a daily price range so they know what to charge before they travel.", stack: ["Python", "SMS", "Data validation"], by: "Isaac M.", status: "In use" },
    { id: "harvest", color: "k-plum", tag: "Developer · Cohort 5", title: "Harvest Logger", sub: "Voice-note yield tracking", glyph: "◴", desc: "Farmers send a voice note after each harvest; the system transcribes, extracts crop and quantity, and builds a season log they can show a lender.", stack: ["Python", "Speech-to-text", "Agents"], by: "Brian T.", status: "Prototype" },
  ];

  const proCards = [
    { id: "school", color: "k-plum", tag: "Professional · Cohort 5", title: "School Fees Tracker", sub: "Payment reconciliation", glyph: "∑", desc: "Matches bank deposits against student records, flags outstanding balances, sends SMS reminders, and produces a monthly report for the bursar.", stack: ["No-code", "Automation", "SMS", "Sheets"], by: "Grace N.", status: "Adopted" },
    { id: "clinic", color: "k-forest", tag: "Professional · Cohort 4", title: "Clinic Intake Assistant", sub: "Triage & records for a health post", glyph: "+", desc: "Guides front-desk staff through patient intake, structures symptoms into a record, and prioritises the queue — cutting wait times at a Wakiso health post.", stack: ["No-code", "Forms", "Triage logic"], by: "Patricia A.", status: "Piloted" },
    { id: "sacco", color: "k-marigold", tag: "Professional · Cohort 3", title: "SACCO Statements", sub: "Plain-language savings reports", glyph: "§", desc: "Turns a savings group's messy ledger into a clear monthly statement for every member, in their language — read aloud at meetings and trusted by all.", stack: ["No-code", "Automation", "Translation"], by: "Janet W.", status: "Adopted" },
  ];

  const visibleDev = filter === "professional" ? [] : devCards;
  const visiblePro = filter === "developer" ? [] : proCards;
  const totalVisible = (filter === "all" ? 7 : filter === "developer" ? 4 : 3);

  return (
    <>
      <style>{PAGE_CSS}</style>
      <NavBar activePage="capstones" />

      <section className="c-hero">
        <div className="c-hero-bg" />
        <div className="wrap">
          <div className="crumb"><Link href="/">Home</Link> <span className="sep">/</span> <span>Capstones</span></div>
          <h1>Real systems, real clients.</h1>
          <p className="lede">Every Foundry graduate ships a capstone built around an actual Kampala problem — not a toy demo. Here&apos;s what recent cohorts built.</p>
          <div className="kpis">
            <div className="kpi"><div className="n"><em>40</em>+</div><div className="l">Capstones shipped</div></div>
            <div className="kpi"><div className="n">12</div><div className="l">In active use</div></div>
            <div className="kpi"><div className="n">6</div><div className="l">Cohorts</div></div>
          </div>
        </div>
      </section>

      <div className="filterbar">
        <div className="wrap">
          <span className="lbl">Filter</span>
          <button className={`fchip${filter === "all" ? " on" : ""}`} onClick={() => setFilter("all")}>All</button>
          <button className={`fchip${filter === "developer" ? " on" : ""}`} onClick={() => setFilter("developer")}>Developer</button>
          <button className={`fchip${filter === "professional" ? " on" : ""}`} onClick={() => setFilter("professional")}>Professional</button>
          <span className="count">Showing {totalVisible} of 40</span>
        </div>
      </div>

      <section className="gallery">
        <div className="wrap">
          {filter !== "professional" && (
            <div className="feature">
              <div className="f-art">
                <span className="badge">Developer · Cohort 5 · Featured</span>
                <h2>Duka Accountant</h2>
                <div className="sub">AI bookkeeper for informal traders</div>
                <span className="glyph">₵</span>
                <div className="by">Built by Amara K. · now used by 30+ dukas in Nakawa</div>
              </div>
              <div className="f-body">
                <div className="problem">The problem</div>
                <p className="big">Most small traders keep no books at all — money moves through mobile money and memory, and at month-end nobody knows if they made a profit.</p>
                <p>Duka Accountant reads M-Pesa and MTN MoMo transaction history, categorises every expense and sale, flags anomalies, and produces a weekly cash-flow summary in plain Luganda or English — over WhatsApp, where traders already are.</p>
                <div className="stack"><span>Python</span><span>RAG</span><span>WhatsApp API</span><span>MoMo data</span><span>Deployed</span></div>
              </div>
            </div>
          )}

          {(visibleDev.length > 0 || visiblePro.length > 0) && (
            <div className="cap-gal">
              {[...visibleDev, ...visiblePro].map((c) => (
                <div key={c.id} className={`card ${c.color}`}>
                  <div className="c-top">
                    <div className="tag">{c.tag}</div>
                    <h3>{c.title}</h3>
                    <div className="sub">{c.sub}</div>
                    <span className="glyph">{c.glyph}</span>
                  </div>
                  <div className="c-in">
                    <p>{c.desc}</p>
                    <div className="stack">{c.stack.map((s) => <span key={s}>{s}</span>)}</div>
                    <div className="by"><span>{c.by}</span><span>{c.status}</span></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="c-final">
        <div className="wrap">
          <h2>Your name could be on this wall</h2>
          <p>Every track ends in a capstone. Start with the assessment and Mshauri will help you find the problem worth solving.</p>
          <div className="cta-row">
            <Link href="/assess" className="btn btn-cream btn-lg">Take the assessment <span aria-hidden="true">→</span></Link>
            <Link href="/#tracks" className="btn btn-ghost-dk btn-lg">Explore tracks</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
