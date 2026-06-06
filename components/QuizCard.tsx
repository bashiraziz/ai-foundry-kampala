"use client";
import { useState, useEffect } from "react";

interface Question {
  q: string;
  options: string[];
  answer: number;
  explain: string;
  chosen?: number;
  correct?: boolean;
}

interface QuizCardProps {
  track: string;
  week: number;
}

const LABELS = ["A", "B", "C", "D"];

export default function QuizCard({ track, week }: QuizCardProps) {
  const [quizId, setQuizId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [finalQuestions, setFinalQuestions] = useState<Question[]>([]);

  const loadQuiz = () => {
    setLoading(true);
    setError(null);
    setScore(null);
    setQuestions([]);
    setCurrent(0);
    setSelected(null);
    setAnswers([]);
    setQuizId(null);
    setFinalQuestions([]);

    fetch("/api/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ track, week }),
    })
      .then(async (r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(({ quizId, questions, error }) => {
        if (error) throw new Error(error);
        setQuizId(quizId);
        setQuestions(questions);
      })
      .catch(() => setError("Could not load the quiz — please try again."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadQuiz(); }, [track, week]); // eslint-disable-line react-hooks/exhaustive-deps

  const pick = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
  };

  const next = async () => {
    const nextAnswers = [...answers, selected!];
    setAnswers(nextAnswers);

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setSelected(null);
    } else {
      setSubmitting(true);
      try {
        const res = await fetch("/api/quiz", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quizId, answers: nextAnswers }),
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setScore(data.score);
        setFinalQuestions(data.questions);
      } catch {
        setError("Could not submit your answers — please try again.");
      } finally {
        setSubmitting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center space-y-3">
        <div className="flex items-center justify-center gap-1.5 text-stone-grey">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
        <p className="text-sm text-gray-400">Generating quiz…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center space-y-4">
        <p className="text-sm text-red-500">{error}</p>
        <button onClick={loadQuiz} className="bg-foundry-green text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-foundry-green-light transition">
          Try again
        </button>
      </div>
    );
  }

  if (score !== null) {
    const pass = score >= 70;
    return (
      <div className="p-6 space-y-6 animate-scale-in">
        {/* Score header */}
        <div className={`rounded-2xl p-6 text-center ${pass ? "bg-green-50 border border-green-100" : "bg-amber-50 border border-amber-100"}`}>
          <p className={`text-5xl font-bold mb-1 ${pass ? "text-foundry-green" : "text-amber-600"}`}>{score}%</p>
          <p className={`text-sm font-medium ${pass ? "text-green-700" : "text-amber-700"}`}>
            {pass ? "Great work — you passed!" : "Keep practicing — you'll get there."}
          </p>
        </div>

        {/* Review */}
        <div className="space-y-3">
          {finalQuestions.map((q, i) => (
            <div key={i} className={`rounded-xl border p-4 text-sm space-y-2 ${q.correct ? "border-green-100 bg-green-50/40" : "border-red-100 bg-red-50/40"}`}>
              <p className="font-medium text-gray-800">{q.q}</p>
              <div className="flex items-center gap-1.5">
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${q.correct ? "bg-green-500 text-white" : "bg-red-400 text-white"}`}>
                  {q.correct ? "✓" : "✗"}
                </span>
                <span className={`${q.correct ? "text-green-700" : "text-red-600"}`}>
                  {LABELS[q.chosen!]}: {q.options[q.chosen!]}
                </span>
              </div>
              {!q.correct && (
                <p className="text-gray-500 text-xs pl-5.5">Correct: {LABELS[q.answer]}: {q.options[q.answer]}</p>
              )}
              <p className="text-gray-400 text-xs leading-relaxed">{q.explain}</p>
            </div>
          ))}
        </div>

        <button onClick={loadQuiz} className="w-full bg-foundry-green text-white py-2.5 rounded-xl text-sm font-medium hover:bg-foundry-green-light transition">
          Try another quiz
        </button>
      </div>
    );
  }

  const q = questions[current];
  const progress = (current / questions.length) * 100;

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-stone-grey">Question {current + 1} of {questions.length}</p>
          <div className="flex gap-1">
            {questions.map((_, i) => (
              <div key={i} className={`w-6 h-1 rounded-full transition-colors ${i <= current ? "bg-foundry-green" : "bg-gray-200"}`} />
            ))}
          </div>
        </div>
        <div className="h-0.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-foundry-green rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question */}
      <p className="text-base font-semibold text-gray-800 leading-snug">{q.q}</p>

      {/* Options */}
      <div className="space-y-2.5">
        {q.options.map((opt, i) => {
          let base = "w-full text-left flex items-start gap-3 px-4 py-3 rounded-xl border text-sm transition-all ";

          if (selected === null) {
            base += "border-gray-200 hover:border-foundry-green hover:bg-green-50/30 cursor-pointer";
          } else if (i === q.answer) {
            base += "border-green-400 bg-green-50 text-green-800";
          } else if (i === selected) {
            base += "border-red-300 bg-red-50 text-red-700";
          } else {
            base += "border-gray-100 opacity-40";
          }

          const labelBg =
            selected === null
              ? "bg-gray-100 text-gray-500"
              : i === q.answer
              ? "bg-green-500 text-white"
              : i === selected
              ? "bg-red-400 text-white"
              : "bg-gray-100 text-gray-400";

          return (
            <button key={i} className={base} onClick={() => pick(i)}>
              <span className={`w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center text-[11px] font-bold mt-0.5 ${labelBg}`}>
                {LABELS[i]}
              </span>
              <span className="flex-1 leading-relaxed">{opt}</span>
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div className="space-y-3 animate-fade-up">
          <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
            <p className="text-xs font-medium text-stone-grey mb-1">Explanation</p>
            <p className="text-sm text-gray-600 leading-relaxed">{q.explain}</p>
          </div>
          <button
            onClick={next}
            disabled={submitting}
            className="w-full bg-foundry-green text-white py-2.5 rounded-xl text-sm font-medium hover:bg-foundry-green-light disabled:opacity-50 transition"
          >
            {submitting ? "Saving…" : current + 1 < questions.length ? "Next question →" : "See results →"}
          </button>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </div>
      )}
    </div>
  );
}
