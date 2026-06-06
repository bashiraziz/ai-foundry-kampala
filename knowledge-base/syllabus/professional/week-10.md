## Week 10 — Capstone Kickoff: Own the Requirements

**Track:** Professional
**Week:** 10 of 12

---

### Learning objectives

By the end of this week you will be able to:
1. Brief a developer on your capstone project in under 10 minutes
2. Run a requirements clarification session and document the outcomes
3. Set up a lightweight project tracking system for a 2-week build
4. Define the acceptance review process that will happen on Demo Day

---

### Key concepts

**1. The Kickoff Brief**

A kickoff brief is the moment you hand your spec to a developer and align on what gets built. It is not a lecture — it is a conversation. Structure it as:

- 5 minutes: you present the spec
- 5 minutes: developer asks clarification questions
- 5 minutes: you agree on priorities if scope needs trimming
- 5 minutes: you agree on the review cadence

For a 2-week build, the kickoff brief is the spec in the developer's hands on Day 1. Anything that is unclear after this meeting is a problem you will pay for in Week 11.

In a real organisation, a kickoff brief would typically include more stakeholders — the operations manager who owns the process, the IT team who owns the data, and the finance team who approved the budget. For the capstone, you are playing all of those roles. That makes the brief simpler but also means there is no one to escalate to if something is unclear. The spec is your authority. Keep it close.

**2. Accepting the Product Owner Role**

From the moment the build starts, you are the product owner. That means:

- You are the final authority on what the spec says
- You resolve ambiguities — not the developer, not the facilitator
- You approve changes — nothing is added to scope without your sign-off
- You test the output — not against your impression, but against the written spec

The product owner role is unfamiliar to most professionals who are used to commissioning services and then waiting for delivery. In an agent build, waiting is a risk. A developer who hits an ambiguous requirement at Day 5 of a 14-day build needs an answer today, not after the weekend. If you are not available or not decisive, the developer makes the decision. It may not be the decision you wanted.

Think of it the way a site supervisor thinks about a building project. The architect drew the plans, but the site supervisor is there every day to answer questions: "The plans show a window here, but there's a structural beam — what do you want?" That is the product owner's job.

**3. Requirements Clarification**

During kickoff, developers will ask questions that reveal gaps in your spec. Common gaps:

- "How should I authenticate users?" → You hadn't specified authentication because you assumed they'd figure it out. You need to specify.
- "What happens when there's no data for a query?" → You specified the happy path but not the empty-state response.
- "How precise should the timestamp be — date only or date and time?" → You wrote "date" without thinking about time zones.

Document every clarification as a spec amendment. Send it in writing. This protects both parties.

A useful habit: after every developer question you answer verbally, write the answer into the spec within the hour. If the build ends and there was a dispute, the written spec is the reference. "We agreed on WhatsApp" is not a spec amendment. "Spec amendment 3, dated [date]: when no balance data is available, the agent responds with: 'I don't have your current balance. Please visit a branch or call 0800 XXX XXX.'" is a spec amendment.

**4. Acceptance Criteria as Test Cases**

Your acceptance criteria from Week 8 are not just a definition of done — they are the test plan for Week 11. Each criterion should correspond directly to one or more of your 10 test cases. If you have an acceptance criterion with no corresponding test case, add the test case now. If you have a test case with no corresponding acceptance criterion, ask yourself whether it represents a real requirement. If it does, the acceptance criterion is missing — add it.

This discipline matters because it keeps the spec consistent end-to-end. A spec that says "the agent must never reveal another customer's data" in Section 4 but has no test case that attempts to elicit another customer's data has a gap that the developer could miss and a QA reviewer definitely will find.

**5. Lightweight Project Tracking**

For a 2-week build, you don't need Jira or Asana. A shared Google Doc or Notion page with three columns works:

```
TO DO | IN PROGRESS | DONE

Week 1:
- [ ] Database schema
- [ ] Tool 1: get_student_balance
- [ ] Tool 2: generate_payment_reference
- [ ] System prompt v1
- [ ] Basic UI

Week 2:
- [ ] Tool 3 + 4
- [ ] Guardrails implementation
- [ ] Test suite run
- [ ] Deploy to staging
- [ ] Demo prep
```

Check in briefly every 2 days. Not to micromanage — to catch blockers early.

The check-in has one purpose: to find out whether the developer is blocked on something only you can unblock. Common blockers that require product owner action: you have not yet provided the data source credentials, the MTN contact you promised for API access has not responded, the stakeholder who needs to approve a design decision has not approved it. These are your blockers, not the developer's. The check-in is how you find out before they have silently cost two days.

