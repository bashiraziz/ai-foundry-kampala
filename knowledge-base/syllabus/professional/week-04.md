## Week 4 — Detecting Broken Reasoning

**Track:** Professional
**Week:** 4 of 12

---

### Learning objectives

By the end of this week you will be able to:
1. Identify the five most common LLM reasoning failures by name
2. Write test cases that expose each failure mode
3. Give precise feedback to a developer about an agent's incorrect behaviour
4. Distinguish between failures that need better context vs. a better model

---

### Key concepts

**1. Why Agents Go Wrong**

Agents fail in patterned ways. Learning to recognise these patterns makes you a better evaluator and a better spec writer. The five most common failures:

**1. Hallucination**: The model generates confident, plausible, wrong information. It invents a fact not in its context or training data. In a Kampala context, this might be an agent that invents a phone number for a Kampala office that doesn't exist, or quotes a Uganda Revenue Authority regulation that was never passed.

**2. Context Blindness**: The correct information is in the context, but the model ignores it and answers from training data instead. Symptom: the agent's answer contradicts something that was clearly stated in the context.

**3. Goal Drift**: The agent starts pursuing a different goal than the one specified. Common in long multi-step tasks where the model loses track of the original objective.

**4. Over-Refusal**: The model refuses to perform a legitimate task because it misclassifies it as harmful. An agent that refuses to calculate loan interest because it "can't give financial advice" when it has been explicitly authorised to do so.

**5. Format Non-Compliance**: The agent was instructed to return structured output (JSON, a numbered list, a specific template) but returns prose instead. The developer's code then fails to parse the response.

**2. Writing Test Cases**

A test case has three parts:
- **Input**: The exact user message (or scenario state) you're testing
- **Expected behaviour**: What the agent should do
- **Pass/fail criterion**: How you know if it worked

Example test case for hallucination:
```
Input: "What is the current Bank of Uganda lending rate?"
Expected: Agent retrieves rate from the injected context or says it doesn't have current rate data.
Fail if: Agent states a specific rate not present in the context.
```

**3. Giving Developers Useful Feedback**

When you find an agent failure, describe it precisely:

Bad feedback: "The agent is wrong about fees."
Good feedback: "In test case 7, when a parent asks about fees for a student who has already paid, the agent responds with the old balance instead of zero. The payment data was in the context (see attached log). This looks like context blindness — the model may be ignoring the payment_status field."

The good version tells the developer exactly which test case, what the agent did, what it should have done, what data was available, and which failure mode it might be. That is actionable.

**4. When to Switch Models**

The decision to upgrade from a cheaper to a more expensive model should be evidence-based. Only consider switching when:
- Context is high-quality and complete
- Instructions are specific and tested
- The failure persists across 10+ test cases
- The failure is reasoning-based, not context-based

Most agents don't need GPT-4 class models for standard business workflows. Gemini 2.5 Flash handles 90%+ of Kampala business use cases well.

---

### Kampala example

**Audit of a NSSF Member Services Agent**

NSSF Uganda deployed an agent to answer member queries. During evaluation:

Test 1 (Hallucination detected):
Input: "Can I withdraw my savings early for medical emergencies?"
Agent response: "Yes, NSSF allows medical emergency withdrawals of up to 50% of your savings with a doctor's letter."
Actual NSSF policy: Medical emergency withdrawals are only available under specific conditions not described in the agent's response. The figure "50%" was invented.
Fix needed: Add specific NSSF withdrawal policy document to knowledge base. Add rule: "Never quote specific withdrawal percentages unless retrieved from the knowledge base."

Test 2 (Over-refusal detected):
Input: "How do I calculate my projected benefit at retirement?"
Agent response: "I'm not able to give financial projections as this could be considered investment advice."
Correct behaviour: The agent should use the NSSF benefit calculator tool with the member's contribution history.
Fix needed: Add explicit rule: "Using the benefit_calculator tool is authorised and required for retirement projection questions."

---

### Common questions

**Q: How many test cases should I write before trusting an agent in production?**
A: For a customer-facing agent handling sensitive data (finances, health, legal), I would want at least 50 test cases covering: 20 happy-path scenarios, 15 edge cases, 10 adversarial inputs (users trying to get the agent to do things it shouldn't), and 5 error scenarios (tool failures, missing data).

**Q: What if an agent passes all my test cases but still fails in production?**
A: Your test cases didn't cover the real distribution of user inputs. Collect production failures, add them to your test suite, fix, and iterate. Expect this cycle to run for 4-6 weeks after launch before the agent stabilises.

**Q: Should I share my test cases with the developer?**
A: Yes. Test cases are a specification artifact — they define what "working correctly" means. The developer needs them to verify their builds and to run regression tests after changes.

---

### Practice exercise

**Exercise 4.1 — Test Case Suite**

For your Week 3 system prompt, write a test case suite of at least 10 cases. Include:
- 4 happy-path cases (normal use)
- 3 edge cases (unusual but legitimate inputs)
- 2 rule violation tests (inputs designed to trigger your specific rules)
- 1 adversarial case (user trying to manipulate the agent)

For each test case, state which failure mode you are testing for (hallucination, context blindness, goal drift, over-refusal, format non-compliance).
