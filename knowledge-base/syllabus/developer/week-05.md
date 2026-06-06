## Week 5 — Multi-Agent Systems

**Track:** Developer
**Week:** 5 of 12

---

### Learning objectives

By the end of this week you will be able to:
1. Explain orchestrator/sub-agent patterns and when to use them
2. Design a multi-agent system for a complex Kampala workflow
3. Implement agent-to-agent communication using tool calls
4. Choose between sequential, parallel, and handoff communication patterns
5. Identify and mitigate the coordination failure modes in multi-agent systems

---

### Key concepts

**1. Why Multiple Agents?**

A single agent with 40 tools and a 10,000-word context will become unreliable. The model loses focus, makes wrong tool selections, and produces inconsistent results as its context grows more complex. The solution is decomposition: break the problem into specialised sub-agents, each with a narrow context and a small, focused toolset. An orchestrator agent coordinates them, receives their outputs, and synthesises a final result. This is not a workaround — it is the correct architecture for complex workflows. Decomposition improves reliability because each agent is operating within a domain it can handle confidently. It improves debuggability because when something goes wrong, you can trace exactly which agent produced the bad output. It improves maintainability because you can update one sub-agent's logic without touching the others.

*Kampala analogy:* This mirrors how organisations work. The managing director of a Kampala logistics company does not personally check every vehicle's fuel level, call every customer, reconcile every invoice, and update the route map. They delegate to specialists — operations, customer service, accounts, logistics — and synthesise the outputs into business decisions. The orchestrator agent is the MD. The sub-agents are the department heads.

**2. Orchestrator / Sub-Agent Pattern**

The orchestrator receives the high-level goal from the user or triggering system. It breaks the goal into sub-tasks. It calls sub-agents as tools — from the orchestrator's perspective, a sub-agent is just another tool that happens to be powered by an LLM with its own reasoning loop. The orchestrator waits for sub-agent results, synthesises them, and produces the final output.

```
Orchestrator Agent
├── receives the high-level goal
├── breaks it into sub-tasks
├── calls sub-agents as tools
├── synthesises results
└── returns final output to user

Sub-Agent: Research
├── narrow context: knowledge base only
└── tools: search, fetch, summarise

Sub-Agent: Execution
├── narrow context: current task state
└── tools: database write, API call, message send
```

Sub-agents should return structured summaries — JSON objects with the key findings, a confidence indicator, and any important caveats. The orchestrator should never see the sub-agent's full internal reasoning transcript — that would pollute the orchestrator's context with irrelevant detail and eventually cause the same scaling problem the multi-agent architecture was designed to solve.

**3. Communication Patterns**

Three main patterns govern how agents exchange information, each with different tradeoffs.

**Sequential** communication: the orchestrator calls Agent A, waits for the result, then calls Agent B with A's output included. Each step builds on the previous one. This pattern is simple to implement, easy to debug (you can read the transcript step by step), and appropriate when each step genuinely depends on the previous step's output. The cost is latency — steps run one at a time, so total time is the sum of all step durations.

**Parallel** communication: the orchestrator calls Agent A and Agent B simultaneously, waits for both results, then synthesises. Both agents work at the same time. This pattern requires that the two tasks be genuinely independent — Agent B cannot need Agent A's output to do its work. The benefit is speed: total time is approximately the duration of the slowest agent, not the sum. Use parallel patterns when gathering information from multiple independent sources simultaneously — checking inventory, checking pricing, and checking delivery availability all at once rather than sequentially.

**Handoff** communication: Agent A completes its portion of a task and passes control directly to Agent B, without the orchestrator being involved in every step. Used in long workflows where the orchestrator would otherwise just relay messages. A customer onboarding workflow might hand off from an identity verification agent to a risk scoring agent to an account setup agent — the orchestrator defined the plan, but each agent passes the baton directly to the next.

**4. Agent Guardrails**

