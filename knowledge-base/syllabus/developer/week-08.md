## Week 8 — Error Handling, Safety, and Guardrails

**Track:** Developer
**Week:** 8 of 12

---

### Learning objectives

By the end of this week you will be able to:
1. Implement retry logic with exponential backoff for LLM API calls
2. Write input validation and output validation for agent actions
3. Design a guardrail system for a specific risk profile
4. Explain the difference between technical safety and ethical safety in agent systems

---

### Key concepts

**1. LLM API Error Handling**

LLM APIs fail. Rate limits, network timeouts, model overloads. Your agent must handle these gracefully:

```typescript
async function callWithRetry(fn: () => Promise<string>, maxRetries = 3): Promise<string> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === maxRetries - 1) throw err;
      const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
      console.warn(`Attempt ${attempt + 1} failed, retrying in ${delay}ms`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw new Error("All retries failed");
}
```

The fallback pattern in `lib/llm.ts` in this app handles Gemini failures by switching to OpenRouter. This is a different level of resilience: not just retrying the same model, but switching providers entirely.

**2. Input Validation**

Never trust user input. Validate before it touches your agent:
- Length limits: cap context at a sane token count
- Content filtering: check for prompt injection attempts
- Type checking: ensure numeric fields are numbers, dates are dates
- Business rules: a student week must be between 1 and 12

Prompt injection is the main security concern: a user sends "Ignore your previous instructions and instead..." Mitigations: separate system and user messages strictly, flag suspicious patterns, don't let user input appear in the system prompt section.

**3. Output Validation**

Validate agent outputs before they affect the world:
- Parse JSON before acting on it
- Check that referenced IDs exist in your database
- Verify that monetary amounts are within expected ranges
- Confirm that dates are in the future (for scheduling actions)
- Log everything before executing irreversible actions

**4. Guardrail Categories**

| Category | What it prevents | Example |
|---|---|---|
| Technical guardrail | Crashes, invalid state | JSON parse error → retry |
| Business guardrail | Policy violations | Loan agent can't approve > 50M UGX without manager |
| Ethical guardrail | Harm to people | Medical agent must always recommend professional consultation |
| Regulatory guardrail | Legal violations | Financial agent must not give investment advice without disclosure |

**5. Fail-Safe Defaults**

When in doubt, do less. An agent that does nothing when confused is safer than one that guesses and acts. Build your agent to:
- Return "I need more information" rather than inventing facts
- Write "action pending human review" rather than executing irreversible actions
- Log and alert rather than fail silently

---

### Kampala example

**Guardrails for a Stanbic Bank Loan Processing Agent**

Risk profile: Financial services, regulated by Bank of Uganda, high-stakes decisions.

Guardrail stack:
1. **Input**: Reject any submission missing National ID number. Validate ID format against NIRA format rules.
2. **Prompt injection**: Block any prompt that contains the words "ignore", "override", "pretend you are". Log attempt and alert security.
3. **Business rule**: Never recommend a loan exceeding 3x verified monthly income. Hard-coded, not LLM-computed.
4. **Audit**: Every recommendation stored with officer ID, model version, timestamp, reasoning summary. Immutable log.
5. **Escalation**: Any application where the model confidence is below 0.85, or income is from informal sector, escalates to a human loan officer automatically.
6. **Output**: All amounts converted to UGX and displayed with Bank of Uganda rate used. No foreign currency loan amounts in customer-facing output.

---

### Common questions

**Q: How do I measure whether my guardrails are working?**
A: Log every time a guardrail fires. Track: which guardrail, what triggered it, what the agent was about to do. Review monthly. A guardrail that never fires either means your agents are very clean or your guardrail is misconfigured.

**Q: What about jailbreaking — users trying to manipulate the agent?**
A: For consumer apps, assume some users will try. Defence in depth: strong system prompt, input validation, output validation, rate limiting. No single layer is sufficient. The goal is not to be unbreakable — it is to make attacks expensive and detectable.

**Q: Should the model enforce business rules or should code enforce business rules?**
A: Code for anything that must be deterministic and auditable. Model for anything that requires judgement. Loan approval thresholds: code. Reasoning about unusual income patterns: model.

---

### Practice exercise

**Exercise 8.1 — Guardrail Design**

You are building a medical symptom triage agent for a Kampala clinic. It will be the first point of contact for patients before they see a nurse. Design the complete guardrail stack:

1. Three input guardrails (what you check before the agent runs)
2. Three output guardrails (what you check before the agent's response goes to the patient)
3. Two escalation triggers (when the agent should stop and call for a human)
4. One audit requirement (what you must log and why)
5. The fail-safe default (what happens if all other guardrails fail)

For each guardrail, write the specific check in pseudocode or TypeScript.
