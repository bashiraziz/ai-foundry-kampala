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

const CSS = `
  .qc-loading { padding: 48px 24px; display: flex; flex-direction: column; align-items: center; gap: 10px; }
  .qc-dots { display: flex; gap: 5px; }
  .qc-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--muted-lt); animation: qc-bounce .9s ease-in-out infinite; }
  .qc-dot:nth-child(2) { animation-delay: .15s; }
  .qc-dot:nth-child(3) { animation-delay: .3s; }
  @keyframes qc-bounce { 0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } }
  .qc-loading p { font-family: "Space Mono"; font-size: 12px; color: var(--muted-lt); }

  .qc-error { padding: 40px 24px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 14px; }
  .qc-error p { font-family: "Space Mono"; font-size: 12px; color: var(--clay-deep); }
  .qc-retry { font-family: "Archivo"; font-weight: 700; font-size: 13px; padding: 10px 20px; border-radius: 10px; background: var(--ink); color: var(--cream); border: none; cursor: pointer; transition: all .15s; }
  .qc-retry:hover { background: var(--ink-2); }

  .qc-score { padding: 24px; display: flex; flex-direction: column; gap: 20px; }
  .qc-score-header { border-radius: 16px; padding: 24px; text-align: center; }
  .qc-score-header.pass { background: color-mix(in srgb, var(--forest) 8%, transparent); border: 1px solid color-mix(in srgb, var(--forest) 20%, transparent); }
  .qc-score-header.fail { background: color-mix(in srgb, var(--marigold) 8%, transparent); border: 1px solid color-mix(in srgb, var(--marigold) 20%, transparent); }
  .qc-score-num { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 52px; letter-spacing: -0.02em; line-height: 1; }
  .qc-score-num.pass { color: var(--forest); }
  .qc-score-num.fail { color: var(--clay-deep); }
  .qc-score-verdict { font-family: "Space Mono"; font-size: 12px; margin-top: 6px; }
  .qc-score-verdict.pass { color: var(--forest); }
  .qc-score-verdict.fail { color: var(--clay-deep); }

  .qc-review { display: flex; flex-direction: column; gap: 10px; }
  .qc-rq { border-radius: 12px; border: 1px solid; padding: 14px 16px; display: flex; flex-direction: column; gap: 8px; }
  .qc-rq.correct { border-color: color-mix(in srgb, var(--forest) 25%, transparent); background: color-mix(in srgb, var(--forest) 5%, transparent); }
  .qc-rq.wrong { border-color: color-mix(in srgb, var(--clay) 25%, transparent); background: color-mix(in srgb, var(--clay) 5%, transparent); }
  .qc-rq-q { font-size: 13.5px; font-weight: 600; color: var(--ink); }
  .qc-rq-ans { display: flex; align-items: center; gap: 8px; }
  .qc-rq-badge { width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 700; flex-shrink: 0; }
  .qc-rq-badge.correct { background: var(--forest); color: var(--cream); }
  .qc-rq-badge.wrong { background: var(--clay); color: var(--cream); }
  .qc-rq-ans-text { font-size: 13px; }
  .qc-rq-ans-text.correct { color: var(--forest); }
  .qc-rq-ans-text.wrong { color: var(--clay-deep); }
  .qc-rq-correct { font-size: 12px; color: var(--muted-lt); padding-left: 26px; }
  .qc-rq-explain { font-size: 12px; color: var(--muted-lt); line-height: 1.5; font-family: "Archivo"; }

  .qc-retry-btn { font-family: "Archivo"; font-weight: 700; font-size: 14px; padding: 13px 20px; border-radius: 12px; background: var(--ink); color: var(--cream); border: none; cursor: pointer; transition: all .15s; width: 100%; }
  .qc-retry-btn:hover { background: var(--ink-2); }

  .qc-quiz { padding: 24px; display: flex; flex-direction: column; gap: 20px; }

  .qc-progress { display: flex; flex-direction: column; gap: 8px; }
  .qc-prog-meta { display: flex; align-items: center; justify-content: space-between; }
  .qc-prog-meta span { font-family: "Space Mono"; font-size: 11px; color: var(--muted-lt); }
  .qc-pips { display: flex; gap: 4px; }
  .qc-pip { height: 4px; width: 24px; border-radius: 999px; background: var(--line-lt); transition: background .2s; }
  .qc-pip.done { background: var(--ink); }
  .qc-prog-bar { height: 3px; background: var(--line-lt); border-radius: 999px; overflow: hidden; }
  .qc-prog-bar span { display: block; height: 100%; background: var(--ink); border-radius: 999px; transition: width .3s ease; }

  .qc-question { font-size: 15px; font-weight: 600; color: var(--ink); line-height: 1.5; }

  .qc-options { display: flex; flex-direction: column; gap: 8px; }
  .qc-opt { width: 100%; text-align: left; display: flex; align-items: flex-start; gap: 12px; padding: 13px 16px; border-radius: 12px; border: 1.5px solid var(--line-lt); background: #fff; cursor: pointer; transition: all .15s; font-size: 13.5px; }
  .qc-opt:hover { border-color: var(--ink); }
  .qc-opt.selected-correct { border-color: var(--forest); background: color-mix(in srgb, var(--forest) 6%, transparent); cursor: default; }
  .qc-opt.selected-wrong { border-color: var(--clay); background: color-mix(in srgb, var(--clay) 6%, transparent); cursor: default; }
  .qc-opt.correct-answer { border-color: var(--forest); background: color-mix(in srgb, var(--forest) 6%, transparent); cursor: default; }
  .qc-opt.dimmed { opacity: 0.35; cursor: default; }
  .qc-opt-label { width: 22px; height: 22px; border-radius: 7px; display: flex; align-items: center; justify-content: center; font-family: "Space Mono"; font-size: 10px; font-weight: 700; flex-shrink: 0; margin-top: 1px; transition: all .15s; }
  .qc-opt-label.neutral { background: var(--cream-2); color: var(--muted-lt); }
  .qc-opt-label.correct { background: var(--forest); color: var(--cream); }
  .qc-opt-label.wrong { background: var(--clay); color: var(--cream); }
  .qc-opt-label.faded { background: var(--cream-2); color: var(--line-lt); }
  .qc-opt-text { flex: 1; line-height: 1.45; color: var(--ink); }
  .qc-opt.selected-wrong .qc-opt-text { color: var(--clay-deep); }
  .qc-opt.selected-correct .qc-opt-text, .qc-opt.correct-answer .qc-opt-text { color: var(--forest); }
  .qc-opt.dimmed .qc-opt-text { color: var(--muted-lt); }

  .qc-explain-box { background: var(--cream-2); border: 1px solid var(--line-lt); border-radius: 12px; padding: 14px 16px; display: flex; flex-direction: column; gap: 4px; }
  .qc-explain-box .ex-label { font-family: "Space Mono"; font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted-lt); }
  .qc-explain-box p { font-size: 13.5px; line-height: 1.55; color: var(--ink); }

  .qc-next-btn { font-family: "Archivo"; font-weight: 700; font-size: 14.5px; padding: 14px 20px; border-radius: 12px; background: var(--ink); color: var(--cream); border: none; cursor: pointer; transition: all .15s; width: 100%; }
  .qc-next-btn:hover:not(:disabled) { background: color-mix(in srgb, var(--ink) 85%, var(--muted-lt)); }
  .qc-next-btn:disabled { opacity: 0.4; cursor: default; }
  .qc-submit-error { font-family: "Space Mono"; font-size: 12px; color: var(--clay-deep); text-align: center; }
`;

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
      <>
        <style>{CSS}</style>
        <div className="qc-loading">
          <div className="qc-dots">
            <span className="qc-dot" /><span className="qc-dot" /><span className="qc-dot" />
          </div>
          <p>Generating quiz…</p>
        </div>
      </>
    );
  }

  if (error && !submitting) {
    return (
      <>
        <style>{CSS}</style>
        <div className="qc-error">
          <p>{error}</p>
          <button className="qc-retry" onClick={loadQuiz}>Try again</button>
        </div>
      </>
    );
  }

  if (score !== null) {
    const pass = score >= 70;
    return (
      <>
        <style>{CSS}</style>
        <div className="qc-score">
          <div className={`qc-score-header ${pass ? "pass" : "fail"}`}>
            <div className={`qc-score-num ${pass ? "pass" : "fail"}`}>{score}%</div>
            <div className={`qc-score-verdict ${pass ? "pass" : "fail"}`}>
              {pass ? "Great work — you passed!" : "Keep practicing — you'll get there."}
            </div>
          </div>

          <div className="qc-review">
            {finalQuestions.map((q, i) => (
              <div key={i} className={`qc-rq ${q.correct ? "correct" : "wrong"}`}>
                <div className="qc-rq-q">{q.q}</div>
                <div className="qc-rq-ans">
                  <span className={`qc-rq-badge ${q.correct ? "correct" : "wrong"}`}>
                    {q.correct ? "✓" : "✗"}
                  </span>
                  <span className={`qc-rq-ans-text ${q.correct ? "correct" : "wrong"}`}>
                    {LABELS[q.chosen!]}: {q.options[q.chosen!]}
                  </span>
                </div>
                {!q.correct && (
                  <div className="qc-rq-correct">
                    Correct: {LABELS[q.answer]}: {q.options[q.answer]}
                  </div>
                )}
                <div className="qc-rq-explain">{q.explain}</div>
              </div>
            ))}
          </div>

          <button className="qc-retry-btn" onClick={loadQuiz}>Try another quiz</button>
        </div>
      </>
    );
  }

  const q = questions[current];
  const progress = (current / questions.length) * 100;

  return (
    <>
      <style>{CSS}</style>
      <div className="qc-quiz">
        <div className="qc-progress">
          <div className="qc-prog-meta">
            <span>Question {current + 1} of {questions.length}</span>
            <div className="qc-pips">
              {questions.map((_, i) => (
                <div key={i} className={`qc-pip${i <= current ? " done" : ""}`} />
              ))}
            </div>
          </div>
          <div className="qc-prog-bar">
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>

        <p className="qc-question">{q.q}</p>

        <div className="qc-options">
          {q.options.map((opt, i) => {
            let cls = "qc-opt";
            let labelCls = "qc-opt-label neutral";
            if (selected !== null) {
              if (i === q.answer) { cls += " correct-answer"; labelCls = "qc-opt-label correct"; }
              else if (i === selected) { cls += " selected-wrong"; labelCls = "qc-opt-label wrong"; }
              else { cls += " dimmed"; labelCls = "qc-opt-label faded"; }
            }

            return (
              <button key={i} className={cls} onClick={() => pick(i)}>
                <span className={labelCls}>{LABELS[i]}</span>
                <span className="qc-opt-text">{opt}</span>
              </button>
            );
          })}
        </div>

        {selected !== null && (
          <>
            <div className="qc-explain-box">
              <span className="ex-label">Explanation</span>
              <p>{q.explain}</p>
            </div>
            <button className="qc-next-btn" onClick={next} disabled={submitting}>
              {submitting ? "Saving…" : current + 1 < questions.length ? "Next question →" : "See results →"}
            </button>
            {error && <p className="qc-submit-error">{error}</p>}
          </>
        )}
      </div>
    </>
  );
}
