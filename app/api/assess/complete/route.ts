import { NextRequest, NextResponse } from "next/server";
import { chat } from "@/lib/llm";
import { prisma } from "@/lib/prisma";

const SCORING_PROMPT = `You are a scoring engine for the Kampala Agentic AI Club intake assessment.

Score the applicant on all 8 signals using only evidence from the transcript below.

SCALE: 0 = no evidence, 1 = partial, 2 = clear pass

TRANSCRIPT:
{transcript}

Return ONLY valid JSON — no preamble, no markdown fences:
{
  "signal_coding_experience": 0,
  "signal_terminal": 0,
  "signal_git": 0,
  "signal_code_reading": 0,
  "signal_business_process": 0,
  "signal_workflow_tools": 0,
  "signal_motivation": 0,
  "signal_self_awareness": 0,
  "reasoning": "3-4 sentences describing the applicant profile, what path they are recommended for, and why."
}`;

export async function POST(req: NextRequest) {
  const { applicantId } = await req.json();

  const applicant = await prisma.applicant.findUniqueOrThrow({ where: { id: applicantId } });
  const messages = applicant.messages as { role: string; content: string }[];
  const transcript = messages.map((m) => `${m.role}: ${m.content}`).join("\n");

  const prompt = SCORING_PROMPT.replace("{transcript}", transcript);
  const raw = await chat([{ role: "user", content: prompt }], "You are a scoring engine. Return only valid JSON.");
  const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  const scores = JSON.parse(cleaned);

  // Weighted scoring
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

  // Threshold logic
  let recommendation: "DEVELOPER" | "PROFESSIONAL" | "PREP" | "NOT_READY";
  if (developerScore >= 11) {
    recommendation = "DEVELOPER";
  } else if (professionalScore >= 5) {
    recommendation = "PROFESSIONAL";
  } else if (prepScore >= 4) {
    recommendation = "PREP";
  } else {
    recommendation = "NOT_READY";
  }

  await prisma.applicant.update({
    where: { id: applicantId },
    data: {
      scores,
      developerScore,
      professionalScore,
      prepScore,
      recommendation,
      reasoning: scores.reasoning,
      status: "ASSESSED",
    },
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
