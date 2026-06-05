import { geminiChat, geminiEmbed } from "./gemini";
import { openrouterChat } from "./openrouter";

export type Message = { role: "user" | "assistant"; content: string };

export async function chat(messages: Message[], systemPrompt: string): Promise<string> {
  try {
    return await geminiChat(messages, systemPrompt);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn("Gemini failed, falling back to OpenRouter:", msg);
    return openrouterChat(messages, systemPrompt);
  }
}

export async function embed(text: string): Promise<number[]> {
  return geminiEmbed(text);
}
