## Week 6 — Reading and Translating Specs

**Track:** Developer
**Week:** 6 of 12

---

### Learning objectives

By the end of this week you will be able to:
1. Read a business requirements document and extract agent-buildable requirements
2. Translate ambiguous business language into precise technical specs
3. Identify "hidden requirements" — things the spec doesn't say but the business needs
4. Write a technical spec that a second developer could implement without you
5. Conduct a joint spec review session with the Professional track

---

### Key concepts

**1. The Spec Gap**

Business people write requirements in business language. Developers build in technical language. The gap between them is where most project failures originate. An agent developer must be fluent in both — able to read "make it smart" and translate that to "retrieve top five knowledge base chunks by cosine similarity, inject into system prompt section three, temperature 0.3, with a fallback to a human operator if retrieved similarity is below 0.7." The Spec Gap is not a communication failure or a character flaw — it is a structural problem that exists in every client-developer relationship. Your job is to close it deliberately, before you write a single line of code, through a structured process of extraction, clarification, and written confirmation. Developers who skip this step build the wrong thing confidently and expensively.

*Kampala analogy:* A contractor building a house in Muyenga needs more than "build us something nice." Without a floor plan, materials spec, and a defined boundary for the plot, they will either stop and ask questions every day, or make assumptions that the client will reject on inspection. The technical spec is the floor plan.

**2. Reading a Business Spec**

When you receive a business requirements document — a Word file, a WhatsApp message, a set of meeting notes, or anything else — your first job is extraction. Pull out five specific things and nothing else on the first pass.

The **goal**: What outcome does the business want to achieve? Not what tool do they want built, but what problem do they want solved. "Reduce the time our secretary spends on parent inquiries" is a goal. "Build a chatbot" is not — it is a proposed solution, and proposed solutions often turn out to be wrong solutions.

The **trigger**: What event or condition starts the agent running? A message arriving, a time of day, a database event, a human pressing a button? If you cannot identify the trigger, you cannot build the loop.

The **actions**: What real-world things must happen as a result of the agent running? Not just what it says or generates, but what it does — sends an SMS, updates a database record, books a slot, charges an account. Actions have consequences and constraints. Identifying them early surfaces the most important risks.

The **constraints**: What must never happen, regardless of any other consideration? In Ugandan financial services, one constraint is always present whether written or not: every transaction must be logged with a timestamp and a user identifier. If the spec does not say this, your job is to say it.

The **success condition**: How does the business know the agent worked? Measurable, specific. "It feels faster" is not a success condition. "Secretary handles fewer than 50 manual inquiries per day, down from 200" is.

Anything not answerable from these five elements is a gap you must fill before building. Write the gaps as a numbered list and send them to the client. Do not start building until every gap has a written answer.

**3. Hidden Requirements**

Every spec has things the business forgot to write down because they assumed you would know, or because they did not know they needed to specify them. These are hidden requirements, and they are the most dangerous part of any project — they surface in UAT as "I assumed it would do X" conversations that cost weeks to resolve.

Four categories of hidden requirements appear in almost every Kampala agent project:

**Audit trail requirements**: In Ugandan financial services, every transaction must be logged. The Personal Data Protection Act (2019) requires that systems processing personal data maintain records of processing activities. Even if the spec says only "send payment confirmation," the actual requirement is "send payment confirmation AND write an immutable log entry with the timestamp, customer ID, amount, and operator ID." If you do not build this, the client will discover the requirement when their Bank of Uganda auditor arrives.

**Fallback behaviour**: What happens when the primary tool fails? The SMS gateway is down, the database is unavailable, the external API returns a 500 error. The spec almost never specifies this, but the business always cares — because failures happen in production and the business needs to know the agent degrades gracefully rather than silently losing data.

**Rate limits and throughput constraints**: "Notify all customers" sounds like one action. In practice it might mean sending 5,000 SMS messages through a gateway that allows 100 per minute. Naive implementation sends all 5,000 in a loop and gets the account suspended in 50 minutes. The spec never mentions rate limits; the implementation must account for them.

