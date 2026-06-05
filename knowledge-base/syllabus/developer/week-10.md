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
- **Scoped for 2 weeks**: Not a 6-month enterprise system. A working MVP that demonstrates agent capabilities.
- **Grounded in a real Kampala problem**: Not a toy demo. Something a real person or business in Uganda would actually use.
- **Technically complete**: Model + context + tools + persistence + at least 2 guardrails
- **Presentable to non-technical stakeholders**: The business case must be clear

Bad capstone: "A general AI assistant"
Good capstone: "A WhatsApp agent for Nakasero Market vendors that tracks daily sales by voice note and sends weekly summaries to their MTN MoMo statement"

**2. Capstone Project Domains**

Strong domain ideas for Kampala-based capstones:

**Agriculture**: Smallholder farmer advisory agents (soil, weather, market prices). Uganda has 4M+ smallholder farmers. National Agricultural Advisory Services (NAADS) reaches 20%.

**Education**: Homework help in Luganda/English. Study group scheduling. Exam preparation. 1.5M secondary students in Uganda.

**Health**: Symptom triage for rural clinics. Medication adherence reminders. MCH (mother and child health) follow-up for Mulago Hospital referrals.

**Financial services**: Loan pre-qualification for SACCOs. Expense tracking for SMEs. School fees payment reminders.

**Government services**: NIRA identity verification agent. KCCA permit application guide. URA tax compliance helper.

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

The 5-minute pitch format:
1. Problem (1 minute): Who has this problem in Kampala? How often? What does it cost them today?
2. Solution (1 minute): What does your agent do? Show the happy-path user journey.
3. Architecture (1 minute): Model, tools, data. Keep it visual.
4. Demo plan (1 minute): What will you show on Demo Day?
5. Ask (1 minute): What specific help do you need from the cohort this week?

---

### Kampala example

**Sample Capstone: Matooke Market Price Intelligence Agent**

Problem: Farmers in Luwero drive 2 hours to Owino Market in Kampala only to find prices are lower than expected because they had no information before leaving.

Solution: WhatsApp agent that gives farmers current commodity prices at Owino, St. Balikuddembe, and Nakasero markets, updated daily by scraping Uganda Commodity Exchange data.

Tools:
1. `get_market_price(commodity, market)` — queries UGX price database
2. `get_price_trend(commodity, days)` — last N days price history
3. `compare_markets(commodity)` — best price across all three markets
4. `send_whatsapp(phone, message)` — sends price report via Meta Cloud API

Knowledge base: Uganda Commodity Exchange historical data (6 months), Makerere agriculture research on seasonal price patterns.

Guardrail: Never recommend sell/hold decisions — only provide price information. Include disclaimer: "Prices change throughout the day."

---

### Common questions

**Q: Can I build on an existing project I started outside the club?**
A: Yes, if you can complete it to demo standard in 2 weeks and it uses the agent architecture from this course.

**Q: Can two people work on the same capstone?**
A: Yes, but both must be able to explain every part of the system on Demo Day. No "I did the frontend, she did the backend."

**Q: What if my project requires integrations I can't get access to in time (MTN API, government databases)?**
A: Mock the integration. A well-designed mock (same interface, realistic fake data) demonstrates the architecture just as well. Note clearly what is mocked in the demo.

---

### Practice exercise

**Exercise 10.1 — Capstone Spec**

Write your complete capstone spec using the template above. Bring it to the next session for peer review. Specifically, your peers will be checking:
1. Is the scope achievable in 2 weeks for one person?
2. Is it a real Kampala problem or a generic AI demo?
3. Are there any obvious missing tools or guardrails?
4. Is the Week 11 plan specific enough to start on Monday?
