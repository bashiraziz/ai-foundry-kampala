## The Agent Factory: Core Concepts

**Source:** AI Foundry Kampala Programme
**Applies to:** Both Developer and Professional tracks

---

### What is the Agent Factory?

The Agent Factory is the operating philosophy of The AI Foundry Kampala. It treats agent-building as a production discipline — repeatable, quality-controlled, and improvable — rather than as artistry or guesswork.

The name is intentional. A factory implies:
- Standardised inputs and outputs
- Quality checkpoints at each stage
- Reproducible processes
- Continuous improvement
- A team that can maintain the line, not just the inventor

The opposite of the Agent Factory is the Demo Trap: building something impressive once, shipping it to production without guardrails, and watching it fail unpredictably on real data.

---

### The Five-Stage Production Line

**Stage 1: Spec**

Every agent starts with a written specification. The spec answers:
- Who uses this agent and for what?
- What tools does it have and what are their boundaries?
- What must it never do?
- What does a correct output look like?
- How will it be tested?

Agents built without a spec have no standard to measure against. You cannot improve what you cannot define.

A good spec for a Kampala school fees agent answers: who are the users (parents, bursary staff, the headteacher)? What can each user do? What is the agent not allowed to do (share other families' balances, make payment decisions, give legal advice)? What does a correct output look like for the three most common requests? How will the payment-matching logic be tested?

**Stage 2: Scaffold**

Set up the three components:
- Model: select, configure temperature and context window
- Context: write system prompt, identify knowledge sources, design retrieval
- Tools: define interfaces, implement, test each tool in isolation

The scaffold is the factory floor. Before you run the production line, every machine must work independently. Test each tool by calling it directly before connecting it to the agent. If `record_sale()` fails in isolation, it will fail inside the agent — just harder to debug.

**Stage 3: Test**

Run the agent against your test suite before anyone else sees it. Test:
- Happy path (normal inputs, expected outputs)
- Edge cases (unusual but valid inputs)
- Adversarial inputs (users trying to break the agent)
- Failure modes (tool errors, missing data, context overflow)

A test suite is a specification artifact — it defines what "working correctly" means. It lives in the repository alongside the code.

For a Kampala boda dispatch agent, adversarial tests include: a customer trying to get a rider's phone number without paying, a customer asking for a delivery outside service zones, and a message claiming a payment was made when no MoMo notification arrived.

**Stage 4: Ship**

Deploy with guardrails in place. Before shipping:
- Error handling covers all identified failure modes
- Escalation path is implemented and tested
- Audit logging is active
- Cost monitoring is in place
- Rollback plan exists

Shipping without these is not speed — it is debt.

**Stage 5: Iterate**

Production is the best teacher. Collect:
- User inputs that triggered unexpected behaviour
- Tool calls that failed
- Cases where the agent escalated unnecessarily (or didn't escalate when it should have)
- User feedback

Add these to the test suite. Fix the root cause. Redeploy. The factory improves with every cycle.

---

### The Three Components in Depth

**The Model**

The model is the reasoning engine. Different models have different trade-offs:

| Model | Strengths | Kampala use case fit |
|---|---|---|
| Gemini 2.5 Flash | Fast, cheap, 1M context, multimodal | 90%+ of business workflows |
| Gemini 2.5 Pro | Stronger reasoning, more expensive | Complex multi-step analysis |
| Claude Sonnet | Strong instruction following | Precise rule-following agents |
| Llama 3.3 70B (via OpenRouter) | Free tier available, open weights | Development/fallback |

For most agents in Kampala, Gemini 2.5 Flash is the right starting point. It is fast enough for real-time use, cheap enough for high volume, and capable enough for the majority of business tasks.

Model selection matters, but context and tools matter more. A well-designed agent with a weaker model outperforms a poorly designed agent with a stronger model. Do not reach for the most expensive model before fixing your context and tool design.

**The Context**

Context is everything the model can see when it makes a decision. It has four layers:

1. **System prompt**: The agent's standing instructions. Defined by the spec. Changes rarely.
2. **Retrieved knowledge**: Chunks from the knowledge base relevant to this query. Retrieved via RAG.
3. **Conversation history**: The messages so far in this session. Grows as the conversation continues.
4. **Tool results**: What tools returned in previous steps. Injected as the loop runs.

Good context engineering means putting the right information in each layer, in the right order, at the right granularity. This is the primary skill separating effective agent builders from those who can only demo.

For a Kampala duka agent, the system prompt contains business rules (never record a sale without confirmation). The knowledge base contains the product catalogue (loaded via RAG when a product name appears in the message). The conversation history contains the last 10 turns. Tool results contain the inventory count returned by the last `check_inventory` call. Each layer has a purpose — mixing them creates confusion.

**The Tools**

Tools are the agent's interface to the world. Without tools, an agent can only generate text. With tools, it can:
- Read from databases
- Write to databases
- Call external APIs
- Send notifications
- Trigger other agents

Tool design principles (from the Agent Factory):
1. **Narrow scope**: One tool, one purpose
2. **Descriptive names**: `calculate_ugx_fee(amount, rate)` not `process(x, y)`
3. **Rich descriptions**: The model reads the description to decide when to call the tool
4. **Structured returns**: JSON, not prose
5. **Error context**: Failures explain themselves

A tool named `do_stuff(data)` with the description "handles data" will be misused. A tool named `match_momo_payment(momo_reference, amount_ugx, sender_name)` with the description "Attempts to match incoming MoMo payment to a student account using fuzzy name matching. Returns matched student ID and confidence score, or 'unmatched' if no match found" will be called correctly.

---

### The Agent Triangle Summary

```
         MODEL
        /     \
       /       \
  CONTEXT --- TOOLS

The triangle is balanced. All three matter.
Most problems live in context.
Most solutions live in context.
```

When an agent misbehaves, diagnose:
- Is the reasoning wrong given the information it had? → Model problem (rare)
- Did it reason correctly but from wrong/missing information? → Context problem (common)
- Did it have the right information but no way to act on it? → Tools problem (addressable)

In practice, 70% of agent failures are context problems. The model read the right system prompt but the wrong product catalogue was loaded. The conversation history grew too long and the system prompt rules scrolled out of the context window. The tool result was returned as an error string instead of structured JSON, and the model misinterpreted it. Fix context before assuming model or tool problems.

---

### The Digital FTE Concept

A Digital FTE (Full-Time Equivalent) is the agent-era equivalent of a hire. When you deploy an agent that handles 200 parent balance enquiries per week without bursary staff involvement, you have added a Digital FTE to the school's capacity — one that does not get sick, does not need a lunch break, and handles the same question at 11pm on a Sunday as it does at 9am on Monday.

The Digital FTE concept matters because it changes how organisations think about agent investment. The question is not "how much does this API cost?" — it is "what would it cost to hire the human doing this work, and what is the agent cost at the same volume?" For most Kampala small businesses and schools, the answer makes agent deployment financially obvious.

Digital FTEs have limits. They handle volume and consistency well. They handle judgment, relationship nuance, and novel situations poorly. The goal is not to replace all staff — it is to free human staff from the 70% of their time spent on information lookup and routine communication, so they can spend it on the 30% that requires human judgment.

---

### Spec-Driven Design

Spec-Driven Design is the practice of writing the agent's specification before writing any code. The spec is not a planning document — it is a contract. It defines:

- The agent's permitted actions (what it can do)
- The agent's prohibited actions (what it must never do)
- The acceptance criteria (the tests that define "working correctly")
- The escalation paths (when does a human get involved?)

A Kampala school fees agent spec might include: "The agent must never share one family's balance with another family's contact. Test: send a request from phone number A asking for the balance of a student registered under phone number B. The expected response contains no balance information."

Writing the spec first catches design problems before they become code problems. A two-hour spec session typically uncovers three or four edge cases that would take two weeks to discover in production.

---

### The 10-80-10 Rule

The 10-80-10 Rule describes the population of agent interactions:

- **10%**: Routine requests that the agent handles perfectly with no human involvement
- **80%**: Routine requests that the agent handles correctly
- **10%**: Exceptions, edge cases, and situations requiring human judgment

Wait — the first two together are 90%, not 10%. The rule is:

- **10%**: Truly exceptional cases the agent cannot handle alone
- **80%**: The high-volume routine work the agent handles autonomously
- **10%**: The design and maintenance work required to keep the agent working

The agent's job is the 80%. Human staff handle the 10% that requires judgment. Developers handle the 10% that requires ongoing maintenance and improvement. When an agent tries to handle the top 10% (the judgment calls) autonomously, it makes expensive mistakes. Design the escalation path first.

In the boda dispatch case: 80% of orders follow the standard flow (request → price → payment → rider assignment → delivery). 10% are exceptions Fatima handles (no riders available, disputes, incidents). 10% are system maintenance tasks (updating the zone price matrix, adding new riders, reviewing flagged events).

---

### The Two-Layer Model

Agents operate on two layers simultaneously:

**Layer 1: Conversation** — the turn-by-turn exchange with the user. Each message comes in, the agent responds. This is the visible layer.

**Layer 2: State** — the persistent data that gives the conversation meaning. The student's fee balance. The order's current status. The rider's last known zone. This is the invisible layer.

Most agent failures happen at the boundary between layers. The conversation layer says "payment confirmed" but the state layer was not updated. The conversation layer remembers the product name, but the state layer has the wrong price. The agent responds confidently to a question about something that changed in the state layer since the conversation started.

Design Layer 2 first. What data does the agent need to exist persistently, between conversations? Where does it live (database, file, API)? How does the agent read it? How does the agent write it? The answers to these questions define your tool requirements.

---

### MCP (Model Context Protocol)

MCP is an open protocol that standardises how agents connect to data sources and tools. Think of it as USB for agent integrations: instead of writing a custom connector for every data source, you write one MCP-compliant connector and it works with any MCP-compatible agent.

In practical terms for Kampala deployments: an MCP server sitting in front of a school's student database exposes `get_student_account`, `record_payment`, and other tools in a standard format. The agent framework connects to the MCP server and gets all tools automatically, without custom integration code per tool.

MCP matters because it reduces the cost of the Scaffold stage. Standard integrations (Google Sheets, PostgreSQL, WhatsApp) already have MCP servers available. You configure, not code.

---

### OpenCode

OpenCode is the AI Foundry's approach to agentic software development. It is the practice of using AI agents (like Claude Code) as collaborators in writing, testing, and deploying agent code — not just as code assistants.

In practice at The AI Foundry Kampala: students use Claude Code to scaffold their agent projects, generate test suites from their specs, debug tool implementations, and review system prompts for logic gaps. The agent helps build the agent.

OpenCode is a multiplier on the Five-Stage Production Line. With OpenCode, the Scaffold stage goes from a day's work to an hour's work. The Test stage generates test cases from the acceptance criteria automatically. The Iterate stage diagnoses production failures faster.

---

### OpenWork / Mshauri

Mshauri is The AI Foundry Kampala's AI tutor and learning assistant. It demonstrates the OpenWork philosophy: AI as a colleague in learning, not a search engine.

Mshauri is always available — at midnight when a student is debugging a Python error, at 6am before the Saturday session, on a Thursday when no facilitator is present. It knows the curriculum, the local context (Owino market, MTN MoMo, boda bodas), and the common mistakes Kampala students make.

OpenWork in a business context means something similar: an AI that knows your business, your products, your customers, and your processes — available to any staff member at any time. The Duka Accountant is OpenWork for Moses's shop. The School Fees Tracker is OpenWork for the bursary team.

---

### Kampala-Specific Considerations

**Language**: Ugandan users communicate in English, Luganda, and mixtures of both. Agents deployed in Uganda must be tested with code-switched inputs. "Nze nfuna 50,000 UGX from MoMo" is a valid user input. Test for it.

**Connectivity**: Internet in parts of Kampala (Kawempe, Makindye, Rubaga) is less reliable than Nakasero. Build agents with timeouts and offline-graceful degradation. A loading spinner that hangs forever is worse than an immediate error message.

**Data formats**: Uganda uses UGX (no decimal places in common usage), DD/MM/YYYY dates (different from US format), and phone numbers starting 256 or 0 followed by 9 digits. Validate these in tool parameter schemas.

**Regulatory context**: Uganda's Data Protection and Privacy Act (2019) requires a legal basis for processing personal data. Agents that store conversation history containing personal information must comply. Build data retention policies into the specification, not as an afterthought.

**Payment infrastructure**: MTN MoMo and Airtel Money are the primary digital payment rails. Bank cards are secondary. Any agent involving payments must support MoMo and Airtel. The Central Bank of Uganda (BOU) API is available for licensed providers. For unlicensed parties, payments must go through aggregators (Beyonic, Pesapal, FlexiPay).

---

### How the Concepts Connect

The Agent Factory concepts are not independent ideas — they form a complete system. Understanding how they fit together explains why each matters.

**The Digital FTE is the business case.** It answers why the organisation should invest in building an agent at all. When Moses at the duka understands that a Duka Accountant would save him 2 hours per day — the same value as hiring a part-time bookkeeper at a fraction of the cost — the investment is obvious.

**Spec-Driven Design produces the blueprint.** Once the business case is clear, the spec defines exactly what the Digital FTE will do, what it will refuse to do, and how you will know when it is working. The spec for Moses's Duka Accountant lists the tools, the language rules, the confirmation loop, and the six acceptance criteria.

**The Agent Triangle (Model + Context + Tools) is the implementation.** The spec tells you what to build. The Triangle tells you how to build it. The system prompt (Context) encodes the business rules. The tools (Tools) connect to Moses's inventory database and MTN MoMo. The model (Model) — Gemini 2.5 Flash — does the reasoning.

**The 10-80-10 Rule determines the escalation design.** The 80% (routine sales recording, inventory queries, daily summaries) is handled autonomously. The 10% (disputed prices, supplier negotiations, tax questions) escalates to Moses. If Moses tried to automate the top 10%, the agent would make expensive mistakes and he would lose trust in the system within a week.

**The Two-Layer Model governs the data architecture.** The conversation layer (WhatsApp messages) is stateless. The state layer (PostgreSQL database with sales, inventory, and product tables) persists everything. Every tool call that changes state writes to the database. The agent reads from the database before every response to ensure it has current data, not assumptions from earlier in the conversation.

**MCP reduces integration cost at the Scaffold stage.** Standard MCP connectors for WhatsApp and PostgreSQL mean the integration code is configuration, not custom development. This is the difference between a two-day Scaffold stage and a two-week one.

**OpenCode (Claude Code) accelerates every stage.** The spec is written with Claude Code's help. The test suite is generated from the acceptance criteria. The system prompt is reviewed and refined through dialogue. Production failures are diagnosed faster. The factory runs faster when the factory itself uses AI.

**Mshauri / OpenWork completes the loop.** Every student learning to build agents has Mshauri available. Every staff member at a school using the fees tracker has the tracker available. The knowledge compounds: Mshauri learns from student sessions, Moses's agent learns from sales patterns, the school's agent learns from payment matching experience.

---

### Common Misconceptions

**Misconception 1: "A better model solves everything."**

The most common mistake new agent builders make: when the agent behaves incorrectly, assume the model needs to be smarter and switch to a more expensive one. In practice, 70% of agent failures are context problems — the model had the wrong information, the system prompt was ambiguous, or the tool result was malformed. Switching from Gemini 2.5 Flash to Gemini 2.5 Pro rarely fixes a context problem. It just costs more while still being wrong. Diagnose before upgrading.

**Misconception 2: "The agent should handle everything autonomously."**

The 10-80-10 Rule exists because no agent handles 100% of cases correctly. An agent that tries to handle every situation ends up making high-stakes mistakes on the 10% that require human judgment. The boda dispatch agent that tries to resolve customer disputes autonomously will make promises it cannot keep and create liability for QuickBoda. The school fees agent that tries to make hardship decisions autonomously will make calls that destroy family trust in the school. Design the escalation path as carefully as the main path.

**Misconception 3: "Once it works in demo, it's ready to ship."**

A demo uses clean, prepared inputs. Production uses everything: voice notes with background noise, messages in three languages at once, customers who paste their full conversation history into a single message, payments that arrive 40 days after the order. The gap between demo and production is where agents fail. Stage 3 (Test) and Stage 4 (Ship with guardrails) exist specifically to close this gap. Never skip them.

**Misconception 4: "AI will replace all the staff."**

The Duka Accountant does not replace Moses's two employees. It replaces Moses's 2 hours of daily bookkeeping. His staff still manage customers, stock shelves, and handle situations that require judgment and relationship. The bursary team at the school still handles hardship cases, disputes, and the governance work of fee policy. The displacement is of specific tasks, not of people. The people freed from those tasks can do higher-value work — or the organisation can handle more volume with the same team.

**Misconception 5: "Agents are only for tech companies."**

Dukas, boda boda dispatch businesses, primary schools, market vendors at Owino, SACCO lending officers — every organisation that communicates with people, tracks transactions, or manages information is a candidate for agent deployment. The infrastructure (WhatsApp, MTN MoMo, cheap LLM APIs) is already in Kampala. The gap is knowledge of how to build and deploy. That is what The AI Foundry Kampala is for.

---

### Common Questions About the Agent Factory

**Q: Is the Agent Factory just another framework?**
A: No. It is a discipline, not a framework. It does not require specific libraries or tools. You can apply it with raw API calls and plain TypeScript, or with LangChain and LlamaIndex. The discipline is in the process: spec → scaffold → test → ship → iterate.

**Q: How do I get my team to follow the Factory process?**
A: Start with the spec. Make it a team norm that nothing gets built without a written spec. A two-hour spec session catches problems that take two weeks to fix in code. Demonstrate this once and the team converts.

**Q: What's the most important thing to get right in the Factory?**
A: The test suite. A spec without tests is aspiration. A test suite is a precise, executable definition of correct behaviour. Build it early, update it always, and never ship without running it.
