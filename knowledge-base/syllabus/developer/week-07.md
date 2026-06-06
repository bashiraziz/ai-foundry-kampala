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

By default, LLMs are stateless. Each API call starts fresh with no memory of what came before. If you want a student to pick up a tutoring session where they left off, or a customer service agent to remember a returning customer's previous complaint, you must build persistence yourself. Think of it like a boda boda rider who forgets every passenger the moment they drop them off — useful for a single trip, useless for building a regular relationship. Persistence turns your agent from a one-trip stranger into a familiar face who remembers your route, your preferred drop-off, and the fact that you always pay with MTN MoMo.

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

The Session model in this app's Prisma schema does exactly this: each row has a studentId, track, week, and a `messages` JSON column that stores the full conversation array. Every message is written to the database before the LLM reply is returned to the user. If the network drops mid-response — common in Kampala neighbourhoods where connectivity fluctuates between 3G and 4G — the user reconnects and picks up exactly where they left off. The session is in Neon PostgreSQL in a data centre, not in the browser tab that just closed.

**3. Vector Embeddings and RAG**

Retrieval-Augmented Generation (RAG) is how agents access large knowledge bases without stuffing everything into context. Cramming an entire textbook into a system prompt is expensive, slow, and often impossible given token limits. RAG solves this by making the agent reach for relevant information at the moment it is needed, just as a knowledgeable librarian at Makerere University doesn't memorise every book — they know exactly which shelf to walk to.

1. **Ingest**: Read source documents, split into chunks (~400 words with 50-word overlap)
2. **Embed**: Convert each chunk to a vector (768 numbers) using a text embedding model
3. **Store**: Write chunk text + vector to a vector-capable database (PostgreSQL + pgvector in this app)
4. **Retrieve**: At query time, embed the user's question, find the closest chunks by cosine similarity, inject them into context

The embedding model in this app is Google's `text-embedding-004`, which produces 768-dimensional vectors. The `<=>` operator in pgvector computes cosine distance.

**4. Chunking Strategy**

How you split documents affects retrieval quality. The wrong chunk size is like cutting a newspaper into strips that each contain only half a sentence — the words are all there but none of them mean anything on their own. Chunk too large and you retrieve paragraphs of irrelevant detail alongside the one sentence that matters. Chunk too small and you lose the context that gives each sentence meaning.

- **Too large chunks**: Retrieve irrelevant information alongside relevant, dilute signal
- **Too small chunks**: Miss context that spans multiple sentences, fragments meaning
- **Sweet spot**: ~300-500 words, with sentence boundary respect and ~10% overlap

For the AI Foundry Kampala's knowledge base, weeks are chunked at ~400 words because each key concept is typically 2-4 paragraphs. Overlap ensures that a concept explanation split across two chunks does not lose its connecting thread.

**5. Prisma and PostgreSQL Basics**

Prisma is a type-safe ORM that translates TypeScript code into SQL queries. You define your data model in a schema file, run a migration, and interact with your database through strongly-typed client methods. No raw SQL required for the common cases.

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

The JSON column for messages avoids the complexity of a separate messages table while keeping all conversation data retrievable in a single query. For a tutoring app at cohort scale, this is the right trade-off.

---

### Kampala example

**Persistent Tutor Sessions for Makerere Distance Students**

Makerere University's distance learning program enrolls students in Gulu, Mbarara, Arua, and Soroti — towns where internet connectivity is intermittent and often cuts out without warning, especially during evening load-shedding hours when mobile data traffic spikes. A tutoring agent that loses its memory every time a connection drops is useless for these students.

The session persistence strategy for this deployment works as follows. Every message is written to PostgreSQL on Neon immediately when sent — before the LLM reply is even requested. If the connection drops mid-response, the student opens the app again, their session ID is retrieved from localStorage, the last ten messages are loaded from the database, and the conversation continues as if nothing happened. After seven days of inactivity, a background job generates a session summary and compresses the detailed message log, keeping the database lean without losing the thread.

