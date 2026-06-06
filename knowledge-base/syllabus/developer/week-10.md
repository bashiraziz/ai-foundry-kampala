## Week 10 — Capstone Kickoff

**Track:** Developer
**Week:** 10 of 12

---

### Learning objectives

By the end of this week you will be able to:
1. Define a complete capstone project scoped for Weeks 11-12
2. Write a technical spec that covers all layers of an agent system
3. Identify the risks and dependencies in your build plan
4. Deliver a 5-minute project pitch to the cohort

---

### Key concepts

**1. What Makes a Good Capstone**

A good capstone is:
- **Scoped for 2 weeks**: Not a 6-month enterprise system. A working MVP that demonstrates agent capabilities within a tight, honest timeline.
- **Grounded in a real Kampala problem**: Not a toy demo. Something a real person or business in Uganda would actually use and benefit from.
- **Technically complete**: Model + context + tools + persistence + at least 2 guardrails
- **Presentable to non-technical stakeholders**: The business case must be clear enough that a school headteacher or a market vendor could understand what it does and why they would want it

Bad capstone: "A general AI assistant"
Good capstone: "A WhatsApp agent for Nakasero Market vendors that tracks daily sales by voice note and sends weekly summaries to their MTN MoMo statement"

The difference is specificity. A general AI assistant solves nothing particular for anyone in particular. The Nakasero Market agent solves a real problem — informal vendors do not have accounting software, do not keep paper records consistently, and already use WhatsApp all day. The agent fits into their existing behaviour rather than demanding new ones.

**2. Capstone Project Domains**

Strong domain ideas for Kampala-based capstones:

**Agriculture**: Smallholder farmer advisory agents covering soil health, weather patterns, and commodity market prices. Uganda has over 4 million smallholder farmers. The National Agricultural Advisory Services (NAADS) reaches approximately 20% of them. An agent that delivers timely advice via WhatsApp or USSD could reach the other 80%.

**Education**: Homework help in Luganda and English. Study group scheduling. Exam preparation for PLE, UCE, and UACE. Uganda has 1.5 million secondary students, most of whom do not have access to private tutors. An agent that provides on-demand subject help at 9pm when parents cannot help is a real product.

**Health**: Symptom triage for rural clinics. Medication adherence reminders. Mother and child health follow-up for patients referred from Mulago Hospital. Malaria is the leading cause of outpatient visits in Uganda — an agent that helps health workers ask the right triage questions faster has measurable impact.

**Financial services**: Loan pre-qualification for SACCOs. Expense tracking for small businesses in Owino Market. School fees payment reminders and instalment planning. Uganda has over 10,000 registered SACCOs, most of which rely on manual processes.

**Government services**: NIRA identity verification guidance. KCCA permit application walkthroughs. URA tax compliance helpers for small businesses filing for the first time.

**3. Capstone Spec Template**

```
Project: [Name]
Problem: [One sentence — what problem for whom in Kampala]
Solution: [One sentence — what the agent does]

Users: [Who uses it and how]
Agent type: [Single agent / multi-agent / RAG-backed]
LLM: [Gemini 2.5 Flash / fallback]

Tools (list each with description):
  1. ...
  2. ...

Data:
  Schema: [key models]
  Knowledge base: [what documents you will ingest]

Guardrails (at least 2):
  1. ...
  2. ...

Week 11 milestones:
  Day 1-2: ...
  Day 3-4: ...
  Day 5: ...

Week 12 milestones:
  Day 1-2: ...
  Day 3: Demo ready
  Day 4: Buffer / polish
  Day 5: Demo Day

Risks:
  1. [Risk] → [Mitigation]
  2. ...

Out of scope:
  - ...
```

**4. Pitching Your Project**

The 5-minute pitch format is a discipline, not a suggestion. Five minutes is enough to communicate a complete idea if you have distilled it clearly. More time is not available on Demo Day, and the cohort's attention is finite. Practise cutting until every word earns its place.

1. **Problem (1 minute)**: Who has this problem in Kampala? How often? What does it cost them today — in time, money, or missed opportunity?
2. **Solution (1 minute)**: What does your agent do? Walk the audience through the happy-path user journey in one concrete scenario. "Amina is a vendor at Owino Market. She sends a voice note saying she sold 20 kg of matooke at 3,000 UGX per kg. The agent records the sale, updates her weekly total, and replies with a confirmation in Luganda."
3. **Architecture (1 minute)**: Model, tools, data. Keep it visual — a whiteboard diagram beats three minutes of oral description.
4. **Demo plan (1 minute)**: What will you show on Demo Day? Be specific about the scenario you will run live and what the audience will see.
5. **Ask (1 minute)**: What specific help do you need from the cohort this week? Not "any advice is welcome" — name the specific technical challenge you are worried about and ask if anyone has solved it.

