import * as fs from "fs";
import * as crypto from "crypto";
import { glob } from "glob";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

// Use || not ?? — Vercel env pull writes empty strings for unset vars
const url =
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.DATABASE_URL!;

const adapter = new PrismaPg({ connectionString: url });
const prisma = new PrismaClient({ adapter });

function chunkText(text: string, maxTokens = 400, overlapTokens = 50): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  let i = 0;
  while (i < words.length) {
    const chunk = words.slice(i, i + maxTokens).join(" ");
    chunks.push(chunk);
    i += maxTokens - overlapTokens;
  }
  return chunks.filter((c) => c.trim().length > 0);
}

async function embedText(text: string): Promise<number[]> {
  const apiKey = process.env.GEMINI_API_KEY!;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "models/gemini-embedding-001", content: { parts: [{ text }] } }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Embed API error ${res.status}: ${err}`);
  }
  const data = await res.json() as { embedding: { values: number[] } };
  return data.embedding.values;
}

function chunkId(source: string, chunk: string): string {
  return crypto.createHash("sha256").update(`${source}::${chunk}`).digest("hex").slice(0, 24);
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  // Clear duplicates and start fresh on each seed run
  const deletedCount = await prisma.knowledgeChunk.deleteMany({});
  if (deletedCount.count > 0) console.log(`Cleared ${deletedCount.count} existing chunks`);

  const files = await glob("knowledge-base/**/*.md");
  console.log(`Found ${files.length} files`);
  let total = 0;
  let failed = 0;

  for (const file of files) {
    const content = fs.readFileSync(file, "utf-8");
    const source = file.replace(/\\/g, "/");
    const chunks = chunkText(content);
    console.log(`  ${source}: ${chunks.length} chunks`);

    for (const chunk of chunks) {
      const id = chunkId(source, chunk);
      let retries = 3;
      while (retries > 0) {
        try {
          const embedding = await embedText(chunk);
          const vectorStr = `[${embedding.join(",")}]`;
          await prisma.$executeRaw`
            INSERT INTO "KnowledgeChunk" (id, source, content, embedding, "createdAt")
            VALUES (${id}, ${source}, ${chunk}, ${vectorStr}::vector, now())
            ON CONFLICT (id) DO NOTHING
          `;
          total++;
          break;
        } catch (e) {
          const msg = String(e);
          if (msg.includes("429")) {
            console.log(`    Rate limited — waiting 60s…`);
            await sleep(60000);
            retries--;
          } else {
            console.error(`    Error: ${msg.slice(0, 120)}`);
            retries = 0;
            failed++;
          }
        }
      }
      await sleep(500); // 2 req/s — well within free tier 100 RPM
    }
  }

  console.log(`\n✅ Seeded ${total} chunks (${failed} failed)`);
  await prisma.$disconnect();
}

main().catch(console.error);
