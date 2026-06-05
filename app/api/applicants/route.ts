import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const applicants = await prisma.applicant.findMany({
    orderBy: { createdAt: "desc" },
    include: { prepEnrollment: true },
  });
  return NextResponse.json({ applicants });
}

export async function PATCH(req: NextRequest) {
  const { applicantId, status } = await req.json();

  const applicant = await prisma.applicant.findUniqueOrThrow({ where: { id: applicantId } });

  await prisma.applicant.update({ where: { id: applicantId }, data: { status } });

  if (status === "ACCEPTED" && applicant.recommendation !== "PREP") {
    const track = applicant.recommendation === "DEVELOPER" ? "DEVELOPER" : "PROFESSIONAL";
    await prisma.student.upsert({
      where: { email: applicant.email ?? `applicant-${applicantId}@kampalaclaw.local` },
      update: {},
      create: {
        name: applicant.name,
        email: applicant.email ?? `applicant-${applicantId}@kampalaclaw.local`,
        track,
      },
    });
  }

  return NextResponse.json({ ok: true });
}
