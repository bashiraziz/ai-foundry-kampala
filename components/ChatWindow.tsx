"use client";
import { useState, useRef, useEffect } from "react";

type Message = { role: "user" | "assistant"; content: string };

interface ChatWindowProps {
  track: string;
  week: number;
  weekLabel: string;
  studentId?: string;
}

const CSS = `
  .cw-shell { display: flex; flex-direction: column; height: 100%; min-height: 0; }

  .cw-messages { flex: 1; overflow-y: auto; padding: 24px 28px; display: flex; flex-direction: column; gap: 16px; }

  .cw-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 48px 24px; text-align: center; }
  .cw-empty .em-mark { width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(150deg, var(--marigold), var(--clay)); display: grid; place-items: center; font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 17px; color: var(--ink); opacity: 0.45; }
  .cw-empty .em-primary { font-size: 14px; color: var(--muted-dk); }
  .cw-empty .em-secondary { font-family: "Space Mono"; font-size: 11px; color: var(--line-dk); }

  .cw-row { display: flex; align-items: flex-end; gap: 8px; }
  .cw-row.user { flex-direction: row-reverse; }
  .cw-av { width: 26px; height: 26px; border-radius: 8px; background: linear-gradient(150deg, var(--marigold), var(--clay)); display: grid; place-items: center; font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 12px; color: var(--ink); flex-shrink: 0; }
  .cw-bubble { max-width: 78%; font-size: 14px; line-height: 1.6; padding: 11px 16px; border-radius: 16px; white-space: pre-wrap; word-break: break-word; }
  .cw-row.user .cw-bubble { background: var(--ink); color: var(--cream); border-bottom-right-radius: 4px; }
  .cw-row.bot .cw-bubble { background: #fff; border: 1px solid var(--line-lt); color: var(--ink); border-bottom-left-radius: 4px; }

  .cw-typing { display: flex; gap: 4px; align-items: center; padding: 12px 16px; background: #fff; border: 1px solid var(--line-lt); border-radius: 16px; border-bottom-left-radius: 4px; }
  .cw-tdot { width: 6px; height: 6px; border-radius: 50%; background: var(--muted-lt); animation: cw-bounce .9s ease-in-out infinite; }
  .cw-tdot:nth-child(2) { animation-delay: .15s; }
  .cw-tdot:nth-child(3) { animation-delay: .3s; }
  @keyframes cw-bounce { 0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } }

  .cw-error-bubble { max-width: 78%; font-family: "Space Mono"; font-size: 12px; padding: 10px 14px; border-radius: 12px; background: color-mix(in srgb, var(--clay) 8%, transparent); border: 1px solid color-mix(in srgb, var(--clay) 20%, transparent); color: var(--clay-deep); }

  .cw-input-bar { flex-shrink: 0; border-top: 1px solid var(--line-lt); background: #fff; padding: 14px 16px; }
  .cw-input-row { display: flex; align-items: flex-end; gap: 8px; background: var(--cream-2); border: 1.5px solid var(--line-lt); border-radius: 14px; padding: 10px 14px; transition: border-color .15s; }
  .cw-input-row:focus-within { border-color: var(--muted-lt); }
  .cw-input-row textarea { flex: 1; background: transparent; border: none; outline: none; font-family: "Archivo"; font-size: 14px; color: var(--ink); resize: none; line-height: 1.5; }
  .cw-input-row textarea::placeholder { color: var(--muted-lt); }
  .cw-send { width: 28px; height: 28px; border-radius: 8px; background: var(--ink); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--cream); flex-shrink: 0; transition: all .15s; margin-bottom: 1px; }
  .cw-send:hover:not(:disabled) { background: color-mix(in srgb, var(--ink) 85%, var(--muted-lt)); }
  .cw-send:disabled { opacity: 0.3; cursor: default; }
`;

export default function ChatWindow({ track, week, weekLabel, studentId }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError(null);
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, track, week, studentId }),
      });
      if (!res.ok) throw new Error();
      if (!res.body) throw new Error();

      setLoading(false);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      setMessages([...next, { role: "assistant", content: "▋" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullContent += decoder.decode(value, { stream: true });
        setMessages([...next, { role: "assistant", content: fullContent + "▋" }]);
      }
      setMessages([...next, { role: "assistant", content: fullContent }]);
    } catch {
      setError("Mshauri is unavailable right now — check your connection and try again.");
      setInput(text);
      setMessages(messages);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="cw-shell">
        <div className="cw-messages">
          {messages.length === 0 && (
            <div className="cw-empty">
              <div className="em-mark">M</div>
              <p className="em-primary">
                Ask Mshauri anything about <strong>Week {week}: {weekLabel}</strong>
              </p>
              <p className="em-secondary">Enter to send · Shift+Enter for new line</p>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`cw-row ${m.role === "user" ? "user" : "bot"}`}>
              {m.role === "assistant" && <div className="cw-av">M</div>}
              <div className="cw-bubble">{m.content}</div>
            </div>
          ))}

          {loading && (
            <div className="cw-row bot">
              <div className="cw-av">M</div>
              <div className="cw-typing">
                <span className="cw-tdot" /><span className="cw-tdot" /><span className="cw-tdot" />
              </div>
            </div>
          )}

          {error && (
            <div className="cw-row bot">
              <div className="cw-av" style={{ opacity: 0.3 }}>M</div>
              <div className="cw-error-bubble">{error}</div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="cw-input-bar">
          <div className="cw-input-row">
            <textarea
              ref={textareaRef}
              rows={1}
              placeholder="Ask a question…"
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              disabled={loading}
              style={{ maxHeight: "120px" }}
            />
            <button className="cw-send" onClick={send} disabled={loading || !input.trim()} aria-label="Send">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 11L11 1M11 1H4M11 1V8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
