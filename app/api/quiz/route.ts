import { NextRequest, NextResponse } from "next/server";
import { chat } from "@/lib/llm";
import { prisma } from "@/lib/prisma";
import { WEEK_TOPICS } from "@/lib/quiz";

export async function POST(req: NextRequest) {
  const { track, week, studentId } = await req.json();
  const topic = WEEK_TOPICS[track]?.[week] ?? "Agentic AI";

  const prompt = `Generate exactly 3 multiple-choice questions about "${topic}" for the ${track} track, Week ${week} of The AI Foundry Kampala.

Each question must include a Kampala-specific example in the explanation (dukas, boda bodas, MTN MoMo, school fees, Owino market, etc.).

Return ONLY this JSON with no preamble, no markdown fences, no explanation:
{"questions":[{"q":"...","options":["A","B","C","D"],"answer":0,"explain":"...Kampala example"}]}

The "answer" field is the 0-based index of the correct option.`;

  const raw = await chat([{ role: "user", content: prompt }], "You are a quiz generator. Return only valid JSON.");
  const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  const { questions } = JSON.parse(cleaned);

  const quizResult = await prisma.quizResult.create({
    data: {
      studentId: studentId ?? "anonymous",
      track,
      week,
      score: 0,
      questions,
    },
  });

  return NextResponse.json({ quizId: quizResult.id, questions });
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
  await prisma.quizResult.update({
    where: { id: quizId },
    data: { score, questions: updated },
  });

  return NextResponse.json({ score, questions: updated });
}
