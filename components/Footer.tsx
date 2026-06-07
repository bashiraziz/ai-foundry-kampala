import Link from "next/link";

export default function Footer() {
  return (
    <>
      <style>{`
        footer.foundry-footer { background: var(--ink); color: var(--cream); }
        .foundry-footer .foot { padding-top: 88px; padding-bottom: 56px; display: grid; grid-template-columns: 1.7fr 1fr 1fr 1fr; gap: 48px; align-items: start; }
        .foundry-footer .lockup { display: flex; align-items: center; gap: 12px; }
        .foundry-footer .lockup .mark { width: 34px; height: 34px; background: var(--marigold); border-radius: 9px; display: grid; place-items: center; transform: rotate(-6deg); flex-shrink: 0; }
        .foundry-footer .lockup .mark span { font-family: "Bricolage Grotesque"; font-weight: 900; font-size: 18px; color: var(--ink); transform: rotate(6deg); display: block; line-height: 1; }
        .foundry-footer .lockup .name { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 17px; letter-spacing: 0.01em; white-space: nowrap; }
        .foundry-footer .lockup .name em { font-style: normal; color: var(--marigold); }
        .foundry-footer .f-left { max-width: 360px; }
        .foundry-footer .f-left .descr { margin-top: 22px; font-size: 15px; line-height: 1.55; color: var(--muted-dk); }
        .foundry-footer .f-left .loc { font-family: "Space Mono"; font-size: 12px; color: var(--muted-dk); margin-top: 20px; letter-spacing: 0.06em; }
        .foundry-footer .f-col h4 { font-family: "Space Mono"; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted-dk); margin-bottom: 20px; white-space: nowrap; }
        .foundry-footer .f-col a { display: block; width: fit-content; font-size: 15px; margin-bottom: 14px; color: var(--cream); white-space: nowrap; transition: color .15s; }
        .foundry-footer .f-col a:hover { color: var(--marigold); }
        .foundry-footer .foot-base { border-top: 1px solid var(--line-dk); padding-top: 26px; padding-bottom: 26px; font-family: "Space Mono"; font-size: 11.5px; color: var(--muted-dk); display: flex; justify-content: space-between; letter-spacing: 0.04em; }
        @media (max-width: 980px) {
          .foundry-footer .foot { grid-template-columns: repeat(2, 1fr); gap: 40px; }
          .foundry-footer .f-left { grid-column: 1 / -1; }
        }
      `}</style>
      <footer className="foundry-footer">
        <div className="wrap foot">
          <div className="f-left">
            <Link href="/" className="lockup">
              <span className="mark"><span>F</span></span>
              <span className="name">THE AI FOUNDRY <em>KAMPALA</em></span>
            </Link>
            <p className="descr">An intensive AI learning hub training developers, professionals, and first-time builders to ship real systems — from Kampala.</p>
            <p className="loc">Kampala, Uganda · 00°19′N 32°35′E</p>
          </div>
          <div className="f-col">
            <h4>Programme</h4>
            <Link href="/#tracks">Tracks</Link>
            <Link href="/#how">How it works</Link>
            <Link href="/capstones">Capstones</Link>
          </div>
          <div className="f-col">
            <h4>Get started</h4>
            <Link href="/assess">Apply</Link>
            <Link href="/mshauri">Mshauri</Link>
            <Link href="/tracks/runway">Runway</Link>
          </div>
          <div className="f-col">
            <h4>Foundry</h4>
            <Link href="/about">About</Link>
            <Link href="/login">Staff login</Link>
          </div>
        </div>
        <div className="wrap foot-base">
          <span>© 2026 The AI Foundry Kampala</span>
          <span>Build with AI. From Kampala.</span>
        </div>
      </footer>
    </>
  );
}
