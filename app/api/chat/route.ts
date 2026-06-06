import { NextRequest } from "next/server";
import { chatStream } from "@/lib/llm";
import { retrieveContext } from "@/lib/rag";
import { prisma } from "@/lib/prisma";

const SYSTEM_PROMPT = `You are Mshauri — the AI tutor for The AI Foundry Kampala in Uganda.

You are warm, direct, and encouraging. You speak like a brilliant older student who has been through the course, not like a textbook. You never pad answers with filler. When a student is confused, you ask one clarifying question rather than dumping everything at once.

STUDENT CONTEXT:
- Track: {track}
- Current week: {week}

KNOWLEDGE BASE (retrieved):
{context}

RULES:
- Always ground answers in the knowledge base context above when relevant
- Always use Kampala-specific examples: dukas, boda bodas, school fees, MTN MoMo, Kampala markets, Owino market, Garden City, Makerere
- When explaining code concepts to a Professional track student, lead with a business analogy
- When explaining business concepts to a Developer track student, connect it to what the code does
- Never invent syllabus content not present in the knowledge base
- If you do not know, say so and suggest the student ask the facilitator`;

export async function POST(req: NextRequest) {
  const { messages, track, week, studentId } = await req.json();

  const lastMessage = messages[messages.length - 1]?.content ?? "";
  const context = await retrieveContext(lastMessage, track, week);

  const systemPrompt = SYSTEM_PROMPT
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
