## Week 9 — The Digital FTE Business Case

**Track:** Professional
**Week:** 9 of 12

---

### Learning objectives

By the end of this week you will be able to:
1. Build a quantified business case for a Digital FTE investment
2. Calculate ROI using Kampala-specific labour and technology cost benchmarks
3. Identify the non-financial benefits (speed, quality, availability) that strengthen the case
4. Present the business case to a sceptical CFO or board member

---

### Key concepts

**1. The Digital FTE Framework**

A Digital FTE is an agent configured to do a defined bundle of tasks. The business case compares the cost of the Digital FTE to the cost of the human FTE doing the same tasks.

Cost structure for a human FTE in Kampala (illustrative, varies by role and organisation):
- Salary: 800,000 - 3,000,000 UGX/month depending on seniority
- Benefits (NSSF, health, leave): +25-35% on top of salary
- Office space, equipment, management overhead: +20-30%
- Total cost per FTE: 1.3M - 5M UGX/month

Cost structure for a Digital FTE:
- Development cost: 5M - 25M UGX (one-time, amortised over 24 months)
- API costs: 100,000 - 500,000 UGX/month
- Maintenance: 500,000 - 1M UGX/month (developer retainer)
- Total ongoing: 600,000 - 1.5M UGX/month

For tasks where the Digital FTE is a valid replacement, payback period is typically 2-8 months.

The amortisation logic matters. When you spread a 10M UGX development cost over 24 months, it becomes approximately 417,000 UGX/month — comparable to a fraction of a junior staff member's fully loaded cost. Presented that way, the comparison becomes concrete for a board member who is used to thinking about monthly payroll, not one-time technology investments.

**2. ROI Calculation Methodology**

Calculate ROI in three steps:

**Step 1: Cost of current process.** Identify the task the agent will handle. Count the staff hours spent on it per month. Multiply by the fully loaded hourly cost of the staff doing it. Include management time and overhead. This is your baseline cost.

**Step 2: Cost of the Digital FTE.** Development cost amortised over 24 months, plus monthly API and maintenance costs. This is your ongoing cost.

**Step 3: The comparison.** Monthly savings = baseline cost × percentage of tasks the agent handles − ongoing Digital FTE cost. Payback period = development cost ÷ monthly savings.

A business case is credible when the assumptions behind each number are stated and defensible. Do not try to make the ROI look better than it is by using optimistic deflection rates or ignoring maintenance costs. A sceptical CFO will find the weakness. It is better to find it first and address it in the presentation.

**3. Non-Financial Benefits**

The financial comparison is necessary but not sufficient. These non-financial factors often matter as much:

- **Speed**: An agent runs in seconds; a human may take hours or days. In customer service, speed directly affects retention.
- **Availability**: Agents run 24/7. For MTN MoMo users making transactions at midnight, this matters.
- **Consistency**: An agent follows its rules every time. Human performance varies by mood, fatigue, and training quality.
- **Scalability**: An agent handles 10 or 10,000 queries with the same infrastructure cost. Human capacity requires proportional headcount.
- **Data**: Agents automatically generate logs that enable analytics. Manual workflows typically don't.

These benefits are real but they are harder to put a number on. Present them as supporting evidence, not primary evidence. A board member who is unsure about the ROI will not be won over by availability and consistency arguments alone. Win them with the numbers first, then use the non-financial benefits to address the "yes, but" questions.

**4. Internal Pitch Structure**

The internal pitch for a Digital FTE investment follows a simple structure:

1. **The problem** (2 minutes): What task is being done today? How long does it take? What does it cost? What goes wrong? Be specific. Name the role, the frequency, the error rate.

2. **The proposed solution** (2 minutes): What will the agent do? What will it not do? What is the scope? Show the workflow in a simple diagram — a flowchart on one slide is enough.

3. **The numbers** (3 minutes): Baseline cost, Digital FTE cost, monthly saving, payback period. Show your working. Sourced estimates beat invented precision.

4. **The risk and mitigation** (2 minutes): What could go wrong? What is the pilot plan? How will you know in 90 days whether it is working?

5. **The ask** (1 minute): Specific amount, specific timeline, specific success measure.

Total: 10 minutes. Leave 10 minutes for questions. The questions are where you win or lose the pitch.

**5. Stakeholder Objections and Responses**

A CFO or board member will ask:
- "What if it gets it wrong?" → Show the guardrails and escalation path. Compare the agent's error rate to your current human error rate (often surprisingly high). An agent that is wrong 5% of the time replacing a human process that is wrong 15% of the time is still an improvement.
- "Is our data safe?" → Address Uganda Data Protection Act compliance, data residency, and access controls.
- "What happens to the staff whose jobs change?" → Address change management proactively. The goal is redeployment to higher-value work, not redundancy.
- "What's the maintenance cost?" → Give a specific monthly figure including developer retainer and API costs.

**6. The Three Business Cases Worth Making**

In Uganda's current market, the strongest Digital FTE business cases are:

1. **Customer service triage** (financial services, telecoms, utilities): High-volume, repetitive queries, 24/7 demand, measurable deflection rate.