Multi-agent systems need explicit guardrails at each layer — not just at the user-facing edge. An orchestrator guardrail might prevent it from spending more than a certain budget across sub-agent calls in a single session. A sub-agent guardrail might prevent the execution agent from sending more than 50 SMS messages in a single run without a human confirmation checkpoint. Guardrails enforce the 10-80-10 rule at the system level: the final 10% — the consequential decisions — always involve human review before irreversible action. In a multi-agent system where the user is several layers away from the agent taking the action, it is easy for consequential decisions to slip through without review. Guardrails prevent this.

**5. Routing Logic**

Routing is the logic that decides which sub-agent handles a given task or input. In simple systems the orchestrator routes based on explicit rules in its system prompt: "if the task involves money, call the payments agent; if it involves customer data, call the CRM agent." In more complex systems, routing is itself a specialised task handled by a lightweight router agent or classifier that reads the input and returns a routing decision in structured format. Routing logic must handle the case where no sub-agent is appropriate — an explicit "cannot handle" path that escalates to a human rather than forcing the input into the wrong sub-agent.

*Kampala analogy:* A receptionist at Mulago Hospital routes patients to the correct department without knowing how to treat them. A walk-in with a broken leg goes to orthopaedics; a walk-in with chest pain goes to emergency. The routing decision is critical, fast, and does not require the router to be a specialist in the destination department.

**6. Failure Modes in Multi-Agent Systems**

Four failure modes are specific to multi-agent architectures.

**Cascade failure**: Sub-agent A fails and returns an error. The orchestrator passes that error as data to sub-agent B, which now produces invalid output. Sub-agent C receives B's invalid output and fails catastrophically. The entire system collapses from one point failure because each layer did not validate the previous layer's output. Prevention: validate every sub-agent output before passing it downstream. Define what "valid" looks like for each sub-agent's response in your spec.

**Coordination deadlock**: Two agents are each waiting for the other to act first. This is rare in well-designed systems but can occur in handoff patterns with circular dependencies. Prevention: always have a maximum wait time (timeout) on any handoff, and a fallback path when the timeout fires.

**Context pollution**: A sub-agent includes its entire internal reasoning in the response it returns to the orchestrator. The orchestrator's context fills with irrelevant detail from sub-agent transcripts, causing the orchestrator to lose focus on the original goal. Prevention: sub-agents must return structured summaries, not raw transcripts. Define the return schema for every sub-agent explicitly.

**Responsibility gaps**: An input falls in the space between two sub-agents — neither owns it because neither's system prompt covers it, and the orchestrator has no rule for the case. Prevention: the orchestrator must have an explicit "none of the above" rule that routes unhandled cases to a human rather than silently dropping them.

---

### Kampala example

**Kampala Event Management System**

A multi-agent system for a Kampala events company managing concerts at Kololo Airstrip and conferences at Serena Hotel demonstrates all five concepts in one coherent system.

**Orchestrator**: Receives an event brief from the client, breaks it into five parallel tasks, calls all five sub-agents simultaneously (parallel pattern), synthesises results, produces a complete event plan document, and flags any budget overruns for human review before presenting to the client.

**Venue Agent**: Searches a venue database, checks availability on the requested date, returns capacity, pricing, and technical specifications for Kololo Airstrip, Serena Hotel, Kampala Sheraton, and the Cricket Oval. Returns a structured JSON summary of the top two options.

**Vendor Agent**: Manages a database of caterers, sound companies, security firms, and AV equipment suppliers. Knows which vendors have worked events before, their ratings, and their price ranges. Returns vendor recommendations with quotes in UGX.

**Budget Agent**: Receives cost inputs from the venue and vendor agents (fed by the orchestrator), checks against the client's stated budget in UGX, calculates the total, flags overruns, and suggests which items to cut or scale down to meet budget. This agent runs sequentially after the venue and vendor agents complete.

**Permits Agent**: Checks Kampala Capital City Authority permit requirements for the event size and type, generates a permit application checklist, and identifies which KCCA office handles each permit type. Returns a timeline of permit deadlines relative to the event date.

