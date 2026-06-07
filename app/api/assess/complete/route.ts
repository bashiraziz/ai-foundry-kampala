import { NextRequest, NextResponse } from "next/server";
import { chat } from "@/lib/llm";
import { prisma } from "@/lib/prisma";
import { safeParseJson } from "@/lib/utils";
import { SCORING_PROMPT } from "@/lib/prompts";

type ScoreResult = {
  signal_coding_experience: number;
  signal_terminal: number;
  signal_git: number;
  signal_code_reading: number;
  signal_business_process: number;
  signal_workflow_tools: number;
  signal_motivation: number;
  signal_self_awareness: number;
  reasoning: string;
};

export async function POST(req: NextRequest) {
  const { applicantId } = await req.json();

  const applicant = await prisma.applicant.findUniqueOrThrow({ where: { id: applicantId } });
  const messages = applicant.messages as { role: string; content: string }[];
  const transcript = messages.map((m) => `${m.role}: ${m.content}`).join("\n");

  const systemPrompt = "You are a scoring engine. Return only valid JSON.";
  const prompt = SCORING_PROMPT.replace("{transcript}", transcript);

  let raw = await chat([{ role: "user", content: prompt }], systemPrompt);
  let scores = safeParseJson<ScoreResult>(raw);

  if (!scores) {
    raw = await chat(
      [
        { role: "user", content: prompt },
        { role: "assistant", content: raw },
        { role: "user", content: "Your response was not valid JSON. Return ONLY the raw JSON object, nothing else." },
      ],
      systemPrompt
    );
    scores = safeParseJson<ScoreResult>(raw);
  }

  if (!scores) {
    return NextResponse.json(
      { error: "Assessment scoring failed — a facilitator will review this application manually." },
      { status: 500 }
    );
  }

  const developerScore = Math.round(
    scores.signal_coding_experience * 2 +
    scores.signal_terminal * 2 +
    scores.signal_git * 1 +
    scores.signal_code_reading * 1.5
  );
  const professionalScore = Math.round(
    scores.signal_business_process * 2 +
    scores.signal_workflow_tools * 2
  );
  const prepScore = Math.round(
    scores.signal_motivation * 2 +
    scores.signal_self_awareness * 1
  );

  let recommendation: "DEVELOPER" | "PROFESSIONAL" | "PREP" | "NOT_READY";
  if (developerScore >= 11) {
    recommendation = "DEVELOPER";
  } else if (professionalScore >= 5) {
    recommendation = "PROFESSIONAL";
  } else {
    recommendation = "PREP";
  }

  await prisma.applicant.update({
    where: { id: applicantId },
    data: { scores, developerScore, professionalScore, prepScore, recommendation, reasoning: scores.reasoning, status: "ASSESSED" },
  });

  if (recommendation === "PREP") {
    await prisma.prepEnrollment.upsert({
      where: { applicantId },
      update: {},
      create: { applicantId, currentModule: 1, moduleProgress: {} },
    });
  }

  return NextResponse.json({ recommendation, reasoning: scores.reasoning, developerScore, professionalScore, prepScore });
}
