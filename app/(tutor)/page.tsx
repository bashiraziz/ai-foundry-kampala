import Link from "next/link";

export const metadata = {
  title: "The AI Foundry Kampala — Build With AI",
  description: "Uganda's AI learning hub. Intensive tracks for developers, professionals, and first-time builders.",
};

export default function LandingPage() {
  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --cream: #F4ECDD;
          --cream-2: #EBE0CD;
          --ink: #1A1410;
          --ink-2: #221A13;
          --line-lt: #DCCFB8;
          --line-dk: #382A1E;
          --muted-lt: #6A5F4D;
          --muted-dk: #B3A488;
          --clay: #D8542B;
          --clay-deep: #B5421E;
          --forest: #1F5E45;
          --marigold: #F2B23E;
          --plum: #6B3A52;
        }
        .lp { font-family: "Archivo", sans-serif; background: var(--cream); color: var(--ink); -webkit-font-smoothing: antialiased; }
        .lp a { color: inherit; text-decoration: none; }
        .lp .mono { font-family: "Space Mono", monospace; }
        .lp .bric { font-family: "Bricolage Grotesque", sans-serif; letter-spacing: -0.02em; }
        .lp .wrap { max-width: 1320px; margin: 0 auto; padding: 0 clamp(48px, 7.5vw, 140px); }

        /* BUTTONS */
        .lp .btn { font-family: "Archivo"; font-weight: 700; font-size: 15px; line-height: 1; padding: 14px 24px; border-radius: 999px; cursor: pointer; border: 2px solid transparent; display: inline-flex; align-items: center; gap: 9px; transition: transform .15s ease, background .2s, color .2s, border-color .2s; text-decoration: none; }
        .lp .btn:hover { transform: translateY(-1px); }
        .lp .btn-clay { background: var(--clay); color: #1a0d06; border-color: var(--clay); }
        .lp .btn-clay:hover { background: #e85f33; border-color: #e85f33; }
        .lp .btn-ink { background: var(--ink); color: var(--cream); }
        .lp .btn-ink:hover { background: #2d1f16; }
        .lp .btn-cream { background: var(--cream); color: var(--ink); }
        .lp .btn-cream:hover { background: var(--cream-2); }
        .lp .btn-ghost-dk { background: transparent; color: var(--cream); border-color: var(--line-dk); }
        .lp .btn-ghost-dk:hover { border-color: var(--marigold); color: var(--marigold); }
        .lp .btn-lg { padding: 17px 30px; font-size: 16px; }

        /* NAV */
        .lp header.nav-bar { position: sticky; top: 0; z-index: 50; background: var(--ink); color: var(--cream); }
        .lp .nav { display: flex; align-items: center; justify-content: space-between; height: 76px; }
        .lp .lockup { display: flex; align-items: center; gap: 12px; }
        .lp .lockup .mark { width: 34px; height: 34px; background: var(--marigold); border-radius: 9px; display: grid; place-items: center; transform: rotate(-6deg); flex-shrink: 0; }
        .lp .lockup .mark span { font-family: "Bricolage Grotesque"; font-weight: 900; font-size: 18px; color: var(--ink); transform: rotate(6deg); display: block; line-height: 1; }
        .lp .lockup .name { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 16px; letter-spacing: 0.01em; white-space: nowrap; }
        .lp .lockup .name em { font-style: normal; color: var(--marigold); }
        .lp .nav-links { display: flex; align-items: center; gap: 32px; }
        .lp .nav-links a.lk { color: rgba(244,236,221,0.72); font-size: 15px; font-weight: 600; white-space: nowrap; transition: color .15s; }
        .lp .nav-links a.lk:hover { color: var(--cream); }

        /* HERO */
        .lp .hero { background: var(--ink); color: var(--cream); position: relative; overflow: hidden; }
        .lp .hero-bg { position: absolute; inset: 0; z-index: 0;
          background:
            radial-gradient(1100px 520px at 82% -8%, rgba(216,84,43,0.30), transparent 56%),
            radial-gradient(760px 460px at 6% 14%, rgba(242,178,62,0.13), transparent 60%);
        }
        .lp .hero-inner { position: relative; z-index: 2; padding-top: 92px; padding-bottom: 78px; }
        .lp .eyebrow { display: inline-flex; align-items: center; gap: 11px; white-space: nowrap; font-family: "Space Mono"; font-weight: 700; font-size: 12.5px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--cream); background: var(--forest); padding: 9px 18px 9px 16px; border-radius: 999px; margin-bottom: 32px; }
        .lp .eyebrow .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--marigold); flex: none; }
        .lp .eyebrow .hl { color: var(--marigold); }
        .lp h1.hero-h { font-family: "Bricolage Grotesque"; font-size: clamp(50px, 7.4vw, 104px); line-height: 1.0; font-weight: 700; letter-spacing: -0.035em; max-width: 1150px; padding-bottom: 0.06em; }
        .lp .molten { background: linear-gradient(96deg, var(--marigold) 4%, var(--clay) 56%, var(--clay-deep) 100%); -webkit-background-clip: text; background-clip: text; color: transparent; font-style: italic; font-weight: 600; }
        .lp .hero-h .clay-word { color: var(--clay); }
        .lp .hero-h .kampala-word { color: #23CB87; font-style: italic; font-weight: 600; }
        .lp .lede { margin-top: 32px; max-width: 620px; font-size: 20px; line-height: 1.55; color: var(--muted-dk); }
        .lp .cta-row { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 40px; }
        .lp .strip { position: relative; z-index: 2; margin-top: 78px; border-top: 1px solid var(--line-dk); display: grid; grid-template-columns: repeat(4, 1fr); }
        .lp .strip .cell { padding: 30px 8px 24px 0; border-right: 1px solid var(--line-dk); }
        .lp .strip .cell:last-child { border-right: none; }
        .lp .strip .num { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 40px; letter-spacing: -0.02em; }
        .lp .strip .num em { color: var(--clay); font-style: normal; }
        .lp .strip .lbl { margin-top: 8px; font-family: "Space Mono"; font-size: 11.5px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted-dk); }

        /* TICKER */
        .lp .ticker { background: var(--ink); color: var(--cream); border-top: 1px solid var(--line-dk); padding: 18px 0; overflow: hidden; white-space: nowrap; }
        .lp .ticker-track { display: inline-flex; align-items: center; gap: 26px; font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 18px; letter-spacing: 0.03em; text-transform: uppercase; animation: lp-marquee 26s linear infinite; }
        .lp .ticker-track .o { color: var(--marigold); }
        @keyframes lp-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) { .lp .ticker-track { animation: none; } }

        /* SECTIONS */
        .lp .pad { padding: 100px 0; }
        .lp .sec-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 40px; margin-bottom: 50px; }
        .lp .sec-kicker { font-family: "Space Mono"; font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--clay); margin-bottom: 18px; }
        .lp .sec-head h2 { font-family: "Bricolage Grotesque"; font-weight: 900; font-size: clamp(34px, 5vw, 58px); letter-spacing: -0.015em; line-height: 0.96; text-transform: uppercase; }
        .lp .sec-head p { max-width: 360px; font-size: 16px; line-height: 1.55; text-align: right; color: var(--muted-lt); flex-shrink: 0; }

        /* TRACKS */
        .lp .track-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
        .lp .track { border-radius: 22px; padding: 34px 30px; color: var(--cream); position: relative; overflow: hidden; display: flex; flex-direction: column; }
        .lp .track.t1 { background: var(--clay); }
        .lp .track.t2 { background: var(--forest); }
        .lp .track.t3 { background: var(--plum); }
        .lp .track .t-idx { font-family: "Space Mono"; font-size: 12px; letter-spacing: 0.08em; opacity: 0.82; }
        .lp .track h3 { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 30px; text-transform: uppercase; margin-top: 12px; letter-spacing: -0.01em; }
        .lp .track .t-meta { font-family: "Space Mono"; font-size: 12.5px; margin-top: 8px; opacity: 0.9; }
        .lp .track > p { font-size: 14.5px; line-height: 1.55; margin-top: 18px; opacity: 0.95; }
        .lp .track ul { list-style: none; margin-top: 22px; display: flex; flex-direction: column; gap: 11px; }
        .lp .track li { font-size: 14.5px; display: flex; align-items: flex-start; gap: 11px; font-weight: 500; }
        .lp .track li::before { content: ""; width: 7px; height: 7px; border-radius: 50%; background: var(--marigold); margin-top: 7px; flex: none; }
        .lp .track .t-foot { margin-top: auto; padding-top: 28px; }
        .lp .t-link { font-family: "Space Mono"; font-size: 13px; font-weight: 700; display: inline-flex; align-items: center; gap: 8px; color: var(--cream); }
        .lp .t-link .circle { width: 30px; height: 30px; border-radius: 50%; background: var(--cream); color: var(--ink); display: grid; place-items: center; font-size: 15px; transition: transform .15s; flex-shrink: 0; }
        .lp .t-link:hover .circle { transform: translateX(3px); }

        /* HOW IT WORKS */
        .lp .how { background: var(--ink); color: var(--cream); }
        .lp .how .sec-head p { color: var(--muted-dk); text-align: right; }
        .lp .steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; }
        .lp .step { padding: 0 36px; border-left: 1px solid var(--line-dk); }
        .lp .step:first-child { padding-left: 0; border-left: none; }
        .lp .step .s-no { font-family: "Bricolage Grotesque"; font-weight: 900; font-size: 60px; color: var(--marigold); letter-spacing: -0.02em; line-height: 1; }
        .lp .step h3 { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 21px; text-transform: uppercase; margin-top: 22px; letter-spacing: -0.005em; }
        .lp .step p { color: var(--muted-dk); font-size: 15.5px; line-height: 1.58; margin-top: 14px; }

        /* CAPSTONES */
        .lp .cap-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
        .lp .cap { border-radius: 22px; overflow: hidden; border: 1px solid var(--line-lt); background: #fff; display: flex; flex-direction: column; }
        .lp .cap .c-bar { height: 10px; }
        .lp .cap.c1 .c-bar { background: var(--clay); }
        .lp .cap.c2 .c-bar { background: var(--forest); }
        .lp .cap.c3 .c-bar { background: var(--plum); }
        .lp .cap .c-body { padding: 30px 30px 34px; display: flex; flex-direction: column; flex: 1; }
        .lp .cap .c-tag { font-family: "Space Mono"; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--clay-deep); }
        .lp .cap.c2 .c-tag { color: var(--forest); }
        .lp .cap.c3 .c-tag { color: var(--plum); }
        .lp .cap h3 { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 25px; margin-top: 14px; letter-spacing: -0.01em; }
        .lp .cap .c-sub { font-size: 14.5px; margin-top: 6px; color: var(--muted-lt); font-weight: 600; }
        .lp .cap p { font-size: 14.5px; line-height: 1.56; margin-top: 18px; color: var(--muted-lt); }

        /* MSHAURI */
        .lp .mshauri { background: var(--forest); color: var(--cream); }
        .lp .msh-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
        .lp .msh-copy .badge { display: inline-flex; align-items: center; gap: 10px; font-family: "Space Mono"; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; background: rgba(244,236,221,0.12); padding: 8px 16px; border-radius: 999px; }
        .lp .msh-copy .badge .live { width: 8px; height: 8px; border-radius: 50%; background: var(--marigold); animation: lp-pulse 2.2s infinite; flex-shrink: 0; }
        @keyframes lp-pulse { 0% { box-shadow: 0 0 0 0 rgba(242,178,62,0.5); } 70% { box-shadow: 0 0 0 12px rgba(242,178,62,0); } 100% { box-shadow: 0 0 0 0 rgba(242,178,62,0); } }
        .lp .msh-copy h2 { font-family: "Bricolage Grotesque"; font-weight: 900; font-size: clamp(38px,5vw,58px); text-transform: uppercase; letter-spacing: -0.015em; margin-top: 24px; line-height: 0.96; }
        .lp .msh-copy p { font-size: 17px; line-height: 1.6; color: #d8e6df; margin-top: 22px; max-width: 460px; }
        .lp .msh-copy .cta-row { margin-top: 34px; }
        .lp .chat { background: var(--ink); border-radius: 20px; padding: 26px; border: 1px solid rgba(244,236,221,0.1); box-shadow: 0 30px 60px rgba(0,0,0,0.35); }
        .lp .chat .chat-top { display: flex; align-items: center; gap: 10px; font-family: "Space Mono"; font-size: 11.5px; color: var(--muted-dk); padding-bottom: 18px; border-bottom: 1px solid var(--line-dk); }
        .lp .chat .chat-top .av { width: 26px; height: 26px; border-radius: 8px; background: linear-gradient(150deg, var(--marigold), var(--clay)); flex-shrink: 0; }
        .lp .bubble { margin-top: 18px; }
        .lp .bubble .who { font-family: "Space Mono"; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted-dk); margin-bottom: 8px; }
        .lp .bubble .msg { font-size: 15px; line-height: 1.55; padding: 14px 18px; border-radius: 14px; color: var(--cream); }
        .lp .bubble.you .msg { background: var(--ink-2); border-bottom-right-radius: 4px; }
        .lp .bubble.bot .msg { background: rgba(242,178,62,0.12); border: 1px solid rgba(242,178,62,0.22); border-bottom-left-radius: 4px; }

        /* FINAL CTA */
        .lp .final { background: var(--marigold); color: var(--ink); text-align: center; }
        .lp .final .wrap { padding-top: 110px; padding-bottom: 110px; }
        .lp .final h2 { font-family: "Bricolage Grotesque"; font-weight: 900; font-size: clamp(46px,7vw,90px); text-transform: uppercase; letter-spacing: -0.025em; line-height: 0.95; }
        .lp .final p { font-size: 19px; margin-top: 24px; color: #5a3f12; max-width: 540px; margin-inline: auto; line-height: 1.5; }
        .lp .final .cta-row { justify-content: center; margin-top: 40px; }

        /* FOOTER */
        .lp footer { background: var(--ink); color: var(--cream); }
        .lp .foot { padding-top: 88px; padding-bottom: 56px; display: grid; grid-template-columns: 1.7fr 1fr 1fr 1fr; gap: 48px; align-items: start; }
        .lp .foot .lockup .name { font-size: 17px; }
        .lp .foot .f-left { max-width: 360px; }
        .lp .foot .f-left .descr { margin-top: 22px; font-size: 15px; line-height: 1.55; color: var(--muted-dk); }
        .lp .foot .f-left .loc { font-family: "Space Mono"; font-size: 12px; color: var(--muted-dk); margin-top: 20px; letter-spacing: 0.06em; }
        .lp .foot .f-col h4 { font-family: "Space Mono"; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted-dk); margin-bottom: 20px; white-space: nowrap; }
        .lp .foot .f-col a { display: block; width: fit-content; font-size: 15px; margin-bottom: 14px; color: var(--cream); white-space: nowrap; transition: color .15s; }
        .lp .foot .f-col a:hover { color: var(--marigold); }
        .lp .foot-base { border-top: 1px solid var(--line-dk); padding-top: 26px; padding-bottom: 26px; font-family: "Space Mono"; font-size: 11.5px; color: var(--muted-dk); display: flex; justify-content: space-between; letter-spacing: 0.04em; }

        /* RESPONSIVE */
        @media (max-width: 980px) {
          .lp .nav-links a.lk { display: none; }
          .lp .track-grid, .lp .cap-grid, .lp .steps { grid-template-columns: 1fr; }
          .lp .step { border-left: none; padding: 0; border-top: 1px solid var(--line-dk); padding-top: 28px; }
          .lp .step:first-child { border-top: none; }
          .lp .msh-grid { grid-template-columns: 1fr; gap: 40px; }
          .lp .sec-head { flex-direction: column; align-items: flex-start; }
          .lp .sec-head p { text-align: left; max-width: 100%; }
          .lp .strip { grid-template-columns: repeat(2, 1fr); }
          .lp .strip .cell:nth-child(2) { border-right: none; }
          .lp .foot { grid-template-columns: repeat(2, 1fr); gap: 40px; }
          .lp .foot .f-left { grid-column: 1 / -1; }
        }
      `}</style>

      <div className="lp">

        {/* NAV */}
        <header className="nav-bar">
          <div className="wrap nav">
            <Link href="/" className="lockup">
              <span className="mark"><span>F</span></span>
              <span className="name">THE AI FOUNDRY <em>KAMPALA</em></span>
            </Link>
            <nav className="nav-links">
              <Link href="#tracks" className="lk">Tracks</Link>
              <Link href="#how" className="lk">How it works</Link>
              <Link href="#mshauri" className="lk">Mshauri</Link>
              <Link href="/assess" className="btn btn-clay">Apply now <span aria-hidden="true">→</span></Link>
            </nav>
          </div>
        </header>

        {/* HERO */}
        <section className="hero">
          <div className="hero-bg" />
          <div className="wrap hero-inner">
            <div className="eyebrow">
              <span className="dot" /> Kampala, Uganda · <span className="hl">Intensive AI Training</span>
            </div>
            <h1 className="hero-h">
              Build with <span className="clay-word">AI.</span><br />
              Forged in <span className="kampala-word">Kampala.</span>
            </h1>
            <p className="lede">An intensive learning hub training developers, analysts, and domain experts to build real AI systems — grounded in Kampala problems, Kampala context.</p>
            <div className="cta-row">
              <Link href="/assess" className="btn btn-clay btn-lg">Apply — take the assessment <span aria-hidden="true">→</span></Link>
              <Link href="/start" className="btn btn-ghost-dk btn-lg">Talk to Mshauri</Link>
            </div>
            <div className="strip">
              <div className="cell"><div className="num"><em>3</em></div><div className="lbl">Learning tracks</div></div>
              <div className="cell"><div className="num">12 wks</div><div className="lbl">Core cohort</div></div>
              <div className="cell"><div className="num">Sat</div><div className="lbl">Fusion Labs</div></div>
              <div className="cell"><div className="num">24/7</div><div className="lbl">Mshauri advisor</div></div>
            </div>
          </div>
        </section>

        {/* TICKER */}
        <div className="ticker">
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
                <div className="t-foot"><Link href="/assess" className="t-link">Apply for this track <span className="circle">→</span></Link></div>
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
                <div className="t-foot"><Link href="/assess" className="t-link">Apply for this track <span className="circle">→</span></Link></div>
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
                <div className="t-foot"><Link href="/assess" className="t-link">Apply for this track <span className="circle">→</span></Link></div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="how pad" id="how">
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
        <section className="mshauri pad" id="mshauri">
          <div className="wrap msh-grid">
            <div className="msh-copy">
              <span className="badge"><span className="live" /> AI Advisor · Available 24/7</span>
              <h2>Meet Mshauri</h2>
              <p>Your personal AI advisor — trained on the Foundry curriculum, available any time. Ask it anything: explain a concept, review your code approach, challenge an idea, or tell you what to tackle next. It knows your track and your week.</p>
              <div className="cta-row">
                <Link href="/start" className="btn btn-cream btn-lg">Start a conversation <span aria-hidden="true">→</span></Link>
              </div>
            </div>
            <div className="chat">
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
        <section className="final" id="apply">
          <div className="wrap">
            <h2>Ready to build?</h2>
            <p>The assessment takes 10 minutes. Mshauri will guide you through it — no pressure, no exam.</p>
            <div className="cta-row">
              <Link href="/assess" className="btn btn-ink btn-lg">Take the intake assessment <span aria-hidden="true">→</span></Link>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer>
          <div className="wrap foot">
            <div className="f-left">
              <div className="lockup">
                <span className="mark"><span>F</span></span>
                <span className="name">THE AI FOUNDRY <em>KAMPALA</em></span>
              </div>
              <p className="descr">An intensive AI learning hub training developers, professionals, and first-time builders to ship real systems — from Kampala.</p>
              <p className="loc">Kampala, Uganda · 00°19′N 32°35′E</p>
            </div>
            <div className="f-col">
              <h4>Programme</h4>
              <Link href="#tracks">Tracks</Link>
              <Link href="#how">How it works</Link>
              <Link href="#build">Capstones</Link>
            </div>
            <div className="f-col">
              <h4>Get started</h4>
              <Link href="/assess">Apply</Link>
              <Link href="/start">Mshauri</Link>
              <Link href="/runway">Runway</Link>
            </div>
            <div className="f-col">
              <h4>Foundry</h4>
              <Link href="/login">Staff login</Link>
            </div>
          </div>
          <div className="wrap foot-base">
            <span>© 2026 The AI Foundry Kampala</span>
            <span>Build with AI. From Kampala.</span>
          </div>
        </footer>

      </div>
    </>
  );
}
