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

An agent can only automate what it can understand. If you hand a developer a vague description — "it handles customer complaints" — they will build a chatbot that gives generic responses. If you hand them a workflow map showing exactly what happens at each step, which conditions branch the path, where a human must intervene, and what the outputs are, they can build an agent that does the actual work. Workflow mapping is the bridge between "we want to automate this" and "here is exactly what to automate." It is also a diagnostic tool: the act of mapping a workflow almost always surfaces ambiguity, contradictions, and undocumented exceptions that would become production failures if not caught at the design stage.

*Kampala analogy: A construction contractor in Nakasero needs more than "build us an office." They need architectural drawings, electrical schematics, and materials specifications. A workflow map is the architectural drawing for your agent.*

**2. Workflow Anatomy**

A business workflow has five elements. Map all five before engaging a developer:

- **Trigger**: What starts the workflow? It must be a specific, observable event — not "when a customer needs help" but "when a customer submits the complaint form on the website" or "when a payment fails and the system generates an error code." A vague trigger produces an agent that does not know when to activate.

- **Steps**: The sequential actions taken from trigger to completion. Each step must have a clear input (what information arrives at this step), a clear action (what is done with that information), and a clear output (what leaves this step and goes to the next).

- **Decision points**: Forks in the path where the outcome of a condition determines which step comes next. Every decision point must be fully specified: "If the outstanding balance is greater than 500,000 UGX, escalate to the senior manager. If it is 500,000 UGX or below, the agent resolves directly." The threshold matters. The condition matters. Vague decision points — "if it's a big case, escalate" — produce unpredictable agent behaviour.

- **Actors**: Who or what performs each step. Assign each step to one of: Agent (fully automated), Human (requires human judgement or action), or Hybrid (agent prepares, human approves or confirms before the action executes). Every step must have a clearly assigned actor.

- **Outputs**: What the workflow produces when complete. These are concrete artifacts: a database record updated, an email sent, a notification delivered, a document generated, a payment initiated. Not "the customer is helped" — the customer receives an SMS confirmation with their case reference number within two minutes of submission.

**3. Agent vs. Human Allocation**

Not every step should be automated. A good workflow map makes deliberate choices about where the agent operates and where a human must remain in the loop. The core principle: if a wrong outcome is easily reversible and low-cost, the agent can own it. If a wrong outcome causes financial loss, regulatory liability, reputational damage, or relationship harm, a human must remain in the loop — either as the decision-maker or as the approver of the agent's recommendation.

Practical allocation guide:
- **Give to the agent**: High-volume, well-defined, rule-based steps where the correct response is deterministic given the available data. Document retrieval, balance lookups, status notifications, standard form generation, eligibility pre-checks.
- **Keep with a human**: Steps requiring political judgement, relationship sensitivity, legal interpretation, or accountability that cannot be delegated. Loan approval above threshold, disciplinary actions, contract negotiations, anything requiring a signature.
- **Use hybrid**: Steps where the agent's speed and consistency add value but the stakes require human sign-off. Agent generates a draft recommendation; human reviews and approves before it executes.

*Kampala analogy: At a Kampala supermarket like Carrefour at Garden City, the checkout system (agent) handles scanning, totalling, and payment processing automatically. A human supervisor handles price disputes, damaged goods, and override requests. The hybrid is at customer service: the agent logs the complaint and prepares the resolution options; a customer service representative confirms which option to apply.*

**4. Exception Mapping**

Every workflow has exceptions — situations that do not follow the documented normal path. Most automated system failures come not from the normal path being wrong, but from unmapped exceptions. When an exception occurs and the agent has no instruction for it, it will either invent a response (hallucination risk), fail silently, or produce an error that confuses the user.

For each decision point in your workflow, ask three questions:
1. What percentage of real cases take each path? (If you do not know, observe the workflow for one week and count.)
2. What happens in the cases that do not fit either documented path?
3. Is there a third or fourth path you have not drawn yet?

For a school fees workflow: the normal path is "parent pays, system confirms, accounts record updates, teacher is notified." The unmapped exception is "parent pays via a relative's MTN MoMo number registered under a different name — payment arrives but cannot be matched to the student's account." If you do not map this exception, the agent will either mark the student as unpaid (causing a false late-payment consequence) or flag the payment as unidentified and take no action. Neither is acceptable. The exception path must specify exactly what the agent does — and who it notifies.

**5. Handoff Points**

A handoff point is where responsibility transfers from agent to human or from one system to another. Handoff points must be explicitly specified because they are the most common source of cases "falling through the cracks." For each handoff in your workflow, document: what information must be transferred (the agent must not hand over a case without the full context assembled), what the human must do with it, what the time expectation is (the agent escalates on day five if no reading received — the supervisor has until end of business day five to respond), and what happens if the human does not act within the expected time.

---

### Kampala example

**Workflow Map: Umeme Uganda Meter Reading Agent**

Umeme, Uganda's electricity distributor, has meter readers who visit customer premises manually each month. An agent workflow for billing automation:

