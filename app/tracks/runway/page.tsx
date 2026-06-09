import Link from "next/link";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Runway Track — The AI Foundry Kampala",
  description: "The on-ramp. Four self-paced modules that build the technical confidence you need before the Developer track.",
};

const TRACK_CSS = `
  .t-hero { background: var(--ink); color: var(--cream); position: relative; overflow: hidden; }
  .t-hero-bg { position: absolute; inset: 0; z-index: 0; background: radial-gradient(1000px 520px at 82% -10%, rgba(107,58,82,0.5), transparent 56%), radial-gradient(640px 420px at 4% 16%, rgba(242,178,62,0.10), transparent 60%); }
  .t-hero .wrap { position: relative; z-index: 2; padding-top: 40px; padding-bottom: 76px; }
  .t-hero .crumb { margin-bottom: 40px; }
  .t-hero .grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: 56px; align-items: end; }
  .t-tag { display: inline-flex; align-items: center; gap: 10px; font-family: "Space Mono"; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; background: var(--plum); color: var(--cream); padding: 8px 16px; border-radius: 999px; font-weight: 700; }
  .t-hero h1 { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: clamp(54px, 7vw, 96px); letter-spacing: -0.03em; line-height: 0.94; margin-top: 26px; }
  .t-hero .lede { font-size: 20px; line-height: 1.55; color: var(--muted-dk); margin-top: 26px; max-width: 560px; }
  .t-hero .cta-row { display: flex; gap: 14px; margin-top: 36px; }
  .specs { border: 1px solid var(--line-dk); border-radius: 18px; background: var(--ink-2); overflow: hidden; }
  .specs .s-row { display: flex; justify-content: space-between; align-items: center; padding: 18px 22px; border-bottom: 1px solid var(--line-dk); }
  .specs .s-row:last-child { border-bottom: none; }
  .specs .s-row .k { font-family: "Space Mono"; font-size: 12px; color: var(--muted-dk); letter-spacing: 0.04em; }
  .specs .s-row .v { font-family: "Bricolage Grotesque"; font-weight: 700; font-size: 17px; }
  .specs .s-row .v.accent { color: var(--plum); }
  .curric { background: var(--cream); }
  .modules { display: flex; flex-direction: column; gap: 18px; }
  .mod { display: grid; grid-template-columns: 200px 1fr; gap: 36px; padding: 30px 0; border-top: 1px solid var(--line-lt); }
  .mod:first-child { border-top: none; }
  .mod .m-left .m-no { font-family: "Space Mono"; font-size: 12px; color: var(--plum-deep); letter-spacing: 0.06em; }
  .mod .m-left .m-wk { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 24px; margin-top: 8px; line-height: 1.05; }
  .mod .m-left .m-dur { font-family: "Space Mono"; font-size: 12px; color: var(--muted-lt); margin-top: 8px; }
  .mod .m-right h3 { font-family: "Bricolage Grotesque"; font-weight: 700; font-size: 22px; }
  .mod .m-right p { font-size: 15px; line-height: 1.55; color: var(--muted-lt); margin-top: 10px; max-width: 620px; }
  .mod .m-right .topics { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
  .mod .m-right .topics span { font-family: "Space Mono"; font-size: 12px; padding: 6px 12px; border-radius: 999px; background: #fff; border: 1px solid var(--line-lt); color: var(--muted-lt); }
  .outcomes { background: var(--ink); color: var(--cream); }
  .out-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
  .out { display: flex; gap: 16px; padding: 26px; border: 1px solid var(--line-dk); border-radius: 16px; background: var(--ink-2); }
  .out .ic { width: 40px; height: 40px; flex: none; border-radius: 11px; background: var(--plum); color: var(--cream); display: grid; place-items: center; font-family: "Bricolage Grotesque"; font-weight: 800; }
  .out h3 { font-family: "Bricolage Grotesque"; font-weight: 700; font-size: 18px; }
  .out p { font-size: 14.5px; line-height: 1.55; color: var(--muted-dk); margin-top: 8px; }
  .split { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; }
  .panel { border-radius: 20px; padding: 36px; }
  .panel.prq { background: var(--cream-2); border: 1px solid var(--line-lt); }
  .panel.cap { background: var(--plum); color: var(--cream); }
  .panel h3 { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 26px; }
  .panel.prq .kick, .panel.cap .kick { font-family: "Space Mono"; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 14px; }
  .panel.prq .kick { color: var(--plum-deep); }
  .panel.cap .kick { color: rgba(255,255,255,0.8); }
  .panel ul { list-style: none; margin-top: 20px; display: flex; flex-direction: column; gap: 13px; }
  .panel li { font-size: 15px; display: flex; gap: 12px; align-items: flex-start; line-height: 1.5; }
  .panel.prq li::before { content: ""; width: 7px; height: 7px; border-radius: 50%; background: var(--forest); margin-top: 7px; flex: none; }
  .panel.cap li::before { content: ""; width: 7px; height: 7px; border-radius: 50%; background: var(--marigold); margin-top: 7px; flex: none; }
  .panel.prq p { font-size: 15px; line-height: 1.55; color: var(--muted-lt); margin-top: 16px; }
  .panel.cap p { font-size: 15.5px; line-height: 1.55; margin-top: 18px; opacity: 0.95; }
  .panel .runway-link { display: inline-flex; margin-top: 22px; font-family: "Space Mono"; font-size: 13px; font-weight: 700; }
  .panel.prq .runway-link { color: var(--plum-deep); }
  .t-final { background: var(--plum); color: var(--cream); text-align: center; }
  .t-final .wrap { padding-top: 96px; padding-bottom: 96px; }
  .t-final h2 { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: clamp(40px, 6vw, 72px); letter-spacing: -0.025em; line-height: 0.96; }
  .t-final p { font-size: 18px; margin-top: 20px; opacity: 0.82; max-width: 520px; margin-inline: auto; }
  .t-final .cta-row { display: flex; gap: 14px; justify-content: center; margin-top: 34px; }
  @media (max-width: 900px) {
    .t-hero .grid, .out-grid, .split { grid-template-columns: 1fr; }
    .mod { grid-template-columns: 1fr; gap: 14px; }
  }
`;

