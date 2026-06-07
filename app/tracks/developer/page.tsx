import Link from "next/link";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Developer Track — The AI Foundry Kampala",
  description: "Build production AI systems from first principles. Twelve weeks of real code, real tools, and a capstone you can put in front of a real client.",
};

const TRACK_CSS = `
  :root { --accent: #D8542B; --accent-deep: #B5421E; }
  .t-hero { background: var(--ink); color: var(--cream); position: relative; overflow: hidden; }
  .t-hero-bg { position: absolute; inset: 0; z-index: 0; background: radial-gradient(1000px 520px at 82% -10%, rgba(216,84,43,0.30), transparent 56%), radial-gradient(640px 420px at 4% 16%, rgba(242,178,62,0.10), transparent 60%); }
  .t-hero .wrap { position: relative; z-index: 2; padding-top: 40px; padding-bottom: 76px; }
  .t-hero .crumb { margin-bottom: 40px; }
  .t-hero .grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: 56px; align-items: end; }
  .t-tag { display: inline-flex; align-items: center; gap: 10px; font-family: "Space Mono"; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; background: var(--accent); color: #1a0d06; padding: 8px 16px; border-radius: 999px; font-weight: 700; }
  .t-hero h1 { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: clamp(54px, 7vw, 96px); letter-spacing: -0.03em; line-height: 0.94; margin-top: 26px; }
  .t-hero .lede { font-size: 20px; line-height: 1.55; color: var(--muted-dk); margin-top: 26px; max-width: 560px; }
  .t-hero .cta-row { display: flex; gap: 14px; margin-top: 36px; }
  .specs { border: 1px solid var(--line-dk); border-radius: 18px; background: var(--ink-2); overflow: hidden; }
  .specs .s-row { display: flex; justify-content: space-between; align-items: center; padding: 18px 22px; border-bottom: 1px solid var(--line-dk); }
  .specs .s-row:last-child { border-bottom: none; }
  .specs .s-row .k { font-family: "Space Mono"; font-size: 12px; color: var(--muted-dk); letter-spacing: 0.04em; }
  .specs .s-row .v { font-family: "Bricolage Grotesque"; font-weight: 700; font-size: 17px; }
  .specs .s-row .v.accent { color: var(--accent); }
  .curric { background: var(--cream); }
  .modules { display: flex; flex-direction: column; gap: 18px; }
  .mod { display: grid; grid-template-columns: 200px 1fr; gap: 36px; padding: 30px 0; border-top: 1px solid var(--line-lt); }
  .mod:first-child { border-top: none; }
  .mod .m-left .m-no { font-family: "Space Mono"; font-size: 12px; color: var(--accent-deep); letter-spacing: 0.06em; }
  .mod .m-left .m-wk { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 24px; margin-top: 8px; line-height: 1.05; }
  .mod .m-left .m-dur { font-family: "Space Mono"; font-size: 12px; color: var(--muted-lt); margin-top: 8px; }
  .mod .m-right h3 { font-family: "Bricolage Grotesque"; font-weight: 700; font-size: 22px; }
  .mod .m-right p { font-size: 15px; line-height: 1.55; color: var(--muted-lt); margin-top: 10px; max-width: 620px; }
  .mod .m-right .topics { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
  .mod .m-right .topics span { font-family: "Space Mono"; font-size: 12px; padding: 6px 12px; border-radius: 999px; background: #fff; border: 1px solid var(--line-lt); color: var(--muted-lt); }
  .outcomes { background: var(--ink); color: var(--cream); }
  .out-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
  .out { display: flex; gap: 16px; padding: 26px; border: 1px solid var(--line-dk); border-radius: 16px; background: var(--ink-2); }
  .out .ic { width: 40px; height: 40px; flex: none; border-radius: 11px; background: var(--accent); color: #1a0d06; display: grid; place-items: center; font-family: "Bricolage Grotesque"; font-weight: 800; }
  .out h3 { font-family: "Bricolage Grotesque"; font-weight: 700; font-size: 18px; }
  .out p { font-size: 14.5px; line-height: 1.55; color: var(--muted-dk); margin-top: 8px; }
  .split { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; }
  .panel { border-radius: 20px; padding: 36px; }
  .panel.prq { background: var(--cream-2); border: 1px solid var(--line-lt); }
  .panel.cap { background: var(--accent); color: var(--cream); position: relative; overflow: hidden; }
  .panel h3 { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 26px; }
  .panel.prq .kick, .panel.cap .kick { font-family: "Space Mono"; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 14px; }
  .panel.prq .kick { color: var(--accent-deep); }
  .panel.cap .kick { color: rgba(255,255,255,0.8); }
  .panel ul { list-style: none; margin-top: 20px; display: flex; flex-direction: column; gap: 13px; }
  .panel li { font-size: 15px; display: flex; gap: 12px; align-items: flex-start; line-height: 1.5; }
  .panel.prq li::before { content: ""; width: 7px; height: 7px; border-radius: 50%; background: var(--forest); margin-top: 7px; flex: none; }
  .panel.cap li::before { content: ""; width: 7px; height: 7px; border-radius: 50%; background: var(--marigold); margin-top: 7px; flex: none; }
  .panel.prq p { font-size: 15px; line-height: 1.55; color: var(--muted-lt); margin-top: 16px; }
  .panel.cap p { font-size: 15.5px; line-height: 1.55; margin-top: 18px; opacity: 0.95; }
  .panel .runway-link { display: inline-flex; margin-top: 22px; font-family: "Space Mono"; font-size: 13px; font-weight: 700; }
  .panel.prq .runway-link { color: var(--accent-deep); }
  .t-final { background: var(--accent); color: #1a0d06; text-align: center; }
  .t-final .wrap { padding-top: 96px; padding-bottom: 96px; }
  .t-final h2 { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: clamp(40px, 6vw, 72px); letter-spacing: -0.025em; line-height: 0.96; }
  .t-final p { font-size: 18px; margin-top: 20px; color: #4a2412; max-width: 520px; margin-inline: auto; }
  .t-final .cta-row { display: flex; gap: 14px; justify-content: center; margin-top: 34px; }
  @media (max-width: 900px) {
    .t-hero .grid, .out-grid, .split { grid-template-columns: 1fr; }
    .mod { grid-template-columns: 1fr; gap: 14px; }
  }
`;

