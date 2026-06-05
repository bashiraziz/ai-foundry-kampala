import * as fs from "fs";
import * as path from "path";
import { glob } from "glob";
import { PrismaClient } from "@prisma/client";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

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
  const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const files = await glob("knowledge-base/**/*.md");
  console.log(`Found ${files.length} files`);
  let total = 0;

  for (const file of files) {
    const content = fs.readFileSync(file, "utf-8");
    const source = file.replace(/\\/g, "/");
    const chunks = chunkText(content);
    console.log(`  ${source}: ${chunks.length} chunks`);

    for (const chunk of chunks) {
      try {
        const embedding = await embedText(chunk);
        const vectorStr = `[${embedding.join(",")}]`;
        await prisma.$executeRaw`
          INSERT INTO "KnowledgeChunk" (id, source, content, embedding, "createdAt")
          VALUES (gen_random_uuid()::text, ${source}, ${chunk}, ${vectorStr}::vector, now())
          ON CONFLICT DO NOTHING
        `;
        total++;
        await sleep(100);
      } catch (e) {
        console.error(`    Error on chunk: ${e}`);
        await sleep(2000);
      }
    }
  }

  console.log(`\n✅ Seeded ${total} chunks`);
  await prisma.$disconnect();
}

main().catch(console.error);
