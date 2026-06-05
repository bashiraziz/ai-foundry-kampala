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

**2. Anticipating Developer Questions**

Before submitting a spec, ask yourself these questions and make sure the spec answers them:
- What should the agent do when it has no relevant data?
- What should the agent do on a topic outside its scope?
- Who has authority to update the system prompt?
- Who receives escalation notifications and how?
- What is the data retention policy for conversation logs?

**3. Acceptance Criteria**

Acceptance criteria define "done." They should be:
- Observable (you can see whether they pass or fail)
- Binary (pass or fail — not "mostly good")
- Agreed before development starts

Example: "The agent correctly identifies the required permit category for 9 out of 10 test cases in the permit category test suite."

Not: "The agent performs well on permit questions."

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
A: Describe the outcome you want, not the implementation. "When a driver's weekly earnings drop more than 40% compared to the previous week, the agent should proactively mention this and ask if they'd like to see a breakdown." A developer can translate this into code; you just need to specify the behaviour.

**Q: What if the developer says my spec is not buildable?**
A: Ask why specifically. The most common reasons: the data doesn't exist, the integration is not available, or the timeline is too short. These are real constraints, not excuses. Work with the developer to scope down or find alternatives.

**Q: How do I protect my spec if I'm working with an external developer?**
A: Include it in a simple service agreement. Specify that the spec is the basis for acceptance. Add a clause that changes to the spec require written agreement from both parties. This is basic project management, not legal complexity.

---

### Practice exercise

**Exercise 8.1 — Complete Capstone Spec**

Write your complete capstone specification using the six-section format above. Target length: 3-5 pages.

Bring it to the next session for a paired review with a Developer track student. They will:
1. Check whether your tool list makes technical sense
2. Identify data requirements you may have missed
3. Estimate roughly how long it would take to build

You will review their technical spec and:
1. Check whether the tools match the business workflow
2. Verify the guardrails are appropriate for the risk level
3. Confirm the test cases are specific enough to be meaningful