For a law course, the knowledge base strategy looks like this: the 200-page Constitution of Uganda is split into 150 chunks, each embedded and stored in pgvector. A student in Gulu asks "what does the Constitution say about land rights?" — the query is embedded, the five most similar chunks are retrieved, and the model synthesises a precise answer with article citations. The student gets a better answer than a general-knowledge LLM could provide, because the agent is reading the actual document, not guessing from training data.

Students in Gulu studying at 11pm on mobile data get the same experience as students in Kampala on broadband, because the state lives in the database, not in the browser tab.

---

### Common questions

**Q: Should I store messages in a separate table or as a JSON column?**

For a tutoring app with moderate scale — say, a few hundred students across several cohorts — a JSON column is the right choice. It is simpler to implement, requires no joins to load a full conversation, and performs well at this scale. The trade-off is that you cannot easily query within messages: you cannot ask "how many sessions mentioned the word 'confused'" without loading every row. For an enterprise system where you need to search within messages, query by specific message attributes, or run analytics across millions of conversations, a separate messages table with indexed columns is better. Start with JSON; migrate to a table when the query requirements demand it.

**Q: How do I handle the cost of embedding large knowledge bases?**

Embed once and store. The cost is a one-time seed operation, not a recurring expense. The seed script in this app sleeps 100ms between embedding API calls to stay within Google's rate limits. For 1,000 chunks, that is about two minutes of seeding and roughly $0.001 in API cost — less than the cost of a chapati at the Owino Market food stalls. Re-embedding is only needed when source documents change. Design your pipeline to hash each source document and only re-embed chunks whose hash has changed.

**Q: What if my knowledge base is updated frequently?**

Build an incremental update pipeline: hash each source document at ingest time, store the hash alongside the chunks in your database. When the source changes, compute the new hash, compare it to the stored hash, and only re-embed the changed document's chunks. Delete the old chunks for that document, insert the new ones. Never re-embed content that has not changed. For a Kampala clinic whose medication formulary is updated monthly by the Ministry of Health, this means one re-embedding run per month rather than a full reseed every time a single drug is updated.

**Q: Can I use SQLite instead of PostgreSQL for simpler deployments?**

Yes, for local development or single-server deployments. SQLite does not support pgvector natively, so you lose the vector similarity search capability. For RAG you would need a separate vector store or a library like `@xenova/transformers` for in-process similarity search. The trade-off is simplicity versus capability: SQLite requires no server setup and works on any machine, making it excellent for building and testing the agent logic before committing to a hosted PostgreSQL setup. Many Kampala developers start with SQLite locally and switch to Neon or Supabase for staging and production.

---

### Practice exercise

**Exercise 7.1 — Schema Design and State Pipeline**

You are building a persistent state system for a Kampala clinic patient triage agent. The agent accepts symptom descriptions via WhatsApp, stores each conversation, tracks triage outcomes, and allows doctors to review agent decisions.

**Part A — Schema Design**

Write a complete Prisma schema with at least four models. Your schema must include:
- A `Patient` model (phone number as identifier, name, registration date)
- A `TriageSession` model (patient reference, session messages as JSON, outcome enum, assigned nurse if escalated, created and updated timestamps)
- A `TriageOutcome` enum with at least three values: `URGENT`, `STANDARD`, `SELF_CARE`
- A `DoctorReview` model (session reference, doctor ID, review notes, approved boolean, review timestamp)

For each model, write a one-sentence explanation of the design decision: why this field, why this type, why this relation.

**Part B — Session Lifecycle**

Write pseudocode (or TypeScript) for the complete session lifecycle:
1. Patient sends first WhatsApp message: create session, store message
2. Agent responds: store agent message, update session
3. Patient sends follow-up: load existing session, append message, call LLM with full history
4. Agent reaches triage decision: update outcome field, trigger escalation if URGENT

**Part C — Retrieval Test**

Given a knowledge base of 50 Ministry of Health treatment guidelines (each ~2 pages), describe in plain English how you would structure the chunking and retrieval so that when a patient says "I have chest pain and my left arm feels heavy," the agent retrieves the cardiac emergency guideline rather than the general chest infection guideline. What would you tune if it kept retrieving the wrong document?
