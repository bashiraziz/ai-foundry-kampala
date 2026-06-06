## Week 7 — Scoping Agents for Kampala Problems

**Track:** Professional
**Week:** 7 of 12

---

### Learning objectives

By the end of this week you will be able to:
1. Apply a structured scoping framework to a Kampala business problem
2. Identify the data requirements and data availability for a proposed agent
3. Write a problem statement that narrows the solution space appropriately
4. Estimate the effort and cost for an agent build using a scope sizing framework

---

### Key concepts

**1. The Scoping Trap**

The most expensive mistake in agent projects is starting too broad. "An AI for all our customer service" is not a scope — it is a direction. You need a scope narrow enough to build in 4-8 weeks, test thoroughly, and iterate. Then expand.

Scoping rule: If you cannot describe the agent's job in one sentence, it is too broad.

Good scope: "An agent that answers student fee balance queries via WhatsApp for students at Kampala Parents School."
Too broad: "An AI for school administration."

Think of it the way a building contractor thinks about a renovation brief. "Improve the building" is not a brief. "Tile the ground-floor bathroom in 14 days using materials already on site" is a brief. Scope is about constraints, not ambition. The ambition stays — you just achieve it one specific, deliverable piece at a time.

**2. The Scoping Framework**

Five questions that define a scope:

1. **Who is the primary user?** (Not "everyone" — one persona, one context)
2. **What is the one thing they need to be able to do?** (The core use case)
3. **What data does the agent need, and does it exist?** (The data dependency check)
4. **What can go wrong, and how bad is it?** (The risk profile)
5. **What does success look like in numbers?** (The measurement)

If you cannot answer all five, you are not ready to commission a build. These five questions are not a formality. They are a stress test. A scope that collapses under these questions would have collapsed under the pressure of a real build. Better to find that out now, in a conversation, than three weeks into development when a developer has already written code against your assumptions.

**3. Data Reality Check**

The most common reason an agent project fails is that the data needed to run it doesn't exist, is inaccessible, or is in the wrong format.

