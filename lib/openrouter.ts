import type { Message } from "./llm";

const HEADERS = () => ({
  Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
  "Content-Type": "application/json",
  "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "",
  "X-Title": "AI Foundry Kampala",
});

const MODEL = "meta-llama/llama-3.3-70b-instruct:free";

export async function openrouterChat(messages: Message[], systemPrompt: string): Promise<string> {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: HEADERS(),
    body: JSON.stringify({
      model: MODEL,
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

export async function openrouterChatStream(
  messages: Message[],
  systemPrompt: string
): Promise<ReadableStream<string>> {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: HEADERS(),
    body: JSON.stringify({
      model: MODEL,
      stream: true,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    }),
  });
  if (!response.ok) throw new Error(`OpenRouter stream error: ${response.status}`);

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();

  return new ReadableStream<string>({
    async start(controller) {
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;
          const data = trimmed.slice(5).trim();
          if (data === "[DONE]") continue;
          try {
            const json = JSON.parse(data);
            const content = json.choices?.[0]?.delta?.content;
            if (content) controller.enqueue(content);
          } catch { /* skip malformed SSE line */ }
        }
      }
      controller.close();
    },
  });
}
