## Week 5 — Workflow Mapping

**Track:** Professional
**Week:** 5 of 12

---

### Learning objectives

By the end of this week you will be able to:
1. Map a business workflow in enough detail for agent decomposition
2. Identify decision points, exceptions, and handoff conditions in a workflow
3. Determine which parts of a workflow are agent-appropriate and which are not
4. Draw an agent workflow diagram a developer can implement

---

### Key concepts

**1. Why Workflow Mapping Matters**

An agent can only automate what it can understand. If you hand a developer a vague description — "it handles customer complaints" — they will build a chatbot that gives generic responses. If you hand them a workflow map showing exactly what happens in each scenario, they can build an agent that does the actual work.

Workflow mapping is the bridge between "we want to automate this" and "here's exactly what to automate."

**2. Workflow Anatomy**

A business workflow has five elements:

- **Trigger**: What starts the workflow? (Customer submits complaint, payment is received, deadline is passed)
- **Steps**: The sequential actions taken
- **Decision points**: Where the path branches based on a condition (if disputed > 500,000 UGX, escalate to senior manager)
- **Actors**: Who (or what) performs each step (agent, human, automated system)
- **Outputs**: What the workflow produces (resolution email, database record, payment, notification)

Map all five before talking to a developer.

**3. Agent vs. Human Allocation**

Not every step should be automated. A good workflow map assigns each step to either:
- **Agent**: High-volume, well-defined, low-stakes, rule-based
- **Human**: Judgement-heavy, relationship-dependent, high-stakes, legally regulated
- **Hybrid**: Agent prepares, human approves

Decision principle: If a wrong outcome is easily reversible and low-cost, give it to the agent. If a wrong outcome causes financial loss, regulatory liability, or relationship damage, keep a human in the loop.

**4. Exception Mapping**

Every workflow has exceptions — things that happen differently from the normal case. Most workflow failures in automated systems come from unmapped exceptions.

For each decision point in your workflow, ask:
1. What percentage of cases take this path?
2. What happens in the 5% of edge cases that don't fit either path?
3. Is there a third path you haven't drawn yet?

For a Kampala school fees workflow: the normal path is "parent pays, system confirms, teacher is notified." The unmapped exception is "parent pays via a relative's MoMo number under a different name, payment arrives but can't be matched to the student." If you don't map this exception, the agent will either fail silently or create a false late-payment record.

---

### Kampala example

**Workflow Map: Umeme Uganda Meter Reading Agent**

Umeme (Uganda's electricity distributor) has meter readers who visit premises manually. An agent workflow:

**Trigger**: First day of each month

**Steps**:
1. Agent queries customer database for this month's scheduled reads [AGENT]
2. For each premise: retrieve last reading, generate expected range based on historical usage [AGENT]
3. Field teams submit readings via mobile app [HUMAN]
4. Agent receives reading, validates against expected range [AGENT]
   - Decision: Is reading within ±40% of expected?
   - YES → accept, calculate bill, update database [AGENT]
   - NO → flag for verification [AGENT → HUMAN]
5. Agent generates bill [AGENT]
6. Agent sends SMS/email to customer with bill amount and payment link [AGENT]
7. Exception: Reading not received by day 5 → escalate to field supervisor [AGENT triggers HUMAN]

**Outputs**:
- Updated meter reading database
- Bill generated for each premise
- Customer notification sent
- Exception report to field supervisors

**Agent-appropriate**: Steps 1, 2, 4 (validation), 5, 6, 7 trigger
**Human-required**: Step 3 (physical meter reading), step 4 verification (anomalies)

---

### Common questions

**Q: How do I get this information if the workflow is in people's heads and not written down?**
A: Shadow the work. Spend one day observing how the task is done manually. Ask the person doing it to narrate their decision-making aloud. Record it. Then build the workflow from your observations, share it back, and ask "what did I miss?"

**Q: What if the workflow is different every time and there's no standard path?**
A: That's a signal that the workflow isn't ready for automation. First standardise the process (document the preferred path, get management sign-off), then automate it. Agents amplify existing processes — they cannot standardise chaotic ones.

**Q: How granular should the steps be?**
A: Granular enough that each step has a clear input and output, and a single responsible actor. If a "step" requires 15 sub-decisions, break it down further.

---

### Practice exercise

**Exercise 5.1 — Workflow Map**

Choose a workflow from your organisation that involves regular information processing (monthly reports, customer onboarding, procurement requests, etc.). Map it completely using the five elements:

1. Draw the full workflow (text or diagram — text is fine)
2. Mark each step as Agent / Human / Hybrid
3. Identify at least 3 exception paths you didn't cover in your first pass
4. Write one sentence for each exception: "If X happens, the agent should..."
5. Identify the single decision point with the highest risk if automated incorrectly, and explain why a human must stay in the loop there
