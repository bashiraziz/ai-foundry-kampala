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

**2. The Scoping Framework**

Five questions that define a scope:

1. **Who is the primary user?** (Not "everyone" — one persona, one context)
2. **What is the one thing they need to be able to do?** (The core use case)
3. **What data does the agent need, and does it exist?** (The data dependency check)
4. **What can go wrong, and how bad is it?** (The risk profile)
5. **What does success look like in numbers?** (The measurement)

If you cannot answer all five, you are not ready to commission a build.

**3. Data Reality Check**

The most common reason an agent project fails is that the data needed to run it doesn't exist, is inaccessible, or is in the wrong format.

Before approving a build, verify:
- Does the data exist? (Obvious but often skipped)
- Is it accessible via API or database query? (Not trapped in a spreadsheet or a person's head)
- Is it accurate enough to act on? (Outdated customer records produce wrong agent responses)
- Is it in scope of Uganda's Data Protection Act? (Processing personal data requires a legal basis)

**4. Effort and Cost Estimation**

Rough sizing framework for a Kampala agent project:

| Scope | Timeline | Cost range (developer fees) |
|---|---|---|
| Single-purpose, 2-3 tools, existing data | 2-4 weeks | 3M-8M UGX |
| Multi-purpose, 5-8 tools, some data prep | 6-10 weeks | 10M-25M UGX |
| Multi-agent, new integrations, compliance | 3-6 months | 40M+ UGX |

API costs (Gemini, database): typically 100,000-500,000 UGX/month for a medium-scale Kampala deployment. Not the main cost.

---

### Kampala example

**Scoping a KCCA Permit Application Agent**

Kampala Capital City Authority processes thousands of building permit applications monthly. The current process: applicants submit paper forms, queue at the office, wait 6-8 weeks for response.

**First scoping attempt (too broad)**:
"An AI for KCCA permit management"

**Properly scoped**:

Who is the primary user? A business owner in Kampala applying for their first commercial renovation permit.

Core use case: Given an applicant's description of their renovation, the agent tells them which permit category applies, what documents are required, the estimated timeline, and the fee.

Data required:
- KCCA permit categories and criteria (exists, available on KCCA website)
- Required documents per category (exists in KCCA guidelines)
- Current fee schedule (exists, updated annually)
- Estimated processing times by category (needs to be obtained from KCCA operations)

Data reality check: Three of four data sources are accessible. Processing time data requires a KCCA contact.

Risk profile: Low. The agent provides information only — it doesn't submit applications or process payments. Wrong information is annoying but not financially harmful.

Success metric: 70% reduction in "what documents do I need?" calls to the KCCA helpline within 3 months.

Scope decision: Proceed. This is a realistic 3-week build.

---

### Common questions

**Q: What if the organisation doesn't have the data to run the agent?**
A: This is the most common blocker and must be resolved before the build starts. Options: (1) build a data collection system first, (2) find a proxy data source, (3) narrow the scope to what existing data supports.

**Q: Should I start with the most impactful use case or the easiest one?**
A: Start with the easiest one that is still meaningful. A successful small deployment builds trust, teaches your team how to work with agents, and creates the organisational capability to tackle bigger problems. "Crawl, walk, run" is the right progression.

**Q: How do I get management sign-off on an agent project?**
A: Present: the problem in cost/time terms, the proposed scope (one sentence), the data status (available/accessible/clean?), the timeline, the cost, and the success metric. Most managers will approve a 4-week, 5M UGX project with a clear success metric. They won't approve a 6-month, open-ended AI transformation programme.

---

### Practice exercise

**Exercise 7.1 — Scope Document**

Choose a problem from your organisation or sector. Apply the five-question scoping framework to produce a one-page scope document:

1. User persona (who, context, frequency)
2. Core use case (one sentence)
3. Data audit (list each data requirement + status: exists/accessible/clean)
4. Risk assessment (what can go wrong, severity, mitigation)
5. Success metric (specific, measurable, time-bound)
6. Scope decision: proceed / needs more information / not feasible

Present this to the cohort for 5 minutes and take questions on your scoping decisions.