**Data privacy and consent**: Uganda's Data Protection Act (2019) requires lawful basis for processing personal data. An agent that collects customer names and phone numbers from WhatsApp messages must have a defined legal basis, and that basis must be documented. If you build data collection without raising this with the client, you are building a compliance liability.

**4. Ambiguity Detection**

Ambiguity is not always obvious. Trained developers develop pattern recognition for ambiguous phrases. "The system should be fast" — fast under what load, measured how, compared to what baseline? "It should handle all inquiries" — all inquiries from which channels, in which languages, about which topics, at what volume? "Be accurate" — accurate according to whom, verified how, with what tolerance for error? When you read a spec, highlight every adjective that is not quantified (fast, smart, accurate, helpful, reliable) and every scope statement that is not bounded (all, every, any, whenever). Each one is a gap. Fill it with a specific, measurable, agreed value before building.

**5. Writing a Technical Spec**

A technical spec for an agent project has six required sections. The **agent definition** covers the name, purpose, trigger condition, and the model that will power it. The **tool list** contains the full definition of every tool the agent needs — name, description, input schema, expected return format, and error cases. The **data flow diagram** shows where each piece of data comes from, where it goes, and who can access it. The **error handling table** maps every identified error type to a specific agent response — not "handle errors gracefully" but "if credit_score_lookup returns a 404, respond with intent: escalate, reason: customer_not_found, notify: loan_officer." The **test cases** include at minimum one happy path (all tools succeed, agent produces correct output), two failure cases (each testing a different error path), and one edge case (an unusual but valid input the spec explicitly covers). The **out of scope** section is a numbered list of things the agent will explicitly not do — this is not a sign of limitation, it is a professional boundary that protects the project from scope creep and protects the developer from "I thought it would also do X" conversations.

**6. The Joint Session with the Professional Track**

Week 6 is the first joint session between the Developer and Professional tracks. Professional track participants write business specs in the format they will use with real clients. Developer track participants receive those specs and practice the extraction and translation process — identifying the five required elements, surfacing hidden requirements, flagging ambiguities, and producing a draft technical spec in response. This joint session simulates the real workflow of an AI Foundry engagement: a business-facing consultant brings a client requirement, and a developer translates it into a buildable specification. The joint session is graded on the quality of the questions you ask as much as on the spec you produce.

---

### Kampala example

**Translating a DFCU Bank spec**

Business spec received from a DFCU loan officer manager:
> "We want an AI that helps our loan officers. It should check if customers qualify for loans and tell them the right amount. It should be fast and smart."

Step one — extract the five elements. Goal: reduce time loan officers spend on manual pre-qualification assessment. Trigger: loan officer submits a customer ID and income declaration form. Actions: look up credit score, calculate repayment capacity, return a pre-qualification recommendation. Constraints: not stated — this is a gap. Success condition: not stated — this is a gap.

Step two — surface hidden requirements. Bank of Uganda regulations require a full audit log of every credit assessment decision. DFCU's own risk policy requires that any recommendation must align with their internal risk tier framework, not just the raw credit score. "Fast" must be defined in an SLA — the spec says fast, we propose "under 3 seconds for 95% of requests." The "smart" requirement means handling edge cases the credit score alone cannot capture: recently employed applicants with short credit history, seasonal income (farmers, market vendors), self-employed business owners.

Step three — flag ambiguities. "The right amount" — right according to which criteria, DFCU's internal tiers or the applicant's credit score? "Check if customers qualify" — against Bank of Uganda minimum criteria, or DFCU's own criteria, or both? These are sent to the client as numbered questions before any building begins.

