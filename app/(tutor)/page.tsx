import Link from "next/link";

export const metadata = {
  title: "The AI Foundry Kampala — Build With AI",
  description:
    "Uganda's AI learning hub. Intensive tracks for developers, professionals, and first-time builders.",
};

const tracks = [
  {
    id: "developer",
    label: "Developer",
    tag: "12 weeks · Code-first",
    accent: "border-l-foundry-green",
    tagColor: "text-foundry-green",
    dot: "bg-foundry-green",
    description:
      "Build production AI agents, RAG pipelines, and deployed applications from first principles. Kampala-context problems, real code, real tools.",
    outcomes: ["Ship a working AI agent", "Deploy to production", "Read and write specs"],
    href: "/assess",
  },
  {
    id: "professional",
    label: "Professional",
    tag: "12 weeks · No-code friendly",
    accent: "border-l-amber-500",
    tagColor: "text-amber-600",
    dot: "bg-amber-500",
    description:
      "Apply AI to your domain. Automate workflows, audit AI systems, scope agents for your organisation. No coding required.",
    outcomes: ["Map and automate a workflow", "Write an AI project spec", "Lead AI transformation"],
    href: "/assess",
  },
  {
    id: "runway",
    label: "Runway",
    tag: "4 modules · Self-paced",
    accent: "border-l-stone-grey",
    tagColor: "text-stone-grey",
    dot: "bg-stone-grey",
    description:
      "Terminal, Git, Python basics, and a mini-project. The foundation for students who need to build technical confidence before the Developer track.",
    outcomes: ["Navigate the terminal", "Push code to GitHub", "Write a Python script"],
    href: "/assess",
  },
];

const steps = [
  {
    n: "01",
    title: "Take the intake assessment",
    body: "A 10-minute conversation with Mshauri, our AI advisor. No exam — just a chat to understand where you are and where you want to go.",
  },
  {
    n: "02",
    title: "Get placed on the right path",
    body: "Mshauri scores your responses across 8 signals and recommends Developer, Professional, or Runway. The facilitator confirms your cohort start date.",
  },
  {
    n: "03",
    title: "Build with your cohort",
    body: "12 weeks of structured learning, Saturday Fusion Labs, and a capstone project you can put in front of a real client.",
  },
];

