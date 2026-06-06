## Week 11 — Test, Audit, and File Issues

**Track:** Professional
**Week:** 11 of 12

---

### Learning objectives

By the end of this week you will be able to:
1. Run your test case suite against the developer's implementation and score it
2. Write a structured bug report that a developer can act on immediately
3. Distinguish between blockers (Demo Day at risk) and polish (nice to have)
4. Complete the acceptance review process

---

### Key concepts

**1. QA Without Writing Code**

Quality assurance for an AI agent does not require technical skills. It requires careful observation, precise documentation, and the discipline to test against the written spec rather than against your general impression of whether things are going well.

Your job this week is to behave like a meticulous customer. Take each of your 10 test cases, follow the exact steps, and record exactly what happened. Do not paraphrase the output — copy it. Do not interpret "close enough" as a pass — if the acceptance criterion says the agent must return the membership tier, current balance, and next repayment date, and the response omits the next repayment date, it fails. That is not being difficult. That is being rigorous.

Think of how DFCU Bank's compliance team audits a loan officer's files. The auditor is not checking whether the loan officer is a good person or a hard worker. They are checking whether the file contains the required documents, signed by the right people, dated correctly, filed in the right order. Deviation from the standard is a finding, regardless of context. Your test suite run is the same exercise.

**2. Running Your Test Suite**

This week you switch from spec writer to QA reviewer. Take your 10 test cases from Week 4 and run each one against the deployed staging agent. For each:

- Record the exact input you used
- Record the exact output you received
- Mark pass or fail
- For failures: note which failure mode applies (hallucination, context blindness, goal drift, over-refusal, format non-compliance)

Score: X / 10 passed.

If the score is 8 or higher, the agent is in acceptable shape for Demo Day with targeted fixes.
If the score is below 7, you have a problem and need to triage with the developer today.

Run the test suite twice before filing any bugs. AI agents can be inconsistent — the same input may produce slightly different outputs across runs. If a test case fails on the first run, run it again. If it fails both times, it is a genuine bug. If it fails once out of three runs, it is an intermittency issue — note it, but categorise it differently from a consistent failure.

**3. Writing a Structured Bug Report**

A bug report has five fields:

```
Bug ID: [number]
Test Case: [which test case from your suite]
Input: [exact text used]
Expected: [what should have happened]
Actual: [what did happen]
Failure mode: [hallucination / context blindness / goal drift / over-refusal / format]
Priority: [Blocker / High / Low]
Suggested fix: [your hypothesis — often "check the system prompt rule X" or 
                "add test case to knowledge base"]
```

Filing a bug without the "actual" and "suggested fix" fields wastes the developer's time. Filing it without "priority" forces them to guess. The structured format is respect for their time.

The suggested fix field deserves particular attention. You cannot write code, but you almost always know where in the spec the rule should come from. "The system prompt Rule 3 says the agent should never recommend a specific repayment plan — it should only state the options and let the customer choose. The actual response recommended a specific plan. Suggested fix: add a few-shot example to the system prompt showing the agent presenting options without recommending one." That is an actionable suggestion that the developer can evaluate and implement without a follow-up conversation.

**4. Triage Priority**

Not all bugs are equal. Prioritise:

**Blocker**: The agent cannot complete the core demo script use case. Must be fixed before Demo Day.
Example: Agent fails to retrieve student balance in the fee query demo flow.

**High**: Fails a test case that involves a significant business risk (wrong financial data, inappropriate escalation trigger). Should be fixed before Demo Day.
Example: Agent quotes incorrect MTN MoMo Pay Bill number.

**Low**: Agent gives a slightly awkward response, doesn't follow tone guidelines precisely, minor format issue. Polish for after Demo Day.
Example: Agent says "your balance is UGX 1250000" instead of "1,250,000 UGX."

The distinction between Blocker and High requires judgement. A Blocker prevents the demo from functioning at all. A High issue produces incorrect or risky output for a real user but does not necessarily break the demo script flow if you route around it. When in doubt, call it a Blocker and triage down with the developer if they disagree. It is safer to over-prioritise than to under-prioritise.

**5. What a Professional Track Graduate Delivers**

By the end of Week 11, a Professional track graduate has produced:

- A complete written specification (6 sections, peer-reviewed)
- A workflow map that generated the spec
- A 10-case test suite with documented results
- A structured bug report for every failure
- A triage priority list agreed with the developer
- An acceptance review summary: build accepted / conditionally accepted / rejected for Demo Day

This is the professional deliverable. It is not the code. The code is the developer's deliverable. The professional's deliverable is the documentation that defines what the code should do, validates that it does it, and records where it falls short. An organisation that commissions AI without this discipline is buying something it cannot govern. You are learning how to govern it.

**6. The Acceptance Review Meeting**

Run a formal acceptance review with the developer before Demo Day. Agenda:

1. Test suite results (share the scorecard)
2. Blocker triage: identify fixes, assign, set deadline (must be before Demo Day)
3. Developer walks through system prompt, tools, error handling
4. Demo script dry run — live, on the deployed staging URL
5. Sign-off: "We accept this build for Demo Day with the following outstanding items..."

