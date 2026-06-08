import { NextRequest, NextResponse } from "next/server";
import { chat } from "@/lib/llm";
import { prisma } from "@/lib/prisma";
import { WEEK_TOPICS } from "@/lib/quiz";
import { safeParseJson } from "@/lib/utils";
import { QUIZ_SYSTEM_PROMPT, quizUserPrompt } from "@/lib/prompts";

type QuizResponse = { questions: { q: string; options: string[]; answer: number; explain: string }[] };

const VALID_TRACKS = new Set(["DEVELOPER", "PROFESSIONAL"]);

export async function POST(req: NextRequest) {
  const { track, week, studentId } = await req.json();
  if (!VALID_TRACKS.has(track)) return NextResponse.json({ error: "Invalid track" }, { status: 400 });
  if (!Number.isInteger(week) || week < 1 || week > 12) return NextResponse.json({ error: "Invalid week" }, { status: 400 });
  if (studentId !== undefined && typeof studentId !== "string") return NextResponse.json({ error: "Invalid studentId" }, { status: 400 });
  const topic = WEEK_TOPICS[track]?.[week] ?? "Agentic AI";
  const systemPrompt = QUIZ_SYSTEM_PROMPT;
  const prompt = quizUserPrompt(topic, track, week);

  let raw = await chat([{ role: "user", content: prompt }], systemPrompt);
  let parsed = safeParseJson<QuizResponse>(raw);

  if (!parsed?.questions) {
    raw = await chat(
      [
        { role: "user", content: prompt },
        { role: "assistant", content: raw },
        { role: "user", content: "Your response was not valid JSON. Return ONLY the raw JSON object, nothing else." },
      ],
      systemPrompt
    );
    parsed = safeParseJson<QuizResponse>(raw);
  }

  if (!parsed?.questions || !Array.isArray(parsed.questions)) {
    return NextResponse.json({ error: "Quiz generation failed — please try again." }, { status: 500 });
  }

  const quizResult = await prisma.quizResult.create({
    data: { studentId: studentId ?? null, track, week, score: 0, questions: parsed.questions },
  });

  return NextResponse.json({ quizId: quizResult.id, questions: parsed.questions });
}

export async function PATCH(req: NextRequest) {
  const { quizId, answers } = await req.json();
  const quiz = await prisma.quizResult.findUniqueOrThrow({ where: { id: quizId } });
  const questions = quiz.questions as { q: string; options: string[]; answer: number; explain: string }[];

  let correct = 0;
  const updated = questions.map((q, i) => {
    const isCorrect = answers[i] === q.answer;
    if (isCorrect) correct++;
    return { ...q, chosen: answers[i], correct: isCorrect };
  });

  const score = Math.round((correct / questions.length) * 100);
  await prisma.quizResult.update({ where: { id: quizId }, data: { score, questions: updated } });

  return NextResponse.json({ score, questions: updated });
}
