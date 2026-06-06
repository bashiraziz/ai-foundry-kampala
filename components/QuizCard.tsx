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
        if (!r.ok) throw new Error("Failed to generate quiz");
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
        if (!res.ok) throw new Error("Submit failed");
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

  if (loading) return <p className="text-center text-gray-400 py-8">Generating quiz…</p>;

  if (error) return (
    <div className="p-6 text-center space-y-4">
      <p className="text-red-500 text-sm">{error}</p>
      <button onClick={loadQuiz} className="bg-foundry-green text-white px-6 py-2 rounded-xl text-sm">
        Try again
      </button>
    </div>
  );

  if (score !== null) {
    return (
      <div className="p-6 text-center space-y-4">
        <p className="text-4xl font-bold text-foundry-green">{score}%</p>
        <p className="text-gray-600">{score >= 70 ? "Great work!" : "Keep practicing!"}</p>
        <div className="text-left space-y-4 mt-4">
          {finalQuestions.map((q, i) => (
            <div key={i} className="border rounded-xl p-4 text-sm">
              <p className="font-medium mb-1">{q.q}</p>
              <p className={q.correct ? "text-green-600" : "text-red-500"}>
                Your answer: {q.options[q.chosen!]} {q.correct ? "✓" : "✗"}
              </p>
              {!q.correct && <p className="text-gray-500">Correct: {q.options[q.answer]}</p>}
              <p className="text-gray-400 mt-1">{q.explain}</p>
            </div>
          ))}
        </div>
        <button onClick={loadQuiz} className="bg-foundry-green text-white px-6 py-2 rounded-xl">
          Try again
        </button>
      </div>
    );
  }

  const q = questions[current];
  return (
    <div className="p-6 space-y-4">
      <p className="text-xs text-gray-400">Question {current + 1} of {questions.length}</p>
      <p className="font-medium text-gray-800">{q.q}</p>
      <div className="space-y-2">
        {q.options.map((opt, i) => {
          let cls = "w-full text-left border rounded-xl px-4 py-3 text-sm ";
          if (selected === null) {
            cls += "hover:border-foundry-green hover:bg-amber-50";
          } else if (i === q.answer) {
            cls += "border-green-500 bg-green-50 text-green-700";
          } else if (i === selected) {
            cls += "border-red-400 bg-red-50 text-red-600";
          } else {
            cls += "opacity-50";
          }
          return (
            <button key={i} className={cls} onClick={() => pick(i)}>
              {opt}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <div className="space-y-3">
          <p className="text-sm text-gray-500">{q.explain}</p>
          <button
            onClick={next}
            disabled={submitting}
            className="bg-foundry-green text-white px-6 py-2 rounded-xl text-sm disabled:opacity-50"
          >
            {submitting ? "Saving…" : current + 1 < questions.length ? "Next →" : "See results"}
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      )}
    </div>
  );
}
