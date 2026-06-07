import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const applicantId = req.nextUrl.searchParams.get("applicantId");
  if (!applicantId) return NextResponse.json({ error: "applicantId required" }, { status: 400 });

  const enrollment = await prisma.prepEnrollment.upsert({
    where: { applicantId },
    update: {},
    create: { applicantId, currentModule: 1, moduleProgress: {} },
  });
  return NextResponse.json({ enrollment });
}

export async function PATCH(req: NextRequest) {
  const { applicantId, module, status } = await req.json();

  const enrollment = await prisma.prepEnrollment.findUnique({ where: { applicantId } });
  if (!enrollment) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const progress = (enrollment.moduleProgress as Record<string, string>) ?? {};
  progress[String(module)] = status;

  const nextModule = status === "COMPLETE" ? Math.min(module + 1, 4) : enrollment.currentModule;

  const updated = await prisma.prepEnrollment.update({
    where: { applicantId },
    data: { moduleProgress: progress, currentModule: nextModule },
  });

  return NextResponse.json({ enrollment: updated });
}
