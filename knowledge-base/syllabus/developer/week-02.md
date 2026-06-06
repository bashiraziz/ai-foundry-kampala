## Week 2 — Agent Architecture and Memory

**Track:** Developer
**Week:** 2 of 12

---

### Learning objectives

By the end of this week you will be able to:
1. Draw the ReAct loop (Reason → Act → Observe → Repeat) and explain each step
2. Distinguish the four types of agent memory and know when to use each
3. Design a memory strategy for a specific Kampala use case
4. Manage context window size to balance cost, speed, and reliability
5. Identify when an agent should escalate to a human vs. keep running

---

### Key concepts

**1. The Agent Loop (ReAct Pattern)**

ReAct (Reason + Act) is the core architectural pattern for agents. The agent does not just answer — it loops. In each iteration: the model reasons about what to do next given everything in its context; it acts by either calling a tool or producing a final answer; if it called a tool, the harness executes the tool and injects the result back into the context as an observation; the model then reasons again with the new information. This loop continues until the model decides the task is complete or until a configured stopping condition is reached (maximum iterations, timeout, or a specific output signal). The loop is implemented in code that you write — the model itself does not control when it runs. You call the model, read its response, decide whether to execute a tool call, inject the result, and call the model again. Understanding this at the implementation level is the difference between a developer who can debug agent behaviour and one who can only guess.

*Kampala analogy:* A boda dispatch agent loops like this: reason about the 20 open orders, act by assigning the nearest available rider, observe the database confirmation, check if any orders remain, repeat until all orders are assigned or it's past cutoff time.

**2. The Four Types of Memory**

Agents need different kinds of memory for different timescales, just as a person uses different cognitive systems for different purposes.

**In-context memory** is everything currently in the context window — the system prompt, the conversation so far, any retrieved documents, and all tool call results from this session. It is fast and perfectly accurate (the model sees exactly what is there), but it is expensive (longer context costs more per token) and finite in size. Use it for the active task only. When the task is done, this memory is gone unless you persist it elsewhere.

**External memory** is any persistent storage outside the model — a database, a vector store, a spreadsheet, a file system. It survives across sessions and can grow indefinitely. The agent accesses it through tools: a search tool for vector stores, a query tool for SQL databases. This is what powers RAG (Retrieval-Augmented Generation) systems. For a Kampala school, external memory would hold every parent's contact details, fee balance, and payment history — far too large for the context window, retrieved on demand as needed.