const projects = [
  {
    name: "Duka Accountant",
    tagline: "AI bookkeeper for informal traders",
    description: "Reads M-Pesa and MTN MoMo transaction history. Categorises expenses, flags anomalies, produces a weekly cash-flow summary in plain language.",
    track: "Developer capstone",
    color: "bg-foundry-green",
  },
  {
    name: "Boda Dispatch",
    tagline: "Intelligent route and load dispatch",
    description: "Assigns delivery jobs to boda boda riders based on location, capacity, and traffic. Sends WhatsApp confirmations. Logs every delivery.",
    track: "Developer capstone",
    color: "bg-foundry-green-dark",
  },
  {
    name: "School Fees Tracker",
    tagline: "Payment reconciliation for school administrators",
    description: "Matches bank deposits against student records, flags outstanding balances, sends SMS reminders, and produces a monthly report for the bursar.",
    track: "Professional capstone",
    color: "bg-amber-600",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-bone-white">

      {/* ── Nav ── */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/">
            <img src="/brand/lockup-horizontal.svg" alt="The AI Foundry Kampala" className="h-7" />
          </Link>
          <div className="flex items-center gap-5">
            <Link href="/start" className="text-sm text-stone-grey hover:text-forge-night transition hidden sm:block">
              Mshauri
            </Link>
            <Link href="/login" className="text-sm text-stone-grey hover:text-forge-night transition hidden sm:block">
              Staff
            </Link>
            <Link
              href="/assess"
              className="text-sm font-medium bg-foundry-green text-white px-4 py-1.5 rounded-full hover:bg-foundry-green-light transition"
            >
              Apply now
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="bg-forge-night text-white">
        <div className="max-w-5xl mx-auto px-6 py-20 sm:py-28">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-amber-400 mb-5">
              <span className="w-4 h-px bg-amber-400" />
              Kampala, Uganda
            </span>
            <h1 className="text-4xl sm:text-6xl font-display font-bold leading-tight mb-6">
              Build With AI.
              <br />
              <span className="text-amber-400">From Kampala.</span>
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed mb-10 max-w-xl">
              The AI Foundry Kampala is an intensive learning hub training developers,
              analysts, and domain experts to build real AI systems — grounded in
              Kampala problems, Kampala context.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/assess"
                className="bg-amber-400 text-forge-night font-semibold px-6 py-3 rounded-xl hover:bg-amber-300 transition"
              >
                Apply — take the assessment →
              </Link>
              <Link
                href="/start"
                className="border border-gray-600 text-gray-300 font-medium px-6 py-3 rounded-xl hover:border-gray-400 hover:text-white transition"
              >
                Talk to Mshauri
              </Link>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="border-t border-white/10">
          <div className="max-w-5xl mx-auto px-6 py-5 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { v: "3", l: "Tracks" },
              { v: "12", l: "Weeks" },
              { v: "Saturday", l: "Fusion Labs" },
              { v: "24 / 7", l: "AI Advisor" },
            ].map((s) => (
              <div key={s.l}>
                <p className="text-xl font-bold text-white">{s.v}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tracks ── */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-forge-night mb-3">Choose your path</h2>
            <p className="text-stone-grey max-w-lg">Three tracks designed around where you are — and where the work is.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {tracks.map((t) => (
              <div
                key={t.id}
                className={`bg-white rounded-2xl border-l-4 ${t.accent} border border-gray-100 p-6 flex flex-col shadow-sm hover:shadow-md transition`}
              >
                <div>
                  <h3 className="text-lg font-semibold text-forge-night">{t.label}</h3>
                  <span className={`text-xs font-mono ${t.tagColor} block mb-3`}>{t.tag}</span>
                  <p className="text-sm text-stone-grey leading-relaxed mb-4">{t.description}</p>
                </div>
                <ul className="space-y-1.5 flex-1 mb-5">
                  {t.outcomes.map((o) => (
                    <li key={o} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className={`w-1.5 h-1.5 rounded-full ${t.dot} mt-1.5 flex-shrink-0`} />
                      {o}
                    </li>
                  ))}
                </ul>
                <Link href={t.href} className={`text-sm font-medium ${t.tagColor} hover:underline`}>
                  Apply for this track →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="bg-white py-20 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-forge-night mb-12">How it works</h2>
          <div className="grid sm:grid-cols-3 gap-10">
            {steps.map((s) => (
              <div key={s.n}>
                <p className="text-4xl font-bold text-gray-100 font-mono mb-3">{s.n}</p>
                <h3 className="text-base font-semibold text-forge-night mb-2">{s.title}</h3>
                <p className="text-sm text-stone-grey leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <Link
              href="/assess"
              className="inline-block bg-foundry-green text-white font-semibold px-6 py-3 rounded-xl hover:bg-foundry-green-light transition"
            >
              Start your assessment →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Capstone projects ── */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-forge-night mb-3">What you&apos;ll build</h2>
            <p className="text-stone-grey max-w-lg">
              Capstone projects are real systems built around real Kampala problems — not toy demos.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {projects.map((p) => (
              <div key={p.name} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition">
                <div className={`${p.color} h-2`} />
                <div className="p-6">
                  <p className="text-xs font-mono text-stone-grey mb-2">{p.track}</p>
                  <h3 className="text-base font-semibold text-forge-night mb-1">{p.name}</h3>
                  <p className="text-xs text-amber-600 font-medium mb-3">{p.tagline}</p>
                  <p className="text-sm text-stone-grey leading-relaxed">{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mshauri ── */}
      <section className="bg-foundry-green text-white py-20">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-start gap-12">
          <div className="flex-1">
            <span className="text-xs font-mono tracking-widest uppercase text-green-300 mb-3 block">AI Advisor · Available 24/7</span>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Meet Mshauri</h2>
            <p className="text-green-100 leading-relaxed max-w-md mb-6">
              Mshauri is your personal AI advisor — trained on the Foundry curriculum, available any time.
              Ask it anything: explain a concept, review your code approach, challenge an idea,
              or tell you what to tackle next. It knows your track and your week.
            </p>
            <Link
              href="/start"
              className="inline-block bg-white text-foundry-green font-semibold px-5 py-2.5 rounded-xl hover:bg-green-50 transition"
            >
              Start a conversation →
            </Link>
          </div>
          <div className="bg-foundry-green-dark rounded-2xl p-5 font-mono text-sm w-full sm:w-96 shrink-0 space-y-4">
            <p className="text-green-400 text-xs border-b border-white/10 pb-2">Mshauri · Developer track · Week 3</p>
            <div>
              <p className="text-green-300 text-xs mb-1">You</p>
              <p className="text-white">What is context engineering and why does it matter more than prompt engineering?</p>
            </div>
            <div>
              <p className="text-green-300 text-xs mb-1">Mshauri</p>
              <p className="text-green-100 leading-relaxed">
                Prompt engineering asks &quot;what do I say?&quot; Context engineering asks &quot;what does the model need to know to do its job well?&quot; — think of it like briefing a new market vendor versus just telling them what to sell today. Week 3 goes deep on this.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-amber-50 border-t border-amber-100 py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-forge-night mb-4">
            Ready to build?
          </h2>
          <p className="text-stone-grey mb-8 max-w-md mx-auto">
            The assessment takes 10 minutes. Mshauri will guide you through it — no pressure, no exam.
          </p>
          <Link
            href="/assess"
            className="inline-block bg-foundry-green text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-foundry-green-light transition text-base"
          >
            Take the intake assessment →
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-forge-night text-gray-500 py-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <img src="/brand/lockup-horizontal.svg" alt="The AI Foundry Kampala" className="h-6 opacity-60 mb-2" />
            <p className="text-xs">Kampala, Uganda</p>
          </div>
          <div className="flex flex-wrap gap-5 text-sm">
            <Link href="/assess" className="hover:text-white transition">Apply</Link>
            <Link href="/start" className="hover:text-white transition">Mshauri</Link>
            <Link href="/prep" className="hover:text-white transition">Runway</Link>
            <Link href="/login" className="hover:text-white transition">Staff login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