export default function RunwayTrackPage() {
  return (
    <>
      <style>{TRACK_CSS}</style>
      <NavBar activePage="tracks" />

      <section className="t-hero">
        <div className="t-hero-bg" />
        <div className="wrap">
          <div className="crumb">
            <Link href="/#tracks">Tracks</Link> <span className="sep">/</span> <span>Runway</span>
          </div>
          <div className="grid">
            <div>
              <span className="t-tag">Track 03 · Self-paced</span>
              <h1>Runway</h1>
              <p className="lede">The on-ramp. Four self-paced modules that build the technical confidence you need before the Developer track — terminal, Git, Python, and a project of your own.</p>
              <div className="cta-row">
                <Link href="/assess" className="btn btn-clay btn-lg">Start Runway <span aria-hidden="true">→</span></Link>
                <Link href="/tracks/developer" className="btn btn-ghost-dk btn-lg">Where it leads →</Link>
              </div>
            </div>
            <div className="specs">
              <div className="s-row"><span className="k">Duration</span><span className="v">4 modules</span></div>
              <div className="s-row"><span className="k">Format</span><span className="v">Self-paced</span></div>
              <div className="s-row"><span className="k">Pace</span><span className="v">~6 weeks suggested</span></div>
              <div className="s-row"><span className="k">Support</span><span className="v accent">Mshauri 24/7</span></div>
              <div className="s-row"><span className="k">Leads to</span><span className="v">Developer track</span></div>
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
            <p>Four modules. Each ends with something you&apos;ve actually built.</p>
          </div>
          <div className="modules">
            <div className="mod">
              <div className="m-left">
                <div className="m-no">Module 01</div>
                <div className="m-wk">The terminal</div>
                <div className="m-dur">Self-paced</div>
              </div>
              <div className="m-right">
                <h3>Stop fearing the black screen</h3>
                <p>The command line is where developers live. You&apos;ll learn to move around, manage files, and run programs from the terminal until it feels like home, not a hazard.</p>
                <div className="topics"><span>Navigation</span><span>Files &amp; folders</span><span>Running programs</span><span>Shortcuts</span></div>
              </div>
            </div>
            <div className="mod">
              <div className="m-left">
                <div className="m-no">Module 02</div>
                <div className="m-wk">Git &amp; GitHub</div>
                <div className="m-dur">Self-paced</div>
              </div>
              <div className="m-right">
                <h3>Save your work like a pro</h3>
                <p>Version control is non-negotiable. You&apos;ll learn to track changes, branch, and push your code to GitHub — the habits every Foundry developer relies on daily.</p>
                <div className="topics"><span>Commits</span><span>Branches</span><span>Push &amp; pull</span><span>GitHub basics</span></div>
              </div>
            </div>
            <div className="mod">
              <div className="m-left">
                <div className="m-no">Module 03</div>
                <div className="m-wk">Python basics</div>
                <div className="m-dur">Self-paced</div>
              </div>
              <div className="m-right">
                <h3>Your first real programming language</h3>
                <p>Variables, loops, functions, and data — the building blocks. By the end you can read and write small Python programs with confidence.</p>
                <div className="topics"><span>Variables &amp; types</span><span>Loops &amp; logic</span><span>Functions</span><span>Working with data</span></div>
              </div>
            </div>
            <div className="mod">
              <div className="m-left">
                <div className="m-no">Module 04</div>
                <div className="m-wk">Mini-project</div>
                <div className="m-dur">Self-paced</div>
              </div>
              <div className="m-right">
                <h3>Put it all together</h3>
                <p>Build one small thing end to end — written in Python, tracked in Git, run from the terminal. Finish this and you&apos;re ready to walk into the Developer track.</p>
                <div className="topics"><span>Scoping</span><span>Building</span><span>Debugging</span><span>Shipping it</span></div>
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
            <p style={{ color: "var(--muted-dk)" }}>By completion — not &ldquo;exposure to&rdquo;, but able to do unaided.</p>
          </div>
          <div className="out-grid">
            <div className="out"><div className="ic">1</div><div><h3>Navigate the terminal</h3><p>Move around, manage files, and run programs from the command line without hesitation.</p></div></div>
            <div className="out"><div className="ic">2</div><div><h3>Push code to GitHub</h3><p>Track your work with Git and publish it to GitHub the way every developer does.</p></div></div>
            <div className="out"><div className="ic">3</div><div><h3>Write a Python script</h3><p>Read and write small Python programs using variables, loops, and functions.</p></div></div>
            <div className="out"><div className="ic">4</div><div><h3>Finish a mini-project</h3><p>Build one small thing end to end — and walk into the Developer track ready.</p></div></div>
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
                <li>No experience needed — Runway assumes you&apos;re starting from zero</li>
                <li>A laptop and a reliable internet connection</li>
                <li>A few hours a week, on your own schedule</li>
                <li>Curiosity and the willingness to be a beginner</li>
              </ul>
              <p>This is the most welcoming door into the Foundry. Everyone&apos;s first step.</p>
              <Link href="/assess" className="runway-link">Take the assessment →</Link>
            </div>
            <div className="panel cap">
              <div className="kick">Where it leads</div>
              <h3>Straight into Developer</h3>
              <p>Runway exists for one reason: to get you ready for the Developer track. Finish the mini-project and you&apos;ve cleared every prerequisite.</p>
              <ul>
                <li>Builds the exact skills Developer assumes</li>
                <li>Self-paced — go as fast as you like</li>
                <li>Mshauri is with you at every step</li>
              </ul>
              <Link href="/tracks/developer" className="runway-link">Explore the Developer track →</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="t-final">
        <div className="wrap">
          <h2>Start from zero</h2>
          <p>Runway is built for absolute beginners. Take the 10-minute assessment and Mshauri will get you started on the right module.</p>
          <div className="cta-row">
            <Link href="/assess" className="btn btn-cream btn-lg">Take the assessment <span aria-hidden="true">→</span></Link>
            <Link href="/#tracks" className="btn btn-ghost-dk btn-lg">Compare tracks</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