---

### Kampala example

**Sample Capstone: Matooke Market Price Intelligence Agent**

Problem: Farmers in Luwero district drive two hours to Owino Market and St. Balikuddembe Market in Kampala only to find commodity prices are lower than expected. They had no price information before leaving and no way to compare markets. Some turn around and drive home without selling. The wasted trip costs 20,000-40,000 UGX in fuel and half a working day.

Solution: A WhatsApp agent that gives farmers current commodity prices at Owino, St. Balikuddembe, and Nakasero markets, updated daily by ingesting Uganda Commodity Exchange data. Farmers send a WhatsApp message asking about a commodity; the agent replies with current prices across all three markets and a seven-day trend.

Tools:
1. `get_market_price(commodity, market)` — queries a UGX price database updated daily from Uganda Commodity Exchange feeds
2. `get_price_trend(commodity, days)` — returns price history for the last N days with percentage change
3. `compare_markets(commodity)` — returns the best price across all three markets in a single response
4. `send_whatsapp(phone, message)` — sends the price report via Meta Cloud API

Knowledge base: Uganda Commodity Exchange historical price data (six months), Makerere agriculture research on seasonal price patterns for the 12 most-traded commodities.

Guardrail 1: Never recommend a sell or hold decision — only provide price information. The agent has no knowledge of the farmer's costs, transportation budget, or storage capacity. Providing a recommendation without that context is harmful.

Guardrail 2: Include disclaimer on every price response: "Prices change throughout the day. Last updated: [timestamp]. Confirm with market vendors before travelling."

Week 11 milestones:
- Day 1-2: Schema, WhatsApp webhook, `get_market_price` tool
- Day 3-4: `get_price_trend`, `compare_markets`, system prompt tuning
- Day 5: Deployed to staging, demo script written

---

### Common questions

**Q: Can I build on an existing project I started outside the club?**

Yes, with two conditions: you must be able to complete it to demo standard within two weeks, and it must use the agent architecture from this course — meaning a proper system prompt, at least two tools, and persistence. If you already have a half-built app, the capstone is an opportunity to add the agentic layer. Bring your existing project to the Week 10 pitch session so the cohort can assess scope.

**Q: Can two people work on the same capstone?**

Yes, but both people must be able to explain every part of the system on Demo Day. The judges will ask each person questions independently. "I did the frontend, she did the backend" is not an acceptable answer — each person must understand the full stack. In practice, this means you build together rather than dividing the system into separate islands. Code review each other's work. Pair on the parts you find difficult.

**Q: What if my project requires integrations I cannot get access to in time — MTN API, government databases, Ministry of Health systems?**

Mock the integration. A well-designed mock — same function interface, realistic fake data structured like the real API would return, error cases handled — demonstrates the architecture just as well as a live integration. State clearly in your pitch and demo: "This tool calls the MTN MoMo API; for the demo I am using a realistic mock because the API approval takes six weeks." Judges evaluate architecture and agent behaviour, not API access. Many production projects ship with mocked integrations for months while API approvals work through bureaucracy.

**Q: How specific should my Week 11 daily milestones be?**

Specific enough to know at the end of each day whether you are on track. "Build the agent" is not a milestone. "Prisma schema deployed to Neon with Student and Session models, WhatsApp webhook endpoint returning 200 OK to Meta's verification call, first tool implemented and returning hardcoded test data" is a milestone. If you cannot tell at 9pm on Day 1 whether you completed the day's milestone, the milestone was too vague. Write milestones as acceptance criteria: what does done look like?

---

### Practice exercise

**Exercise 10.1 — Capstone Spec**

Write your complete capstone spec using the template above. This is not a brainstorming document — it is a commitment you are making to the cohort about what you will build and demonstrate in two weeks.

Bring it to the next session for peer review. Your peers will evaluate it against four criteria:

1. **Scope check**: Is this achievable by one person in two weeks? Peers will estimate the engineering time for each component and flag if the total exceeds your available hours. If you are working a day job, your available hours are evenings and weekends — approximately 25-30 hours total across two weeks. Spec accordingly.

2. **Reality check**: Is this a real Kampala problem or a generic AI demo with Kampala names attached? If you removed all the Ugandan context from your spec, would the project still make sense? If yes, it is too generic. Your spec should only make sense in Kampala.

3. **Technical completeness**: Are there obvious missing tools? Are the guardrails specific to the risk profile of your domain? Is the data model sufficient to support the tools you described?

4. **Monday-readiness**: Is the Week 11 Day 1-2 milestone specific enough that you can start writing code first thing Monday morning without any additional planning? If you would spend Monday morning still figuring out what to build, the spec is not ready.

Revise your spec based on peer feedback before the build sprint begins.
