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

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState<boolean[]>(new Array(moduleData?.checklist.length ?? 0).fill(false));
  const [marking, setMarking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

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
    setLoading(true);
    const res = await fetch("/api/prep/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: next, module: moduleNum }),
    });
    const data = await res.json();
    setMessages([...next, { role: "assistant", content: data.reply }]);
    setLoading(false);
  };

  const markComplete = async () => {
    if (!applicantId) return;
    setMarking(true);
    await fetch("/api/prep", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicantId, module: moduleNum, status: "COMPLETE" }),
    });
    setMarking(false);
    router.push(`/prep?applicantId=${applicantId}`);
  };

  const allChecked = checked.every(Boolean);

  return (
    <div className="min-h-screen bg-bone-white">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/favicon.svg" alt="Mshauri" className="w-7 h-7" />
          <p className="font-semibold text-gray-800 text-sm">Module {moduleNum}: {moduleData.title}</p>
        </div>
        <Link href={`/prep?applicantId=${applicantId}`} className="text-xs text-gray-400 hover:text-gray-600">← Back</Link>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 max-w-6xl mx-auto gap-0 lg:gap-6 p-4">
        {/* Lesson */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
          <div className="prose prose-sm max-w-none whitespace-pre-wrap text-gray-700 text-sm leading-relaxed">
            {moduleData.content}
          </div>
          <div>
            <p className="font-semibold text-gray-700 text-sm mb-2">Module checklist</p>
            <div className="space-y-2">
              {moduleData.checklist.map((item, i) => (
                <label key={i} className="flex items-start gap-2 text-sm text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-0.5 accent-foundry-green"
                    checked={checked[i]}
                    onChange={() => {
                      const next = [...checked];
                      next[i] = !next[i];
                      setChecked(next);
                    }}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>
          <button
            onClick={markComplete}
            disabled={!allChecked || marking}
            className="w-full bg-foundry-green text-white py-2 rounded-xl text-sm font-medium hover:bg-foundry-green-light disabled:opacity-40"
          >
            {marking ? "Saving…" : "Mark module complete →"}
          </button>
        </div>
        {/* Chat */}
        <div className="bg-white rounded-2xl shadow-sm flex flex-col h-[500px] lg:h-auto">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <p className="text-xs text-gray-400 text-center">Ask Mshauri anything about this module</p>
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "assistant" && <img src="/favicon.svg" alt="Mshauri" className="w-7 h-7 mr-1.5 flex-shrink-0" />}
                <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap ${
                  m.role === "user" ? "bg-foundry-green text-white" : "bg-gray-50 border border-gray-200 text-gray-700"
                }`}>{m.content}</div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <img src="/favicon.svg" alt="Mshauri" className="w-7 h-7 mr-1.5 flex-shrink-0" />
                <div className="bg-gray-50 border border-gray-200 rounded-2xl px-3 py-2 text-gray-400 text-sm animate-pulse">Thinking…</div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div className="border-t border-gray-100 p-3 flex gap-2">
            <input
              className="flex-1 border border-gray-300 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-foundry-green"
              placeholder="Ask a question…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              disabled={loading}
            />
            <button onClick={send} disabled={loading} className="bg-foundry-green text-white px-3 py-1.5 rounded-xl text-sm disabled:opacity-50">Send</button>
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
