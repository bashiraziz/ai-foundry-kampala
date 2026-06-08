import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VALID_STATUSES = new Set(["PENDING", "IN_PROGRESS", "COMPLETE"]);

export async function GET(req: NextRequest) {
  const studentId = req.nextUrl.searchParams.get("studentId");
  if (!studentId || typeof studentId !== "string") return NextResponse.json({ error: "studentId required" }, { status: 400 });

  const student = await prisma.student.findUnique({ where: { id: studentId }, select: { id: true } });
  if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const progress = await prisma.weekProgress.findMany({ where: { studentId } });
  return NextResponse.json({ progress });
}

export async function PATCH(req: NextRequest) {
  const { studentId, week, status } = await req.json();
  if (!studentId || typeof studentId !== "string") return NextResponse.json({ error: "Invalid studentId" }, { status: 400 });
  if (!Number.isInteger(week) || week < 1 || week > 12) return NextResponse.json({ error: "Invalid week" }, { status: 400 });
  if (!VALID_STATUSES.has(status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });

  const student = await prisma.student.findUnique({ where: { id: studentId }, select: { id: true } });
  if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const result = await prisma.weekProgress.upsert({
    where: { studentId_week: { studentId, week } },
    update: { status },
    create: { studentId, week, status },
  });
  return NextResponse.json({ result });
}
