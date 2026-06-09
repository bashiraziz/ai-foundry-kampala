import Link from "next/link";
import NavBar from "@/components/NavBar";

export const metadata = {
  title: "Mshauri — Your AI Advisor · The AI Foundry Kampala",
  description: "Meet Mshauri, your personal AI advisor trained on the Foundry curriculum. Available 24/7.",
};

const PAGE_CSS = `
  body { background: var(--ink); }
  .msh-app { background: var(--ink); color: var(--cream); display: grid; grid-template-columns: 296px 1fr; min-height: calc(100vh - 76px); }

  .side { background: var(--ink-2); border-right: 1px solid var(--line-dk); display: flex; flex-direction: column; padding: 24px 18px; }
  .side .me { display: flex; align-items: center; gap: 12px; padding: 8px 8px 20px; border-bottom: 1px solid var(--line-dk); }
  .side .me .pic { width: 40px; height: 40px; border-radius: 11px; background: linear-gradient(150deg, var(--forest-2), var(--forest)); display: grid; place-items: center; font-family: "Bricolage Grotesque"; font-weight: 800; color: var(--cream); flex-shrink: 0; }
  .side .me .nm { font-weight: 700; font-size: 15px; }
  .side .me .ctx { font-family: "Space Mono"; font-size: 11px; color: var(--muted-dk); margin-top: 3px; }
  .side .new { margin: 20px 0; }
  .side .new a { width: 100%; justify-content: center; }
  .sect { font-family: "Space Mono"; font-size: 10.5px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted-dk); padding: 6px 10px; margin-top: 8px; }
  .thread { display: block; padding: 11px 12px; border-radius: 11px; font-size: 14px; color: var(--muted-dk); cursor: pointer; transition: background .15s, color .15s; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .thread:hover { background: rgba(255,255,255,0.04); color: var(--cream); }
  .thread.active { background: rgba(242,178,62,0.12); color: var(--cream); }
  .side .foot-link { margin-top: auto; padding-top: 18px; border-top: 1px solid var(--line-dk); }
  .side .foot-link a { font-family: "Space Mono"; font-size: 12px; color: var(--muted-dk); display: flex; align-items: center; gap: 8px; padding: 8px 10px; }
  .side .foot-link a:hover { color: var(--marigold); }

  .main { display: flex; flex-direction: column; position: relative; overflow: hidden; }
  .main-bg { position: absolute; inset: 0; z-index: 0; background: radial-gradient(900px 480px at 88% -12%, rgba(216,84,43,0.14), transparent 58%); }
  .thread-top { position: relative; z-index: 2; display: flex; align-items: center; justify-content: space-between; padding: 20px 40px; border-bottom: 1px solid var(--line-dk); background: rgba(26,20,16,0.7); backdrop-filter: blur(8px); }
  .thread-top .t-nm { font-family: "Bricolage Grotesque"; font-weight: 700; font-size: 18px; }
  .thread-top .t-meta { font-family: "Space Mono"; font-size: 11px; color: var(--muted-dk); margin-top: 2px; }
  .thread-top .status { display: inline-flex; align-items: center; gap: 8px; font-family: "Space Mono"; font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted-dk); }
  .thread-top .status .live-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--forest-2); }

  .stream { position: relative; z-index: 2; flex: 1; overflow: auto; padding: 38px 40px 20px; }
  .stream-inner { max-width: 760px; margin: 0 auto; display: flex; flex-direction: column; gap: 30px; }
  .ex { display: flex; gap: 16px; }
  .ex .av { width: 40px; height: 40px; border-radius: 11px; flex: none; display: grid; place-items: center; font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 16px; }
  .ex.bot .av { background: linear-gradient(150deg, var(--marigold), var(--clay)); color: var(--ink); }
  .ex.you .av { background: var(--ink-2); border: 1px solid var(--line-dk); color: var(--muted-dk); font-family: "Space Mono"; font-size: 12px; font-weight: 700; }
  .ex .body { flex: 1; min-width: 0; }
  .ex .who { font-family: "Space Mono"; font-size: 10.5px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted-dk); margin-bottom: 9px; }
  .ex .who b { color: var(--marigold); font-weight: 700; }
  .ex p { font-size: 15.5px; line-height: 1.62; color: var(--cream); margin-bottom: 13px; }
  .ex p:last-child { margin-bottom: 0; }
  .ex.you .body { background: var(--ink-2); border: 1px solid var(--line-dk); border-radius: 14px; padding: 16px 20px; }
  .ex .code { background: var(--ink); border: 1px solid var(--line-dk); border-radius: 12px; padding: 16px 18px; font-family: "Space Mono"; font-size: 13px; line-height: 1.7; color: var(--cream-2); margin: 6px 0 13px; overflow-x: auto; }
  .ex .callout { border-left: 3px solid var(--marigold); padding: 4px 0 4px 16px; margin: 4px 0 13px; }
  .ex .callout .lbl { font-family: "Space Mono"; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--marigold); margin-bottom: 6px; }

  .composer { position: relative; z-index: 2; padding: 0 40px 30px; }
  .composer-inner { max-width: 760px; margin: 0 auto; }
  .suggest { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 16px; }
  .suggest .s { font-family: "Archivo"; font-size: 13.5px; font-weight: 500; padding: 9px 16px; border-radius: 999px; border: 1px solid var(--line-dk); background: var(--ink-2); color: var(--muted-dk); cursor: pointer; transition: all .15s; }
  .suggest .s:hover { border-color: var(--marigold); color: var(--cream); }
  .inputbar { display: flex; align-items: center; gap: 12px; background: var(--ink-2); border: 1.5px solid var(--line-dk); border-radius: 16px; padding: 8px 8px 8px 20px; }
  .inputbar input { flex: 1; background: transparent; border: none; outline: none; color: var(--cream); font-family: "Archivo"; font-size: 15.5px; }
  .inputbar input::placeholder { color: var(--muted-dk); }
  .inputbar .send { width: 44px; height: 44px; border-radius: 11px; background: var(--clay); color: var(--ink); border: none; display: grid; place-items: center; font-size: 19px; cursor: pointer; transition: background .15s; flex-shrink: 0; }
  .inputbar .send:hover { background: var(--clay-deep); }
  .disc { text-align: center; font-family: "Space Mono"; font-size: 11px; color: var(--muted-dk); margin-top: 14px; }

  @media (max-width: 900px) {
    .msh-app { grid-template-columns: 1fr; }
    .side { display: none; }
    .stream { padding: 24px 20px 16px; }
    .thread-top, .composer { padding-left: 20px; padding-right: 20px; }
  }
`;

