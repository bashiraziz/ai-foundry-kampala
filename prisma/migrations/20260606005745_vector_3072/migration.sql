-- Change KnowledgeChunk embedding from vector(768) to vector(3072)
-- gemini-embedding-001 outputs 3072 dimensions
ALTER TABLE "KnowledgeChunk" ALTER COLUMN embedding TYPE vector(3072);