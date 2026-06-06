"use client";
import { useState, useRef, useEffect } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

type Message = { role: "user" | "assistant"; content: string };

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

  if (!moduleData) return <p className="text-center text-gray-400 mt-20">Module not found.</p>;

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
    <div className="min-h-screen bg-forge-deep flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-white/[0.06] px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/brand/hero-mark.svg" alt="Mshauri" className="w-7 h-7" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-gray-500">0{moduleNum}</span>
                <p className="text-white font-semibold text-sm">{moduleData.title}</p>
              </div>
              <p className="text-gray-500 text-xs">Runway · {checkedCount}/{moduleData.checklist.length} checks complete</p>
            </div>
          </div>
          <Link href={`/runway?applicantId=${applicantId}`} className="text-xs text-gray-500 hover:text-gray-300 transition">
            ← Runway
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">

        {/* Lesson panel */}
        <div className="bg-white rounded-2xl overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-6">
            <div className="prose prose-sm max-w-none text-gray-700 text-sm leading-relaxed whitespace-pre-wrap font-mono">
              {moduleData.content}
            </div>
          </div>

          {/* Checklist */}
          <div className="border-t border-gray-100 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-forge-night">Module checklist</p>
              <span className="text-xs text-stone-grey">{checkedCount}/{moduleData.checklist.length}</span>
            </div>
            <div className="space-y-2.5">
              {moduleData.checklist.map((item, i) => (
                <label key={i} className="flex items-start gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 flex-shrink-0 mt-0.5 rounded-md border-2 flex items-center justify-center transition-all ${
                    checked[i]
                      ? "bg-foundry-green border-foundry-green"
                      : "border-gray-300 group-hover:border-foundry-green/50"
                  }`}>
                    {checked[i] && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked[i]}
                      onChange={() => {
                        const next = [...checked];
                        next[i] = !next[i];
                        setChecked(next);
                      }}
                    />
                  </div>
                  <span className={`text-sm leading-snug transition-colors ${checked[i] ? "text-gray-400 line-through" : "text-gray-700"}`}>
                    {item}
                  </span>
                </label>
              ))}
            </div>
            <button
              onClick={markComplete}
              disabled={!allChecked || marking}
              className="w-full bg-foundry-green text-white py-3 rounded-xl text-sm font-semibold hover:bg-foundry-green-light disabled:opacity-40 transition mt-2"
            >
              {marking ? "Saving…" : "Mark module complete →"}
            </button>
          </div>
        </div>

        {/* Chat panel */}
        <div className="flex flex-col h-[520px] lg:h-auto rounded-2xl border border-white/[0.06] bg-white/[0.03] overflow-hidden">
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-10 space-y-2 animate-fade-in">
                <img src="/brand/hero-mark.svg" alt="Mshauri" className="w-8 h-8 mx-auto opacity-40" />
                <p className="text-gray-500 text-sm">Ask Mshauri anything about this module</p>
                <p className="text-gray-600 text-xs">Enter to send · Shift+Enter for new line</p>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex items-end gap-2 animate-fade-up ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                {m.role === "assistant" && (
                  <img src="/brand/hero-mark.svg" alt="Mshauri" className="w-6 h-6 flex-shrink-0 mb-0.5" />
                )}
                <div className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words ${
                  m.role === "user"
                    ? "bg-foundry-green text-white rounded-br-sm"
                    : "bg-white/[0.08] border border-white/[0.08] text-gray-100 rounded-bl-sm"
                }`}>
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-end gap-2 animate-fade-up">
                <img src="/brand/hero-mark.svg" alt="Mshauri" className="w-6 h-6 flex-shrink-0 mb-0.5" />
                <div className="bg-white/[0.08] border border-white/[0.08] rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5 text-gray-400">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}

            {chatError && (
              <div className="flex items-end gap-2 animate-fade-up">
                <img src="/brand/hero-mark.svg" alt="Mshauri" className="w-6 h-6 flex-shrink-0 mb-0.5 opacity-30" />
                <div className="max-w-[78%] rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm bg-red-900/30 border border-red-500/20 text-red-300">
                  {chatError}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Chat input */}
          <div className="flex-shrink-0 border-t border-white/[0.06] p-3">
            <div className="flex items-end gap-2 bg-white/[0.05] border border-white/[0.08] rounded-2xl px-4 py-2.5 focus-within:border-white/20 transition">
              <textarea
                ref={textareaRef}
                rows={1}
                className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 resize-none focus:outline-none leading-relaxed"
                placeholder="Ask a question…"
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                disabled={loading}
                style={{ maxHeight: "100px" }}
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                className="w-7 h-7 bg-amber-400 text-forge-night rounded-lg flex items-center justify-center flex-shrink-0 hover:bg-amber-300 disabled:opacity-30 transition mb-0.5"
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
    <Suspense fallback={<p className="text-center text-gray-400 mt-20">Loading…</p>}>
      <ModuleContent />
    </Suspense>
  );
}
