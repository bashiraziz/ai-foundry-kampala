import { prisma } from "./prisma";
import { embed } from "./llm";

export async function retrieveContext(
  query: string,
  track: string,
  week: number,
  topK = 5,
  sourcePrefix?: string
): Promise<string> {
  const vector = await embed(query);
  const vectorStr = `[${vector.join(",")}]`;

  let chunks: { content: string; source: string; similarity: number }[];

  if (sourcePrefix) {
    // Runway modules: filter by exact prefix (e.g. knowledge-base/runway/module-01)
    chunks = await prisma.$queryRaw`
      SELECT content, source,
        1 - (embedding <=> ${vectorStr}::vector) AS similarity
      FROM "KnowledgeChunk"
      WHERE source LIKE ${sourcePrefix + "%"}
      ORDER BY embedding <=> ${vectorStr}::vector
      LIMIT ${topK}
    `;
  } else {
    // Tutor chat: scope to the student's track syllabus + shared content.
    // Agent Factory concepts and Kampala case studies are relevant to both tracks.
    // Never pull the other track's syllabus or runway content.
    const trackDir = track.toLowerCase(); // "developer" | "professional"
    const syllabusPrefix = `knowledge-base/syllabus/${trackDir}/%`;
    const agentFactoryPrefix = `knowledge-base/agent-factory/%`;
    const kampalaPrefix = `knowledge-base/kampala-cases/%`;

    chunks = await prisma.$queryRaw`
      SELECT content, source,
        1 - (embedding <=> ${vectorStr}::vector) AS similarity
      FROM "KnowledgeChunk"
      WHERE (
        source LIKE ${syllabusPrefix}
        OR source LIKE ${agentFactoryPrefix}
        OR source LIKE ${kampalaPrefix}
      )
      ORDER BY embedding <=> ${vectorStr}::vector
      LIMIT ${topK}
    `;
  }

  return chunks
    .map((c) => `[${c.source}]\n${c.content}`)
    .join("\n\n---\n\n");
}
