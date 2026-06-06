"use client";

interface Week { week: number; status: "PENDING" | "IN_PROGRESS" | "COMPLETE" }

interface Student {
  id: string;
  name: string;
  track: "DEVELOPER" | "PROFESSIONAL";
  progress: Week[];
  latestScore: number | null;
  sessionCount: number;
}

export default function ProgressGrid({ students }: { students: Student[] }) {
  if (students.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-gray-400">
        No students yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {students.map((s) => {
        const dots = Array.from({ length: 12 }, (_, i) => {
          const w = s.progress.find((p) => p.week === i + 1);
          return w?.status ?? "PENDING";
        });

        const completed = dots.filter((d) => d === "COMPLETE").length;
        const isDev = s.track === "DEVELOPER";

        return (
          <a
            key={s.id}
            href={`/dashboard/students/${s.id}`}
            className="block bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-md hover:border-gray-200 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold text-gray-800 text-sm">{s.name}</p>
                <p className="text-xs text-stone-grey mt-0.5">
                  {completed}/12 weeks · {s.sessionCount} session{s.sessionCount !== 1 ? "s" : ""}
                </p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                isDev ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
              }`}>
                {isDev ? "Dev" : "Pro"}
              </span>
            </div>

            {/* Week progress dots */}
            <div className="flex gap-1 mb-3">
              {dots.map((status, i) => (
                <div
                  key={i}
                  title={`Week ${i + 1}: ${status}`}
                  className={`flex-1 h-1.5 rounded-full transition-colors ${
                    status === "COMPLETE"
                      ? "bg-foundry-green"
                      : status === "IN_PROGRESS"
                      ? "bg-amber-400"
                      : "bg-gray-100"
                  }`}
                />
              ))}
            </div>

            {/* Score */}
            {s.latestScore !== null && (
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400">Latest quiz score</p>
                <p className={`text-xs font-semibold ${s.latestScore >= 70 ? "text-foundry-green" : "text-amber-600"}`}>
                  {s.latestScore}%
                </p>
              </div>
            )}
          </a>
        );
      })}
    </div>
  );
}
