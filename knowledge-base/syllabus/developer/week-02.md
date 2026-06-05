## Week 2 — Agent Architecture and Memory

**Track:** Developer
**Week:** 2 of 12

---

### Learning objectives

By the end of this week you will be able to:
1. Draw the ReAct loop (Reason → Act → Observe → Repeat) and explain each step
2. Distinguish the four types of agent memory and know when to use each
3. Design a memory strategy for a specific Kampala use case
4. Identify when an agent should escalate to a human vs. keep running

---

### Key concepts

**1. The ReAct Loop**

ReAct (Reason + Act) is the core architectural pattern for agents. The agent does not just answer — it loops:

1. **Reason**: Given what I know (context), what should I do next?
2. **Act**: Call a tool or produce output
3. **Observe**: What did the tool return?
4. **Repeat**: Am I done? If not, reason again with the new observation

This loop is implemented in code — you write the harness that calls the model, extracts tool calls from the response, executes them, and injects results back into context.

A boda dispatch agent loops like this: reason about the 20 open orders, act by assigning the nearest available rider, observe the database confirmation, check if any orders remain, repeat until all orders are assigned or it's past cutoff time.

**2. The Four Types of Memory**

Agents need different kinds of memory for different timescales:

- **In-context memory**: Everything in the current context window. Fast, accurate, but expensive and limited in size. Use for the current conversation or task.
- **External memory (database/vector store)**: Persistent storage retrieved by search. Use for knowledge bases, customer histories, past conversations. This is what the RAG system in this app uses.
- **Episodic memory**: Logs of past agent runs — what actions were taken, what happened. Use for debugging, auditing, and teaching the agent from past mistakes.
- **Parametric memory**: What the model "knows" from training. You cannot change this without fine-tuning. Treat it as read-only background knowledge.

Most production agents use in-context + external memory. The others are for advanced use cases.

**3. Context Window Management**

The context window is finite. On Gemini 2.5 Flash, it's around 1 million tokens — enormous but not infinite, and long contexts cost more. On smaller/cheaper models it may be 8k or 32k tokens.

Context management strategies:
- **Summarize**: After N turns, summarize old messages into a compact block
- **Retrieve**: Don't put everything in context — only retrieve relevant chunks
- **Truncate**: Drop old messages from the middle, keep system prompt and recent turns
- **Compress**: Use a smaller model to compress tool results before injecting

In Kampala terms: you don't read your entire WhatsApp chat history before replying to a message. You remember the last few exchanges and the original topic. Agents need the same discipline.

**4. Human-in-the-Loop Escalation**

Good agents know when to stop and ask for help. Escalation triggers:
- Confidence below a threshold
- Action is irreversible (sending money, deleting data)
- Contradictory information in context
- Multiple failed tool calls on the same step

A school fees collection agent should never send a "payment failed" SMS to 500 parents without a human reviewing the list. The escalation point is part of the spec.

---

### Kampala example

**The Makerere Student Support Agent**

Makerere University has 40,000 students. A common problem: students don't know which office handles their specific issue (fees, transcripts, accommodation, graduation). A support agent could:

- Receive a student's question via WhatsApp
- Reason: is this a fees question, an academic question, or a welfare question?
- Act: search the knowledge base for the right office + procedure
- Observe: retrieved 3 relevant pages
- Reason: the student needs the Bursar's office, Building 3, open Mon-Fri 8am-5pm
- Act: return the answer with the office location and a reminder about the fee clearance deadline

Memory strategy: in-context for the current conversation, external memory for the Makerere procedures knowledge base. No episodic memory needed for this use case.

---

### Common questions

**Q: How do I know how much context to give the agent?**
A: Start with less. More context means more cost, slower inference, and more opportunities for the model to get confused. Only add context when you observe the agent failing because it lacked specific information.

**Q: Should I build my own ReAct loop or use a framework?**
A: Both are valid. Building from scratch (raw API calls + your own loop) gives you full control and teaches you what's actually happening. Frameworks like LangChain or LlamaIndex give you pre-built patterns but add abstraction you'll need to debug later. In this club we start from scratch, then introduce frameworks in Week 5.

**Q: What happens when the model hallucinates a tool call?**
A: The model may invent a tool name that doesn't exist or call a real tool with wrong parameters. Your harness must validate every tool call before executing it, and return a clear error message to the model if validation fails. The model usually self-corrects on the next loop iteration.

---

### Practice exercise

**Exercise 2.1 — Memory Strategy Design**

You are building an agent for a duka (small shop) owner on Kampala Road. The agent helps them:
- Track daily sales
- Remind them when stock is low
- Answer questions like "what was my best-selling item last month?"

Design the memory strategy. For each memory type (in-context, external, episodic), write:
1. What specifically would be stored there
2. How large it would grow over 6 months
3. How you would retrieve it when needed

Sketch the ReAct loop for the question "what was my best-selling item last month?" — write out each Reason/Act/Observe step.
