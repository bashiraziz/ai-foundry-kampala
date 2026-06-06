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

The 10-minute constraint is not arbitrary. Real decision-makers — CFOs, board members, ministry directors — make funding decisions in short windows. If you cannot make the case for your agent in 10 minutes, you have not yet understood it well enough to govern it. Practice until the 10-minute mark feels natural, not rushed. The clock is the discipline.

**2. The Structure of a 5-Minute Pitch**

When presenting to an external audience — a ministry, an investor, a potential enterprise client — the full 10-minute capstone format may not be available. The 5-minute pitch is the version you carry with you permanently after this course.

Five minutes, five elements:

1. **The real cost of the status quo** (1 minute): What is this problem costing your sector today? Be specific about money, time, or both.
2. **The agent in one sentence** (30 seconds): "The agent answers [task] for [user] via [channel], handling [volume] queries per [period]."
3. **One live interaction** (1.5 minutes): Show the most impressive thing the agent does. Narrate it so the audience understands what they are seeing.
4. **The ROI headline** (1 minute): One number — payback period, monthly saving, or percentage deflection. Give the methodology in one sentence. Offer to share the full calculation.
5. **The ask or the next step** (1 minute): What are you inviting this audience to do? Pilot? Fund? Introduce to a decision-maker?

The 5-minute pitch is the version you deliver at a Uganda ICT Association event, a Makerere entrepreneurship panel, or a chance meeting at Garden City with someone who runs operations at a major organisation. Practice it until it is automatic.

**3. Defending Your Spec Decisions**

Expect these questions:
- "Why did you include/exclude [specific guardrail]?"
- "What happens if [specific edge case] that you didn't test?"
- "How did you arrive at that ROI figure?"
- "Would you trust this agent with [higher-stakes version of the task]?"

Prepare one-sentence answers. You do not need to have tested every edge case — you need to be able to articulate the risk and your mitigation.

A useful preparation technique: write down the 5 questions you would most dread being asked. Write one-sentence answers to each. Then write down the 5 questions you hope someone asks — the ones that let you show the strongest parts of your thinking. Know both lists. The dread questions will come. Having answered them in writing means the answer is already in your mind when you need it.

**4. Handling Questions About AI Reliability**

Some audience members will challenge the premise. Common challenges and honest responses:

"What if the AI hallucinates?"
Honest response: "The agent is constrained to its tools and a defined system prompt — it does not freely generate information. For any query outside its defined scope, it defaults to escalating to a human. In our test suite, it failed to retrieve data accurately in [X] out of 10 cases. Those failures are known and documented. The human error rate on this task is [Y] — we are comparing to that, not to perfection."

"What if it gives someone bad advice?"
Honest response: "The agent is not authorised to give advice — it retrieves data and states facts. When the situation requires judgement — such as a loan dispute or a penalty waiver request — it escalates to a human. The escalation triggers are defined in the spec and tested."

"Is our data safe?"
Honest response: "The agent operates on data held in [system], accessed via authenticated API calls. No data leaves [organisation's] infrastructure. Conversation logs are retained for [X] days under the data retention policy, consistent with Uganda's Data Protection Act. I can share the privacy section of the spec."

These responses work because they are grounded in your spec. If your spec is complete, you can answer any reliability question by pointing to a section of it. If there is a question you cannot answer by pointing to the spec, the spec has a gap — note it in your retrospective.

**5. The Professional's Contribution on Demo Day**

The most important thing you demonstrate on Demo Day is not the technology. It is that you understand:
- The real problem deeply enough to scope it correctly
- The agent's behaviour well enough to describe its failure modes
- The business case well enough to defend the numbers
- The limitations well enough to know when not to trust it

A Professional who can do these four things is ready to commission and govern AI in a real organisation. That is the credential this course creates.

**6. What Comes After Demo Day**

Three paths forward, and you should commit to one before leaving Demo Day:

**Path 1: Deploy.** Your agent is ready for a limited production deployment. You have an organisation that has agreed to pilot it. Define: which users, what volume, what monitoring, who reviews escalations, when you evaluate. A 90-day pilot with 10% of the target query volume and weekly performance reviews is a reasonable deployment plan.

**Path 2: Expand.** The capstone demonstrated a working core. You want to add tools, expand to additional user segments, or integrate with a second data source. Write a new spec. Treat it as a new project, not an informal extension of the capstone.

**Path 3: Present internally.** You are not yet in a position to deploy, but you have a working demo and a business case. Your next step is getting the business case in front of the right decision-maker. Name the organisation, the person, and the date.

**7. Continuing as an AI Champion**

Completing this course positions you to play a specific role that most Kampala organisations do not yet have: someone who understands both the business problem and the AI tool well enough to connect them without a translator.

That role is worth protecting. How to protect it:

