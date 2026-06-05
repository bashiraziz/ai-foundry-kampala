## Week 12 — Demo Day: Presenting the Business Case

**Track:** Professional
**Week:** 12 of 12

---

### Learning objectives

By the end of this week you will have:
1. Delivered a 10-minute Demo Day presentation covering both the agent and the business case
2. Answered questions from the cohort and facilitator about your spec decisions
3. Written a retrospective on what you learned
4. Committed to one next step: deploy, expand, or present internally

---

### Key concepts

**1. Demo Day Format for Professional Track**

Professional track Demo Day is different from Developer track. You own the business narrative; the developer (if you paired with one) owns the technical demonstration.

Your 10 minutes:

1. **Problem (2 minutes)**: Who has this problem in Kampala? What does it cost them today? Make it real — name organisations, quote figures.

2. **Solution demo (3 minutes)**: Live walkthrough of the agent doing its job. Walk through your demo script. Narrate what the agent is doing and why it matters.

3. **Business case (3 minutes)**: Present your one-page business case. Current cost, Digital FTE cost, ROI, payback period. Defend your assumptions — the best questions will be about these.

4. **Lessons learned (1 minute)**: What surprised you? What would you spec differently?

5. **Next step (1 minute)**: What happens on Monday? Specific, committed action.

**2. Defending Your Spec Decisions**

Expect these questions:
- "Why did you include/exclude [specific guardrail]?"
- "What happens if [specific edge case] that you didn't test?"
- "How did you arrive at that ROI figure?"
- "Would you trust this agent with [higher-stakes version of the task]?"

Prepare one-sentence answers. You don't need to have tested every edge case — you need to be able to articulate the risk and your mitigation.

**3. The Professional's Contribution on Demo Day**

The most important thing you demonstrate on Demo Day is not the technology. It is that you understand:
- The real problem deeply enough to scope it correctly
- The agent's behaviour well enough to describe its failure modes
- The business case well enough to defend the numbers
- The limitations well enough to know when not to trust it

A Professional who can do these four things is ready to commission and govern AI in a real organisation. That is the credential this course creates.

**4. Retrospective**

Write a retrospective covering:
1. **The problem I tried to solve**: One paragraph, no jargon.
2. **What the agent can do**: What went right.
3. **What I'd specify differently**: Three specific changes to the spec.
4. **What I learned about AI that surprised me**: One genuine insight.
5. **What I'm doing next**: Specific, committed, dated.

---

### Kampala example

**Demo Day Retrospective: Uganda Revenue Authority SME Compliance Agent**

The problem I tried to solve: URA call centre agents spend 60% of their time answering the same 7 questions about filing deadlines and penalty calculations. This leaves taxpayers who need complex help waiting.

What the agent can do: Answer all 7 FAQ categories accurately, in English and Luganda, 24/7. Handle 168,000 queries/year that currently go to human agents. Escalate correctly for 3 categories that require human judgement.

What I'd specify differently:
1. I underspecified the Luganda language requirement. I should have included 3 Luganda test cases in the original spec. The developer had to guess at the expected register and vocabulary.
2. I didn't include an escalation notification spec — when the agent escalates, who gets notified and how? This should have been in Section 4.
3. My ROI calculation used average salary figures. A more accurate case would segment by role — the staff who handle FAQ calls are more junior and less expensive than my average. I overstated savings slightly.

What surprised me: The agent's biggest failure was not hallucination — it was inconsistency. The same question asked in slightly different ways sometimes got slightly different answers. The fix (few-shot examples in the system prompt) was simpler than I expected.

What I'm doing next: Present the business case to URA's Director of Taxpayer Services on June 25th. I have the introductory meeting confirmed.

---

### Common questions

**Q: What if my agent isn't working perfectly on Demo Day?**
A: Acknowledge it directly: "I have a known issue with [X] — it fails about 20% of the time. My plan to fix it is [Y]." Transparency is more credible than pretending it works perfectly.

**Q: Do I need the developer to be at my Demo Day presentation?**
A: For a capstone, no — but it is useful if you want them to handle deep technical questions. Agree in advance on who answers what.

**Q: Can I present a business case for an agent I didn't actually build?**
A: No. The capstone requires a working demo of an agent you helped specify. The business case without a working agent is just a slide deck. The point of this course is that you can take both from idea to working system.

---

### Practice exercise

**Exercise 12.1 — Demo Prep Checklist**

Complete 24 hours before Demo Day:

- [ ] Demo script rehearsed with timing (10 minutes exactly — not 9, not 12)
- [ ] All business case figures checked and sourced
- [ ] Staging URL confirmed working
- [ ] Backup plan if live demo fails (screenshots + narration)
- [ ] One-sentence answers prepared for 5 likely hard questions
- [ ] Retrospective written
- [ ] Next step committed (organisation, meeting, date)

Post checklist to Slack midnight before Demo Day. Share your staging URL.

The cohort and facilitator will be looking for: clarity of problem, quality of spec decisions, honesty about limitations, and a concrete next step. These are the signs of a Professional who is ready to commission real AI in a real organisation.
