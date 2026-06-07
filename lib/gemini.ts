import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Message } from "./llm";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function geminiChat(messages: Message[], systemPrompt: string): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL ?? "gemini-2.5-flash",
    systemInstruction: systemPrompt,
  });
  const priorMessages = messages.slice(0, -1);
  // Gemini requires history to start with a user turn.
  // If the first stored message is the assistant greeting (triggered by our synthetic "begin"),
  // prepend that synthetic user turn so the history is valid.
  const rawHistory = priorMessages.length > 0 && priorMessages[0].role !== "user"
    ? [{ role: "user" as const, parts: [{ text: "begin" }] }, ...priorMessages.map((m) => ({
        role: m.role === "user" ? "user" as const : "model" as const,
        parts: [{ text: m.content }],
      }))]
    : priorMessages.map((m) => ({
        role: m.role === "user" ? "user" as const : "model" as const,
        parts: [{ text: m.content }],
      }));
  const lastMessage = messages.length > 0 ? messages[messages.length - 1].content : "begin";
  const chatSession = model.startChat({ history: rawHistory });
  const result = await chatSession.sendMessage(lastMessage);
  return result.response.text();
}

export async function geminiChatStream(
  messages: Message[],
  systemPrompt: string
): Promise<ReadableStream<string>> {
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL ?? "gemini-2.5-flash",
    systemInstruction: systemPrompt,
  });
  const history = messages.slice(0, -1).map((m) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.content }],
  }));
  const lastMessage = messages[messages.length - 1].content;
  const chatSession = model.startChat({ history });
  const result = await chatSession.sendMessageStream(lastMessage);

  return new ReadableStream<string>({
    async start(controller) {
      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) controller.enqueue(text);
      }
      controller.close();
    },
  });
}

export async function geminiEmbed(text: string): Promise<number[]> {
  const apiKey = process.env.GEMINI_API_KEY!;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2:embedContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "models/gemini-embedding-2", content: { parts: [{ text }] } }),
  });
  if (!res.ok) throw new Error(`Embed API ${res.status}: ${await res.text()}`);
  const data = await res.json() as { embedding: { values: number[] } };
  return data.embedding.values;
}
