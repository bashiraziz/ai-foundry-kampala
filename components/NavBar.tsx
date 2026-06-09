import Link from "next/link";

interface NavBarProps {
  activePage?: "tracks" | "capstones" | "mshauri" | "about";
}

export default function NavBar({ activePage }: NavBarProps) {
  return (
    <>
      <style>{`
        header.nav-bar { position: sticky; top: 0; z-index: 50; background: var(--ink); color: var(--cream); }
        .nav-bar .nav { display: flex; align-items: center; justify-content: space-between; height: 76px; }
        .nav-bar .lockup { display: flex; align-items: center; gap: 12px; }
        .nav-bar .lockup .mark { width: 34px; height: 34px; background: var(--marigold); border-radius: 9px; display: grid; place-items: center; transform: rotate(-6deg); flex-shrink: 0; }
        .nav-bar .lockup .mark span { font-family: "Bricolage Grotesque"; font-weight: 900; font-size: 18px; color: var(--ink); transform: rotate(6deg); display: block; line-height: 1; }
        .nav-bar .lockup .name { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 16px; letter-spacing: 0.01em; white-space: nowrap; }
        .nav-bar .lockup .name em { font-style: normal; color: var(--marigold); }
        .nav-bar .nav-links { display: flex; align-items: center; gap: 32px; }
        .nav-bar .nav-links a.lk { color: color-mix(in srgb, var(--cream) 72%, transparent); font-size: 15px; font-weight: 600; white-space: nowrap; transition: color .15s; }
        .nav-bar .nav-links a.lk:hover { color: var(--cream); }
        .nav-bar .nav-links a.lk.active { color: var(--marigold); }
        @media (max-width: 980px) { .nav-bar .nav-links a.lk { display: none; } }
      `}</style>
      <header className="nav-bar">
        <div className="wrap nav">
          <Link href="/" className="lockup">
            <span className="mark"><span>F</span></span>
            <span className="name">THE AI FOUNDRY <em>KAMPALA</em></span>
          </Link>
          <nav className="nav-links">
            <Link href="/#tracks" className={`lk${activePage === "tracks" ? " active" : ""}`}>Tracks</Link>
            <Link href="/capstones" className={`lk${activePage === "capstones" ? " active" : ""}`}>Capstones</Link>
            <Link href="/mshauri" className={`lk${activePage === "mshauri" ? " active" : ""}`}>Mshauri</Link>
            <Link href="/about" className={`lk${activePage === "about" ? " active" : ""}`}>About</Link>
            <Link href="/assess" className="btn btn-clay">Apply now <span aria-hidden="true">→</span></Link>
          </nav>
        </div>
      </header>
    </>
  );
}
