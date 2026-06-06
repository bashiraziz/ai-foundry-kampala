import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Message } from "./llm";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function geminiChat(messages: Message[], systemPrompt: string): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL ?? "gemini-2.5-flash",
    systemInstruction: systemPrompt,
  });
  const history = messages.slice(0, -1).map((m) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.content }],
  }));
  const lastMessage = messages[messages.length - 1].content;
  const chat = model.startChat({ history });
  const result = await chat.sendMessage(lastMessage);
  return result.response.text();
}

export async function geminiEmbed(text: string): Promise<number[]> {
  const apiKey = process.env.GEMINI_API_KEY!;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "models/gemini-embedding-001", content: { parts: [{ text }] } }),
  });
  if (!res.ok) throw new Error(`Embed API ${res.status}: ${await res.text()}`);
  const data = await res.json() as { embedding: { values: number[] } };
  return data.embedding.values;
}
