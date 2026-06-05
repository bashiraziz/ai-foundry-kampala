import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Message } from "./llm";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function geminiChat(messages: Message[], systemPrompt: string): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
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
  const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
  const result = await model.embedContent(text);
  return result.embedding.values;
}