**Communications Agent**: Drafts sponsor outreach emails, vendor engagement letters, and attendee save-the-date notices in appropriate professional formats. Runs in parallel with the permits agent once venue and vendor selections are confirmed.

A human sends: "Plan a 500-person product launch at a top Kampala venue on August 15th, budget 120M UGX."

The orchestrator runs the venue and vendor agents in parallel (independent), feeds their outputs to the budget agent (sequential dependency), runs the permits and communications agents in parallel (independent of each other but dependent on venue selection), synthesises all outputs, and produces a complete event plan — flagged for human review of the budget summary before sending to the client.

---

### Common questions

**Q: How do I decide what deserves its own sub-agent vs. just a tool?**

A sub-agent is justified when a task requires its own reasoning loop — multiple steps, conditional logic, and its own tools to call. A single deterministic lookup (get current UGX/USD rate from the Bank of Uganda API) is a tool, not a sub-agent. A task that involves reading three documents, comparing them against a policy, and making a recommendation based on the comparison is a sub-agent task — it needs its own context, its own reasoning, and probably its own tools. The practical test: if you can write the logic as a deterministic function that takes inputs and returns an output with no LLM reasoning, use a tool. If you need an LLM to figure out what to do with the inputs, use a sub-agent.

**Q: How do sub-agents communicate context to the orchestrator?**

Sub-agents return a structured summary — typically a JSON object — containing the key findings, a confidence level if appropriate, any important caveats or assumptions, and a status field indicating success, partial success, or failure. The orchestrator should not see the sub-agent's full internal reasoning transcript or tool call history — that belongs in the sub-agent's episodic log, not in the orchestrator's context. Design the return schema for every sub-agent explicitly before you write a single line of code. The schema is part of the spec.

**Q: What framework should I use for multi-agent systems?**

For this programme we build the orchestrator manually using the ReAct loop, which means you understand exactly what is happening at every step. In production, several frameworks are worth knowing. LangGraph (from LangChain) provides a graph-based execution model well-suited to complex multi-step workflows. CrewAI provides a higher-level abstraction around agent roles and crew coordination. Anthropic's own agent patterns documentation describes patterns well-suited to Claude-based systems. The framework choice matters less than the architecture: whichever framework you use, the orchestrator/sub-agent separation, the structured return schemas, and the cascade failure prevention logic must be explicitly designed. Frameworks do not solve architecture problems — they implement them.

**Q: How do I test a multi-agent system before deploying it?**

Test each sub-agent in isolation first — build a test harness that sends it representative inputs and validates its structured outputs against the schema. Then test the orchestrator with mocked sub-agent responses — replace the real sub-agents with functions that return pre-defined responses, and verify the orchestrator routes, synthesises, and escalates correctly. Only then run end-to-end integration tests with all components live. This layered approach makes failures much easier to trace. When the end-to-end test fails, you already know each sub-agent works in isolation, so the failure is in the integration layer — the routing logic, the output synthesis, or the cascade validation.

---

### Practice exercise

**Exercise 5.1 — Multi-Agent Architecture Design**

Design a multi-agent system for a Kampala matatu (minibus taxi) company that wants to optimise its route operations. The company runs 50 matatus across 8 routes: Kampala CBD to Wakiso, Mukono, Entebbe, Gayaza, Ntinda, Bwaise, Nansana, and Kireka. Routes run from 5:30am to 10pm daily.

Describe the agent hierarchy in text or as a diagram. For each agent specify:
1. Its name and its specific role in the system
2. The context it needs — what information must be in its window to do its job
3. The tools it has access to — name and purpose of each
4. What it returns to the orchestrator — define the return schema
5. Whether it runs sequentially or in parallel with other agents

Then trace through this scenario in detail: "Route 3 (Kampala CBD to Mukono) has two matatus broken down at the same time. It is 7:15am on a Monday — peak morning rush hour. 40 passengers are waiting at Mukono stage. What should happen?"

Write out each agent's action in the correct order, including what the orchestrator decides, what data flows between agents, and what the final output to the human operations manager looks like.
