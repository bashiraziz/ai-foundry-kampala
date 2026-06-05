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

---

### Key concepts

**1. The Spec Gap**

Business people write requirements in business language. Developers build in technical language. The gap between them is where most project failures originate. An agent developer must be fluent in both — able to read "make it smart" and translate that to "retrieve top 5 knowledge base chunks by cosine similarity, inject into system prompt section 3, temperature 0.3."

**2. Reading a Business Spec**

When you receive a business spec, extract five things:
1. **The goal**: What outcome does the business want?
2. **The trigger**: What starts the agent running?
3. **The actions**: What real-world things must happen (not just outputs)?
4. **The constraints**: What must never happen?
5. **The success condition**: How does the business know it worked?

Anything not answerable from these five is a gap you must fill before building.

**3. Hidden Requirements**

Every spec has things the business forgot to write down because they assumed you would know:
- **Audit trail**: In Ugandan financial services, every transaction must be logged. Even if the spec says "send payment," it means "send payment AND log it."
- **Fallback behaviour**: What if the primary tool fails? The spec rarely says, but the business always cares.
- **Rate limits**: A spec that says "notify all customers" often doesn't mention that the SMS gateway allows only 100/minute.
- **Data privacy**: In Uganda's Data Protection Act (2019), personal data has handling requirements. An agent that logs customer data must do so lawfully.

**4. Writing a Technical Spec**

A technical spec for an agent includes:
- **System prompt** (or a reference to it)
- **Tool list** with full definitions
- **Data flow diagram** (which data goes where)
- **Error handling table** (each error type → agent response)
- **Test cases** (at least one happy path, two failure cases)
- **Out of scope** section (explicit statement of what the agent will NOT do)

The "out of scope" section prevents scope creep and protects you when the client says "but I thought it would also do X."

---

### Kampala example

**Translating a DFCU Bank spec**

Business spec received:
> "We want an AI that helps our loan officers. It should check if customers qualify for loans and tell them the right amount. It should be fast and smart."

Hidden requirements found during spec review:
- "Check if customers qualify" means running against Bank of Uganda credit score criteria, not guessing
- "Tell them the right amount" must align with DFCU's own risk tiers, not just credit score
- "Fast" means under 3 seconds — must be specified in the SLA
- "Smart" means handling edge cases: recently employed, seasonal income, business owners
- Audit log required by BOU regulations — every decision must be recordable
- Officer cannot override the model's recommendation without entering a reason code

Technical translation:
```
Agent: Loan Pre-Qualification Assistant
Trigger: Loan officer submits customer ID + income declaration form
Tools: credit_score_lookup(national_id), employment_verify(employer_name), 
       calculate_repayment_capacity(income, dependents, existing_loans)
Constraints: Never approve or deny a loan — only recommend. Flag for human review if credit score is below 550 or income is irregular.
Audit: Every run must write to the loan_assessments table with officer ID, timestamp, recommendation, and reasoning summary.
Out of scope: Mortgage loans, business loans, foreign nationals
```

---

### Common questions

**Q: What if the business can't articulate what they want?**
A: Use the "5 jobs" technique: ask them to describe 5 real tasks they do manually today that take the most time. Those are your starting point. Build for those jobs first, then expand.

**Q: What if the spec changes halfway through the build?**
A: This is normal. Keep a version-controlled spec document and make clients sign off before you start each major phase. When changes come in, assess them against what's already built and be explicit about what the change costs.

**Q: How detailed should my technical spec be before I start coding?**
A: Detailed enough that you could hand it to another developer and they could build it. If you cannot describe the error handling table, you are not ready to build.

---

### Practice exercise

**Exercise 6.1 — Spec Translation**

Here is a business spec from a Kampala school:

> "We want a system that handles parent inquiries. Parents ask about fees, results, and school events. Currently our secretary handles 200+ calls per day. The system should reduce this by 80%. Parents use WhatsApp."

Translate this into a full technical spec including:
1. Agent goal and trigger
2. Tool list (at least 4 tools with descriptions)
3. At least 3 hidden requirements you identified
4. Error handling for 2 failure cases
5. Out of scope section (at least 3 items)
6. Success metric (how you would measure the "80% reduction" claim)
