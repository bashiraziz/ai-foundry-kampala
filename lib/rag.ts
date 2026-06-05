import { prisma } from "./prisma";
import { embed } from "./llm";

export async function retrieveContext(
  query: string,
  _track: string,
  _week: number,
  topK = 5,
  sourcePrefix?: string
): Promise<string> {
  const vector = await embed(query);
  const vectorStr = `[${vector.join(",")}]`;

  let chunks: { content: string; source: string; similarity: number }[];

  if (sourcePrefix) {
    chunks = await prisma.$queryRaw`
      SELECT content, source,
        1 - (embedding <=> ${vectorStr}::vector) AS similarity
      FROM "KnowledgeChunk"
      WHERE source LIKE ${sourcePrefix + "%"}
      ORDER BY embedding <=> ${vectorStr}::vector
      LIMIT ${topK}
    `;
  } else {
    chunks = await prisma.$queryRaw`
      SELECT content, source,
        1 - (embedding <=> ${vectorStr}::vector) AS similarity
      FROM "KnowledgeChunk"
      ORDER BY embedding <=> ${vectorStr}::vector
      LIMIT ${topK}
    `;
  }

  return chunks
    .map((c) => `[${c.source}]\n${c.content}`)
    .join("\n\n---\n\n");
}