Technical translation:
```
Agent: Loan Pre-Qualification Assistant
Trigger: Loan officer submits customer national ID + income declaration form
Model: Gemini 2.5 Flash (speed requirement: <3 seconds)
Tools:
  - credit_score_lookup(national_id) → credit score + history summary
  - employment_verify(employer_name, duration_months) → employment confirmation
  - calculate_repayment_capacity(monthly_income, dependents, existing_loan_payments)
  - dfcu_risk_tier_lookup(credit_score, employment_type) → internal risk tier + max loan amount

Constraints:
  - Never approve or deny — only recommend and flag for human review
  - If credit_score < 550 OR income is flagged as irregular: mandatory escalation to senior officer
  - Officer cannot override recommendation without entering a documented reason code

Audit: Every run writes to loan_assessments table:
  {assessment_id, officer_id, customer_national_id, timestamp, 
   credit_score, risk_tier, recommendation, reasoning_summary, officer_reason_code_if_override}

Out of scope: mortgage loans, business loans, foreign nationals, joint applications
Success metric: Pre-qualification time under 3 seconds; 90% of assessments require no manual officer research
```

---

### Common questions

**Q: What if the business can't articulate what they want?**

Use the "five jobs" technique: ask them to describe five real tasks they do manually today that take the most time or cause the most frustration. Observe them doing one of those tasks if possible — watching someone work for 20 minutes reveals requirements that an hour of meetings would not surface. Build for the highest-impact jobs first, then expand. Resist the temptation to ask abstract questions like "what do you want the AI to do?" Abstract questions produce abstract answers. Concrete observation produces concrete requirements. In Kampala, this often means visiting the business in person — a morning at the school fee collection desk will tell you more than three remote requirements workshops.

**Q: What if the spec changes halfway through the build?**

This is normal in every project and not a reason to panic. Three practices keep scope changes manageable. First, maintain a version-controlled spec document — every change is recorded with a date and a reason, so nothing is lost and disputes are resolvable. Second, require written sign-off from the client contact before starting each major build phase — if they approved the spec in writing and now want to change it, the change is documented and the cost implication is clear. Third, assess every change request against what is already built and be explicit in writing about what the change costs in time and money. Changes are not inherently bad; undocumented, uncosted changes are.

**Q: How detailed should my technical spec be before I start coding?**

Detailed enough that you could hand it to another developer on your team and they could build it — correctly, without calling you to clarify the basics. The minimum bar: every tool is defined with its full input schema and expected return format, every error case has a specified response, the success condition is measurable, and the out-of-scope section is written. If you cannot answer "what does the agent do when the SMS gateway is down?" before you start coding, you are not ready. The cost of spec ambiguity compounds — it is cheap to resolve in the spec phase, expensive in UAT, and potentially catastrophic in production.

---

### Practice exercise

**Exercise 6.1 — Spec Translation**

Here is a business spec from a Kampala school:

> "We want a system that handles parent inquiries. Parents ask about fees, results, and school events. Currently our secretary handles 200+ calls per day. The system should reduce this by 80%. Parents use WhatsApp."

Translate this into a full technical spec. Your spec must include:

1. **The five extracted elements** — goal, trigger, actions, constraints (both stated and identified), and success condition. For the success condition, propose a specific measurement methodology for the "80% reduction" claim.

2. **Tool list** — at least four tools with full definitions: name, purpose description (three sentences), input schema, and two example return values (one success, one error).

3. **Hidden requirements** — at least three that you identified that the spec did not state. For each one, explain why it is required and what the consequence of ignoring it would be.

4. **Error handling** — for at least two failure cases, specify exactly what the agent does. "Handle gracefully" is not an acceptable answer.

5. **Out of scope section** — at least three explicit items the agent will not handle, with a brief reason for each exclusion.

6. **Ambiguities flagged** — list at least two phrases in the original spec that are ambiguous, write the question you would send to the school to resolve each one, and propose a default assumption you would use if they don't respond before your deadline.

Bring your completed spec to the Week 6 joint session. Professional track participants will review it as if they were the client and challenge any gaps they find.
