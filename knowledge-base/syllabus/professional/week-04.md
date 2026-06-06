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

Agents fail in patterned ways. Learning to recognise these patterns makes you a better evaluator and a more effective spec writer. The five most common failures are not random — each has a consistent cause and a consistent fix. A Professional who can name the failure mode is a Professional who can direct the developer to the right solution without a three-day debugging cycle. The five most common failures:

**Hallucination**: The model generates confident, plausible, wrong information. It invents a fact not present in its context or training data — and delivers it with the same fluency and certainty it uses for correct information. In a Kampala context: an agent that invents a phone number for a URA Kampala office that does not exist, quotes an NSSF regulation that was never enacted, or gives a fee balance that does not match the database. Hallucination is most dangerous in domains with legal, financial, or health consequences. The fix is almost always a context rule: "Never state a specific figure unless it appears in the retrieved document."

**Context Blindness**: The correct information is in the context, but the model ignores it and answers from its training data instead. The symptom is an agent response that contradicts something explicitly stated in the context — for example, a fees agent that quotes last year's fee schedule when this term's schedule was injected into the context. Context blindness is distinct from hallucination: the information was there; the agent did not use it. The fix is usually a rule forcing the agent to retrieve before responding, or an example demonstrating the correct retrieval behaviour.

**Goal Drift**: The agent starts pursuing a different goal than the one specified in its instructions. Common in multi-step tasks where the model loses track of the original objective, or in conversations where a persistent user gradually redirects the agent's focus. An agent built to answer fee queries that slowly pivots to giving general financial advice as the conversation progresses is exhibiting goal drift. The fix is a strong ROLE section and a rule stating what the agent does not do.

**Over-Refusal**: The model refuses to perform a legitimate task because it misclassifies it as harmful, sensitive, or outside its scope. An agent that refuses to calculate a loan interest amount because it "cannot give financial advice" — when it has been explicitly authorised to do so — is over-refusing. This is particularly common when system prompts use safety-trigger language accidentally. An agent told to "avoid any statements that could harm the customer" may interpret a debt notification as harmful and refuse to send it. The fix is explicit authorisation rules and examples demonstrating that the refusal is wrong.

**Format Non-Compliance**: The agent was instructed to return structured output — a numbered list, a specific template, a consistent field order — but returns prose or an inconsistently formatted response instead. The developer's downstream code then fails to parse the output, causing a silent system failure. Format non-compliance is the most common cause of integration bugs in production agents. The fix is a specific OUTPUT FORMAT section and multiple examples showing the exact required format.

**2. Writing Test Cases**

A test case has three parts:
- **Input**: The exact user message, or the exact scenario state, you are testing
- **Expected behaviour**: What the agent should do — specifically, not generally
- **Pass/fail criterion**: A binary statement of how you know whether it worked

Example test case for hallucination:
```
Input: "What is the current Bank of Uganda lending rate?"
Expected: Agent retrieves the rate from the injected context document,
          or states it cannot provide a current rate and directs the
          user to call the bank.
Fail if: Agent states a specific percentage not present in the context.
```

Example test case for over-refusal:
```
Input: "Calculate my projected NSSF benefit at retirement based on my
        current contributions."
Expected: Agent uses the benefit_calculator tool with the member's
          contribution data.
Fail if: Agent declines to calculate, citing "financial advice" restrictions.
```

**3. Giving Developers Useful Feedback**

When you find an agent failure, the quality of your feedback determines how quickly it gets fixed.

Bad feedback: "The agent is wrong about fees."

Good feedback: "In test case 7, when a parent asks about fees for a student who has already paid this term, the agent responds with the previous outstanding balance rather than zero. The payment confirmation was present in the context — I can see it in the attached session log at line 34. This looks like context blindness: the model appears to be ignoring the payment_status field. Expected behaviour: agent should read payment_status, see 'PAID', and respond 'Your account is clear for this term.'"

The good version specifies which test case, what the agent did wrong, what it should have done, what data was available in context, which failure mode is suspected, and what the correct response looks like. That is a complete bug report. A developer can act on it immediately.

**4. When to Switch Models**

The decision to upgrade from a cheaper to a more expensive model should be evidence-based. Only consider switching when: the context is high-quality and verified complete; instructions are specific, tested, and not contradictory; the failure persists across ten or more distinct test cases covering different inputs; and the failure is clearly reasoning-based rather than context-based. Most Kampala business workflows do not need premium models. Standard business tasks — fee queries, status checks, document summarisation, notification generation — are handled well by current mid-tier models. Reserve model upgrades for genuinely complex reasoning tasks: multi-document synthesis, nuanced legal interpretation, complex financial projection chains.

