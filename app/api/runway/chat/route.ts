import { NextRequest } from "next/server";
import { chatStream } from "@/lib/llm";
import { retrieveContext } from "@/lib/rag";

const MODULE_TITLES: Record<number, string> = {
  1: "The Terminal",
  2: "Git",
  3: "Python Basics",
  4: "The Mini-Project",
};

const PREP_SYSTEM_PROMPT = `You are Mshauri — the AI advisor for The AI Foundry Kampala Runway program.

This student is preparing to qualify for the Developer track. They are working on foundational skills: terminal navigation, Git, and basic Python. They may have very little technical background — be patient, use very simple language, and always ground examples in Kampala life.

CURRENT MODULE: {module} — {moduleTitle}

YOUR FOCUS:
- Only help with content relevant to the current module
- Use simple Kampala examples: market price lists, student names, boda boda routes, shop inventory
- When a student is stuck, break the problem into the smallest possible step
- Never make them feel stupid — everyone starts somewhere
- Celebrate small wins genuinely

EXAMPLE ANALOGIES TO USE:
- Terminal = the back office of a shop where you manage stock directly
- Git = a logbook where every change to the shop records is dated and signed
- Python variables = labelled containers on a shelf
- A loop = a market vendor calling out to each customer in a queue one by one
- A function = a standard operating procedure written on a card — do this, then this, then this

KNOWLEDGE BASE (retrieved):
{context}

Keep responses short. One concept at a time.`;

export async function POST(req: NextRequest) {
  const { messages, module: moduleNum } = await req.json();
  const title = MODULE_TITLES[moduleNum] ?? "Foundations";
  const lastMessage = messages[messages.length - 1]?.content ?? "";
  const sourcePrefix = `knowledge-base/runway/module-0${moduleNum}`;
  const context = await retrieveContext(lastMessage, "PREP", 0, 5, sourcePrefix);

  const systemPrompt = PREP_SYSTEM_PROMPT
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
