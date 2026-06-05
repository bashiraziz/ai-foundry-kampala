## Week 3 — Context Engineering and Prompt Design

**Track:** Developer
**Week:** 3 of 12

---

### Learning objectives

By the end of this week you will be able to:
1. Write a production-quality system prompt with role, rules, output format, and guardrails
2. Apply the three-part message structure: system, user, assistant
3. Use few-shot examples to constrain model output format
4. Diagnose common prompt failures and fix them

---

### Key concepts

**1. Context Engineering vs. Prompt Engineering**

Prompt engineering focuses on the text you send. Context engineering is broader — it is the discipline of deciding what information to put in the context window, in what order, in what format, to produce reliable agent behaviour.

Bad context engineering is the #1 reason agents fail in production. The model is not the problem. The context is. If you give the model ambiguous instructions, incomplete information, or contradictory rules, it will produce inconsistent output — not because it is broken, but because the instructions are broken.

**2. System Prompt Structure**

A production system prompt has five sections:

```
1. ROLE        — who the agent is and what it is optimising for
2. CONTEXT     — facts about the current situation (injected dynamically)
3. RULES       — what it must and must not do (numbered, specific)
4. OUTPUT FORMAT — exactly what the response should look like
5. EXAMPLES    — 1-3 input/output pairs showing the format
```

Example rule quality:
- Weak: "Be helpful and professional"
- Strong: "Never suggest a price below 50,000 UGX. If the customer asks for a lower price, explain the minimum and offer a payment plan."

**3. Few-Shot Examples**

Few-shot means giving the model 2-5 examples of input → output pairs in the prompt itself. This is the most reliable way to enforce output format. For a quiz generator, you would include one complete example question with all four fields filled in.

Few-shot examples should be:
- Representative of the real distribution (include edge cases)
- In the exact output format you require
- Short enough to leave room for the actual task

**4. Temperature and Sampling**

Temperature controls randomness:
- Temperature 0 = deterministic (same output every time for same input). Use for structured data extraction, classification, JSON generation.
- Temperature 0.7-1.0 = creative. Use for explanations, suggestions, content generation.

For the quiz generator in this app, temperature 0.2 is appropriate — you want varied questions but reliable JSON format.

**5. Output Parsing**

Models sometimes refuse to follow format instructions. Your code must handle this gracefully:
- Strip markdown fences (` ```json `) before parsing
- Use `JSON.parse` inside a try/catch
- If parsing fails, retry once with an explicit "return only valid JSON" instruction
- If retry fails, return a graceful error to the user

The quiz API route in this app does exactly this.

---

### Kampala example

**System prompt for a boda dispatch agent**

```
ROLE
You are a boda boda dispatch coordinator for SafeRide Kampala. You assign 
riders to delivery requests to minimise total delivery time. You manage 
35 riders across Kampala, Ntinda, Bukoto, and Kololo zones.

CONTEXT
Current time: {time}
Available riders: {rider_list}
Pending orders: {order_list}
Traffic status: {traffic}

RULES
1. Never assign a rider who has been riding for more than 4 hours without a break
2. Always prefer riders already near the pickup zone
3. If no rider is available within 15 minutes of pickup, escalate to human dispatcher
4. Never reveal rider phone numbers to customers — use order ID only
5. All confirmations must include estimated arrival time in minutes

OUTPUT FORMAT
Return a JSON object: {"assignments": [{"orderId": "...", "riderId": "...", "eta_minutes": N}], "escalations": [...]}
```

This prompt is specific, constrained, and parseable. The model knows exactly what it needs to output.

---

### Common questions

**Q: How long should a system prompt be?**
A: As long as it needs to be and no longer. A good benchmark: if you can't explain every line of your system prompt and why it is there, it is too long. Start minimal and add rules only when you observe specific failures.

**Q: What if the model ignores my format instructions?**
A: First, check if your format section is ambiguous. Second, add a concrete example (few-shot). Third, try starting the assistant's response yourself — some APIs allow you to prefill the beginning of the assistant message, which forces the model to continue in the specified format. Fourth, use a structured output API (Gemini and OpenAI both support JSON schema-constrained output).

**Q: Can I put too many rules in a system prompt?**
A: Yes. More than 15-20 rules and the model starts to lose track of the less important ones. Prioritise: put the most critical rules first, use numbered lists, and remove any rule you have never actually needed.

---

### Practice exercise

**Exercise 3.1 — System Prompt Rewrite**

Here is a broken system prompt for a school fees reminder agent:

```
You are an AI assistant that helps schools. Be helpful and professional. 
Answer questions about fees. Don't be rude. Help parents understand their 
fees situation. Be accurate.
```

Rewrite it using the five-section structure. The agent works for Kampala Parents School, sends fee reminders via SMS, and must:
- Never reveal another family's balance
- Always include the payment deadline
- Support MTN MoMo and Airtel Money payment references
- Escalate to the bursar if a balance is disputed

Write your rewrite, then test it by writing three example inputs and predicting what the output should be.
