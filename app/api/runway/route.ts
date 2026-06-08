import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VALID_MODULE_STATUSES = new Set(["PENDING", "IN_PROGRESS", "COMPLETE"]);

export async function GET(req: NextRequest) {
  const applicantId = req.nextUrl.searchParams.get("applicantId");
  if (!applicantId || typeof applicantId !== "string") return NextResponse.json({ error: "applicantId required" }, { status: 400 });

  const applicant = await prisma.applicant.findUnique({ where: { id: applicantId }, select: { id: true } });
  if (!applicant) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const enrollment = await prisma.prepEnrollment.upsert({
    where: { applicantId },
    update: {},
    create: { applicantId, currentModule: 1, moduleProgress: {} },
  });
  return NextResponse.json({ enrollment });
}

export async function PATCH(req: NextRequest) {
  const { applicantId, module, status } = await req.json();
  if (!applicantId || typeof applicantId !== "string") return NextResponse.json({ error: "Invalid applicantId" }, { status: 400 });
  if (!Number.isInteger(module) || module < 1 || module > 4) return NextResponse.json({ error: "Invalid module" }, { status: 400 });
  if (!VALID_MODULE_STATUSES.has(status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });

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