- Stay close to the spec, not the hype. When a vendor pitches an AI solution to your organisation, you now know the questions to ask: What is the system prompt? What are the guardrails? What are the test cases? What is the escalation path?
- Build on what worked. If your capstone solved 70% of the problem, the next build solves another 20%. Compounding small wins beats one large project that stalls.
- Share what you learned. A cohort presentation, an internal lunch-and-learn, or a LinkedIn post about what you built creates accountability and builds credibility. Teaching what you know accelerates your own understanding.
- Stay connected to the cohort. The Professional and Developer track graduates from your cohort are the people who will commission and build AI for Kampala organisations over the next decade. That network is worth more than any individual project.

**8. Retrospective**

Write a retrospective covering:
1. **The problem I tried to solve**: One paragraph, no jargon.
2. **What the agent can do**: What went right.
3. **What I'd specify differently**: Three specific changes to the spec.
4. **What I learned about AI that surprised me**: One genuine insight.
5. **What I'm doing next**: Specific, committed, dated.

---

### Kampala example

**Demo Day Retrospective: Uganda Revenue Authority SME Compliance Agent**

The problem I tried to solve: URA call centre agents spend 60% of their time answering the same 7 questions about filing deadlines and penalty calculations. This leaves taxpayers who need complex help waiting. SMEs that cannot navigate the compliance process file late or not at all — not because they are evading tax, but because the process is unclear.

What the agent can do: Answer all 7 FAQ categories accurately, in English and Luganda, 24/7. Handle 168,000 queries/year that currently go to human agents. Escalate correctly for 3 categories that require human judgement. Produce an auditable log of every query and response.

What I'd specify differently:
1. I underspecified the Luganda language requirement. I should have included 3 Luganda test cases in the original spec. The developer had to guess at the expected register and vocabulary.
2. I didn't include an escalation notification spec — when the agent escalates, who gets notified and how? This should have been in Section 4.
3. My ROI calculation used average salary figures. A more accurate case would segment by role — the staff who handle FAQ calls are more junior and less expensive than my average. I overstated savings slightly.

What surprised me: The agent's biggest failure was not hallucination — it was inconsistency. The same question asked in slightly different ways sometimes got slightly different answers. The fix (few-shot examples in the system prompt) was simpler than I expected.

What I'm doing next: Present the business case to URA's Director of Taxpayer Services on June 25th. I have the introductory meeting confirmed.

---

### Common questions

**Q: What if my agent isn't working perfectly on Demo Day?**

Acknowledge it directly: "I have a known issue with [X] — it fails about 20% of the time. My plan to fix it is [Y]." Transparency is more credible than pretending it works perfectly. Every experienced decision-maker in the room knows that software has bugs. What they are assessing is whether you understand your system well enough to know where it fails and what to do about it. An honest answer about a known failure, with a clear remediation plan, demonstrates exactly the kind of governance competence this course was designed to build. A presenter who claims their agent never fails will not be believed. A presenter who says "it fails here, here is why, here is the fix" will be respected.

**Q: Do I need the developer to be at my Demo Day presentation?**

For a capstone, no — but it is useful if you want them to handle deep technical questions. Agree in advance on who answers what. A clean division of labour: you handle all questions about the business case, scope decisions, guardrails, and acceptance criteria. The developer handles questions about architecture, API integration, and implementation choices. If a question crosses the boundary, defer to the right person rather than guessing. "That is a question for [developer name] — they can speak to the implementation" is a professional answer.

**Q: Can I present a business case for an agent I didn't actually build?**

No. The capstone requires a working demo of an agent you helped specify. The business case without a working agent is just a slide deck. The point of this course is that you can take both from idea to working system. That said, if your agent is working for 8 out of 10 test cases and you can demo the 8 confidently, you have something real. Do not present a scope you did not build. Present what you built, honestly, with its limitations documented.

---

### Practice exercise

**Exercise 12.1 — Demo Prep Checklist**

Complete 24 hours before Demo Day:

- [ ] Demo script rehearsed with timing (10 minutes exactly — not 9, not 12)
- [ ] All business case figures checked and sourced
- [ ] Staging URL confirmed working
- [ ] Backup plan if live demo fails (screenshots + narration, prepared and tested)
- [ ] One-sentence answers prepared for 5 likely hard questions (write them down)
- [ ] 5-minute pitch version prepared for post-Demo networking conversations
- [ ] Retrospective written
- [ ] Next step committed (organisation, meeting, date)

Post checklist to Slack midnight before Demo Day. Share your staging URL.

The cohort and facilitator will be looking for: clarity of problem, quality of spec decisions, honesty about limitations, and a concrete next step. These are the signs of a Professional who is ready to commission real AI in a real organisation.

That is what you have become.
