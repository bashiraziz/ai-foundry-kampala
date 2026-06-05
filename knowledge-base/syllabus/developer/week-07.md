## Week 7 — Persistent State and Data Handling

**Track:** Developer
**Week:** 7 of 12

---

### Learning objectives

By the end of this week you will be able to:
1. Design a database schema for agent state and conversation history
2. Implement session persistence so conversations survive page reloads
3. Build a knowledge base ingestion pipeline (chunk → embed → store)
4. Query a vector database to retrieve contextually relevant chunks

---

### Key concepts

**1. Why State Persistence Matters**

By default, LLMs are stateless. Each API call starts fresh. If you want a student to pick up a tutoring session where they left off, or a customer service agent to remember a returning customer's previous complaint, you must build persistence yourself.

The two things worth persisting:
- **Conversation history**: The messages array. Store in a database. Load on session start.
- **Structured state**: The current goal, current step, user preferences. Store as JSON in a database column.

**2. Session Architecture**

For a web app, the session lifecycle looks like:

```
User visits page
  → Load or create session ID (localStorage or cookie)
  → Query database for existing messages
  → Inject into agent context
  → User sends message
  → Append to context, send to LLM
  → LLM responds
  → Append response to context
  → Persist updated messages to database
```

The Session model in this app's Prisma schema does exactly this: each row has a studentId, track, week, and a `messages` JSON column that stores the full conversation array.

**3. Vector Embeddings and RAG**

Retrieval-Augmented Generation (RAG) is how agents access large knowledge bases without stuffing everything into context:

1. **Ingest**: Read source documents, split into chunks (~400 words with 50-word overlap)
2. **Embed**: Convert each chunk to a vector (768 numbers) using a text embedding model
3. **Store**: Write chunk text + vector to a vector-capable database (PostgreSQL + pgvector in this app)
4. **Retrieve**: At query time, embed the user's question, find the closest chunks by cosine similarity, inject them into context

The embedding model in this app is Google's `text-embedding-004`, which produces 768-dimensional vectors. The `<=>` operator in pgvector computes cosine distance.

**4. Chunking Strategy**

How you split documents affects retrieval quality:
- **Too large chunks**: Retrieve irrelevant information alongside relevant, dilute signal
- **Too small chunks**: Miss context that spans multiple sentences, fragments meaning
- **Sweet spot**: ~300-500 words, with sentence boundary respect and ~10% overlap

For the Kampala Club's knowledge base, weeks are chunked at ~400 words because each key concept is typically 2-4 paragraphs.

**5. Prisma and PostgreSQL Basics**

```typescript
// Create a session
await prisma.session.create({
  data: { studentId, track, week, messages: [] }
});

// Load and update
const session = await prisma.session.findFirst({
  where: { studentId, week },
  orderBy: { createdAt: "desc" }
});
const updatedMessages = [...session.messages, newMessage];
await prisma.session.update({
  where: { id: session.id },
  data: { messages: updatedMessages }
});
```

---

### Kampala example

**Persistent Tutor Sessions for Makerere Distance Students**

Makerere University's distance learning program has students in Gulu, Mbarara, Arua, and Soroti with unreliable internet. A tutoring agent must survive dropped connections:

Session strategy:
- Every message is persisted to PostgreSQL immediately on send (before LLM reply)
- If connection drops mid-response, the student can reconnect and continue
- After 7 days of inactivity, a "session summary" is generated and stored, and the detailed messages are compressed to save storage
- Students in Gulu studying at night get the same experience as students in Kampala, because the state lives in the database, not the browser

Knowledge base strategy for a law course:
- 200-page Constitution of Uganda → 150 chunks → embedded and stored
- Student asks "what does the Constitution say about land rights?" → top 5 chunks retrieved → model synthesises answer with article citations

---

### Common questions

**Q: Should I store messages in a separate table or as a JSON column?**
A: For a tutoring app with moderate scale, JSON column is fine and simpler. For an enterprise system where you need to search within messages, query by specific message attributes, or run analytics, a separate messages table is better.

**Q: How do I handle the cost of embedding large knowledge bases?**
A: Embed once and store. The cost is a one-time seed operation. The seed script in this app sleeps 100ms between embeddings to stay within Google's rate limits. For 1,000 chunks, that's about 2 minutes of seeding and roughly $0.001 in API cost.

**Q: What if my knowledge base is updated frequently?**
A: Build an incremental update pipeline: hash each source document, only re-embed chunks whose source hash has changed. Delete and re-insert changed chunks. Never re-embed unchanged content.

---

### Practice exercise

**Exercise 7.1 — Schema Design**

Design a Prisma schema for a Kampala clinic patient triage agent. The agent:
- Accepts symptom descriptions via WhatsApp
- Stores each conversation
- Tracks triage outcomes (urgent, standard, self-care)
- Allows doctors to review agent decisions

Write the complete schema with at least 4 models. Include:
- All relevant fields and types
- Appropriate relations
- At least one enum
- An explanation of why you made each major design decision