export default function MshauriPage() {
  return (
    <>
      <style>{PAGE_CSS}</style>
      <NavBar activePage="mshauri" />

      <div className="msh-app">
        <aside className="side">
          <div className="me">
            <div className="pic">AK</div>
            <div>
              <div className="nm">Amara K.</div>
              <div className="ctx">Developer · Week 3</div>
            </div>
          </div>
          <div className="new"><Link href="/assess" className="btn btn-clay">+ New conversation</Link></div>
          <div className="sect">Today</div>
          <span className="thread active">Context vs. prompt engineering</span>
          <span className="thread">Why is my RAG returning junk?</span>
          <div className="sect">This week</div>
          <span className="thread">Explain embeddings like I&apos;m 12</span>
          <span className="thread">Reviewing my agent&apos;s tool calls</span>
          <span className="thread">Boda Dispatch — data model help</span>
          <span className="thread">Git rebase went wrong</span>
          <div className="foot-link">
            <Link href="/">← Back to the Foundry</Link>
          </div>
        </aside>

        <main className="main">
          <div className="main-bg" />
          <div className="thread-top">
            <div>
              <div className="t-nm">Context vs. prompt engineering</div>
              <div className="t-meta">Developer track · Module 2 · Week 3</div>
            </div>
            <div className="status"><span className="live-dot" /> Mshauri online</div>
          </div>

          <div className="stream">
            <div className="stream-inner">
              <div className="ex you">
                <div className="av">You</div>
                <div className="body">
                  <div className="who">Amara</div>
                  <p>What is context engineering and why does it matter more than prompt engineering?</p>
                </div>
              </div>

              <div className="ex bot">
                <div className="av">M</div>
                <div className="body">
                  <div className="who"><b>Mshauri</b> · your advisor</div>
                  <p>Great question to be asking in Week 3 — this is the shift that separates demos from real systems.</p>
                  <p><strong>Prompt engineering</strong> asks: <em>&ldquo;what do I say to the model?&rdquo;</em> You tune wording, examples, and instructions in a single message.</p>
                  <p><strong>Context engineering</strong> asks a bigger question: <em>&ldquo;what does the model need to know — and have access to — to do this job well, every time?&rdquo;</em> That&apos;s retrieval, memory, tools, and the structure of what you feed in.</p>
                  <div className="callout">
                    <div className="lbl">The market analogy</div>
                    <p style={{ margin: 0 }}>Prompt engineering is telling a new vendor what to sell today. Context engineering is briefing them on the whole stall — who the customers are, where stock lives, what sold last week. One scales, one doesn&apos;t.</p>
                  </div>
                  <p>Module 2 this week is exactly this. Want me to pull up the RAG exercise, or walk through how retrieval fits your Boda Dispatch capstone?</p>
                </div>
              </div>
            </div>
          </div>

          <div className="composer">
            <div className="composer-inner">
              <div className="suggest">
                <button className="s">Show me the RAG exercise</button>
                <button className="s">Apply it to my capstone</button>
                <button className="s">What&apos;s the difference from fine-tuning?</button>
              </div>
              <div className="inputbar">
                <input type="text" placeholder="Ask Mshauri anything about your week…" />
                <button className="send" aria-label="Send">↑</button>
              </div>
              <p className="disc">Mshauri knows your track, week, and capstone. It can be wrong — always verify before you ship.</p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