2. **Compliance and reporting** (regulated industries, government): Reduces human error in mandatory filings, creates auditable trail, frees compliance staff for review rather than data entry.

3. **Field-to-headquarters data** (agriculture, healthcare, NGOs): Field workers send data via WhatsApp, agents route it to the right system, produce reports automatically. Replaces data entry at HQ.

---

### Kampala example

**Business Case: Uganda Revenue Authority SME Compliance Agent**

URA has 1.2 million registered SMEs in Uganda. Many are non-compliant not because they are trying to evade taxes, but because the requirements are unclear and the process is confusing.

Current state:
- 300,000 SME queries to URA call centre annually
- Average handle time: 12 minutes
- Call centre staff: 85 agents × average 800,000 UGX/month = 68M UGX/month
- First-contact resolution rate: 55% (45% need follow-up)

Digital FTE scenario:
- Agent handles top 7 query categories (filing deadlines, TIN lookup, penalty calculations, payment methods, form guidance, objection procedures, refund status)
- These represent 70% of call volume = 210,000 queries/year
- Agent deflects 80% of these = 168,000 calls deflected/year
- Call centre can reduce by ~28 staff (168,000 calls × 12 min / 60 = 33,600 staff-hours/year)

Financial impact:
- Staff reduction (redeployment, not redundancy): 28 staff × 800,000 UGX/month = 22.4M UGX/month savings
- Development cost: 20M UGX (one-time, 3-month build), amortised = 833,000 UGX/month
- Ongoing cost: 1.5M UGX/month
- Net monthly saving: 20.1M UGX
- Payback period: 20M / 20.1M = ~1 month

Non-financial: 24/7 availability for SMEs. Consistent advice. Automatic audit trail for every query. Data on most common compliance questions informs URA policy.

The pitch to URA leadership would lead with the compliance gap, not the cost savings. "300,000 SME queries a year suggests that hundreds of thousands of businesses want to comply but cannot navigate the process. This agent closes that gap and frees your expert staff to handle the cases that genuinely need human judgement." Cost savings are the supporting argument, not the headline.

---

### Common questions

**Q: What if the organisation doesn't have reliable data on current costs?**

Estimate conservatively and be transparent about it. "We estimate 300+ calls per week based on our call log sampling" is a credible basis. A business case built on estimates that are clearly labelled is more credible than one with false precision. Think of how a Kampala logistics company would estimate fuel costs for a new route: they do not know exactly, but they can estimate from known distances, typical fuel consumption, and current pump prices at Total or Shell stations. They label it an estimate, they apply a 15% buffer, and they present it as a range. Apply the same discipline. "Between 18M and 24M UGX per month, depending on average handle time" is more honest and more useful than "21.3M UGX per month" presented as a fact.

**Q: How do I handle the HR and change management dimension?**

Address it explicitly in the business case. "The 28 staff freed from call answering will be retrained for complex dispute resolution and outreach — roles currently backlogged by 6 months." This turns a potential redundancy concern into a workforce development narrative. In Uganda's current labour market, redundancy announcements generate negative attention and damage trust with the remaining workforce. Redeployment framing is not just more ethical — it is strategically smarter. If the honest answer is that some roles will be eliminated, say so with a transition plan: timeline, severance, retraining support. A board that hears about the job impacts first from an angry staff WhatsApp group will not trust your next business case.

**Q: Should I include a risk section in the business case?**

Yes. Acknowledge 2-3 risks with mitigations. "Risk: Agent response quality is lower than expected. Mitigation: 3-month pilot with 10% of queries, performance reviewed against human benchmark before full deployment." This increases credibility. A business case with no risk section looks like it was written by someone who has never run a project. Every experienced executive knows that projects fail. What they want to know is that you have thought about how this one could fail and what you will do about it. The pilot plan is your answer. It also reduces the financial exposure: a 3-month pilot on 10% of volume costs far less than a full deployment gone wrong.

---

### Practice exercise

**Exercise 9.1 — Business Case**

Build a one-page business case for your capstone project using this structure:

1. **Problem** (2-3 sentences): What is the task being done today? Who does it? How much of their time does it consume?
2. **Current state cost** (in UGX): Staff time in hours/month × fully loaded hourly cost. Show your working.
3. **Digital FTE cost**: Development cost amortised over 24 months + monthly API cost + monthly maintenance retainer. State each component separately.
4. **Projected impact**: What percentage of the task volume does the agent handle? How many staff hours does that free? Be specific.
5. **ROI**: Monthly saving − monthly Digital FTE cost = net monthly saving. Payback period = development cost ÷ net monthly saving. Express in months.
6. **Top 3 non-financial benefits**: One sentence each. Quantify where possible — "24/7 availability" is weaker than "24/7 availability for the 40% of MTN MoMo queries that arrive outside business hours."
7. **Top 2 risks and mitigations**: One risk, one mitigation each. Be specific about what you would watch for and what you would do.

Keep it to one page. A business case that needs 10 pages is a business case that hasn't been thought through clearly enough. Bring it to the next session. You will pitch it in 5 minutes and take questions for 5 minutes.
