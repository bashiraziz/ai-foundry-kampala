import { NextRequest } from "next/server";
import { chatStream } from "@/lib/llm";
import { retrieveContext } from "@/lib/rag";
import { prisma } from "@/lib/prisma";
import { TUTOR_SYSTEM_PROMPT } from "@/lib/prompts";

const VALID_TRACKS = new Set(["DEVELOPER", "PROFESSIONAL"]);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { track, week, studentId } = body;
  const messages = Array.isArray(body.messages) ? body.messages : [];

  if (!VALID_TRACKS.has(track)) return new Response("Invalid track", { status: 400 });
  if (!Number.isInteger(week) || week < 1 || week > 12) return new Response("Invalid week", { status: 400 });
  if (messages.length > 100) return new Response("Too many messages", { status: 400 });
  if (studentId !== undefined && typeof studentId !== "string") return new Response("Invalid studentId", { status: 400 });

  const lastMessage = messages[messages.length - 1]?.content ?? "";
  const context = await retrieveContext(lastMessage, track, week);

  const systemPrompt = TUTOR_SYSTEM_PROMPT
    .replace("{track}", track)
    .replace("{week}", String(week))
    .replace("{context}", context);

  const encoder = new TextEncoder();
  let fullReply = "";

  const { readable, writable } = new TransformStream<Uint8Array>();
  const writer = writable.getWriter();

  (async () => {
    try {
      const stream = await chatStream(messages, systemPrompt);
      const reader = stream.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullReply += value;
        await writer.write(encoder.encode(value));
      }
    } catch (err) {
      console.error("Chat stream error:", err);
    } finally {
      await writer.close();
      if (studentId && fullReply) {
        const allMessages = [...messages, { role: "assistant", content: fullReply }];
        await prisma.session.create({ data: { studentId, track, week, messages: allMessages } });
        await prisma.weekProgress.upsert({
          where: { studentId_week: { studentId, week } },
          update: { status: "IN_PROGRESS" },
          create: { studentId, week, status: "IN_PROGRESS" },
        });
      }
    }
  })();

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-cache",
    },
  });
}
