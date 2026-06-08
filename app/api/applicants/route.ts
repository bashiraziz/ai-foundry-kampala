import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const applicants = await prisma.applicant.findMany({
    orderBy: { createdAt: "desc" },
    include: { prepEnrollment: true },
  });
  return NextResponse.json({ applicants });
}

export async function PATCH(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { applicantId, status } = await req.json();

  const applicant = await prisma.applicant.findUniqueOrThrow({ where: { id: applicantId } });

  await prisma.applicant.update({ where: { id: applicantId }, data: { status } });

  if (status === "ACCEPTED" && applicant.recommendation !== "PREP") {
    const track = applicant.recommendation === "DEVELOPER" ? "DEVELOPER" : "PROFESSIONAL";
    await prisma.student.upsert({
      where: { email: applicant.email ?? `applicant-${applicantId}@mshauri.local` },
      update: {},
      create: {
        name: applicant.name,
        email: applicant.email ?? `applicant-${applicantId}@mshauri.local`,
        track,
      },
    });
  }

  return NextResponse.json({ ok: true });
}
