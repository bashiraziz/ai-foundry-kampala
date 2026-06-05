import type { Message } from "./llm";

export async function openrouterChat(messages: Message[], systemPrompt: string): Promise<string> {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "",
      "X-Title": "AI Foundry Kampala",
    },
    body: JSON.stringify({
      model: "meta-llama/llama-3.3-70b-instruct:free",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    }),
  });
  if (!response.ok) throw new Error(`OpenRouter error: ${response.status}`);
  const data = await response.json();
  return data.choices[0].message.content as string;
}
