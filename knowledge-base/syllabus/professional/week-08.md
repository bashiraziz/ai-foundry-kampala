## Week 8 — Writing the Capstone Spec

**Track:** Professional
**Week:** 8 of 12

---

### Learning objectives

By the end of this week you will be able to:
1. Write a complete capstone specification using everything from Weeks 1-7
2. Anticipate developer questions and answer them in the spec
3. Define acceptance criteria that can be tested objectively
4. Pair with a Developer track student to review each other's specs

---

### Key concepts

**1. What Goes in a Complete Spec**

A complete spec for a Professional track capstone has six sections:

**Section 1: Problem and Scope**
- The problem statement (one paragraph)
- The scoped use case (one sentence)
- Users and context

**Section 2: Agent Design**
- The system prompt (complete, using five-section format from Week 3)
- Workflow map (from Week 5)
- Tools list with descriptions

**Section 3: Data**
- Data sources and their status
- Schema sketch (what fields the agent needs to read/write)
- Any data privacy considerations (Uganda Data Protection Act)

**Section 4: Guardrails and Escalation**
- At least 3 guardrails (what the agent must not do)
- Escalation triggers (when to involve a human)
- Fail-safe default

**Section 5: Test Cases**
- 10 test cases (from Week 4)
- Acceptance criteria: the agent passes production review when it scores 90%+ on these test cases

**Section 6: Business Case**
- Current state cost (time/money/staff)
- Projected impact (what the Digital FTE does differently)
- Success metric (measurable, time-bound)
- Cost estimate (development + ongoing API costs)

A spec that is missing any of these six sections is not a complete spec. Think of it the way a construction architect thinks about a building plan. You would not hand a builder a plan that includes the floor layout but skips the electrical schematic and the load calculations. The builder would have to make it up. What they make up may not be what you wanted. The spec exists precisely to close that gap.

**2. Anticipating Developer Questions**

Before submitting a spec, ask yourself these questions and make sure the spec answers them:
- What should the agent do when it has no relevant data?
- What should the agent do on a topic outside its scope?
- Who has authority to update the system prompt?
- Who receives escalation notifications and how?
- What is the data retention policy for conversation logs?

Walk through your spec imagining you are a developer who has never met you. Read it the way they will read it — looking for things you assumed but did not say. Every assumption you do not write down becomes a decision the developer makes for you. Some of those decisions will be right. Some will not. The ones that are not will appear at the worst possible moment: during the acceptance review in Week 11.

**3. Acceptance Criteria**

Acceptance criteria define "done." They should be:
- Observable (you can see whether they pass or fail)
- Binary (pass or fail — not "mostly good")
- Agreed before development starts

Example: "The agent correctly identifies the required permit category for 9 out of 10 test cases in the permit category test suite."

Not: "The agent performs well on permit questions."

Vague acceptance criteria are the single most common source of conflict between a professional client and a developer. If your spec says "the agent should respond helpfully," every response is arguably helpful and the developer can never be proven wrong. If your spec says "the agent must return the membership tier, current balance, and next repayment date for every loan status query," then a response that omits the next repayment date is objectively a failure. Specificity protects both parties.

**4. From Workflow Map to Spec**

Your workflow map from Week 5 showed the sequence of steps a user goes through and the decisions the agent makes at each point. Translating that map into a spec means:

- Every decision diamond in the map becomes a rule in the system prompt
- Every box labeled "agent retrieves X" becomes a tool in Section 2
- Every box labeled "agent cannot proceed" becomes a guardrail in Section 4
- Every branch labeled "unusual case" or "exception" becomes a test case in Section 5

If your workflow map has a step with no corresponding spec section, the spec is incomplete. A completed workflow map should generate your spec almost mechanically. The thinking happens in the map; the spec captures and formalises it.

**5. Getting Developer Sign-Off**

The spec review with a Developer track student is not a formality. It serves a specific purpose: a developer reads your spec and tells you what they would have to assume or invent in order to build it. Every assumption they name is a gap you need to close before the build starts.

At the end of the review, get written confirmation on three points:
1. The tools list is technically feasible given the data sources described
2. The scope can be built within the capstone timeline
3. The acceptance criteria are testable as written

This is not a contract. It is alignment. But alignment documented in writing is the only alignment that survives the pressure of a 2-week build.

---

### Kampala example

**Capstone Spec: SafeBoda Driver Earnings Inquiry Agent**

Problem: SafeBoda drivers frequently call the support line to ask about their earnings, pending payouts, and bonus status. The support team handles 300+ such calls per week.

