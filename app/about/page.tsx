import Link from "next/link";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "About — The AI Foundry Kampala",
  description: "AI talent isn't missing in Kampala. The foundry to forge it was.",
};

export default function AboutPage() {
  return (
    <>
      <style>{`
        .a-hero { background: var(--ink); color: var(--cream); position: relative; overflow: hidden; }
        .a-hero-bg { position: absolute; inset: 0; z-index: 0; background: radial-gradient(1000px 540px at 80% -12%, rgba(216,84,43,0.26), transparent 56%), radial-gradient(680px 460px at 4% 30%, rgba(242,178,62,0.12), transparent 60%); }
        .a-hero .wrap { position: relative; z-index: 2; padding-top: 40px; padding-bottom: 80px; }
        .a-hero .crumb { margin-bottom: 44px; }
        .a-hero .kick { font-family: "Space Mono"; font-size: 13px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--marigold); margin-bottom: 26px; }
        .a-hero h1 { font-family: "Bricolage Grotesque"; font-weight: 700; font-size: clamp(40px, 5.2vw, 78px); letter-spacing: -0.03em; line-height: 1.02; max-width: 18ch; }
        .a-hero h1 em { font-style: italic; color: var(--clay); font-weight: 600; }

        .manifesto { background: var(--cream); }
        .manifesto .mwrap { padding-top: 96px; padding-bottom: 96px; display: grid; grid-template-columns: 280px 1fr; gap: 64px; }
        .manifesto .label { font-family: "Space Mono"; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--clay); }
        .manifesto .body p { font-family: "Bricolage Grotesque"; font-weight: 500; font-size: clamp(22px, 2.6vw, 30px); line-height: 1.4; letter-spacing: -0.015em; color: var(--ink); }
        .manifesto .body p + p { margin-top: 28px; }
        .manifesto .body p b { color: var(--clay-deep); font-weight: 700; }

        .thesis { background: var(--ink); color: var(--cream); }
        .thesis .tgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; }
        .thesis .copy h2 { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: clamp(32px, 4vw, 50px); letter-spacing: -0.02em; line-height: 1; text-transform: uppercase; }
        .thesis .copy p { font-size: 17px; line-height: 1.62; color: var(--muted-dk); margin-top: 22px; }
        .thesis .copy p b { color: var(--cream); font-weight: 600; }
        .thesis .stat-stack { display: flex; flex-direction: column; gap: 16px; }
        .thesis .stat { border: 1px solid var(--line-dk); border-radius: 18px; padding: 26px 28px; background: var(--ink-2); }
        .thesis .stat .n { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 46px; letter-spacing: -0.02em; line-height: 1; }
        .thesis .stat .n em { color: var(--marigold); font-style: normal; }
        .thesis .stat .l { font-size: 14.5px; color: var(--muted-dk); margin-top: 10px; line-height: 1.5; }

        .principles { background: var(--cream); }
        .prin-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
        .prin { background: #fff; border: 1px solid var(--line-lt); border-radius: 20px; padding: 32px 30px; }
        .prin .no { font-family: "Space Mono"; font-size: 12px; color: var(--clay-deep); }
        .prin h3 { font-family: "Bricolage Grotesque"; font-weight: 700; font-size: 23px; margin-top: 14px; letter-spacing: -0.01em; }
        .prin p { font-size: 15px; line-height: 1.56; color: var(--muted-lt); margin-top: 12px; }

        .people { background: var(--ink); color: var(--cream); }
        .ppl-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .person .pic { aspect-ratio: 1; border-radius: 18px; display: grid; place-items: center; font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 52px; color: var(--ink); }
        .person:nth-child(1) .pic { background: linear-gradient(150deg, var(--marigold), var(--clay)); }
        .person:nth-child(2) .pic { background: linear-gradient(150deg, var(--forest-2), var(--forest)); color: var(--cream); }
        .person:nth-child(3) .pic { background: linear-gradient(150deg, #8a4f6b, var(--plum)); color: var(--cream); }
        .person:nth-child(4) .pic { background: linear-gradient(150deg, var(--clay), var(--clay-deep)); color: var(--cream); }
        .person .nm { font-family: "Bricolage Grotesque"; font-weight: 700; font-size: 19px; margin-top: 16px; }
        .person .role { font-family: "Space Mono"; font-size: 12px; color: var(--muted-dk); margin-top: 4px; }
        .person .bio { font-size: 14px; line-height: 1.55; color: var(--muted-dk); margin-top: 12px; }

        .a-final { background: var(--clay); color: var(--ink); text-align: center; }
        .a-final .wrap { padding-top: 96px; padding-bottom: 96px; }
        .a-final h2 { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: clamp(40px, 6vw, 72px); letter-spacing: -0.025em; line-height: 0.96; }
        .a-final p { font-size: 18px; margin-top: 20px; color: var(--ink); max-width: 520px; margin-inline: auto; }
        .a-final .cta-row { display: flex; gap: 14px; justify-content: center; margin-top: 34px; }

        @media (max-width: 900px) {
          .manifesto .mwrap, .thesis .tgrid { grid-template-columns: 1fr; gap: 36px; }
          .prin-grid { grid-template-columns: repeat(2, 1fr); }
          .ppl-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .prin-grid, .ppl-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <NavBar activePage="about" />

      <section className="a-hero">
        <div className="a-hero-bg" />
        <div className="wrap">
          <div className="crumb">
            <Link href="/">Home</Link> <span className="sep">/</span> <span>About</span>
          </div>
          <div className="kick">Why we exist</div>
          <h1>AI talent isn&apos;t missing in Kampala. The <em>foundry</em> to forge it was.</h1>
        </div>
      </section>

      <section className="manifesto">
        <div className="wrap mwrap">
          <div className="label">// Our belief</div>
          <div className="body">
            <p>The world keeps telling African developers to <b>wait their turn</b> — to consume AI built elsewhere, for problems elsewhere.</p>
            <p>We think that&apos;s backwards. The people closest to a problem build the best systems for it. A bookkeeper in Nakawa, a dispatcher in a boda stage, a bursar at a school — they know things no model trained in San Francisco ever will.</p>
            <p>The AI Foundry exists to put real building power in their hands. Not certificates. Not theory. <b>The ability to ship.</b></p>
          </div>
        </div>
      </section>

      <section className="thesis pad">
        <div className="wrap">
          <div className="tgrid">
            <div className="copy">
              <h2>Grounded in Kampala, on purpose</h2>
              <p>Most AI education is borrowed — examples about US e-commerce, datasets about weather in Boston. It teaches the tools but never the judgement.</p>
              <p>We teach with <b>local problems from day one</b>. Your first script reads MoMo data. Your capstone solves something on your street. The skills transfer anywhere — but the context is ours.</p>
              <p>That&apos;s not a constraint. It&apos;s the entire advantage.</p>
            </div>
            <div className="stat-stack">
              <div className="stat"><div className="n"><em>100%</em></div><div className="l">of capstones are built around a real, local problem — no toy demos, ever.</div></div>
              <div className="stat"><div className="n">3</div><div className="l">tracks meet learners where they are: first-timer, professional, or developer.</div></div>
              <div className="stat"><div className="n">24/7</div><div className="l">Mshauri, our AI advisor, means no learner is ever stuck alone.</div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="principles pad">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <div className="sec-kicker">// How we teach</div>
              <h2>Four principles</h2>
            </div>
            <p>The things we refuse to compromise on, cohort after cohort.</p>
          </div>
          <div className="prin-grid">
            <div className="prin"><div className="no">01</div><h3>Build, don&apos;t watch</h3><p>You learn by shipping. Every module ends with something you made and can run — not a quiz you passed.</p></div>
            <div className="prin"><div className="no">02</div><h3>First principles</h3><p>We teach why before how. Tools change every six months; understanding doesn&apos;t. We optimise for the durable part.</p></div>
            <div className="prin"><div className="no">03</div><h3>Local by default</h3><p>Every example, dataset, and capstone is rooted in Kampala. Relevance isn&apos;t a bonus — it&apos;s the curriculum.</p></div>
            <div className="prin"><div className="no">04</div><h3>Nobody stuck alone</h3><p>Between Saturday Fusion Labs and Mshauri at 3am, help is always one message away. Drop-off is a system failure, not a student one.</p></div>
          </div>
        </div>
      </section>

      <section className="people pad">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <div className="sec-kicker" style={{ color: "var(--marigold)" }}>// The people</div>
              <h2>Who runs the floor</h2>
            </div>
            <p style={{ color: "var(--muted-dk)" }}>Practitioners who&apos;ve shipped, teaching others to ship.</p>
          </div>
          <div className="ppl-grid">
            <div className="person">
              <div className="pic">SN</div>
              <div className="nm">Samuel N.</div>
              <div className="role">Founder · Lead facilitator</div>
              <div className="bio">Built ML systems for East African fintech for a decade. Started the Foundry to stop exporting talent and start forging it.</div>
            </div>
            <div className="person">
              <div className="pic">RA</div>
              <div className="nm">Ruth A.</div>
              <div className="role">Developer track lead</div>
              <div className="bio">Backend engineer turned teacher. Believes anyone who can run a duka can learn to run a deploy.</div>
            </div>
            <div className="person">
              <div className="pic">JK</div>
              <div className="nm">Joel K.</div>
              <div className="role">Professional track lead</div>
              <div className="bio">Spent years on AI adoption inside large orgs. Knows the gap between a demo and something a team actually uses.</div>
            </div>
            <div className="person">
              <div className="pic">M</div>
              <div className="nm">Mshauri</div>
              <div className="role">AI advisor · always on</div>
              <div className="bio">Trained on the full curriculum. Answers questions, reviews approaches, and never sleeps — so learners never stall.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="a-final">
        <div className="wrap">
          <h2>Come build with us</h2>
          <p>The next cohort is forming now. Take the 10-minute assessment and let&apos;s find your track.</p>
          <div className="cta-row">
            <Link href="/assess" className="btn btn-ink btn-lg">Take the assessment <span aria-hidden="true">→</span></Link>
            <Link href="/capstones" className="btn btn-out-ink btn-lg">See what students build</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