**Episodic memory** is a log of past agent runs: what task was attempted, what actions were taken, what happened. This is valuable for auditing (DFCU's compliance team needs to know what the loan pre-screening agent recommended last Tuesday), for debugging (why did the agent fail on this specific input?), and for quality improvement (what categories of input cause the most errors?). Episodic memory is almost always stored in a database, and it is written by your harness code, not by the model itself.

**Parametric memory** is what the model knows from its training data — general knowledge about the world, coding patterns, language fluency. You cannot change this without retraining or fine-tuning. Treat it as read-only background knowledge. Never rely on it for facts that change frequently (current UGX exchange rates, today's fuel prices at Total stations) — those must come from external memory via tools.

*Kampala analogy:* In-context is what you're actively thinking about in a meeting. External memory is your filing cabinet. Episodic is your diary of past decisions. Parametric is everything you learned in school — useful background, but you'd never cite it for current exchange rates.

**3. Context Window Management**

The context window is finite. On Gemini 2.5 Flash it is around one million tokens — enormous but not infinite, and long contexts cost more and can cause the model to lose focus on the original goal. On smaller or cheaper models it may be 8,000 or 32,000 tokens, which fills up quickly in a long-running agent session. Context management is an engineering discipline in itself.

Four core strategies: **Summarise** — after N turns or N tool calls, use a separate model call to compress older content into a compact summary and replace the raw history with that summary. **Retrieve** — do not pre-load all knowledge into the context; only retrieve the specific chunks relevant to the current step. **Truncate** — drop older middle content, always keeping the system prompt and the most recent turns. **Compress** — when a tool returns a 10,000-word document, use a cheap model call to extract the three relevant sentences before injecting into context. The right strategy depends on your use case — most production agents use a combination of retrieve and compress.

*Kampala analogy:* You don't read your entire WhatsApp chat history before replying to a message. You remember the last few exchanges and the original topic. Agents need the same discipline — keep the relevant, drop the noise.

**4. State Management**

Between loop iterations, the agent must track where it is in the task. State is the data that persists across steps: which sub-tasks are complete, which are pending, what decisions have been made, what errors have occurred. Without explicit state management, agents lose track of progress and repeat work or skip steps. State can be stored in the context window (simple), in a database (persistent), or in a structured object your harness maintains (flexible). For long-running agents that may take hours or days to complete a task, database-backed state is essential — the agent must be able to resume after a crash or restart.

*Kampala analogy:* A Kampala paralegal processing 30 land title applications does not start each morning from scratch. They have a checklist — which applications are complete, which are waiting for a document, which are flagged for the lawyer. The agent's state object is that checklist.

**5. Human-in-the-Loop Escalation**

Good agents know when to stop and ask for help. Escalation is not a failure — it is a designed feature. Define escalation triggers explicitly in your spec: confidence below a threshold, action is irreversible (sending money, deleting data, publishing to customers), contradictory information in context, multiple consecutive tool call failures on the same step, or the task falls outside the agent's defined scope. When an escalation trigger fires, the agent must stop, package a clear summary of its state and the reason for escalation, and hand off to a human — not silently abort and not continue anyway.

*Kampala analogy:* A school fees collection agent should never send a "payment failed" SMS to 500 parents without a human reviewing the list. The escalation point is not an afterthought — it is written into the spec before the first line of code.

---

### Kampala example

**The Makerere Student Support Agent**

Makerere University has 40,000 students. A persistent problem: students don't know which office handles their specific issue — fees go to the Bursar, transcripts go to the Academic Registrar, accommodation issues go to the Dean of Students, and graduation applications go to a completely different office that changes location every year. The university's front desk handles hundreds of misdirected walk-ins per week.

A support agent running on WhatsApp could handle this routing problem. The agent's ReAct loop on a typical query looks like this:

The student sends: "I need to get a letter confirming I am a student here for my visa application."

Reason: this is a verification letter request, not a fees or academic record question. Act: search the knowledge base for "student verification letter" + "visa." Observe: retrieved two relevant pages — one describing the process, one with the office location and hours. Reason: the student needs the Academic Registrar's office in Senate Building, open Monday-Friday 8am-5pm, requires a completed form and 5,000 UGX fee. Act: return the answer with the location, the form download link, and the payment reference for the cashier.

Memory strategy for this agent: in-context memory holds the current conversation only. External memory holds the full Makerere procedures knowledge base (hundreds of pages), retrieved by semantic search. Episodic memory logs every query type for the monthly report to the university registrar — which questions are most common, which are going unanswered. No parametric memory is relied upon for current policy details, since Makerere policy changes frequently.

Escalation trigger: if the student's question involves a disputed grade, a disciplinary matter, or a request for a fee waiver, the agent immediately routes to a human officer and sends the officer a summary of the conversation.

---

### Common questions

**Q: How do I know how much context to give the agent?**

Start with less. More context means more cost, slower inference, and more opportunities for the model to lose focus on the task. The common beginner mistake is to load everything that might be relevant into the context "just in case." Instead, identify the minimum information the model needs to complete one step of the loop, and retrieve more only when you observe the agent failing specifically because it lacked a piece of information. A useful rule: if you can remove a block of context and the agent still performs correctly on 95% of test cases, remove it. Context should be earned by the agent's needs, not given speculatively.

**Q: Should I build my own ReAct loop or use a framework?**

Both are valid approaches at different stages. Building from scratch — raw API calls and your own loop in Python or TypeScript — gives you complete visibility into what is happening at every step and teaches you what frameworks are actually abstracting. Frameworks like LangChain or LlamaIndex give you pre-built patterns but add layers of abstraction that are painful to debug when something goes wrong at 2am in production. In this programme we start from scratch in Weeks 2-4, then introduce frameworks and multi-agent orchestration in Week 5. By the time you use a framework, you will already know exactly what it is doing under the hood.

**Q: What happens when the model hallucinates a tool call?**

The model may invent a tool name that does not exist in your tool list, or call a real tool with parameters in the wrong format (for example, a phone number as "0772123456" instead of "256772123456"). Your harness code must validate every tool call before executing it. If validation fails, return a clear, structured error message to the model — something like: `{"error": "invalid_phone_format", "received": "0772123456", "expected": "256XXXXXXXXX"}`. The model almost always self-corrects on the next iteration when given a clear error. What it cannot self-correct from is a silent failure — if your harness silently drops bad tool calls, the agent will loop indefinitely trying to make progress that is being invisibly blocked.

**Q: How do I design the escalation threshold — what if it escalates too much or too little?**

Calibrate from observation, not from intuition. Start with escalation thresholds that are conservative — escalate early and often in the first two weeks of production. Log every escalation with the reason code and what the human decided. After 100 escalations, you will see patterns: the agent escalates on cases it could have handled, or it is missing cases it should have escalated. Adjust thresholds based on the pattern. For irreversible actions (sending money, deleting data), the threshold should always be human review regardless of confidence — the asymmetry of consequences justifies the cost.

---

### Practice exercise

**Exercise 2.1 — Memory Strategy Design**

You are building an agent for a duka (small shop) owner on Kampala Road. The duka sells mobile phone accessories, airtime, and basic electronics. The agent helps them:
- Track daily sales (items sold, quantities, prices)
- Remind them when stock is low (below a threshold they set per item)
- Answer questions like "what was my best-selling item last month?" and "how much did I make last week?"

Design the complete memory strategy. For each of the four memory types — in-context, external, episodic, and parametric — write:
1. What specifically would be stored there for this use case
2. How large it would grow over 6 months of operation
3. How you would retrieve it when the agent needs it
4. Whether you need this memory type at all for this use case (it is fine to say "not needed" with a reason)

Then sketch the full ReAct loop for the question "what was my best-selling item last month?" Write out each Reason, Act, and Observe step explicitly — do not skip steps. Identify where the escalation trigger would fire if the database query fails. Bring your design to the next session for group review.
