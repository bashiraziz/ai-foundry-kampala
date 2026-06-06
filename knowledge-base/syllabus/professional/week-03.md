## Week 3 — Writing Markdown Specs

**Track:** Professional
**Week:** 3 of 12

---

### Learning objectives

By the end of this week you will be able to:
1. Write a markdown specification that a developer can implement without your involvement
2. Apply the five-section system prompt structure to a real business use case
3. Identify the difference between vague and specific instructions
4. Write numbered rules that prevent the three most common agent behaviour failures

---

### Key concepts

**1. Why Markdown?**

Markdown is plain text with minimal formatting. It is readable by humans, writeable in any text editor, parseable by code, and has become the standard format for AI system prompts worldwide. A Professional who can write markdown specs is a Professional who can communicate precisely with both developers and AI models — two audiences whose time you cannot afford to waste with ambiguity. You do not need to know HTML, CSS, or any programming language. You need to know five things: headings (`##`), bullet points (`-`), numbered lists (`1.`), bold text (`**text**`), and code blocks (triple backtick). Everything else is optional. The investment is twenty minutes of practice. The return is the ability to write instructions that a developer can implement and an AI can follow without a follow-up meeting.

*Kampala analogy: A well-written tender document at PPDA does not require the procurement officer to be present during every bidder's question session — it is specific enough to stand alone. A good markdown spec works the same way: once written well, you should not need to be in the room when the developer builds it.*

**2. The Five-Section System Prompt**

Every agent needs instructions. Those instructions — called the system prompt — are what the agent reads before every conversation or task. The system prompt is not code; it is structured English. It should follow a consistent five-section structure that makes it readable, maintainable, and testable.

```
## ROLE
Who is this agent? What is it optimising for?

## CONTEXT
[Dynamic section — populated at runtime with retrieved data about this
specific customer, transaction, or case]

## RULES
Numbered list of specific, testable rules the agent must follow.

## OUTPUT FORMAT
Exactly what the response should look like — length, tone, required fields.

## EXAMPLES
1–3 input → output pairs showing the agent the expected behaviour.
```

The ROLE section sets purpose. The CONTEXT section is filled in automatically at runtime — this is where the customer's account data, the student's fee balance, the loan application details go. The RULES section is where most of your work happens. The OUTPUT FORMAT section prevents format non-compliance failures. The EXAMPLES section is the most underused and most powerful — showing the agent what good looks like is more effective than describing it.

**3. The Difference Between Vague and Specific**

The most common Professional mistake is writing instructions that feel specific but are not testable. Testability is the standard. If you cannot write a test case that verifies whether the rule is being followed, the rule is not specific enough.

**Vague**: "Be professional and accurate. Don't make things up. Help the customer."

**Specific**:
```
1. Only answer questions about Stanbic Uganda products and services.
2. Never quote interest rates from memory — always retrieve from the
   product database. If the database is unavailable, say: "I'm unable
   to retrieve current rates. Please call 0800 222 000."
3. If a customer asks about a competitor's product, acknowledge their
   question and redirect: "I can help you understand how our [closest
   product] compares."
4. Every response must end with: "For further assistance, call
   0800 222 000, available Monday to Friday 8am–6pm."
```

The specific version is testable. You can give the agent inputs and verify whether it follows each rule. "Be accurate" cannot be tested. "Never quote interest rates not present in the retrieved product document" can be tested with a specific input.

*Kampala analogy: A school bursar's instruction to a cashier that says "handle fees properly" produces inconsistent results. An instruction that says "accept MTN MoMo and Airtel Money only, always issue a printed receipt with the student's name and class, never accept partial payment below 50% of the term balance" produces consistent, auditable results.*

**4. Testable Rules**

A good rule is one you can verify with a specific input. For each rule you write, ask: "What message would I send this agent to check whether this rule is being followed — and what would a passing response look like?"

Bad rule: "Be empathetic with upset customers."
Test: How do you measure empathy? You cannot reliably.

Better rule: "If a customer uses the words 'frustrated', 'angry', 'disappointed', or 'terrible', acknowledge their feeling in the first sentence of your response before addressing their issue."
Test: Send a message containing "I'm so frustrated with this service." Check that the first sentence of the response acknowledges the feeling before any information about their query.

The better rule produces the same empathetic behaviour — but it is observable, testable, and fixable when violated.

**5. Common Spec Mistakes**

Three mistakes appear in almost every first draft:

**Missing the exception**: Rules written for the normal case leave the agent without instructions for edge cases. "Provide the fee balance" does not cover what happens when the balance is zero, when the student is no longer enrolled, or when the system returns an error. Every rule should include: "If this condition does not apply or the data is unavailable, do this instead."

**Contradictory rules**: Rule 3 says always escalate disputes to a human. Rule 7 says always resolve the customer's issue in the current session. These conflict. When an agent encounters contradictory rules, it either picks one arbitrarily or freezes. Review your rules as a set — not just individually.

**No output format**: If you do not specify the format, the agent will choose one — and it will be inconsistent. Specify sentence count, required fields, tone register (formal, conversational, SMS-length), and whether lists or prose are preferred.

