import Link from "next/link";

export const metadata = {
  title: "The AI Foundry Kampala — Build With AI",
  description: "Uganda's AI learning hub. Intensive tracks for developers, professionals, and first-time builders.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col font-archivo bg-cream text-ink">

      {/* ── 1. NAV ── */}
      <header className="sticky top-0 z-50 bg-ink text-cream">
        <div className="max-w-[1320px] mx-auto px-[clamp(48px,7.5vw,140px)] h-[76px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="w-[34px] h-[34px] bg-marigold rounded-[9px] -rotate-6 grid place-items-center flex-shrink-0">
              <span className="font-bricolage font-black text-[18px] text-ink rotate-6 leading-none">F</span>
            </span>
            <span className="font-bricolage font-extrabold text-[16px] tracking-[0.01em] whitespace-nowrap">
              THE AI FOUNDRY <em className="not-italic text-marigold">KAMPALA</em>
            </span>
          </Link>
          <nav className="flex items-center gap-8">
            <Link href="#tracks" className="hidden lg:block font-archivo text-[15px] font-semibold text-cream/70 hover:text-cream transition whitespace-nowrap">Tracks</Link>
            <Link href="#how" className="hidden lg:block font-archivo text-[15px] font-semibold text-cream/70 hover:text-cream transition whitespace-nowrap">How it works</Link>
            <Link href="#mshauri" className="hidden lg:block font-archivo text-[15px] font-semibold text-cream/70 hover:text-cream transition whitespace-nowrap">Mshauri</Link>
            <Link href="/assess" className="font-archivo font-bold text-[15px] bg-clay text-[#1a0d06] px-6 py-[13px] rounded-full hover:bg-[#e85f33] hover:-translate-y-px transition whitespace-nowrap">
              Apply now →
            </Link>
          </nav>
        </div>
      </header>

      {/* ── 2. HERO ── */}
      <section className="bg-ink text-cream relative overflow-hidden">
        <div className="absolute inset-0 z-0" style={{ background: "radial-gradient(1100px 520px at 82% -8%, rgba(216,84,43,0.30), transparent 56%), radial-gradient(760px 460px at 6% 14%, rgba(242,178,62,0.13), transparent 60%)" }} />
        <div className="relative z-10 max-w-[1320px] mx-auto px-[clamp(48px,7.5vw,140px)] pt-[92px] pb-[78px]">
          <div className="inline-flex items-center gap-3 bg-forest font-space-mono font-bold text-[12.5px] tracking-[0.1em] uppercase px-[18px] py-[9px] rounded-full mb-8 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-marigold flex-shrink-0" />
            Kampala, Uganda · <span className="text-marigold">Intensive AI Training</span>
          </div>
          <h1 className="font-bricolage font-bold leading-[1.0] tracking-[-0.035em] max-w-[1150px]" style={{ fontSize: "clamp(50px, 7.4vw, 104px)", paddingBottom: "0.06em" }}>
            Build with <span className="text-clay">AI.</span><br />
            Forged in <span className="italic font-semibold" style={{ color: "#23CB87" }}>Kampala.</span>
          </h1>
          <p className="font-archivo mt-8 max-w-[620px] text-[20px] leading-[1.55] text-muted-dk">
            An intensive learning hub training developers, analysts, and domain experts to build real AI systems — grounded in Kampala problems, Kampala context.
          </p>
          <div className="flex flex-wrap gap-4 mt-10">
            <Link href="/assess" className="font-archivo font-bold text-[16px] bg-clay text-[#1a0d06] px-[30px] py-[17px] rounded-full hover:bg-[#e85f33] hover:-translate-y-px transition">
              Apply — take the assessment →
            </Link>
            <Link href="/start" className="font-archivo font-bold text-[16px] border-2 border-line-dk text-cream px-[30px] py-[17px] rounded-full hover:border-marigold hover:text-marigold transition">
              Talk to Mshauri
            </Link>
          </div>
          {/* Stats strip */}
          <div className="mt-[78px] border-t border-line-dk grid grid-cols-2 lg:grid-cols-4">
            {[
              { num: "3", accent: true, label: "Learning tracks" },
              { num: "12 wks", accent: false, label: "Core cohort" },
              { num: "Sat", accent: false, label: "Fusion Labs" },
              { num: "24/7", accent: false, label: "Mshauri advisor" },
            ].map((s, i) => (
              <div key={i} className={`pt-[30px] pb-1 pr-2 ${i < 3 ? "border-r border-line-dk" : ""} ${i === 1 ? "lg:border-r border-r-0" : ""}`}>
                <p className={`font-bricolage font-extrabold text-[40px] tracking-[-0.02em] ${s.accent ? "text-clay" : "text-cream"}`}>{s.num}</p>
                <p className="mt-2 font-space-mono text-[11.5px] tracking-[0.1em] uppercase text-muted-dk">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. TICKER ── */}
      <div className="bg-ink border-t border-line-dk py-[18px] overflow-hidden whitespace-nowrap">
        <div className="ticker-track font-bricolage font-extrabold text-[18px] tracking-[0.03em] uppercase text-cream">
          <span>Duka Accountant</span><span className="text-marigold">✦</span>
          <span>Boda Dispatch</span><span className="text-marigold">✦</span>
          <span>School Fees Tracker</span><span className="text-marigold">✦</span>
          <span>Real systems, real clients</span><span className="text-marigold">✦</span>
          <span>Duka Accountant</span><span className="text-marigold">✦</span>
          <span>Boda Dispatch</span><span className="text-marigold">✦</span>
          <span>School Fees Tracker</span><span className="text-marigold">✦</span>
          <span>Real systems, real clients</span><span className="text-marigold">✦</span>
        </div>
      </div>

      {/* ── 4. TRACKS ── */}
      <section className="py-[100px] bg-cream" id="tracks">
        <div className="max-w-[1320px] mx-auto px-[clamp(48px,7.5vw,140px)]">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-[50px]">
            <div>
              <p className="font-space-mono text-[12px] tracking-[0.14em] uppercase text-clay mb-[18px]">// Programmes</p>
              <h2 className="font-bricolage font-black uppercase tracking-[-0.015em] leading-[0.96] text-ink" style={{ fontSize: "clamp(34px, 5vw, 58px)" }}>
                Choose<br />your path
              </h2>
            </div>
            <p className="font-archivo max-w-[360px] text-[16px] leading-[1.55] lg:text-right text-muted-lt">
              Three tracks designed around where you are — and where the work is.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[22px]">
            {[
              { idx: "01 — DEVELOPER", title: "Developer", meta: "12 weeks · code-first", bg: "bg-clay", body: "Build production AI agents, RAG pipelines, and deployed applications from first principles. Kampala-context problems, real code, real tools.", outcomes: ["Ship a working AI agent", "Deploy to production", "Read and write specs"] },
              { idx: "02 — PROFESSIONAL", title: "Professional", meta: "12 weeks · no-code friendly", bg: "bg-forest", body: "Apply AI to your domain. Automate workflows, audit AI systems, and scope agents for your organisation. No coding required.", outcomes: ["Map and automate a workflow", "Write an AI project spec", "Lead AI transformation"] },
              { idx: "03 — RUNWAY", title: "Runway", meta: "4 modules · self-paced", bg: "bg-plum", body: "Terminal, Git, Python basics, and a mini-project. The foundation for students who need technical confidence before the Developer track.", outcomes: ["Navigate the terminal", "Push code to GitHub", "Write a Python script"] },
            ].map((t) => (
              <div key={t.title} className={`${t.bg} rounded-[22px] p-[34px_30px] text-cream flex flex-col`}>
                <div className="font-space-mono text-[12px] tracking-[0.08em] opacity-80">{t.idx}</div>
                <h3 className="font-bricolage font-extrabold text-[30px] uppercase tracking-[-0.01em] mt-3">{t.title}</h3>
                <div className="font-space-mono text-[12.5px] mt-2 opacity-90">{t.meta}</div>
                <p className="font-archivo text-[14.5px] leading-[1.55] mt-[18px] opacity-95">{t.body}</p>
                <ul className="mt-[22px] flex flex-col gap-[11px] flex-1">
                  {t.outcomes.map((o) => (
                    <li key={o} className="font-archivo text-[14.5px] flex items-start gap-3 font-medium">
                      <span className="w-[7px] h-[7px] rounded-full bg-marigold mt-[7px] flex-shrink-0" />
                      {o}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-[28px]">
                  <Link href="/assess" className="inline-flex items-center gap-2 font-space-mono text-[13px] font-bold group">
                    Apply for this track
                    <span className="w-[30px] h-[30px] rounded-full bg-cream text-ink grid place-items-center text-[15px] group-hover:translate-x-[3px] transition">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. HOW IT WORKS ── */}
      <section className="bg-ink text-cream py-[100px]" id="how">
        <div className="max-w-[1320px] mx-auto px-[clamp(48px,7.5vw,140px)]">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-[50px]">
            <div>
              <p className="font-space-mono text-[12px] tracking-[0.14em] uppercase text-clay mb-[18px]">// Process</p>
              <h2 className="font-bricolage font-black uppercase tracking-[-0.015em] leading-[0.96]" style={{ fontSize: "clamp(34px, 5vw, 58px)" }}>
                How it works
              </h2>
            </div>
            <p className="font-archivo max-w-[360px] text-[16px] leading-[1.55] lg:text-right text-muted-dk">
              From first contact to a shipped capstone in twelve weeks.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {[
              { n: "01", title: "Take the intake assessment", body: "A 10-minute conversation with Mshauri, our AI advisor. No exam — just a chat to understand where you are and where you want to go." },
              { n: "02", title: "Get placed on the right path", body: "Mshauri scores your responses across 8 signals and recommends Developer, Professional, or Runway. The facilitator confirms your cohort start date." },
              { n: "03", title: "Build with your cohort", body: "12 weeks of structured learning, Saturday Fusion Labs, and a capstone project you can put in front of a real client." },
            ].map((s, i) => (
              <div key={s.n} className={`${i > 0 ? "border-t border-line-dk pt-7 mt-7 lg:mt-0 lg:pt-0 lg:border-t-0 lg:border-l lg:border-line-dk lg:pl-9" : ""}`}>
                <p className="font-bricolage font-black text-[60px] text-marigold tracking-[-0.02em] leading-none">{s.n}</p>
                <h3 className="font-bricolage font-extrabold text-[21px] uppercase tracking-[-0.005em] mt-[22px]">{s.title}</h3>
                <p className="font-archivo text-muted-dk text-[15.5px] leading-[1.58] mt-[14px]">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. CAPSTONES ── */}
      <section className="py-[100px] bg-cream" id="build">
        <div className="max-w-[1320px] mx-auto px-[clamp(48px,7.5vw,140px)]">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-[50px]">
            <div>
              <p className="font-space-mono text-[12px] tracking-[0.14em] uppercase text-clay mb-[18px]">// Capstones</p>
              <h2 className="font-bricolage font-black uppercase tracking-[-0.015em] leading-[0.96] text-ink" style={{ fontSize: "clamp(34px, 5vw, 58px)" }}>
                What you&apos;ll build
              </h2>
            </div>
            <p className="font-archivo max-w-[360px] text-[16px] leading-[1.55] lg:text-right text-muted-lt">
              Real systems built around real Kampala problems — not toy demos.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[22px]">
            {[
              { bar: "bg-clay", tagColor: "text-clay-deep", tag: "Developer capstone", name: "Duka Accountant", sub: "AI bookkeeper for informal traders", body: "Reads M-Pesa and MTN MoMo transaction history. Categorises expenses, flags anomalies, and produces a weekly cash-flow summary in plain language." },
              { bar: "bg-forest", tagColor: "text-forest", tag: "Developer capstone", name: "Boda Dispatch", sub: "Intelligent route and load dispatch", body: "Assigns delivery jobs to boda boda riders based on location, capacity, and traffic. Sends WhatsApp confirmations. Logs every delivery." },
              { bar: "bg-plum", tagColor: "text-plum", tag: "Professional capstone", name: "School Fees Tracker", sub: "Payment reconciliation for administrators", body: "Matches bank deposits against student records, flags outstanding balances, sends SMS reminders, and produces a monthly report for the bursar." },
            ].map((p) => (
              <div key={p.name} className="rounded-[22px] overflow-hidden border border-line-lt bg-white flex flex-col">
                <div className={`h-[10px] ${p.bar}`} />
                <div className="p-[30px_30px_34px] flex flex-col flex-1">
                  <p className={`font-space-mono text-[11px] tracking-[0.08em] uppercase ${p.tagColor}`}>{p.tag}</p>
                  <h3 className="font-bricolage font-extrabold text-[25px] tracking-[-0.01em] mt-[14px] text-ink">{p.name}</h3>
                  <p className="font-archivo text-[14.5px] mt-[6px] text-muted-lt font-semibold">{p.sub}</p>
                  <p className="font-archivo text-[14.5px] leading-[1.56] mt-[18px] text-muted-lt">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. MSHAURI ── */}
      <section className="bg-forest text-cream py-[100px]" id="mshauri">
        <div className="max-w-[1320px] mx-auto px-[clamp(48px,7.5vw,140px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[64px] items-center">
            <div>
              <div className="inline-flex items-center gap-[10px] bg-cream/10 font-space-mono text-[12px] tracking-[0.08em] uppercase px-4 py-2 rounded-full mb-6">
                <span className="w-2 h-2 rounded-full bg-marigold mshauri-pulse flex-shrink-0" />
                AI Advisor · Available 24/7
              </div>
              <h2 className="font-bricolage font-black uppercase tracking-[-0.015em] leading-[0.96]" style={{ fontSize: "clamp(38px, 5vw, 58px)" }}>
                Meet Mshauri
              </h2>
              <p className="font-archivo text-[17px] leading-[1.6] mt-[22px] max-w-[460px]" style={{ color: "#d8e6df" }}>
                Your personal AI advisor — trained on the Foundry curriculum, available any time. Ask it anything: explain a concept, review your code approach, challenge an idea, or tell you what to tackle next. It knows your track and your week.
              </p>
              <div className="mt-[34px]">
                <Link href="/start" className="font-archivo font-bold text-[15px] bg-cream text-ink px-6 py-[14px] rounded-full hover:bg-cream-2 hover:-translate-y-px transition inline-block">
                  Start a conversation →
                </Link>
              </div>
            </div>
            {/* Chat mockup */}
            <div className="bg-ink rounded-[20px] p-[26px] border border-cream/10" style={{ boxShadow: "0 30px 60px rgba(0,0,0,0.35)" }}>
              <div className="flex items-center gap-[10px] font-space-mono text-[11.5px] text-muted-dk pb-[18px] border-b border-line-dk">
                <span className="w-[26px] h-[26px] rounded-[8px] flex-shrink-0" style={{ background: "linear-gradient(150deg, #F2B23E, #D8542B)" }} />
                Mshauri · Developer track · Week 3
              </div>
              <div className="mt-[18px]">
                <p className="font-space-mono text-[11px] tracking-[0.08em] uppercase text-muted-dk mb-2">You</p>
                <div className="font-archivo text-[15px] leading-[1.55] px-[18px] py-[14px] rounded-[14px] rounded-br-[4px] text-cream" style={{ background: "#221A13" }}>
                  What is context engineering and why does it matter more than prompt engineering?
                </div>
              </div>
              <div className="mt-[18px]">
                <p className="font-space-mono text-[11px] tracking-[0.08em] uppercase text-muted-dk mb-2">Mshauri</p>
                <div className="font-archivo text-[15px] leading-[1.55] px-[18px] py-[14px] rounded-[14px] rounded-bl-[4px] text-cream" style={{ background: "rgba(242,178,62,0.12)", border: "1px solid rgba(242,178,62,0.22)" }}>
                  Prompt engineering asks &ldquo;what do I say?&rdquo; Context engineering asks &ldquo;what does the model need to know to do its job well?&rdquo; — think of it like briefing a new market vendor versus just telling them what to sell today. Week 3 goes deep on this.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. FINAL CTA ── */}
      <section className="bg-marigold text-ink text-center py-[110px]">
        <div className="max-w-[1320px] mx-auto px-[clamp(48px,7.5vw,140px)]">
          <h2 className="font-bricolage font-black uppercase tracking-[-0.025em] leading-[0.95]" style={{ fontSize: "clamp(46px, 7vw, 90px)" }}>
            Ready to build?
          </h2>
          <p className="font-archivo text-[19px] mt-6 max-w-[540px] mx-auto" style={{ color: "#5a3f12" }}>
            The assessment takes 10 minutes. Mshauri will guide you through it — no pressure, no exam.
          </p>
          <div className="mt-10">
            <Link href="/assess" className="font-archivo font-bold text-[16px] bg-ink text-cream px-[30px] py-[17px] rounded-full hover:opacity-90 hover:-translate-y-px transition inline-block">
              Take the intake assessment →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 9. FOOTER ── */}
      <footer className="bg-ink text-cream">
        <div className="max-w-[1320px] mx-auto px-[clamp(48px,7.5vw,140px)]">
          <div className="pt-[88px] pb-[56px] grid grid-cols-2 lg:grid-cols-[1.7fr_1fr_1fr_1fr] gap-10 lg:gap-12 items-start">
            <div className="col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3">
                <span className="w-[34px] h-[34px] bg-marigold rounded-[9px] -rotate-6 grid place-items-center flex-shrink-0">
                  <span className="font-bricolage font-black text-[18px] text-ink rotate-6 leading-none">F</span>
                </span>
                <span className="font-bricolage font-extrabold text-[17px] tracking-[0.01em] whitespace-nowrap">
                  THE AI FOUNDRY <em className="not-italic text-marigold">KAMPALA</em>
                </span>
              </div>
              <p className="font-archivo mt-[22px] text-[15px] leading-[1.55] text-muted-dk max-w-[360px]">
                An intensive AI learning hub training developers, professionals, and first-time builders to ship real systems — from Kampala.
              </p>
              <p className="font-space-mono text-[12px] text-muted-dk mt-5 tracking-[0.06em]">Kampala, Uganda · 00°19′N 32°35′E</p>
            </div>
            <div>
              <h4 className="font-space-mono text-[11px] tracking-[0.12em] uppercase text-muted-dk mb-5 whitespace-nowrap">Programme</h4>
              {[["Tracks", "#tracks"], ["How it works", "#how"], ["Capstones", "#build"]].map(([l, h]) => (
                <Link key={l} href={h} className="font-archivo block w-fit text-[15px] mb-[14px] text-cream hover:text-marigold transition whitespace-nowrap">{l}</Link>
              ))}
            </div>
            <div>
              <h4 className="font-space-mono text-[11px] tracking-[0.12em] uppercase text-muted-dk mb-5 whitespace-nowrap">Get started</h4>
              {[["Apply", "/assess"], ["Mshauri", "/start"], ["Runway", "/prep"]].map(([l, h]) => (
                <Link key={l} href={h} className="font-archivo block w-fit text-[15px] mb-[14px] text-cream hover:text-marigold transition whitespace-nowrap">{l}</Link>
              ))}
            </div>
            <div>
              <h4 className="font-space-mono text-[11px] tracking-[0.12em] uppercase text-muted-dk mb-5 whitespace-nowrap">Foundry</h4>
              <Link href="/login" className="font-archivo block w-fit text-[15px] mb-[14px] text-cream hover:text-marigold transition whitespace-nowrap">Staff login</Link>
            </div>
          </div>
          <div className="border-t border-line-dk pt-[26px] pb-[26px] font-space-mono text-[11.5px] text-muted-dk flex justify-between tracking-[0.04em]">
            <span>© 2026 The AI Foundry Kampala</span>
            <span>Build with AI. From Kampala.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
