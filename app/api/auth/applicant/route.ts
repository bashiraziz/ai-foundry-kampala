import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { normalisePhone } from "@/lib/phone";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { phone, pin } = await req.json();

  if (!phone || !pin) {
    return NextResponse.json({ error: "Phone and PIN are required" }, { status: 400 });
  }

  const normalised = normalisePhone(phone);
  const applicant = await prisma.applicant.findUnique({ where: { phone: normalised } });

  if (!applicant || !applicant.pinHash) {
    return NextResponse.json({ error: "No account found for that phone number" }, { status: 404 });
  }

  const valid = await bcrypt.compare(String(pin), applicant.pinHash);
  if (!valid) {
    return NextResponse.json({ error: "Incorrect PIN" }, { status: 401 });
  }

  return NextResponse.json({ applicantId: applicant.id, recommendation: applicant.recommendation });
}