**Trigger**: First day of each calendar month at 06:00 EAT

**Steps and Actors**:
1. Agent queries customer database for all premises scheduled for readings this month [AGENT]
2. For each premise: retrieve the last validated reading and calculate the expected range based on twelve months of historical usage [AGENT]
3. Field teams visit premises and submit readings via the Umeme mobile app [HUMAN]
4. Agent receives each submitted reading and validates it against the expected range [AGENT]
   - Decision point: Is the reading within ±40% of the expected value?
   - YES → accept reading, calculate bill, update database, proceed to Step 5 [AGENT]
   - NO → flag reading for human verification, notify field supervisor with the reading, expected range, and GPS coordinates of the premise [AGENT → HUMAN]
5. Agent generates bill for each accepted reading [AGENT]
6. Agent sends SMS and email to customer with bill amount, due date, and payment link [AGENT]
7. Exception: If no reading received for a premise by day 5 of the month → agent sends automated reminder to field supervisor; if no reading by day 8 → escalate to district manager [AGENT triggers HUMAN]

**Outputs**:
- Updated meter reading record in the database for each premise
- Bill generated and stored for each completed reading
- Customer notification delivered within one hour of bill generation
- Exception report to field supervisors for flagged or missing readings

**Agent-appropriate**: Steps 1, 2, 4 (validation and accept/flag decision), 5, 6, and the Step 7 escalation trigger
**Human-required**: Step 3 (physical meter reading cannot be automated), Step 4 human verification for anomalous readings

**Unmapped exception (found during review)**: A customer has recently installed solar panels and their consumption has dropped 70% from the historical baseline. Their reading is outside the ±40% range and gets flagged every month. Fix: add a customer attribute `solar_customer: TRUE` that overrides the ±40% threshold for these accounts and applies a wider ±80% range.

---

### Common questions

**Q: How do I get this information if the workflow exists only in people's heads and is not written down?**

Shadow the work. Spend one full day observing how the task is performed manually. Ask the person doing it to narrate their decision-making aloud as they work — "I'm checking this because...", "I escalate when I see...", "if this field is blank I always...". Record it. Then build the workflow from your observations, write it up, and share it back with the same person and their manager: "What did I miss? What happens that I didn't document?" Run this review cycle at least twice before handing the workflow to a developer. The gaps found in the second review are almost always the exception paths that would have caused production failures.

**Q: What if the workflow is different every time and there is no standard path?**

That is a signal that the workflow is not ready for automation — and that automating it now will produce an unpredictable agent that handles some cases correctly and others badly with no discernible pattern. The right sequence is: first standardise the process (document the preferred path, resolve the internal disagreements about how it should work, get management sign-off on a single version), then automate it. An agent amplifies an existing process — it cannot standardise a chaotic one. Attempting to automate a non-standard process produces a system that encodes the chaos rather than eliminating it.

**Q: How granular should the steps be in my workflow map?**

Granular enough that each step has a single, clearly defined input, a single action, and a single output — and a single actor responsible for it. If a "step" in your map requires fifteen sub-decisions and involves two different people and three different systems, break it down further. The practical test: could you hand one specific step to a new employee with no context and have them complete it correctly? If yes, the step is well-defined. If they would need to ask questions first, break it down further. Steps that require judgement from the actor (not just information) are candidates for human rather than agent allocation.

---

### Practice exercise

**Exercise 5.1 — Workflow Map**

Choose a workflow from your organisation that involves regular information processing: monthly reports, customer onboarding, procurement requests, loan pre-qualification, student registration, payroll verification, or any similar repeating administrative process.

Map it completely using the five elements. Text is completely acceptable — you do not need drawing software.

**Step 1 — Full workflow text**: Write out every step from trigger to all possible outputs. Use the format: "Step N [AGENT/HUMAN/HYBRID]: Input → Action → Output."

**Step 2 — Actor assignment**: Go through every step and mark it Agent, Human, or Hybrid. For every Human step, write one sentence explaining why a human is required rather than an agent. For every Hybrid step, define precisely what the agent prepares and what the human must review or approve.

**Step 3 — Exception hunting**: Identify at least three exception paths not covered in your first draft. The best method: ask yourself "what is the strangest real thing that has ever happened in this workflow?" for each decision point. Each exception you find requires one sentence: "If X happens, the agent should Y and notify Z."

**Step 4 — Handoff specification**: Identify every point where the agent hands off to a human. For each handoff, write: what information must be transferred, what must the human do with it, and what is the time expectation before escalation.

**Step 5 — Highest-risk decision point**: Identify the single decision point in your workflow where an automated wrong decision would cause the most harm. Write three sentences: what the decision is, what the worst-case outcome of an incorrect automated decision is, and why a human must remain in the loop at this point even when the agent is operating correctly for 95% of cases.

Bring your completed workflow map to Week 6. The Developer track students will review it and identify implementation questions — this is your first cross-track collaboration.