Scope: An agent that answers driver earnings queries via WhatsApp, accessing the driver's account data directly.

System prompt excerpt:
```
ROLE: You are the SafeBoda earnings assistant. You help SafeBoda drivers in Uganda 
understand their earnings, pending payouts, and weekly bonuses.

RULES:
1. Only discuss earnings for the authenticated driver. Never reveal another driver's data.
2. Payout amounts are always in UGX with comma separators.
3. If a driver asks about a disputed deduction, acknowledge it and say: "I've flagged 
   this for review by the payments team within 48 hours."
4. Never promise a payout date that is not in the system.
```

Tools:
- `get_driver_earnings(driver_id, period)`: weekly/monthly earnings breakdown
- `get_pending_payout(driver_id)`: next payout amount and expected date
- `get_bonus_status(driver_id, week)`: current progress toward weekly bonus targets
- `flag_dispute(driver_id, description)`: creates a support ticket

Guardrails:
1. Never process refunds — inform driver to contact support
2. Never disclose other drivers' data
3. Escalate any dispute over 500,000 UGX to human support

Acceptance criteria:
- Earns 9/10 on earnings query test suite
- Zero incidents of wrong driver data in 50 test runs
- Average response time under 4 seconds

Business case:
- Current: 3 support staff × 300 calls/week × 5 minutes each = 25 staff-hours/week
- Projected: Agent handles 85% of earnings queries, staff focus on complex disputes
- Savings: ~20 staff-hours/week = equivalent to 1 FTE, savings of ~1.2M UGX/month

---

### Common questions

**Q: How do I handle a spec requirement I don't know how to specify technically?**

Describe the outcome you want, not the implementation. "When a driver's weekly earnings drop more than 40% compared to the previous week, the agent should proactively mention this and ask if they'd like to see a breakdown." A developer can translate this into code; you just need to specify the behaviour. This is the same way you would describe a new service to a KCCA office: you tell them what outcome you need for the customer, not how to restructure their internal filing system. The technical translation is the developer's professional responsibility. Your responsibility is to be precise about the outcome.

**Q: What if the developer says my spec is not buildable?**

Ask why specifically. The most common reasons: the data doesn't exist, the integration is not available, or the timeline is too short. These are real constraints, not excuses. Work with the developer to scope down or find alternatives. For example, if the developer says the MTN MoMo API integration you specified is not available within the capstone timeline, ask: "What can we use instead that demonstrates the same workflow?" A mock data source that simulates the API may be sufficient for the Demo Day demonstration, with a note in the spec that the real integration follows in production. Capturing that distinction in writing keeps expectations honest.

**Q: How do I protect my spec if I'm working with an external developer?**

Include it in a simple service agreement. Specify that the spec is the basis for acceptance. Add a clause that changes to the spec require written agreement from both parties. This is basic project management, not legal complexity. Think of how Kampala construction contracts work: the bills of quantities are attached to the contract, and any change to the scope requires a variation order signed by both parties. The variation order concept directly applies here. A WhatsApp message saying "can you also add X?" is not a spec amendment. A document both parties sign saying "we are adding X, the timeline extends by 3 days, the cost increases by 500,000 UGX" is a spec amendment.

---

### Practice exercise

**Exercise 8.1 — Complete Capstone Spec**

Write your complete capstone specification using the six-section format above. Target length: 3-5 pages. Write it for a reader who has not been in this course and does not know your sector. That reader should be able to pick it up, understand the problem, understand what the agent does and does not do, and know exactly how they would test whether the agent is working correctly.

Before you submit it for peer review, do one self-check pass using this checklist:

- Section 1: Can I state the scope in exactly one sentence?
- Section 2: Does every step in my workflow map appear somewhere in the system prompt, tools list, or guardrails?
- Section 3: Have I confirmed that every data source listed is accessible, not just assumed to exist?
- Section 4: Have I named at least 3 things the agent must never do, and specified what it should do instead?
- Section 5: Are all 10 test cases specific enough that a stranger could run them and know whether the agent passed?
- Section 6: Is the success metric a real number I can look up in 90 days?

Bring the spec to the next session for a paired review with a Developer track student. They will:
1. Check whether your tool list makes technical sense
2. Identify data requirements you may have missed
3. Estimate roughly how long it would take to build

You will review their technical spec and:
1. Check whether the tools match the business workflow
2. Verify the guardrails are appropriate for the risk level
3. Confirm the test cases are specific enough to be meaningful

The review is not about finding fault. It is about finding gaps before they cost time and money. A spec that survives a peer review is a spec that is ready to become a real agent.
