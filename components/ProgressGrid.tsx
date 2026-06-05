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
  const dotColor = (status: string) => {
    if (status === "COMPLETE") return "bg-green-500";
    if (status === "IN_PROGRESS") return "bg-amber-400";
    return "bg-gray-200";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {students.map((s) => {
        const dots = Array.from({ length: 12 }, (_, i) => {
          const w = s.progress.find((p) => p.week === i + 1);
          return w?.status ?? "PENDING";
        });
        return (
          <a
            key={s.id}
            href={`/dashboard/students/${s.id}`}
            className="block border rounded-2xl p-4 hover:shadow-md transition bg-white"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-gray-800">{s.name}</p>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  s.track === "DEVELOPER" ? "bg-green-100 text-green-700" : "bg-purple-100 text-purple-700"
                }`}
              >
                {s.track === "DEVELOPER" ? "Dev" : "Pro"}
              </span>
            </div>
            <div className="flex gap-1 mb-2">
              {dots.map((status, i) => (
                <div
                  key={i}
                  title={`Week ${i + 1}: ${status}`}
                  className={`w-3 h-3 rounded-full ${dotColor(status)}`}
                />
              ))}
            </div>
            <div className="flex gap-4 text-xs text-gray-400">
              <span>Latest score: {s.latestScore !== null ? `${s.latestScore}%` : "—"}</span>
              <span>{s.sessionCount} session{s.sessionCount !== 1 ? "s" : ""}</span>
            </div>
          </a>
        );
      })}
    </div>
  );
}