Before approving a build, verify:
- Does the data exist? (Obvious but often skipped)
- Is it accessible via API or database query? (Not trapped in a spreadsheet or a person's head)
- Is it accurate enough to act on? (Outdated customer records produce wrong agent responses)
- Is it in scope of Uganda's Data Protection Act? (Processing personal data requires a legal basis)

A useful analogy: imagine you are managing a new sales agent at your Kampala shop. Before they can serve customers, you need to make sure the inventory list exists, is accurate, is somewhere they can read it, and that showing it to customers is permitted. The same logic applies to your AI agent. Data is the inventory. Without it, the agent cannot work. With poor-quality data, the agent gives wrong answers with great confidence.

**4. The Kampala Constraint**

Scoping in Kampala requires accounting for three context-specific constraints that do not appear in Western AI playbooks:

**Data quality**: Many organisations in Uganda manage data in spreadsheets with inconsistent formatting, duplicate entries, or gaps. If your agent depends on a structured database, confirm one exists before scoping. If it doesn't, the data infrastructure project has to come first.

**Connectivity**: WhatsApp works well even on low-bandwidth connections. A browser-based chat interface that requires a strong 4G signal will fail for agents serving field staff, market vendors, or peri-urban users. Scope should reflect the connectivity reality of the primary user, not the connectivity reality of the developer's office.

**WhatsApp-first**: Most Ugandan users will interact with AI agents through WhatsApp, not a web browser or a dedicated app. This affects what you can show (text and images only, no dropdowns or buttons), how long a message can be, and how authentication works. A scope that ignores WhatsApp-first design is a scope that will have to be renegotiated during the build.

**5. Effort and Cost Estimation**

Rough sizing framework for a Kampala agent project:

| Scope | Timeline | Cost range (developer fees) |
|---|---|---|
| Single-purpose, 2-3 tools, existing data | 2-4 weeks | 3M-8M UGX |
| Multi-purpose, 5-8 tools, some data prep | 6-10 weeks | 10M-25M UGX |
| Multi-agent, new integrations, compliance | 3-6 months | 40M+ UGX |

API costs (Gemini, database): typically 100,000-500,000 UGX/month for a medium-scale Kampala deployment. Not the main cost.

These figures reflect Kampala market rates for experienced developers in 2025. They will shift as the local AI developer market matures. When requesting quotes, ask developers to break down their estimate by tool (each function the agent can call), not by project phase. Tool-by-tool estimates are easier to negotiate and reduce scope creep.

---

### Kampala example

**Scoping a KCCA Permit Application Agent**

Kampala Capital City Authority processes thousands of building permit applications monthly. The current process: applicants submit paper forms, queue at the office, wait 6-8 weeks for response.

**First scoping attempt (too broad):**
"An AI for KCCA permit management"

**Properly scoped:**

Who is the primary user? A business owner in Kampala applying for their first commercial renovation permit. They are not a lawyer or architect. They are asking basic questions about which category applies to them and what they need to bring.

Core use case: Given an applicant's description of their renovation, the agent tells them which permit category applies, what documents are required, the estimated timeline, and the fee.

Data required:
- KCCA permit categories and criteria (exists, available on KCCA website)
- Required documents per category (exists in KCCA guidelines)
- Current fee schedule (exists, updated annually)
- Estimated processing times by category (needs to be obtained from KCCA operations)

Data reality check: Three of four data sources are accessible. Processing time data requires a KCCA contact. The scope can proceed if that contact is made before the build starts — it is a known gap, not a hidden one.

Kampala constraint check: Users will message via WhatsApp. The agent needs to ask only one or two questions before providing an answer. Long back-and-forth sequences break down on WhatsApp because users lose patience and drop off. The agent must be designed to give a useful answer with minimal input.

Risk profile: Low. The agent provides information only — it doesn't submit applications or process payments. Wrong information is annoying but not financially harmful. The agent should make clear it is providing guidance, not a legally binding ruling.

Success metric: 70% reduction in "what documents do I need?" calls to the KCCA helpline within 3 months.

Scope decision: Proceed. This is a realistic 3-week build.

---

### Common questions

**Q: What if the organisation doesn't have the data to run the agent?**

This is the most common blocker and must be resolved before the build starts. Options: (1) build a data collection system first, which may take weeks or months on its own; (2) find a proxy data source — for example, if your SACCO doesn't have a member loan database, perhaps the loan officer's Excel file can be cleaned and imported; (3) narrow the scope to what existing data supports. A school that has fee schedules in a document but member records only in paper ledgers can still build an agent that answers "what are the fees for Senior 3?" — it just cannot yet answer "what is my specific balance?" Scoping to what data exists is not a failure. It is how you ship something working.

**Q: Should I start with the most impactful use case or the easiest one?**

Start with the easiest one that is still meaningful. A successful small deployment builds trust, teaches your team how to work with agents, and creates the organisational capability to tackle bigger problems. "Crawl, walk, run" is the right progression. Think of how Owino Market vendors adopted mobile money: not by adopting every MoMo feature at once, but by starting with receiving payments, getting comfortable, then expanding to savings and loans. Agent adoption follows the same curve. An easy early win lowers the internal resistance to the next project.

**Q: How do I get management sign-off on an agent project?**

Present: the problem in cost and time terms, the proposed scope in one sentence, the data status (available, accessible, clean?), the timeline, the cost, and the success metric. Most managers will approve a 4-week, 5M UGX project with a clear success metric. They will not approve a 6-month, open-ended AI transformation programme. Match your ask to what you can deliver. If you want a 40M UGX multi-agent system approved, first deliver the 5M UGX single-purpose agent and let it speak for itself. Success data from a small deployment is the most effective argument for a larger one.

---

### Practice exercise

**Exercise 7.1 — Scope Document**

Choose a problem from your organisation or a Kampala sector you know well — a school, a SACCO, a logistics company, a market. Apply the five-question scoping framework to produce a one-page scope document using this structure:

1. **User persona**: Who exactly? What is their context, role, and frequency of the task? Write two or three sentences — enough to picture a specific person, not a category.
2. **Core use case**: One sentence. If you need two sentences, it is still too broad.
3. **Data audit**: List each data source the agent needs. For each, note: Does it exist? Is it accessible (API, database, or structured file)? Is it accurate and current? Is it covered by the Uganda Data Protection Act?
4. **Kampala constraint check**: Delivery channel (WhatsApp or other), connectivity profile of the user, any language considerations (Luganda, Swahili, English mix).
5. **Risk assessment**: What can go wrong? How serious is each risk? What is the mitigation?
6. **Success metric**: Specific, measurable, time-bound. Name the number you will look at in 90 days to know whether this worked.
7. **Scope decision**: Proceed / needs more information / not feasible. State the reason in one sentence.

Present this to the cohort for 5 minutes and take questions on your scoping decisions. Your peers will apply the same framework to stress-test your answers. The goal is not to defend the scope — it is to arrive at a scope that is genuinely buildable.