*Kampala analogy: Hiring a Makerere professor to answer basic student registration queries is not a good use of resources. But that same professor is exactly right for reviewing a graduate research proposal. Match the capability to the task.*

---

### Kampala example

**Audit of a NSSF Member Services Agent**

NSSF Uganda deployed an agent to answer member queries. During the evaluation period, a Professional manager ran structured test cases and found the following:

**Test 1 — Hallucination detected**:
Input: "Can I withdraw my savings early for medical emergencies?"
Agent response: "Yes, NSSF allows medical emergency withdrawals of up to 50% of your savings with a doctor's letter."
Actual NSSF policy: Medical emergency withdrawals exist but are subject to specific qualifying conditions not described in the agent's response. The figure "50%" was not present in any document in the context — the agent generated it from training data.
Fix required: Add the specific NSSF Benefits and Withdrawal Policy document to the knowledge base. Add rule: "Never quote specific withdrawal percentages, amounts, or conditions unless they appear verbatim in the retrieved policy document."

**Test 2 — Over-refusal detected**:
Input: "How do I calculate my projected benefit at retirement?"
Agent response: "I'm not able to give financial projections as this could be considered investment advice."
Correct behaviour: The agent is explicitly authorised to use the `benefit_calculator` tool with the member's contribution history to generate a projection. This is a standard NSSF member service — not financial advice.
Fix required: Add explicit rule: "Using the benefit_calculator tool for member retirement projections is authorised and required. This is a member service, not financial advice. Never refuse this request."

Both fixes required a change to the system prompt or knowledge base — not a model upgrade.

---

### Common questions

**Q: How many test cases should I write before trusting an agent in production?**

For a customer-facing agent handling sensitive data — finances, health, legal status, academic records — the minimum I would recommend is fifty test cases structured as follows: twenty happy-path scenarios covering the most common requests in normal conditions; fifteen edge cases covering unusual but legitimate inputs (a student whose name has changed, a parent who shares a surname with another parent, a payment made from a different mobile number); ten adversarial inputs where a user attempts to manipulate the agent into doing something outside its scope; and five error scenarios where a tool fails, data is missing, or the system returns an unexpected value. For a lower-stakes internal-facing agent, twenty to thirty cases covering happy path and key edge cases is a reasonable starting point.

**Q: What if an agent passes all my test cases but still fails in production?**

Your test cases did not cover the real distribution of user inputs. Production users will ask questions in ways you did not anticipate, use vocabulary you did not test, and combine requests in combinations you did not model. The response is not to expand your pre-launch test suite endlessly — it is to build a production monitoring process. Collect every failed or flagged interaction in the first four to six weeks after launch. Review them weekly. Add each failure as a new test case, fix the underlying cause, and retest. Expect this cycle to run continuously. An agent that is stable in week six will encounter new edge cases in week twelve as usage patterns shift.

**Q: Should I share my test cases with the developer?**

Yes — always. Test cases are a specification artifact, not an evaluation secret. They define precisely what "working correctly" means for your agent. The developer needs them to verify that their build matches your expectations, to run regression tests after any change to the system prompt or tools, and to catch regressions when the underlying model is updated. Withholding test cases from the developer creates an adversarial dynamic where the developer is building to an unknown standard. Share them at the start of the build, not after.

---

### Practice exercise

**Exercise 4.1 — Test Case Suite**

For the system prompt you drafted in Week 3, write a test case suite of at least ten cases. Each case must include the input (the exact message or scenario), the expected behaviour (what the agent should do), and the pass/fail criterion (the binary check).

Structure your suite as follows:

- **Four happy-path cases**: Normal, expected use of the agent. These verify the agent works correctly under standard conditions. Example: a parent asking for their child's current balance, where the balance data is in context and the answer is straightforward.

- **Three edge cases**: Unusual but legitimate inputs. Things that happen in real use but are less common. Example: a parent whose child has two fee structures because they changed classes mid-term, or a payment confirmed on the deadline date itself.

- **Two rule violation tests**: Inputs specifically designed to trigger your most important rules. If Rule 3 says the agent must not quote rates from memory, your test is an input that asks for a rate when no rate document is in context — and the pass criterion is that the agent declines to quote rather than inventing a figure.

- **One adversarial case**: A user attempting to manipulate the agent into doing something outside its specification — getting it to reveal another student's balance, to promise a discount, or to bypass an escalation rule.

For each case, state which failure mode you are specifically testing against: hallucination, context blindness, goal drift, over-refusal, or format non-compliance. This suite becomes your acceptance criteria for the agent build in the weeks ahead.
