## Week 5 — Multi-Agent Systems

**Track:** Developer
**Week:** 5 of 12

---

### Learning objectives

By the end of this week you will be able to:
1. Explain orchestrator/sub-agent patterns and when to use them
2. Design a multi-agent system for a complex Kampala workflow
3. Implement agent-to-agent communication using tool calls
4. Identify the coordination failure modes in multi-agent systems

---

### Key concepts

**1. Why Multiple Agents?**

A single agent with 40 tools and a 10,000-word context will become unreliable. The solution is decomposition: break the problem into specialised sub-agents, each with a narrow context and a small, focused toolset. An orchestrator agent coordinates them.

This mirrors how organisations work. The CEO (orchestrator) does not write every line of code, process every invoice, or handle every customer call. They delegate to specialists and synthesise results.

**2. Orchestrator / Sub-Agent Pattern**

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

The orchestrator calls sub-agents via tool calls — "research_agent" and "execution_agent" appear in the orchestrator's tool list just like any other tool, but they are themselves LLM-powered.

**3. Communication Patterns**

Three main patterns:

- **Sequential**: Orchestrator calls Agent A, waits for result, then calls Agent B with A's output. Simple, debuggable, slow.
- **Parallel**: Orchestrator calls Agent A and Agent B simultaneously, waits for both, synthesises. Fast, but requires results to be independent.
- **Handoff**: Agent A completes its task and passes control to Agent B directly. Used in long workflows where the orchestrator doesn't need to be in every loop.

**4. Failure Modes**

- **Cascade failure**: Sub-agent A fails, orchestrator passes bad data to B, B fails, total system collapse. Fix: validate sub-agent outputs before passing downstream.
- **Coordination deadlock**: Two agents waiting for each other. Fix: always have a timeout and a fallback.
- **Context pollution**: Sub-agent includes too much information in its response, causing the orchestrator to lose focus. Fix: sub-agents return structured summaries, not raw transcripts.
- **Responsibility gaps**: No agent owns a particular edge case. Fix: the orchestrator must have explicit rules for unhandled cases.

---

### Kampala example

**Kampala Event Management System**

A multi-agent system for a Kampala events company (concerts at Kololo Airstrip, conferences at Serena Hotel):

**Orchestrator**: Receives event brief, coordinates all sub-agents, produces final event plan.

**Venue Agent**: Searches venue database, checks availability, returns capacity and pricing for Kololo, Serena, Kampala Sheraton, Cricket Oval.

**Vendor Agent**: Manages caterers, sound companies, security firms. Knows which vendors have worked events before and their ratings.

**Budget Agent**: Receives cost inputs from other agents, checks against client budget (in UGX), flags overruns, suggests cuts.

**Permits Agent**: Checks Kampala Capital City Authority permit requirements for the event size, generates permit application checklist, knows which KCCA office handles which permit type.

**Communications Agent**: Drafts sponsor emails, vendor contracts, and attendee invitations in the appropriate format.

A human sends: "Plan a 500-person product launch at a top venue in Kampala on August 15th, budget 120M UGX."

The orchestrator runs all five sub-agents, synthesises their outputs, and produces a complete event plan in 90 seconds.

---

### Common questions

**Q: How do I decide what deserves its own sub-agent vs. just a tool?**
A: A sub-agent is justified when a task requires its own reasoning loop — multiple steps, conditional logic, and its own tools. A single deterministic lookup (get current UGX/USD rate) is a tool, not a sub-agent.

**Q: How do sub-agents communicate context to the orchestrator?**
A: They return a structured summary — typically JSON — containing the key findings, confidence level, and any important caveats. The orchestrator should not see the sub-agent's full internal reasoning; it should see a clean result.

**Q: What framework should I use for multi-agent systems?**
A: For this course we build the orchestrator manually using the ReAct loop. In production, LangGraph, CrewAI, and AutoGen are popular. Anthropic's own agent patterns (available in their documentation) are well-suited to Claude-based systems.

---

### Practice exercise

**Exercise 5.1 — Multi-Agent Architecture Design**

Design a multi-agent system for a Kampala matatu (minibus) company that wants to optimise routes. The company runs 50 matatus across 8 routes between Kampala CBD and Wakiso, Mukono, Entebbe, and Gayaza.

Draw (or describe in text) the agent hierarchy. For each agent specify:
1. Name and role
2. Context it needs (what information is in its window)
3. Tools it has access to
4. What it returns to the orchestrator

Then trace through one scenario: "Route 3 (Kampala–Mukono) has two matatus broken down. It is 7am rush hour. What should happen?"