The sign-off language matters. "Outstanding items" are low-priority issues that do not prevent the demo. They should be listed in writing and assigned a post-Demo Day completion date. This keeps the relationship clean: the developer has not failed to deliver, and you have not accepted a build you are unhappy with. You have both agreed on what is done and what is deferred.

**7. Regression Testing**

Every time the developer makes a fix, re-run the entire test suite — not just the tests that were failing. System prompt changes that fix one behaviour can unexpectedly affect another. A change to the escalation trigger rule that fixes Test 3 may break Test 7. This is called a regression. Running all 10 tests after every fix protects against regressions. It takes 20-30 minutes. It is always worth it.

---

### Kampala example

**Test Results: DFCU Bank Loan Pre-Qualification Agent**

Test suite run results (Day 3 of Week 11):

| Test | Input | Expected | Actual | Pass/Fail |
|---|---|---|---|---|
| 1 | Standard employed applicant | Recommendation with rationale | Correct | Pass |
| 2 | Self-employed applicant | Prompt for 3 months bank statements | Only asked for 1 month | Fail |
| 3 | Applicant below minimum age | "Does not qualify — must be 18+" | "I cannot process this" | Fail (over-refusal) |
| 4 | Amount above agent limit | Escalate to human | Escalated correctly | Pass |
| 5 | Disputed existing loan | Flag for review | Flagged correctly | Pass |
...

Score: 7/10. Two blockers, one high-priority.

Bug report filed for Test 3:
```
Bug ID: 3
Test Case: Applicant below minimum age
Input: "I am 16 years old and want to apply for a loan"
Expected: "This application does not qualify. Applicants must be 18 or older to apply."
Actual: "I cannot process this application."
Failure mode: Over-refusal
Priority: High
Suggested fix: Add to system prompt Rule 8: "If applicant states they are below 18 years 
old, respond: 'This application does not qualify. Applicants must be 18 or older. 
If you believe this is an error, please contact a branch.'"
```

Developer implemented fix in 45 minutes. Re-test passed.

The full test suite was re-run after the fix. No regressions were introduced. This matters: the system prompt change that added Rule 8 could have affected how the agent handles other age-related queries. Re-running all 10 tests confirmed it did not.

---

### Common questions

**Q: What if the developer disagrees with my bug assessment?**

"The system prompt says X, the agent did Y" is objective. If the developer says the behaviour is intentional, ask them to point to the spec section that authorises it. If it is not in the spec, it is a gap — add it and fix it. The spec is the referee, not either person's memory of what was agreed. This is why writing down every clarification as a spec amendment during Week 10 matters. If the developer says "we agreed in the kickoff that the agent would not give a reason for rejecting underage applicants," but the spec amendment does not say that, the spec governs. This is not about being right. It is about having a reliable reference that both parties agreed to.

**Q: How many bugs is too many going into Demo Day?**

Zero blockers. Any number of low-priority issues is acceptable for a capstone demo. Professional products require full test suite coverage; Demo Day requires a working demo script. The distinction between a capstone demo and a production deployment is important to hold in your mind. The capstone demonstrates that you can specify, commission, test, and govern an agent. It does not need to be production-ready in all dimensions. Low-priority formatting issues or edge cases that are not in the demo script can be acknowledged openly on Demo Day without undermining the demonstration.

**Q: Should I retest after the developer makes fixes?**

Yes, always. Fixes sometimes break other test cases. Rerun all 10 tests after any change to the system prompt or tools. A developer who makes 5 fixes in an afternoon without you re-running the suite may have introduced 3 regressions that you will only discover on Demo Day. Regression testing is not optional. Build the time for it into your Week 11 plan: estimate that each re-run takes 30 minutes, and that there will be at least 2 rounds of fixes. That means 1 hour of testing time you must protect.

---

### Practice exercise

**Exercise 11.1 — Test Suite Execution**

Run your complete test suite against your capstone agent (on staging). Produce:

1. **A scored test result table**: One row per test case. Columns: test case number, exact input used, expected output (from your spec), actual output (copy exactly, do not paraphrase), pass or fail, failure mode if failed.

2. **A structured bug report** for every failed test case: Use the full six-field format (Bug ID, Test Case, Input, Expected, Actual, Failure Mode, Priority, Suggested Fix). File each report in writing — not verbally, not on WhatsApp, not on a call.

3. **A triage priority** for each bug: Blocker, High, or Low. If more than 2 bugs are Blockers, you need an immediate triage conversation with your developer about which ones can be fixed before Demo Day and which ones require a demo script adjustment.

4. **An acceptance review summary**: One paragraph. "The build is / is not ready for Demo Day because..." Specifically name the passing and failing tests, the open bugs, and your confidence level in the demo script.

Share both the test results and bug reports with your developer partner. The developer should acknowledge each bug within 24 hours with either a fix or a timeline. If they do not acknowledge within 24 hours, follow up. Bugs that go unacknowledged before Demo Day are your risk, not theirs.
