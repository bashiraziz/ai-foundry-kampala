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

**1. Running Your Test Suite**

This week you switch from spec writer to QA reviewer. Take your 10 test cases from Week 4 and run each one against the deployed staging agent. For each:

- Record the exact input you used
- Record the exact output you received
- Mark pass or fail
- For failures: note which failure mode applies (hallucination, context blindness, goal drift, over-refusal, format non-compliance)

Score: X / 10 passed.

If the score is 8 or higher, the agent is in acceptable shape for Demo Day with targeted fixes.
If the score is below 7, you have a problem and need to triage with the developer today.

**2. Writing a Structured Bug Report**

A bug report has five fields:

```
Bug ID: [number]
Test Case: [which test case from your suite]
Input: [exact text used]
Expected: [what should have happened]
Actual: [what did happen]
Failure mode: [hallucination / context blindness / goal drift / over-refusal / format]
Priority: [Blocker / High / Low]
Suggested fix: [your hypothesis — often "check the system prompt rule X" or "add test case to knowledge base"]
```

Filing a bug without the "actual" and "suggested fix" fields wastes the developer's time. Filing it without "priority" forces them to guess. The structured format is respect for their time.

**3. Triage Priority**

Not all bugs are equal. Prioritise:

**Blocker**: The agent cannot complete the core demo script use case. Must be fixed before Demo Day.
Example: Agent fails to retrieve student balance in the fee query demo flow.

**High**: Fails a test case that involves a significant business risk (wrong financial data, inappropriate escalation trigger). Should be fixed before Demo Day.
Example: Agent quotes incorrect MTN MoMo Pay Bill number.

**Low**: Agent gives a slightly awkward response, doesn't follow tone guidelines precisely, minor format issue. Polish for after Demo Day.
Example: Agent says "your balance is UGX 1250000" instead of "1,250,000 UGX."

**4. The Acceptance Review Meeting**

Run a formal acceptance review with the developer before Demo Day. Agenda:

1. Test suite results (share the scorecard)
2. Blocker triage: identify fixes, assign, set deadline (must be before Demo Day)
3. Developer walkthroughs system prompt, tools, error handling
4. Demo script dry run — live, on the deployed staging URL
5. Sign-off: "We accept this build for Demo Day with the following outstanding items..."

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
Suggested fix: Add to system prompt Rule 8: "If applicant states they are below 18 years old, respond: 'This application does not qualify. Applicants must be 18 or older. If you believe this is an error, please contact a branch.'"
```

Developer implemented fix in 45 minutes. Re-test passed.

---

### Common questions

**Q: What if the developer disagrees with my bug assessment?**
A: "The system prompt says X, the agent did Y" is objective. If the developer says the behaviour is intentional, ask them to point to the spec section that authorises it. If it's not in the spec, it's a gap — add it and fix it.

**Q: How many bugs is too many going into Demo Day?**
A: Zero blockers. Any number of low-priority issues is acceptable for a capstone demo. Professional products require full test suite coverage; Demo Day requires a working demo script.

**Q: Should I retest after the developer makes fixes?**
A: Yes, always. Fixes sometimes break other test cases. Rerun all 10 tests after any change to the system prompt or tools.

---

### Practice exercise

**Exercise 11.1 — Test Suite Execution**

Run your complete test suite against your capstone agent (on staging). Produce:

1. A scored test result table (input, expected, actual, pass/fail for each test case)
2. A structured bug report for every failed test case
3. A triage priority for each bug
4. An acceptance review summary: "The build is / is not ready for Demo Day because..."

Share both the test results and bug reports with your developer partner. The developer should acknowledge each bug within 24 hours with either a fix or a timeline.
