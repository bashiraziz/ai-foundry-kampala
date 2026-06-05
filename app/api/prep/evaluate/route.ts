import { NextRequest, NextResponse } from "next/server";
import { chat } from "@/lib/llm";
import { prisma } from "@/lib/prisma";

const EVAL_PROMPT = `You are evaluating a Python mini-project submission for the Kampala Agentic AI Club Prep track.

The student was asked to write a script called market_summary.py that:
1. Reads a CSV file called prices.csv with columns: item, price_ugx, vendor
2. Prints: total items, cheapest item with vendor, most expensive item with vendor, average price

Here is their submitted code:
{code}

Here is their submitted CSV:
{csv}

Evaluate the submission. Return ONLY valid JSON:
{
  "score": 0,
  "reads_csv_correctly": true,
  "prints_total_items": true,
  "prints_cheapest": true,
  "prints_most_expensive": true,
  "prints_average": true,
  "runs_without_error": true,
  "feedback": "2-3 sentences of specific, encouraging feedback. If score < 70, name exactly what to fix."
}

Scoring guide:
- reads_csv_correctly: 20 points
- prints_total_items: 10 points
- prints_cheapest with vendor: 20 points
- prints_most_expensive with vendor: 20 points
- prints_average: 20 points
- runs_without_error (infer from code quality): 10 points`;

function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
}

export async function POST(req: NextRequest) {
  const { applicantId, githubUrl } = await req.json();

  const parsed = parseGitHubUrl(githubUrl);
  if (!parsed) return NextResponse.json({ error: "Invalid GitHub URL" }, { status: 400 });

  const { owner, repo } = parsed;
  const base = `https://raw.githubusercontent.com/${owner}/${repo}/main`;

  const [codeRes, csvRes] = await Promise.all([
    fetch(`${base}/market_summary.py`),
    fetch(`${base}/prices.csv`),
  ]);

  if (!codeRes.ok || !csvRes.ok) {
    return NextResponse.json({ error: "Could not fetch files from GitHub. Make sure the repo is public and files are on the main branch." }, { status: 400 });
  }

  const [code, csv] = await Promise.all([codeRes.text(), csvRes.text()]);

  const prompt = EVAL_PROMPT.replace("{code}", code).replace("{csv}", csv);
  const raw = await chat([{ role: "user", content: prompt }], "You are a code evaluator. Return only valid JSON.");
  const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  const result = JSON.parse(cleaned);

  const readyForExit = result.score >= 70;

  await prisma.prepEnrollment.update({
    where: { applicantId },
    data: {
      miniProjectUrl: githubUrl,
      miniProjectScore: result.score,
      miniProjectFeedback: result.feedback,
      ...(readyForExit ? { status: "READY_FOR_EXIT" } : {}),
    },
  });

  return NextResponse.json({ score: result.score, feedback: result.feedback, readyForExit });
}
