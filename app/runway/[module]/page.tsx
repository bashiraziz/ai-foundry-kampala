"use client";
import { useState, useRef, useEffect } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Message = { role: "user" | "assistant"; content: string };

const PAGE_CSS = `
  .mod-shell { min-height: 100vh; background: var(--ink); display: flex; flex-direction: column; }

  .mod-header { flex-shrink: 0; border-bottom: 1px solid var(--line-dk); padding: 14px 24px; display: flex; align-items: center; justify-content: space-between; }
  .mod-header .left { display: flex; align-items: center; gap: 12px; }
  .mod-header .mark { width: 28px; height: 28px; border-radius: 7px; background: var(--plum); display: grid; place-items: center; font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 13px; color: var(--cream); flex-shrink: 0; }
  .mod-header .hinfo .num { font-family: "Space Mono"; font-size: 10px; color: var(--muted-dk); }
  .mod-header .hinfo .nm { font-family: "Bricolage Grotesque"; font-weight: 700; font-size: 15px; color: var(--cream); margin-top: 1px; }
  .mod-header .hinfo .checks { font-family: "Space Mono"; font-size: 10px; color: var(--muted-dk); margin-top: 1px; }
  .mod-header .back { font-family: "Space Mono"; font-size: 11px; color: var(--muted-dk); text-decoration: none; transition: color .15s; }
  .mod-header .back:hover { color: var(--cream); }

  .mod-body { flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 0; overflow: hidden; max-height: calc(100vh - 61px); }

  /* Lesson panel */
  .lesson-panel { background: var(--cream); display: flex; flex-direction: column; overflow: hidden; border-right: 1px solid var(--line-lt); }
  .lesson-scroll { flex: 1; overflow-y: auto; padding: 28px 32px; }

  .lesson-md { font-family: "Archivo"; font-size: 14px; line-height: 1.7; color: var(--ink); }
  .lesson-md p { margin: 0 0 12px; }
  .lesson-md p:last-child { margin-bottom: 0; }
  .lesson-md strong { font-weight: 700; }
  .lesson-md em { font-style: italic; }
  .lesson-md h1, .lesson-md h2 { font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 18px; margin: 0 0 14px; letter-spacing: -0.01em; }
  .lesson-md h3 { font-family: "Bricolage Grotesque"; font-weight: 700; font-size: 15px; margin: 20px 0 8px; }
  .lesson-md ul, .lesson-md ol { padding-left: 20px; margin: 6px 0 12px; display: flex; flex-direction: column; gap: 4px; }
  .lesson-md ul { list-style: disc; }
  .lesson-md ol { list-style: decimal; }
  .lesson-md li { line-height: 1.6; }
  .lesson-md code { font-family: "Space Mono"; font-size: 12px; background: var(--cream-2); border: 1px solid var(--line-lt); border-radius: 4px; padding: 1px 5px; color: var(--clay-deep); }
  .lesson-md pre { background: var(--ink); border-radius: 10px; padding: 16px 18px; margin: 12px 0; overflow-x: auto; }
  .lesson-md pre code { background: none; border: none; padding: 0; color: var(--muted-dk); font-size: 12.5px; line-height: 1.6; }
  .lesson-md hr { border: none; border-top: 1px solid var(--line-lt); margin: 16px 0; }

  .checklist-section { flex-shrink: 0; border-top: 1px solid var(--line-lt); padding: 22px 28px; display: flex; flex-direction: column; gap: 16px; background: #fff; }
  .checklist-head { display: flex; align-items: center; justify-content: space-between; }
  .checklist-head h3 { font-family: "Bricolage Grotesque"; font-weight: 700; font-size: 15px; }
  .checklist-head .ck-count { font-family: "Space Mono"; font-size: 11px; color: var(--muted-lt); }
  .ck-items { display: flex; flex-direction: column; gap: 8px; }
  .ck-label { display: flex; align-items: flex-start; gap: 10px; cursor: pointer; }
  .ck-box { width: 20px; height: 20px; flex-shrink: 0; margin-top: 1px; border-radius: 6px; border: 2px solid var(--line-lt); display: flex; align-items: center; justify-content: center; transition: all .15s; }
  .ck-box.on { background: var(--plum); border-color: var(--plum); }
  .ck-box svg { display: none; }
  .ck-box.on svg { display: block; }
  .ck-text { font-size: 13px; line-height: 1.45; color: var(--ink); transition: color .15s; }
  .ck-text.done { color: var(--muted-lt); text-decoration: line-through; }
  .ck-action { font-family: "Archivo"; font-weight: 700; font-size: 14px; padding: 13px 20px; border-radius: 12px; background: var(--plum); color: var(--cream); border: none; cursor: pointer; transition: all .15s; width: 100%; }
  .ck-action:hover:not(:disabled) { background: color-mix(in srgb, var(--plum) 85%, var(--ink)); }
  .ck-action:disabled { opacity: 0.4; cursor: default; }

  /* Chat panel */
  .chat-panel { background: var(--ink-2); display: flex; flex-direction: column; overflow: hidden; }
  .chat-messages { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 14px; }
  .chat-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 40px 20px; text-align: center; }
  .chat-empty .em-mark { width: 36px; height: 36px; border-radius: 10px; background: var(--plum); display: grid; place-items: center; font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 17px; color: var(--cream); opacity: 0.5; }
  .chat-empty p { font-family: "Space Mono"; font-size: 12px; color: var(--muted-dk); }
  .chat-empty .hint { font-size: 10px; color: var(--line-dk); }

  .chat-row { display: flex; align-items: flex-end; gap: 8px; }
  .chat-row.user { flex-direction: row-reverse; }
  .chat-av { width: 24px; height: 24px; border-radius: 7px; background: var(--plum); display: grid; place-items: center; font-family: "Bricolage Grotesque"; font-weight: 800; font-size: 11px; color: var(--cream); flex-shrink: 0; }
  .chat-bubble { max-width: 78%; font-size: 13.5px; line-height: 1.58; padding: 11px 15px; border-radius: 14px; word-break: break-word; }
  .chat-row.user .chat-bubble { background: var(--plum); color: var(--cream); border-bottom-right-radius: 4px; white-space: pre-wrap; }
  .chat-row.bot .chat-bubble { background: color-mix(in srgb, var(--ink) 60%, var(--line-dk)); color: var(--cream); border: 1px solid var(--line-dk); border-bottom-left-radius: 4px; }

  .chat-md { color: var(--cream); }
  .chat-md p { margin: 0 0 10px; }
  .chat-md p:last-child { margin-bottom: 0; }
  .chat-md strong { font-weight: 700; color: var(--cream); }
  .chat-md em { font-style: italic; }
  .chat-md h1, .chat-md h2, .chat-md h3 { font-family: "Bricolage Grotesque"; font-weight: 700; margin: 12px 0 6px; color: var(--cream); }
  .chat-md h1 { font-size: 16px; }
  .chat-md h2 { font-size: 14px; }
  .chat-md h3 { font-size: 13.5px; }
  .chat-md ul, .chat-md ol { padding-left: 18px; margin: 6px 0 10px; display: flex; flex-direction: column; gap: 3px; }
  .chat-md ul { list-style: disc; }
  .chat-md ol { list-style: decimal; }
  .chat-md li { line-height: 1.55; color: var(--cream); }
  .chat-md code { font-family: "Space Mono"; font-size: 11.5px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); border-radius: 4px; padding: 1px 5px; color: var(--marigold); }
  .chat-md pre { background: rgba(0,0,0,0.35); border-radius: 8px; padding: 12px 14px; margin: 8px 0; overflow-x: auto; border: 1px solid var(--line-dk); }
  .chat-md pre code { background: none; border: none; padding: 0; color: var(--muted-dk); font-size: 12px; line-height: 1.6; }
  .chat-md blockquote { border-left: 3px solid var(--line-dk); padding-left: 10px; margin: 6px 0; color: var(--muted-dk); font-style: italic; }

  .typing-dots { display: flex; gap: 4px; align-items: center; padding: 12px 16px; background: color-mix(in srgb, var(--ink) 60%, var(--line-dk)); border: 1px solid var(--line-dk); border-radius: 14px; border-bottom-left-radius: 4px; }
  .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--muted-dk); animation: dotbounce .9s ease-in-out infinite; }
  .dot:nth-child(2) { animation-delay: .15s; }
  .dot:nth-child(3) { animation-delay: .3s; }
  @keyframes dotbounce { 0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; } 40% { transform: scale(1); opacity: 1; } }

  .chat-error { font-family: "Space Mono"; font-size: 12px; color: var(--clay); background: color-mix(in srgb, var(--clay) 10%, transparent); border: 1px solid color-mix(in srgb, var(--clay) 20%, transparent); padding: 10px 14px; border-radius: 10px; }

  .chat-input-bar { flex-shrink: 0; border-top: 1px solid var(--line-dk); padding: 14px 16px; }
  .chat-input-row { display: flex; align-items: flex-end; gap: 8px; background: color-mix(in srgb, var(--ink) 50%, var(--line-dk)); border: 1px solid var(--line-dk); border-radius: 14px; padding: 10px 14px; transition: border-color .15s; }
  .chat-input-row:focus-within { border-color: var(--muted-dk); }
  .chat-input-row textarea { flex: 1; background: transparent; border: none; outline: none; font-family: "Archivo"; font-size: 13.5px; color: var(--cream); resize: none; line-height: 1.5; max-height: 100px; }
  .chat-input-row textarea::placeholder { color: var(--muted-dk); }
  .send-btn { width: 28px; height: 28px; border-radius: 8px; background: var(--marigold); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--ink); flex-shrink: 0; transition: all .15s; margin-bottom: 1px; }
  .send-btn:hover:not(:disabled) { background: color-mix(in srgb, var(--marigold) 82%, white); }
  .send-btn:disabled { opacity: 0.3; cursor: default; }

  @media (max-width: 860px) {
    .mod-body { grid-template-columns: 1fr; max-height: none; }
    .lesson-panel { max-height: 60vh; }
    .chat-panel { min-height: 460px; }
  }

  .loading { min-height: 100vh; background: var(--ink); display: flex; align-items: center; justify-content: center; }
`;

