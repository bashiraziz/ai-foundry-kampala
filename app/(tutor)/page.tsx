import Link from "next/link";

export const metadata = {
  title: "The AI Foundry Kampala — Build With AI",
  description:
    "Uganda's AI learning hub. Intensive tracks for developers, professionals, and first-time builders.",
};

const tracks = [
  {
    label: "Developer",
    tag: "12 weeks · Code-first",
    description:
      "Build production AI applications. APIs, agents, RAG pipelines, and deployment — from first principles.",
    accent: "bg-foundry-green",
    textAccent: "text-foundry-green",
    border: "border-foundry-green",
    href: "/assess",
  },
  {
    label: "Professional",
    tag: "12 weeks · No-code friendly",
    description:
      "Apply AI to your domain. Automate workflows, analyse data, and lead AI transformation in your organisation.",
    accent: "bg-amber-500",
    textAccent: "text-amber-600",
    border: "border-amber-500",
    href: "/assess",
  },
  {
    label: "Prep / Runway",
    tag: "Foundations first",
    description:
      "Not sure where to start? Build the foundations — digital literacy, prompt engineering, and critical thinking with AI.",
    accent: "bg-gray-700",
    textAccent: "text-gray-700",
    border: "border-gray-700",
    href: "/prep",
  },
];

const stats = [
  { value: "2", label: "Tracks" },
  { value: "12", label: "Weeks" },
  { value: "Kampala", label: "Based in" },
  { value: "24 / 7", label: "AI Advisor" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans">

      {/* ── Nav ── */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/">
            <img
              src="/brand/lockup-horizontal.svg"
              alt="The AI Foundry Kampala"
              className="h-7"
            />
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/prep" className="text-sm text-stone-grey hover:text-forge-night transition hidden sm:block">
              Prep
            </Link>
            <Link href="/start" className="text-sm text-stone-grey hover:text-forge-night transition hidden sm:block">
              Mshauri
            </Link>
            <Link
              href="/assess"
              className="text-sm font-medium bg-foundry-green text-white px-4 py-1.5 rounded-full hover:bg-foundry-green-light transition"
            >
              Apply
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="bg-forge-night text-white">
        <div className="max-w-5xl mx-auto px-6 py-20 sm:py-28">
          <div className="max-w-2xl">
            <span className="inline-block text-xs font-mono tracking-widest uppercase text-amber-400 mb-4">
              Kampala · Uganda
            </span>
            <h1 className="text-4xl sm:text-5xl font-display font-bold leading-tight mb-6">
              Build With AI.
              <br />
              <span className="text-amber-400">From Kampala.</span>
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed mb-10 max-w-xl">
              The AI Foundry Kampala is an intensive learning hub training the next
              generation of AI practitioners — developers, analysts, and domain experts
              who build real things.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/assess"
                className="bg-amber-400 text-forge-night font-semibold px-6 py-3 rounded-xl hover:bg-amber-300 transition"
              >
                Apply Now →
              </Link>
              <Link
                href="/start"
                className="border border-gray-500 text-gray-200 font-medium px-6 py-3 rounded-xl hover:border-gray-300 hover:text-white transition"
              >
                Talk to Mshauri
              </Link>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="border-t border-gray-700">
          <div className="max-w-5xl mx-auto px-6 py-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tracks ── */}
      <section className="bg-bone-white py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-forge-night mb-3">
              Choose your path
            </h2>
            <p className="text-stone-grey max-w-lg">
              Three tracks built around where you are now — and where you want to go.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {tracks.map((t) => (
              <div
                key={t.label}
                className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col shadow-sm hover:shadow-md transition"
              >
                <div className={`w-1 h-8 rounded-full ${t.accent} mb-5`} />
                <h3 className="text-lg font-semibold text-forge-night mb-1">{t.label}</h3>
                <span className={`text-xs font-mono ${t.textAccent} mb-4`}>{t.tag}</span>
                <p className="text-sm text-stone-grey leading-relaxed flex-1">{t.description}</p>
                <Link
                  href={t.href}
                  className={`mt-6 text-sm font-medium ${t.textAccent} hover:underline`}
                >
                  Get started →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mshauri ── */}
      <section className="bg-foundry-green text-white py-20">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center gap-10">
          <div className="flex-1">
            <span className="text-xs font-mono tracking-widest uppercase text-green-300 mb-3 block">
              AI Advisor
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Meet Mshauri</h2>
            <p className="text-green-100 leading-relaxed max-w-lg">
              Mshauri is your personal AI advisor — available any time, trained on the
              Foundry curriculum. Ask it anything: concept explanations, project feedback,
              career questions, or what to tackle next.
            </p>
            <Link
              href="/start"
              className="mt-6 inline-block bg-white text-foundry-green font-semibold px-5 py-2.5 rounded-xl hover:bg-green-50 transition"
            >
              Start a conversation →
            </Link>
          </div>
          <div className="bg-foundry-green-dark rounded-2xl p-5 font-mono text-sm text-green-200 w-full sm:w-80 shrink-0">
            <p className="text-green-400 text-xs mb-3">// Mshauri · Week 4 · Developer</p>
            <p className="text-white mb-2">
              <span className="text-green-300">You:</span> What&apos;s the difference between RAG and fine-tuning?
            </p>
            <p className="text-green-100 leading-relaxed">
              <span className="text-green-300">Mshauri:</span> RAG retrieves external context at inference time — no retraining needed. Fine-tuning bakes knowledge into the model weights. For most production use cases, start with RAG.
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-forge-night text-gray-400 py-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <img
              src="/brand/lockup-horizontal.svg"
              alt="The AI Foundry Kampala"
              className="h-6 opacity-80 mb-2"
            />
            <p className="text-xs">Kampala, Uganda</p>
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="/assess" className="hover:text-white transition">Apply</Link>
            <Link href="/prep" className="hover:text-white transition">Prep</Link>
            <Link href="/start" className="hover:text-white transition">Mshauri</Link>
            <Link href="/login" className="hover:text-white transition">Staff</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
