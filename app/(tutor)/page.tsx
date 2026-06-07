import Link from "next/link";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "The AI Foundry Kampala — Build With AI",
  description: "Uganda's AI learning hub. Intensive tracks for developers, professionals, and first-time builders.",
};

export default function LandingPage() {
  return (
    <>
      <style>{`
        /* HERO */
        .lp-hero { background: var(--ink); color: var(--cream); position: relative; overflow: hidden; }
        .lp-hero-bg { position: absolute; inset: 0; z-index: 0;
          background:
            radial-gradient(1100px 520px at 82% -8%, rgba(216,84,43,0.30), transparent 56%),
            radial-gradient(760px 460px at 6% 14%, rgba(242,178,62,0.13), transparent 60%);
        }
        .lp-hero-inner { position: relative; z-index: 2; padding-top: 92px; padding-bottom: 78px; }
        .lp-eyebrow { display: inline-flex; align-items: center; gap: 11px; white-space: nowrap; font-family: "Space Mono"; font-weight: 700; font-size: 12.5px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--cream); background: var(--forest); padding: 9px 18px 9px 16px; border-radius: 999px; margin-bottom: 32px; }
        .lp-eyebrow .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--marigold); flex: none; }
        .lp-eyebrow .hl { color: var(--marigold); }
        h1.hero-h { font-family: "Bricolage Grotesque"; font-size: clamp(50px, 7.4vw, 104px); line-height: 1.0; font-weight: 700; letter-spacing: -0.035em; max-width: 1150px; padding-bottom: 0.06em; }
        .hero-h .clay-word { color: var(--clay); }
        .hero-h .molten { background: linear-gradient(96deg, var(--marigold) 4%, var(--clay) 56%, var(--clay-deep) 100%); -webkit-background-clip: text; background-clip: text; color: transparent; font-style: italic; font-weight: 600; }
        .lp-lede { margin-top: 32px; max-width: 620px; font-size: 20px; line-height: 1.55; color: var(--muted-dk); }
        .cta-row { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 40px; }
        .lp-strip { position: relative; z-index: 2; margin-top: 78px; border-top: 1px solid var(--line-dk); display: grid; grid-template-columns: repeat(4, 1fr); }
        .lp-strip .cell { padding: 30px 8px 24px 0; border-right: 1px solid var(--line-dk); }
        .lp-strip .cell:last-child { border-right: none; }
        .lp-strip .num { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 40px; letter-spacing: -0.02em; }
        .lp-strip .num em { color: var(--clay); font-style: normal; }
        .lp-strip .lbl { margin-top: 8px; font-family: "Space Mono"; font-size: 11.5px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted-dk); }

        /* TICKER */
        .lp-ticker { background: var(--ink); color: var(--cream); border-top: 1px solid var(--line-dk); padding: 18px 0; overflow: hidden; white-space: nowrap; }
        .lp-ticker .ticker-track { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 18px; letter-spacing: 0.03em; text-transform: uppercase; }
        .lp-ticker .ticker-track .o { color: var(--marigold); }

        /* TRACKS */
        .track-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
        .track { border-radius: 22px; padding: 34px 30px; color: var(--cream); position: relative; overflow: hidden; display: flex; flex-direction: column; }
        .track.t1 { background: var(--clay); }
        .track.t2 { background: var(--forest); }
        .track.t3 { background: var(--plum); }
        .track .t-idx { font-family: "Space Mono"; font-size: 12px; letter-spacing: 0.08em; opacity: 0.82; }
        .track h3 { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 30px; text-transform: uppercase; margin-top: 12px; letter-spacing: -0.01em; }
        .track .t-meta { font-family: "Space Mono"; font-size: 12.5px; margin-top: 8px; opacity: 0.9; }
        .track > p { font-size: 14.5px; line-height: 1.55; margin-top: 18px; opacity: 0.95; }
        .track ul { list-style: none; margin-top: 22px; display: flex; flex-direction: column; gap: 11px; }
        .track li { font-size: 14.5px; display: flex; align-items: flex-start; gap: 11px; font-weight: 500; }
        .track li::before { content: ""; width: 7px; height: 7px; border-radius: 50%; background: var(--marigold); margin-top: 7px; flex: none; }
        .track .t-foot { margin-top: auto; padding-top: 28px; }
        .t-link { font-family: "Space Mono"; font-size: 13px; font-weight: 700; display: inline-flex; align-items: center; gap: 8px; color: var(--cream); }
        .t-link .circle { width: 30px; height: 30px; border-radius: 50%; background: var(--cream); color: var(--ink); display: grid; place-items: center; font-size: 15px; transition: transform .15s; flex-shrink: 0; }
        .t-link:hover .circle { transform: translateX(3px); }

        /* HOW IT WORKS */
        .lp-how { background: var(--ink); color: var(--cream); }
        .lp-how .sec-head p { color: var(--muted-dk); text-align: right; }
        .steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; }
        .step { padding: 0 36px; border-left: 1px solid var(--line-dk); }
        .step:first-child { padding-left: 0; border-left: none; }
        .step .s-no { font-family: "Bricolage Grotesque"; font-weight: 900; font-size: 60px; color: var(--marigold); letter-spacing: -0.02em; line-height: 1; }
        .step h3 { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 21px; text-transform: uppercase; margin-top: 22px; letter-spacing: -0.005em; }
        .step p { color: var(--muted-dk); font-size: 15.5px; line-height: 1.58; margin-top: 14px; }

        /* CAPSTONES */
        .cap-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
        .cap { border-radius: 22px; overflow: hidden; border: 1px solid var(--line-lt); background: #fff; display: flex; flex-direction: column; }
        .cap .c-bar { height: 10px; }
        .cap.c1 .c-bar { background: var(--clay); }
        .cap.c2 .c-bar { background: var(--forest); }
        .cap.c3 .c-bar { background: var(--plum); }
        .cap .c-body { padding: 30px 30px 34px; display: flex; flex-direction: column; flex: 1; }
        .cap .c-tag { font-family: "Space Mono"; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--clay-deep); }
        .cap.c2 .c-tag { color: var(--forest); }
        .cap.c3 .c-tag { color: var(--plum); }
        .cap h3 { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 25px; margin-top: 14px; letter-spacing: -0.01em; }
        .cap .c-sub { font-size: 14.5px; margin-top: 6px; color: var(--muted-lt); font-weight: 600; }
        .cap p { font-size: 14.5px; line-height: 1.56; margin-top: 18px; color: var(--muted-lt); }

        /* MSHAURI */
        .lp-mshauri { background: var(--forest); color: var(--cream); }
        .msh-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
        .msh-copy .badge { display: inline-flex; align-items: center; gap: 10px; font-family: "Space Mono"; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; background: rgba(244,236,221,0.12); padding: 8px 16px; border-radius: 999px; }
        .msh-copy .badge .live { width: 8px; height: 8px; border-radius: 50%; background: var(--marigold); animation: msh-pulse 2.2s infinite; flex-shrink: 0; }
        @keyframes msh-pulse { 0% { box-shadow: 0 0 0 0 rgba(242,178,62,0.5); } 70% { box-shadow: 0 0 0 12px rgba(242,178,62,0); } 100% { box-shadow: 0 0 0 0 rgba(242,178,62,0); } }
        .msh-copy h2 { font-family: "Bricolage Grotesque"; font-weight: 900; font-size: clamp(38px,5vw,58px); text-transform: uppercase; letter-spacing: -0.015em; margin-top: 24px; line-height: 0.96; }
        .msh-copy p { font-size: 17px; line-height: 1.6; color: #d8e6df; margin-top: 22px; max-width: 460px; }
        .msh-copy .cta-row { margin-top: 34px; }
        .msh-chat { background: var(--ink); border-radius: 20px; padding: 26px; border: 1px solid rgba(244,236,221,0.1); box-shadow: 0 30px 60px rgba(0,0,0,0.35); }
        .msh-chat .chat-top { display: flex; align-items: center; gap: 10px; font-family: "Space Mono"; font-size: 11.5px; color: var(--muted-dk); padding-bottom: 18px; border-bottom: 1px solid var(--line-dk); }
        .msh-chat .chat-top .av { width: 26px; height: 26px; border-radius: 8px; background: linear-gradient(150deg, var(--marigold), var(--clay)); flex-shrink: 0; }
        .bubble { margin-top: 18px; }
        .bubble .who { font-family: "Space Mono"; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted-dk); margin-bottom: 8px; }
        .bubble .msg { font-size: 15px; line-height: 1.55; padding: 14px 18px; border-radius: 14px; color: var(--cream); }
        .bubble.you .msg { background: var(--ink-2); border-bottom-right-radius: 4px; }
        .bubble.bot .msg { background: rgba(242,178,62,0.12); border: 1px solid rgba(242,178,62,0.22); border-bottom-left-radius: 4px; }

        /* FINAL CTA */
        .lp-final { background: var(--marigold); color: var(--ink); text-align: center; }
        .lp-final .wrap { padding-top: 110px; padding-bottom: 110px; }
        .lp-final h2 { font-family: "Bricolage Grotesque"; font-weight: 900; font-size: clamp(46px,7vw,90px); text-transform: uppercase; letter-spacing: -0.025em; line-height: 0.95; }
        .lp-final p { font-size: 19px; margin-top: 24px; color: #5a3f12; max-width: 540px; margin-inline: auto; line-height: 1.5; }
        .lp-final .cta-row { justify-content: center; margin-top: 40px; }

        @media (max-width: 980px) {
          .track-grid, .cap-grid, .steps { grid-template-columns: 1fr; }
          .step { border-left: none; padding: 0; border-top: 1px solid var(--line-dk); padding-top: 28px; }
          .step:first-child { border-top: none; }
          .msh-grid { grid-template-columns: 1fr; gap: 40px; }
          .lp-strip { grid-template-columns: repeat(2, 1fr); }
          .lp-strip .cell:nth-child(2) { border-right: none; }
        }
      `}</style>

      <NavBar />

      {/* HERO */}
      <section className="lp-hero">
        <div className="lp-hero-bg" />
        <div className="wrap lp-hero-inner">
          <div className="lp-eyebrow">
            <span className="dot" /> Kampala, Uganda · <span className="hl">Intensive AI Training</span>
          </div>
          <h1 className="hero-h">
            Build with <span className="clay-word">AI.</span><br />
            Forged in <span className="molten">Kampala.</span>
          </h1>
          <p className="lp-lede">An intensive learning hub training developers, analysts, and domain experts to build real AI systems — grounded in Kampala problems, Kampala context.</p>
          <div className="cta-row">
            <Link href="/assess" className="btn btn-clay btn-lg">Apply — take the assessment <span aria-hidden="true">→</span></Link>
            <Link href="/mshauri" className="btn btn-ghost-dk btn-lg">Talk to Mshauri</Link>
          </div>
          <div className="lp-strip">
            <div className="cell"><div className="num"><em>3</em></div><div className="lbl">Learning tracks</div></div>
            <div className="cell"><div className="num">12 wks</div><div className="lbl">Core cohort</div></div>
            <div className="cell"><div className="num">Sat</div><div className="lbl">Fusion Labs</div></div>
            <div className="cell"><div className="num">24/7</div><div className="lbl">Mshauri advisor</div></div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="lp-ticker">
        <div className="ticker-track">
          <span>Duka Accountant</span><span className="o">✦</span>
          <span>Boda Dispatch</span><span className="o">✦</span>
          <span>School Fees Tracker</span><span className="o">✦</span>
          <span>Real systems, real clients</span><span className="o">✦</span>
          <span>Duka Accountant</span><span className="o">✦</span>
          <span>Boda Dispatch</span><span className="o">✦</span>
          <span>School Fees Tracker</span><span className="o">✦</span>
          <span>Real systems, real clients</span><span className="o">✦</span>
        </div>
      </div>

      {/* TRACKS */}
      <section className="pad" id="tracks">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <div className="sec-kicker">// Programmes</div>
              <h2>Choose<br />your path</h2>
            </div>
            <p>Three tracks designed around where you are — and where the work is.</p>
          </div>
          <div className="track-grid">
            <div className="track t1">
              <div className="t-idx">01 — DEVELOPER</div>
              <h3>Developer</h3>
              <div className="t-meta">12 weeks · code-first</div>
              <p>Build production AI agents, RAG pipelines, and deployed applications from first principles. Kampala-context problems, real code, real tools.</p>
              <ul>
                <li>Ship a working AI agent</li>
                <li>Deploy to production</li>
                <li>Read and write specs</li>
              </ul>
              <div className="t-foot"><Link href="/tracks/developer" className="t-link">Explore this track <span className="circle">→</span></Link></div>
            </div>
            <div className="track t2">
              <div className="t-idx">02 — PROFESSIONAL</div>
              <h3>Professional</h3>
              <div className="t-meta">12 weeks · no-code friendly</div>
              <p>Apply AI to your domain. Automate workflows, audit AI systems, and scope agents for your organisation. No coding required.</p>
              <ul>
                <li>Map and automate a workflow</li>
                <li>Write an AI project spec</li>
                <li>Lead AI transformation</li>
              </ul>
              <div className="t-foot"><Link href="/tracks/professional" className="t-link">Explore this track <span className="circle">→</span></Link></div>
            </div>
            <div className="track t3">
              <div className="t-idx">03 — RUNWAY</div>
              <h3>Runway</h3>
              <div className="t-meta">4 modules · self-paced</div>
              <p>Terminal, Git, Python basics, and a mini-project. The foundation for students who need technical confidence before the Developer track.</p>
              <ul>
                <li>Navigate the terminal</li>
                <li>Push code to GitHub</li>
                <li>Write a Python script</li>
              </ul>
              <div className="t-foot"><Link href="/tracks/runway" className="t-link">Explore this track <span className="circle">→</span></Link></div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="lp-how pad" id="how">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <div className="sec-kicker">// Process</div>
              <h2>How it works</h2>
            </div>
            <p>From first contact to a shipped capstone in twelve weeks.</p>
          </div>
          <div className="steps">
            <div className="step">
              <div className="s-no">01</div>
              <h3>Take the intake assessment</h3>
              <p>A 10-minute conversation with Mshauri, our AI advisor. No exam — just a chat to understand where you are and where you want to go.</p>
            </div>
            <div className="step">
              <div className="s-no">02</div>
              <h3>Get placed on the right path</h3>
              <p>Mshauri scores your responses across 8 signals and recommends Developer, Professional, or Runway. The facilitator confirms your cohort start date.</p>
            </div>
            <div className="step">
              <div className="s-no">03</div>
              <h3>Build with your cohort</h3>
              <p>12 weeks of structured learning, Saturday Fusion Labs, and a capstone project you can put in front of a real client.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CAPSTONES */}
      <section className="pad" id="build">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <div className="sec-kicker">// Capstones</div>
              <h2>What you&apos;ll build</h2>
            </div>
            <p>Real systems built around real Kampala problems — not toy demos.</p>
          </div>
          <div className="cap-grid">
            <div className="cap c1">
              <div className="c-bar" />
              <div className="c-body">
                <div className="c-tag">Developer capstone</div>
                <h3>Duka Accountant</h3>
                <div className="c-sub">AI bookkeeper for informal traders</div>
                <p>Reads M-Pesa and MTN MoMo transaction history. Categorises expenses, flags anomalies, and produces a weekly cash-flow summary in plain language.</p>
              </div>
            </div>
            <div className="cap c2">
              <div className="c-bar" />
              <div className="c-body">
                <div className="c-tag">Developer capstone</div>
                <h3>Boda Dispatch</h3>
                <div className="c-sub">Intelligent route and load dispatch</div>
                <p>Assigns delivery jobs to boda boda riders based on location, capacity, and traffic. Sends WhatsApp confirmations. Logs every delivery.</p>
              </div>
            </div>
            <div className="cap c3">
              <div className="c-bar" />
              <div className="c-body">
                <div className="c-tag">Professional capstone</div>
                <h3>School Fees Tracker</h3>
                <div className="c-sub">Payment reconciliation for administrators</div>
                <p>Matches bank deposits against student records, flags outstanding balances, sends SMS reminders, and produces a monthly report for the bursar.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MSHAURI */}
      <section className="lp-mshauri pad" id="mshauri">
        <div className="wrap msh-grid">
          <div className="msh-copy">
            <span className="badge"><span className="live" /> AI Advisor · Available 24/7</span>
            <h2>Meet Mshauri</h2>
            <p>Your personal AI advisor — trained on the Foundry curriculum, available any time. Ask it anything: explain a concept, review your code approach, challenge an idea, or tell you what to tackle next. It knows your track and your week.</p>
            <div className="cta-row">
              <Link href="/mshauri" className="btn btn-cream btn-lg">Start a conversation <span aria-hidden="true">→</span></Link>
            </div>
          </div>
          <div className="msh-chat">
            <div className="chat-top"><span className="av" /> Mshauri · Developer track · Week 3</div>
            <div className="bubble you">
              <div className="who">You</div>
              <div className="msg">What is context engineering and why does it matter more than prompt engineering?</div>
            </div>
            <div className="bubble bot">
              <div className="who">Mshauri</div>
              <div className="msg">Prompt engineering asks &ldquo;what do I say?&rdquo; Context engineering asks &ldquo;what does the model need to know to do its job well?&rdquo; — think of it like briefing a new market vendor versus just telling them what to sell today. Week 3 goes deep on this.</div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="lp-final" id="apply">
        <div className="wrap">
          <h2>Ready to build?</h2>
          <p>The assessment takes 10 minutes. Mshauri will guide you through it — no pressure, no exam.</p>
          <div className="cta-row">
            <Link href="/assess" className="btn btn-ink btn-lg">Take the intake assessment <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
