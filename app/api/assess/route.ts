import { NextRequest, NextResponse } from "next/server";
import { chat } from "@/lib/llm";
import { prisma } from "@/lib/prisma";
import { ASSESSMENT_SYSTEM_PROMPT } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  try {
    const { messages, applicantId, name } = await req.json();

    let id = applicantId;
    if (!id) {
      const applicant = await prisma.applicant.create({
        data: { name: name ?? "Unknown", messages: [] },
      });
      id = applicant.id;
    }

    const reply = await chat(messages, ASSESSMENT_SYSTEM_PROMPT);
    const complete = reply.includes("[ASSESSMENT_COMPLETE]");

    const fullMessages = [...messages, { role: "assistant", content: reply }];
    await prisma.applicant.update({
      where: { id },
      data: { messages: fullMessages },
    });

    return NextResponse.json({ reply, applicantId: id, complete });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[/api/assess]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