const MODULE_CONTENT: Record<number, { title: string; content: string; checklist: string[] }> = {
  1: {
    title: "The Terminal",
    checklist: [
      "I can open a terminal on my computer",
      "I can type pwd and understand what it shows me",
      "I can type ls and see the files and folders around me",
      "I can move between folders using cd",
      "I can create a new folder using mkdir",
      "I can create a new file using touch",
      "I can read a file using cat",
    ],
    content: `## Runway 1 — The Terminal

A terminal is a window where you type commands to control your computer using text.

**Think of it like this:** Imagine you manage a shop. You can walk around and move things by hand, or call your assistant on the phone and say "move the rice bags to shelf 3." The terminal is that phone call — you give instructions using words instead of clicking a mouse.

### Key commands

**pwd** — "print working directory" — shows you which folder you are currently in.

**ls** — "list" — shows all files and folders in your current folder.

**cd [folder]** — "change directory" — moves you into a folder. Use \`cd ..\` to go up one level.

**mkdir [name]** — creates a new folder.

**touch [name]** — creates a new empty file.

**cat [file]** — prints the contents of a file in the terminal.

### Try it

1. Open your terminal
2. Type \`pwd\` — write down where you are
3. Type \`ls\` — count the items you see
4. Type \`mkdir kampala_club\` to create a folder
5. Type \`cd kampala_club\` to enter it
6. Type \`touch notes.txt\` to create a file
7. Type \`ls\` to confirm the file is there

Ask Mshauri anything you do not understand. →`,
  },
  2: {
    title: "Git",
    checklist: [
      "I have Git installed and can run git --version",
      "I have set my name and email in Git",
      "I can turn a folder into a Git project with git init",
      "I can stage files with git add",
      "I can save my work with git commit -m 'message'",
      "I have a GitHub account",
      "I can push my local project to GitHub",
    ],
    content: `## Runway 2 — Git

Git is a tool that tracks every change you make to your code files. It saves a complete history of your project.

**Think of it like this:** Imagine keeping accounts for a shop. Every day you record what was sold and earned. If you make a mistake on Tuesday, you can go back to Monday's records and start again. Git does this for your code.

### Key commands

**git init** — starts tracking a folder with Git. Run this once inside your project folder.

**git status** — shows which files have changed.

**git add [file]** — marks a file to be saved in the next commit.

**git commit -m "message"** — saves your marked files with a description.

**git log** — shows your commit history.

**git push** — sends your commits to GitHub.

### Try it

1. Open your terminal and navigate to your prep_work folder
2. Type \`git init\`
3. Create a file: \`touch market.txt\`
4. Type \`git status\` — see it listed as untracked
5. Type \`git add market.txt\`
6. Type \`git commit -m "Add market file"\`
7. Type \`git log\` — see your commit

**GitHub:** Go to github.com, create a free account, and create a repository called \`prep-work\`. Follow the instructions to push your local project.

Ask Mshauri if GitHub authentication fails — it is a common first step. →`,
  },
  3: {
    title: "Python Basics",
    checklist: [
      "I have Python installed and can run python --version",
      "I can create and run a Python file from the terminal",
      "I can store information in variables",
      "I can combine text using f-strings",
      "I can create and work with lists",
      "I can write a loop that processes each item in a list",
      "I can write a function with inputs and a return value",
      "I can read a CSV file using Python",
    ],
    content: `## Runway 3 — Python Basics

Python is a programming language. After this module you will be able to read Python code and write simple scripts.

**Install Python:** Go to python.org/downloads. On Windows, tick "Add Python to PATH" before installing. Then open a terminal and type \`python --version\`.

### Variables — labelled containers

\`\`\`python
item = "tomatoes"
price = 3000
vendor = "Grace"
print(f"{vendor} sells {item} for UGX {price}")
\`\`\`

### Lists — many items in one variable

\`\`\`python
vendors = ["Grace", "Tendo", "Amara", "Fatuma"]
print(vendors[0])  # Grace — lists start at 0
print(len(vendors))  # 4
\`\`\`

### Loops — repeat an action

\`\`\`python
for vendor in vendors:
    print(f"Welcome, {vendor}!")
\`\`\`

### Functions — reusable instructions

\`\`\`python
def calculate_total(price, quantity):
    return price * quantity

result = calculate_total(8000, 3)
print(f"Total: UGX {result}")
\`\`\`

### Reading a CSV file

\`\`\`python
import csv

with open("sales.txt", "r") as file:
    reader = csv.reader(file)
    for row in reader:
        print(f"{row[2]} sells {row[0]} for UGX {row[1]}")
\`\`\`

Ask Mshauri about any error messages you see. →`,
  },
  4: {
    title: "The Mini-Project",
    checklist: [
      "I have created prices.csv with at least 5 rows of Kampala market data",
      "My market_summary.py prints total items, cheapest, most expensive, and average price",
      "The script runs without errors: python market_summary.py",
      "I have committed both files to Git with a clear commit message",
      "I have pushed the project to a public GitHub repository",
      "I have the GitHub repository URL ready to submit",
    ],
    content: `## Runway 4 — The Mini-Project

Combine everything you have learned into one complete project.

### What you are building

A Python script called \`market_summary.py\` that reads a CSV file and prints a market price summary.

### Step 1: Create prices.csv

Create a file called \`prices.csv\` with exactly these columns:

\`\`\`
item,price_ugx,vendor
tomatoes,3000,Grace
onions,2500,Tendo
matoke,8000,Amara
groundnuts,5000,Fatuma
rice,12000,Ibrahim
\`\`\`

Use your own real Kampala market prices. At least 5 rows.

### Step 2: Write market_summary.py

\`\`\`python
import csv

def load_prices(filename):
    rows = []
    with open(filename, "r") as file:
        reader = csv.reader(file)
        next(reader)  # skip header
        for row in reader:
            rows.append({"item": row[0], "price": int(row[1]), "vendor": row[2]})
    return rows

def summarise(rows):
    cheapest = rows[0]
    most_expensive = rows[0]
    total_price = 0
    for row in rows:
        if row["price"] < cheapest["price"]:
            cheapest = row
        if row["price"] > most_expensive["price"]:
            most_expensive = row
        total_price += row["price"]
    average = total_price / len(rows)
    print("=== Market Price Summary ===")
    print(f"Total items:     {len(rows)}")
    print(f"Cheapest:        {cheapest['item']} — UGX {cheapest['price']} ({cheapest['vendor']})")
    print(f"Most expensive:  {most_expensive['item']} — UGX {most_expensive['price']} ({most_expensive['vendor']})")
    print(f"Average price:   UGX {round(average)}")

rows = load_prices("prices.csv")
summarise(rows)
\`\`\`

### Step 3: Test it

Run: \`python market_summary.py\`

You should see all five pieces of information printed.

### Step 4: Commit and push to GitHub

\`\`\`bash
git add market_summary.py prices.csv
git commit -m "Add market price summary script"
git push
\`\`\`

Then go to the Submit page and paste your GitHub repository URL.

Ask Mshauri for help with any step. →`,
  },
};

function ModuleContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const moduleNum = Number(params.module);
  const applicantId = searchParams.get("applicantId");
  const moduleData = MODULE_CONTENT[moduleNum];

  const chatKey = `mshauri_runway_${applicantId}_module_${moduleNum}_chat`;
  const checklistKey = `mshauri_runway_${applicantId}_module_${moduleNum}_checklist`;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [checked, setChecked] = useState<boolean[]>(new Array(moduleData?.checklist.length ?? 0).fill(false));
  const [marking, setMarking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!applicantId) return;
    try {
      const storedChat = localStorage.getItem(chatKey);
      if (storedChat) setMessages(JSON.parse(storedChat));
      const storedChecklist = localStorage.getItem(checklistKey);
      if (storedChecklist) setChecked(JSON.parse(storedChecklist));
    } catch { /* ignore */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!applicantId || messages.length === 0) return;
    localStorage.setItem(chatKey, JSON.stringify(messages));
  }, [messages, applicantId, chatKey]);

  useEffect(() => {
    if (!applicantId) return;
    localStorage.setItem(checklistKey, JSON.stringify(checked));
  }, [checked, applicantId, checklistKey]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (!moduleData) {
    return (
      <div className="loading">
        <style>{PAGE_CSS}</style>
        <p style={{ color: "var(--muted-dk)", fontFamily: "Space Mono", fontSize: 12 }}>Module not found.</p>
      </div>
    );
  }

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setLoading(true);
    setChatError(null);
    try {
      const res = await fetch("/api/runway/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, module: moduleNum, applicantId }),
      });
      if (!res.ok) throw new Error("Server error");
      if (!res.body) throw new Error("No response body");

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
      setChatError("Mshauri is unavailable right now — check your connection and try again.");
      setMessages(messages);
      setInput(text);
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
    e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
  };

  const markComplete = async () => {
    if (!applicantId) return;
    setMarking(true);
    await fetch("/api/runway", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicantId, module: moduleNum, status: "COMPLETE" }),
    });
    setMarking(false);
    localStorage.removeItem(chatKey);
    localStorage.removeItem(checklistKey);
    router.push(`/runway?applicantId=${applicantId}`);
  };

  const allChecked = checked.every(Boolean);
  const checkedCount = checked.filter(Boolean).length;

  return (
    <div className="mod-shell">
      <style>{PAGE_CSS}</style>

      <header className="mod-header">
        <div className="left">
          <div className="mark">F</div>
          <div className="hinfo">
            <div className="num">Module 0{moduleNum} · Runway</div>
            <div className="nm">{moduleData.title}</div>
            <div className="checks">{checkedCount}/{moduleData.checklist.length} items checked</div>
          </div>
        </div>
        <Link href={`/runway?applicantId=${applicantId}`} className="back">← Runway</Link>
      </header>

      <div className="mod-body">
        {/* Lesson panel */}
        <div className="lesson-panel">
          <div className="lesson-scroll">
            <div className="lesson-md">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{moduleData.content}</ReactMarkdown>
            </div>
          </div>

          <div className="checklist-section">
            <div className="checklist-head">
              <h3>Module checklist</h3>
              <span className="ck-count">{checkedCount}/{moduleData.checklist.length}</span>
            </div>
            <div className="ck-items">
              {moduleData.checklist.map((item, i) => (
                <label key={i} className="ck-label">
                  <div className={`ck-box${checked[i] ? " on" : ""}`}>
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <input
                      type="checkbox"
                      style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
                      checked={checked[i]}
                      onChange={() => {
                        const next = [...checked];
                        next[i] = !next[i];
                        setChecked(next);
                      }}
                    />
                  </div>
                  <span className={`ck-text${checked[i] ? " done" : ""}`}>{item}</span>
                </label>
              ))}
            </div>
            <button
              className="ck-action"
              onClick={markComplete}
              disabled={!allChecked || marking}
            >
              {marking ? "Saving…" : "Mark module complete →"}
            </button>
          </div>
        </div>

        {/* Chat panel */}
        <div className="chat-panel">
          <div className="chat-messages">
            {messages.length === 0 && (
              <div className="chat-empty">
                <div className="em-mark">M</div>
                <p>Ask Mshauri anything about this module</p>
                <p className="hint">Enter to send · Shift+Enter for new line</p>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`chat-row ${m.role === "user" ? "user" : "bot"}`}>
                {m.role === "assistant" && <div className="chat-av">M</div>}
                <div className="chat-bubble">
                  {m.role === "assistant" ? (
                    <div className="chat-md">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                    </div>
                  ) : m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="chat-row bot">
                <div className="chat-av">M</div>
                <div className="typing-dots">
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                </div>
              </div>
            )}

            {chatError && (
              <div className="chat-error">{chatError}</div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="chat-input-bar">
            <div className="chat-input-row">
              <textarea
                ref={textareaRef}
                rows={1}
                placeholder="Ask a question…"
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                disabled={loading}
              />
              <button
                className="send-btn"
                onClick={send}
                disabled={loading || !input.trim()}
                aria-label="Send"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 11L11 1M11 1H4M11 1V8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ModulePage() {
  return (
    <Suspense fallback={
      <div className="loading">
        <style>{PAGE_CSS}</style>
      </div>
    }>
      <ModuleContent />
    </Suspense>
  );
}