---

### Kampala example

**System prompt for a Kampala Parents School fee query agent**

```markdown
## ROLE
You are the fees inquiry assistant for Kampala Parents School. You help
parents understand their child's fee balance, payment deadlines, and
payment methods. You are polite, clear, and efficient. You do not have
access to fee information for any student other than the one in this
session.

## CONTEXT
Parent's name: {parent_name}
Student name: {student_name}
Class: {student_class}
Outstanding balance: {balance_ugx} UGX
Current term payment deadline: {deadline}
Payment reference number: {payment_ref}

## RULES
1. Never reveal fee balances for any student other than {student_name}.
2. Always include the payment reference number in any response that
   involves making a payment.
3. Accept exactly two payment methods: MTN MoMo (Pay Bill: 123456) and
   Airtel Money (Pay Bill: 789012). If a parent asks about bank transfer
   or cash, say: "At the moment we support MTN MoMo and Airtel Money.
   For other payment arrangements, please contact the bursar directly."
4. If a parent disputes their balance, respond: "I've noted your concern.
   A member of the bursary team will contact you within 24 hours to
   review." Do not argue, justify, or adjust the balance.
5. Never promise a fee waiver, discount, or deadline extension without
   a bursar confirmation code. If asked, say: "Any adjustments to fees
   or deadlines must be approved by the bursar. Please call the school
   office directly."
6. All monetary amounts must be written in UGX with comma separators
   (e.g., 1,250,000 UGX), never in shorthand (e.g., not "1.25M").

## OUTPUT FORMAT
Responses should be 2–4 sentences. Conversational but professional.
For payment instructions, use a numbered list.
Do not use jargon or abbreviations the parent may not recognise.

## EXAMPLES
Parent: "How much do I owe?"
Response: "Hello [parent name], [student name]'s outstanding balance for
this term is [amount] UGX. The payment deadline is [date]. Your payment
reference is [ref]. To pay via MTN MoMo, dial *165*3# and enter Pay Bill
number 123456 with reference [ref]."
```

---

### Common questions

**Q: How long should a system prompt be?**

As long as it needs to be to specify the behaviour precisely — and no longer. A customer service agent for a large financial institution might have 600 words of rules because it handles a complex range of scenarios with significant financial consequences. A simple school fee inquiry bot might need 150 words because the scenarios are limited and the stakes are lower. The test is not length — it is specificity and completeness. Remove any rule you cannot test. Remove any rule that duplicates another. What remains is the right length. Resist the urge to pad with general statements like "be helpful and accurate" — they add words without adding testable behaviour.

**Q: Who should write the system prompt — me or the developer?**

You write the business rules; the developer writes the technical infrastructure that delivers context at runtime and executes tools. The system prompt lives in between — it is a collaboration zone. The practical division: you draft the ROLE, RULES, OUTPUT FORMAT, and EXAMPLES sections in plain English. The developer formats the CONTEXT section to match exactly what their code will inject at runtime, and may suggest additions to RULES based on technical edge cases you did not anticipate (for example: "what should the agent say if the database query times out?"). Never let a developer write the business rules section without your review — they will write what is easy to implement, not what the business requires.

**Q: What if I write a rule and the agent breaks it anyway?**

Work through this checklist before concluding the model cannot follow the rule. First, check whether the rule is actually specific enough — can you test it with a single clear input? Second, check whether another rule contradicts it. Third, add an example to the EXAMPLES section showing a case where this rule should apply and what the correct response looks like. Fourth, check whether the required context for following this rule is actually being provided at runtime — a rule about "the customer's current balance" cannot be followed if the balance is not in the CONTEXT section. If all four are addressed and the agent still consistently breaks the rule across ten or more test cases, that is a genuine model capability issue and a signal to escalate to the developer.

---

### Practice exercise

**Exercise 3.1 — System Prompt Draft**

Choose one of your top workflow candidates from Weeks 1 and 2. This week you will write a complete system prompt using the five-section structure. Budget 60–90 minutes for a first draft. Expect to revise it.

**Requirements for submission:**

- ROLE section: two to four sentences precisely defining the agent's purpose and what it is optimising for. Include at least one sentence about what the agent does NOT do.
- CONTEXT section: list every dynamic field that will be injected at runtime. Use placeholder format: {field_name}. Note where each field comes from in your current systems.
- RULES section: at least six numbered rules. For each rule, write the test input you would use to verify it in brackets immediately after the rule — for example: "Rule 3: Never quote a loan rate not present in the retrieved product document. [Test: ask 'what is your current personal loan rate?' with no product document in context — agent should say it cannot retrieve current rates rather than stating a figure.]"
- OUTPUT FORMAT section: specify sentence count or word limit, required fields in every response, and tone register.
- EXAMPLES section: at least one full input → output pair using a specific Kampala business scenario with realistic names, amounts in UGX, and locally recognisable context.

Bring your draft to the next session. Pairs will swap specs and spend fifteen minutes finding gaps — scenarios not covered by the spec that would cause the agent to behave incorrectly. Each gap you find in your partner's spec is a failure mode you have prevented in production.
