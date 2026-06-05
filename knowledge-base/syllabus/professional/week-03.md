## Week 3 — Markdown Specs: Writing Instructions AI Can Follow

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

Markdown is plain text with minimal formatting. It is readable by humans, writeable in any text editor, parseable by code, and has become the standard format for AI system prompts. A Professional who can write markdown specs is a Professional who can communicate precisely with both developers and AI models.

You do not need to know HTML, CSS, or programming. You need to know: headings (`##`), bullet points (`-`), numbered lists (`1.`), bold (`**text**`), and code blocks (triple backtick).

**2. The Five-Section System Prompt**

Every agent needs instructions. Those instructions — the system prompt — should follow this structure:

```
## ROLE
Who is this agent? What is it optimising for?

## CONTEXT
[Dynamic section — populated at runtime with retrieved data]

## RULES
Numbered list of specific, testable rules.

## OUTPUT FORMAT
Exactly what the response should look like.

## EXAMPLES
1-3 input → output pairs.
```

**3. The Difference Between Vague and Specific**

The most common Professional mistake is writing instructions that feel specific but aren't.

**Vague**: "Be professional and accurate. Don't make things up. Help the customer."
**Specific**: 
```
1. Only answer questions about Stanbic Uganda products and services.
2. Never quote interest rates from memory — always retrieve from the product database.
3. If a customer asks about a competitor's product, acknowledge their question and redirect: "I can help you understand how our [closest product] compares."
4. Every response must end with the customer service number: 0800 222 000.
```

The specific version is testable. You can give the agent inputs and verify whether it follows each rule.

**4. Testable Rules**

A good rule is one you can test with a specific input. For each rule you write, ask: "What input would I use to check whether this rule is being followed?"

Bad rule: "Be empathetic with upset customers."
Test: How do you measure empathy? You can't reliably.

Better rule: "If a customer uses the words 'frustrated', 'angry', 'disappointed', or 'terrible', acknowledge their feeling in the first sentence of your response before addressing their issue."
Test: Send a message containing "I'm so frustrated with this service." Check that the first sentence acknowledges the feeling.

---

### Kampala example

**System prompt for a Kampala Parents School fee query agent**

```markdown
## ROLE
You are the fees inquiry assistant for Kampala Parents School. You help parents 
understand their child's fee balance, payment deadlines, and payment methods. 
You are polite, clear, and efficient. You do not have access to other schools' 
fee information.

## CONTEXT
Parent's name: {parent_name}
Student name: {student_name}
Class: {student_class}
Outstanding balance: {balance_ugx} UGX
Current term payment deadline: {deadline}
Payment reference number: {payment_ref}

## RULES
1. Never reveal fee balances for other students — only the student in this session.
2. Always include the payment reference number in any response about making a payment.
3. Support exactly two payment methods: MTN MoMo (Pay Bill: 123456) and Airtel Money (Pay Bill: 789012).
4. If a parent disputes their balance, say: "I've noted your dispute. A member of the bursary team will contact you within 24 hours." Do not argue.
5. Never promise a fee waiver, discount, or extension without a bursar confirmation code.
6. All monetary amounts must be in UGX with comma separators (e.g., 1,250,000 UGX).

## OUTPUT FORMAT
Responses should be 2-4 sentences. Conversational but professional.
For payment instructions, use a numbered list.

## EXAMPLES
Parent: "How much do I owe?"
Response: "Hello [parent name], [student name]'s outstanding balance for this term is 
[amount] UGX. The payment deadline is [date]. Your payment reference is [ref]. 
To pay via MTN MoMo, dial *165*3# and enter Pay Bill number 123456."
```

---

### Common questions

**Q: How long should a system prompt be?**
A: As long as it needs to be. A customer service agent for a large institution might have 500 words of rules. A simple FAQ bot might have 100. The test is not length — it is specificity. Remove any rule you cannot test.

**Q: Who should write the system prompt — me or the developer?**
A: You write the business rules; the developer writes the technical infrastructure. The system prompt lives in between — it is a collaboration. Start with your business rules in plain English, then work with the developer to format them correctly.

**Q: What if I write a rule and the agent breaks it anyway?**
A: First, check if the rule is actually specific enough (see above). Second, add an example showing a case where the rule should apply. Third, check if other rules contradict it. If all three are addressed and the agent still breaks the rule, that is a model capability issue — and a signal to escalate to the developer.

---

### Practice exercise

**Exercise 3.1 — System Prompt Draft**

Choose one of your top workflow candidates from Weeks 1-2. Write a complete system prompt using the five-section structure.

Requirements:
- At least 6 numbered rules
- Each rule must be testable (write the test input next to each rule in brackets)
- At least one example with a specific Kampala business scenario
- Output format specified precisely (sentence count, tone, required fields)

Bring your draft to the next session. Pairs will swap specs and try to find the gaps — things the spec doesn't cover that would cause the agent to behave incorrectly.
