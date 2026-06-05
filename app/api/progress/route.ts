import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const studentId = req.nextUrl.searchParams.get("studentId");
  if (!studentId) return NextResponse.json({ error: "studentId required" }, { status: 400 });

  const progress = await prisma.weekProgress.findMany({ where: { studentId } });
  return NextResponse.json({ progress });
}

export async function PATCH(req: NextRequest) {
  const { studentId, week, status } = await req.json();
  const result = await prisma.weekProgress.upsert({
    where: { studentId_week: { studentId, week } },
    update: { status },
    create: { studentId, week, status },
  });
  return NextResponse.json({ result });
}
