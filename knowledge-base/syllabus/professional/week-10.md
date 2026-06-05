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

**2. Requirements Clarification**

During kickoff, developers will ask questions that reveal gaps in your spec. Common gaps:

- "How should I authenticate users?" → You hadn't specified authentication because you assumed they'd figure it out. You need to specify.
- "What happens when there's no data for a query?" → You specified the happy path but not the empty-state response.
- "How precise should the timestamp be — date only or date and time?" → You wrote "date" without thinking about time zones.

Document every clarification as a spec amendment. Send it in writing. This protects both parties.

**3. Lightweight Project Tracking**

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

**4. Acceptance Review Criteria**

Define before the build starts how you will review the final product:

1. Run your 10-test test suite. Agent must score 9/10 or better.
2. Live demo of the primary use case — agent completes it without manual intervention.
3. Developer walks through: system prompt, tools, error handling.
4. Facilitator asks 3 questions you didn't rehearse.
5. Final confirmation: does it solve the problem you specified?

If the agent fails acceptance review, you have one iteration cycle before Demo Day. Scope of iteration is limited to the failing tests only — no new features.

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

These three clarifications prevented three bugs before a single line of code was written.

---

### Common questions

**Q: What if the developer starts building before the spec is fully clear?**
A: That is a project risk. Good developers won't start on uncertain requirements. If yours is about to, say: "Let's finish the clarification session first. Building before we agree on edge cases costs more time than clarifying now."

**Q: How detailed should the daily check-ins be?**
A: One message is enough: "Day 3 status: database and tools 1-2 done. Blocked on MTN API access — need your contact at MTN Uganda." If there's nothing to report, no check-in needed. The purpose is to surface blockers, not generate status reports.

**Q: What if we run out of time in Week 11?**
A: Apply the scope cut framework: tools required for demo script come first, UI polish comes last. A working agent with a basic interface is better than a beautiful interface with a half-working agent.

---

### Practice exercise

**Exercise 10.1 — Kickoff Simulation**

Pair with a Developer track student. You play the role of the Professional presenting your spec; they play the Developer asking clarification questions.

Run a 20-minute simulated kickoff:
1. You present your spec (5 minutes)
2. Developer asks questions, you answer and amend (10 minutes)
3. You write down every clarification as a formal amendment (5 minutes)

After the simulation, the Developer writes down: "If I started building this spec without the clarifications, I would have had to make these assumptions: [list]."

Those assumptions are the gaps in your original spec. Fix them before the build starts.