export default function DeveloperTrackPage() {
  return (
    <>
      <style>{TRACK_CSS}</style>
      <NavBar activePage="tracks" />

      <section className="t-hero">
        <div className="t-hero-bg" />
        <div className="wrap">
          <div className="crumb">
            <Link href="/#tracks">Tracks</Link> <span className="sep">/</span> <span>Developer</span>
          </div>
          <div className="grid">
            <div>
              <span className="t-tag">Track 01 · Code-first</span>
              <h1>Developer</h1>
              <p className="lede">Build production AI systems from first principles. Twelve weeks of real code, real tools, and a capstone you can put in front of a real client.</p>
              <div className="cta-row">
                <Link href="/assess" className="btn btn-clay btn-lg">Apply for this track <span aria-hidden="true">→</span></Link>
                <Link href="/mshauri" className="btn btn-ghost-dk btn-lg">Ask Mshauri about it</Link>
              </div>
            </div>
            <div className="specs">
              <div className="s-row"><span className="k">Duration</span><span className="v">12 weeks</span></div>
              <div className="s-row"><span className="k">Format</span><span className="v">Code-first</span></div>
              <div className="s-row"><span className="k">Commitment</span><span className="v">10–20 hrs / week</span></div>
              <div className="s-row"><span className="k">Labs</span><span className="v accent">Saturdays</span></div>
              <div className="s-row"><span className="k">Capstone</span><span className="v">Shipped &amp; deployed</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="curric pad">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <div className="sec-kicker">// Curriculum</div>
              <h2>What you&apos;ll learn</h2>
            </div>
            <p>Four modules, twelve weeks. Each ends with something you&apos;ve actually built.</p>
          </div>
          <div className="modules">
            <div className="mod">
              <div className="m-left">
                <div className="m-no">Module 01</div>
                <div className="m-wk">Foundations</div>
                <div className="m-dur">Weeks 1–3</div>
              </div>
              <div className="m-right">
                <h3>Mental models &amp; the dev loop</h3>
                <p>How LLMs actually work, what they can and can&apos;t do, and the engineering loop around them. You&apos;ll set up your environment and ship your first context-engineered script.</p>
                <div className="topics"><span>LLM internals</span><span>Prompt vs. context</span><span>Tokens &amp; cost</span><span>Dev environment</span></div>
              </div>
            </div>
            <div className="mod">
              <div className="m-left">
                <div className="m-no">Module 02</div>
                <div className="m-wk">Retrieval &amp; RAG</div>
                <div className="m-dur">Weeks 4–6</div>
              </div>
              <div className="m-right">
                <h3>Give the model the right material</h3>
                <p>Embeddings, vector stores, and chunking strategies. You&apos;ll build a retrieval pipeline that answers questions over a real Kampala dataset — and learn why most RAG returns junk.</p>
                <div className="topics"><span>Embeddings</span><span>Vector stores</span><span>Chunking</span><span>Eval &amp; retrieval quality</span></div>
              </div>
            </div>
            <div className="mod">
              <div className="m-left">
                <div className="m-no">Module 03</div>
                <div className="m-wk">Agents &amp; tools</div>
                <div className="m-dur">Weeks 7–9</div>
              </div>
              <div className="m-right">
                <h3>Systems that take action</h3>
                <p>Function calling, multi-step agents, and guardrails. You&apos;ll wire an agent to real tools — payments, messaging, a database — and learn to evaluate whether it actually works.</p>
                <div className="topics"><span>Tool calling</span><span>Multi-step agents</span><span>Guardrails</span><span>Evaluation</span></div>
              </div>
            </div>
            <div className="mod">
              <div className="m-left">
                <div className="m-no">Module 04</div>
                <div className="m-wk">Ship it</div>
                <div className="m-dur">Weeks 10–12</div>
              </div>
              <div className="m-right">
                <h3>Deploy, monitor, hand over</h3>
                <p>Take your capstone to production: deployment, logging, cost control, and monitoring. You&apos;ll present a working system to a panel — and to a real prospective client.</p>
                <div className="topics"><span>Deployment</span><span>Monitoring</span><span>Cost control</span><span>Capstone demo</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="outcomes pad">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <div className="sec-kicker" style={{ color: "var(--marigold)" }}>// Outcomes</div>
              <h2>What you&apos;ll be able to do</h2>
            </div>
            <p style={{ color: "var(--muted-dk)" }}>By graduation — not &ldquo;exposure to&rdquo;, but able to do unaided.</p>
          </div>
          <div className="out-grid">
            <div className="out"><div className="ic">1</div><div><h3>Ship a working AI agent</h3><p>Design, build, and deploy an agent that uses real tools and handles real inputs — not a notebook demo.</p></div></div>
            <div className="out"><div className="ic">2</div><div><h3>Build retrieval that works</h3><p>Stand up a RAG pipeline and actually measure whether it&apos;s returning the right thing.</p></div></div>
            <div className="out"><div className="ic">3</div><div><h3>Deploy to production</h3><p>Get a system live, monitored, and cost-controlled — and keep it running.</p></div></div>
            <div className="out"><div className="ic">4</div><div><h3>Read &amp; write specs</h3><p>Scope a problem, write the spec, and communicate trade-offs to a non-technical client.</p></div></div>
          </div>
        </div>
      </section>

      <section className="curric pad">
        <div className="wrap">
          <div className="split">
            <div className="panel prq">
              <div className="kick">Before you start</div>
              <h3>Prerequisites</h3>
              <ul>
                <li>Comfort with at least one programming language — Python is ideal</li>
                <li>Git and GitHub basics: clone, commit, push, branch</li>
                <li>You can find your way around a terminal</li>
                <li>10–20 hours a week, including Saturday Fusion Labs</li>
              </ul>
              <p>Not there yet? That&apos;s exactly what the Runway track is for.</p>
              <Link href="/tracks/runway" className="runway-link">Explore Runway →</Link>
            </div>
            <div className="panel cap">
              <div className="kick">Your capstone</div>
              <h3>Build something real</h3>
              <p>Developer capstones solve actual Kampala problems. Past cohorts shipped Duka Accountant and Boda Dispatch — systems with real users, not toy demos.</p>
              <ul>
                <li>Scoped with a facilitator in Week 4</li>
                <li>Built across Modules 3 &amp; 4</li>
                <li>Demoed to a panel and a prospective client</li>
              </ul>
              <Link href="/capstones" className="runway-link">See past capstones →</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="t-final">
        <div className="wrap">
          <h2>Think you&apos;re a fit?</h2>
          <p>Take the 10-minute intake assessment. Mshauri will confirm whether Developer is your track — or point you somewhere better.</p>
          <div className="cta-row">
            <Link href="/assess" className="btn btn-ink btn-lg">Take the assessment <span aria-hidden="true">→</span></Link>
            <Link href="/#tracks" className="btn btn-out-ink btn-lg">Compare tracks</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