**6. Managing Timeline Expectations**

A 2-week build is short. Things will not go exactly as planned. Manage this by establishing the priority order at the start:

1. Core demo script functionality — must work before anything else
2. Test suite compliance — must pass before Demo Day
3. Complete tools — implement in priority order
4. UI and polish — last, and first to cut if time is short

If the build is running behind at Day 8, cut scope — do not extend the timeline. A reduced scope delivered on time teaches you more about agent development than a full scope delivered late. Demo Day is a real deadline.

---

### Kampala example

**Kickoff Brief: Kampala City Traders Association Market Intelligence Agent**

Professional presents spec:
"I'm building an agent that gives traders in Owino Market daily commodity price intelligence. Traders send a WhatsApp message with the commodity they're interested in. The agent returns today's prices at Owino, Nakasero, and St. Balikuddembe markets, plus the 7-day trend. There are four tools: get_commodity_price, get_price_trend, compare_markets, and send_whatsapp_reply."

Developer clarification questions (and spec amendments):

Q: "Who scrapes the market price data?"
Amendment: "A daily cron job will scrape prices from Uganda Commodity Exchange. I will provide the URL. If the scrape fails, the agent should say: 'I don't have today's prices yet. Try again after 8am.'"

Q: "What commodities are in scope?"
Amendment: "Top 20 commodities by volume at Owino — I'll provide the list. The agent should say 'I don't have data for that commodity' for anything not on the list."

Q: "What language do traders use?"
Amendment: "English and Luganda mixed. The agent must understand both and respond in whichever the trader used."

These three clarifications prevented three bugs before a single line of code was written. The developer now knows: what to do when today's data is not yet available, exactly which commodities are in scope, and that Luganda language support is a requirement, not a nice-to-have. Each of these, discovered during a build without a spec amendment, would have cost between half a day and two days of rework.

---

### Common questions

**Q: What if the developer starts building before the spec is fully clear?**

That is a project risk. Good developers will not start on uncertain requirements. If yours is about to, say: "Let's finish the clarification session first. Building before we agree on edge cases costs more time than clarifying now." The Kampala construction analogy applies here too. A contractor who starts pouring concrete before confirming the building line with the site owner is creating expensive problems for both parties. A developer who starts writing integration code before the data source is confirmed will write it again when the actual data source turns out to have a different structure. The 20 minutes spent on clarification at kickoff is worth far more than the hours of rework it prevents.

**Q: How detailed should the daily check-ins be?**

One message is enough: "Day 3 status: database and tools 1-2 done. Blocked on MTN API access — need your contact at MTN Uganda." If there's nothing to report, no check-in needed. The purpose is to surface blockers, not generate status reports. An over-managed developer spends time on reporting instead of building. The product owner's job is to reduce friction, not add it. If you are checking in daily and always hearing "all good," that is fine. If you go three days without a check-in and discover a blocker that has been sitting since Day 1, you have lost time you cannot recover.

**Q: What if we run out of time in Week 11?**

Apply the scope cut framework: tools required for the demo script come first, UI polish comes last. A working agent with a basic interface is better than a beautiful interface with a half-working agent. The demo script is the one sequence of interactions you will run live on Demo Day. Every feature that is not in that sequence is optional. Cut optional features to protect the core demo script. Tell the audience on Demo Day what was cut and why — that transparency demonstrates professional project management, not failure.

---

### Practice exercise

**Exercise 10.1 — Kickoff Simulation**

Pair with a Developer track student. You play the role of the Professional presenting your spec; they play the Developer asking clarification questions.

Run a 20-minute simulated kickoff:
1. You present your spec (5 minutes). Cover all six sections in order. Do not skip the business case section — developers who understand why the agent matters build it better.
2. Developer asks questions, you answer and amend (10 minutes). The developer should focus on three areas: data access and schema, edge cases and empty states, and tool behaviours for unusual inputs.
3. You write down every clarification as a formal amendment (5 minutes). Write each amendment in the format: "Spec amendment [number], [date]: [the change in one or two sentences]."

After the simulation, the Developer writes down: "If I started building this spec without the clarifications, I would have had to make these assumptions: [list]."

Those assumptions are the gaps in your original spec. Fix them before the build starts. A spec that has been through this exercise and had its gaps closed is a spec that will produce the agent you intended — not the agent someone else guessed you intended.
