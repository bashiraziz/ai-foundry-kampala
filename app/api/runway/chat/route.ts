import { NextRequest } from "next/server";
import { chatStream } from "@/lib/llm";
import { retrieveContext } from "@/lib/rag";
import { RUNWAY_SYSTEM_PROMPT } from "@/lib/prompts";

const MODULE_TITLES: Record<number, string> = {
  1: "The Terminal",
  2: "Git",
  3: "Python Basics",
  4: "The Mini-Project",
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { module: moduleNum } = body;
  const messages = Array.isArray(body.messages) ? body.messages : [];

  if (!Number.isInteger(moduleNum) || moduleNum < 1 || moduleNum > 4) return new Response("Invalid module", { status: 400 });
  if (messages.length > 100) return new Response("Too many messages", { status: 400 });
  const title = MODULE_TITLES[moduleNum] ?? "Foundations";
  const lastMessage = messages[messages.length - 1]?.content ?? "";
  const sourcePrefix = `knowledge-base/runway/module-0${moduleNum}`;
  const context = await retrieveContext(lastMessage, "PREP", 0, 5, sourcePrefix);

  const systemPrompt = RUNWAY_SYSTEM_PROMPT
    .replace("{module}", String(moduleNum))
    .replace("{moduleTitle}", title)
    .replace("{context}", context);

  const encoder = new TextEncoder();
  const { readable, writable } = new TransformStream<Uint8Array>();
  const writer = writable.getWriter();

  (async () => {
    try {
      const stream = await chatStream(messages, systemPrompt);
      const reader = stream.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        await writer.write(encoder.encode(value));
      }
    } catch (err) {
      console.error("Runway chat stream error:", err);
    } finally {
      await writer.close();
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
