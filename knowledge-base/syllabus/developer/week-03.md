## Week 3 — Context Engineering and Prompt Design

**Track:** Developer
**Week:** 3 of 12

---

### Learning objectives

By the end of this week you will be able to:
1. Write a production-quality system prompt with role, rules, output format, and guardrails
2. Apply the three-part message structure: system, user, assistant
3. Use few-shot examples to constrain model output format
4. Build a WhatsApp message classifier using structured JSON output
5. Diagnose common prompt failures and fix them

---

### Key concepts

**1. Context Engineering vs. Prompt Engineering**

Prompt engineering focuses on the text you send to the model in a single turn. Context engineering is the broader discipline of deciding what information goes into the context window, in what order, in what format, across the entire agent lifetime — to produce reliable, consistent agent behaviour. The distinction matters because prompt engineering is a craft skill (write better sentences), while context engineering is a systems skill (design the information architecture the agent operates within). Bad context engineering is the single largest cause of agent failures in production. The model is rarely the problem. If you give the model ambiguous instructions, contradictory rules, incomplete background knowledge, or poor examples, it will produce inconsistent output — not because it is broken, but because the inputs are broken. Most "the AI is wrong" complaints in production are actually "the context is wrong" problems.

*Kampala analogy:* A new employee at Garden City mall will perform exactly as well as their onboarding materials and their manager's instructions. Give them a vague job description and no examples, and they will improvise — sometimes correctly, sometimes not. Give them a precise role definition, clear rules, and worked examples, and they will perform consistently.

**2. System Prompt Structure**

A production system prompt has five sections, and every section earns its place. The **Role** section defines who the agent is, what it is optimising for, and what its primary constraints are — in two to four sentences. This is not a creative writing exercise; it is a precision instrument. The **Context** section contains facts about the current situation that are injected dynamically at runtime: the current time, the user's account details, relevant retrieved knowledge, current inventory levels. The **Rules** section contains numbered, specific, testable constraints — things the agent must always do, must never do, or must escalate. The **Output Format** section specifies exactly what the response should look like — JSON schema, field names, data types, maximum lengths. The **Examples** section contains one to three input-output pairs in the exact required format.

```
1. ROLE        — who the agent is and what it is optimising for
2. CONTEXT     — facts about the current situation (injected dynamically)
3. RULES       — what it must and must not do (numbered, specific)
4. OUTPUT FORMAT — exactly what the response should look like
5. EXAMPLES    — 1-3 input/output pairs showing the format
```

Rule quality is where most developers fail. Compare: "Be helpful and professional" (untestable, meaningless to the model) versus "Never suggest a price below 50,000 UGX. If the customer asks for a lower price, explain the minimum and offer a payment plan in three instalments." The second rule is specific, testable, and gives the model a clear action when the trigger condition fires.

**3. Few-Shot Examples**

Few-shot prompting means including two to five input-output pairs in the prompt itself, before the actual task. This is the most reliable single technique for enforcing output format. When you show the model exactly what correct output looks like on similar inputs, it generalises the pattern to the real input with high reliability. Few-shot examples should be representative — include edge cases in your examples, not just the easy cases, because edge cases are where format breaks down. They should be in the exact output format you require — if you want JSON, show JSON, not prose. They should be short enough to leave room in the context window for the actual task content.

A WhatsApp message classifier for a Kampala sacco might have these few-shot examples:

```
Input: "Osaawa bossy, I want to check my balance"
Output: {"intent": "balance_inquiry", "language": "luganda_mix", "urgency": "low"}

Input: "My payment bounced and I need it fixed TODAY"
Output: {"intent": "payment_dispute", "language": "english", "urgency": "high"}
```

The model learns the pattern from the examples and applies it to every new message.

**4. Temperature and Sampling**

Temperature controls how much randomness the model introduces when choosing its next token. Temperature 0 means the model always picks the highest-probability token — same output every time for the same input. Use this for structured data extraction, classification, JSON generation, and any task where consistency and format compliance matter more than variety. Temperature 0.7 to 1.0 introduces meaningful randomness — different outputs each time. Use this for content generation, brainstorming, explanation writing, and tasks where creative variation is valuable. For a WhatsApp classifier that must output valid JSON every time, use temperature 0 or very close to it. For an agent that writes different SMS payment reminders to avoid sounding repetitive to parents, use temperature 0.7. Getting this wrong is a common source of intermittent failures: a structured output task running at high temperature will produce invalid JSON unpredictably.

*Kampala analogy:* Temperature 0 is like a bank teller following the exact script for "how to process a deposit." Temperature 0.8 is like asking the same person to write a friendly message to a customer — you want something different each time, and you trust their judgment on the details.

**5. Output Parsing and Error Recovery**

Models sometimes produce output that is almost correct but fails to parse — a trailing comma in JSON, a markdown code fence wrapping the JSON object, a field name with a typo. Your code must handle this gracefully rather than crashing. The standard pattern: strip markdown fences before parsing, run `JSON.parse` inside a `try/catch`, and if parsing fails retry once with an explicit instruction appended to the prompt ("Return only valid JSON with no markdown, no explanation, nothing else"). If the second attempt also fails, return a structured error to the calling system — never crash silently. Log the raw model output that caused the failure so you can review it and improve the system prompt. Over time, patterns in your failure logs will tell you exactly what format instructions to add.

*Kampala analogy:* A form that arrives with a missing signature doesn't get shredded — it gets returned with a clear note: "Signature required on line 7." The agent's retry logic is that note.

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
6. If traffic on Entebbe Road is flagged as heavy, add 10 minutes to all Entebbe-zone ETAs

OUTPUT FORMAT
Return a JSON object:
{"assignments": [{"orderId": "...", "riderId": "...", "eta_minutes": N}], "escalations": [...]}

EXAMPLES
Input: 3 orders pending, all in Kololo zone, 2 riders available in Kololo, 1 in Ntinda
Output: {"assignments": [{"orderId": "ORD-001", "riderId": "R-07", "eta_minutes": 8}, {"orderId": "ORD-002", "riderId": "R-12", "eta_minutes": 11}], "escalations": [{"orderId": "ORD-003", "reason": "no_rider_within_15min"}]}
```

This prompt is specific, constrained, and parseable. The model knows exactly what it must output, what rules govern every decision, and what to do when exceptions occur. Compare this to "be a helpful dispatch assistant" — a prompt that would produce wildly inconsistent results across the first week of production.

---

### Common questions

**Q: How long should a system prompt be?**

As long as it needs to be, and no longer. A useful test: if you cannot explain every line of your system prompt and why it is there, it is too long. Remove lines you cannot justify. A good production system prompt for a focused agent is typically between 200 and 600 words. You will sometimes see prompts of 2,000+ words — these are usually agents that have accumulated rules reactively ("we added a rule every time something went wrong") rather than being designed deliberately. Start minimal and add rules only when you observe specific, repeated failures that a rule would prevent. Document why each rule exists in a comment block above the system prompt in your codebase — future you will thank present you.

**Q: What if the model ignores my format instructions?**

Work through this checklist in order. First, check if the format section is ambiguous — "return JSON" is ambiguous, "return a JSON object with exactly these fields in this structure" is not. Second, add a concrete few-shot example showing the exact format. Third, use structured output mode if your API supports it — both Gemini and OpenAI support JSON schema-constrained output that forces valid JSON at the API level. Fourth, try prefilling the start of the assistant message with an opening brace `{` — some APIs allow this and it forces the model to continue in JSON format. Fifth, lower the temperature — high-temperature settings introduce randomness that breaks format compliance. If all five steps fail, the problem is likely that your format is too complex for the model to produce reliably, and you should simplify the schema.

**Q: Can I put too many rules in a system prompt?**

Yes, absolutely. More than 15 to 20 numbered rules and the model begins to lose track of lower-priority ones, especially when they conflict with natural language tendencies or with each other. Three techniques help. Prioritise: put the most critical rules first, since models pay more attention to early content. Consolidate: two rules about the same topic (price minimums and payment plans) should be one rule. Prune: if you cannot recall why a rule is there or find a test case that would violate it, remove it. The goal is a minimal set of rules that covers all the failure modes you have actually observed, not a comprehensive list of everything the agent should theoretically do.

**Q: How do I build a WhatsApp message classifier for a Kampala business?**

Start with your system prompt defining the agent as a classifier, your output schema (a JSON object with an intent field, a language field, and an urgency field), and five to eight few-shot examples covering the most common message types and the trickiest edge cases. Use temperature 0. Connect it to your WhatsApp webhook — each incoming message gets passed to the classifier, which returns the JSON label. Route the message to the appropriate handler based on the intent field. The key engineering decisions: how many intent categories (fewer is more reliable), how to handle messages that fit two categories (pick the primary intent), and how to handle completely unintelligible messages (return intent: "unclear", route to human).

---

### Practice exercise

**Exercise 3.1 — System Prompt Rewrite**

Here is a broken system prompt for a school fees reminder agent:

```
You are an AI assistant that helps schools. Be helpful and professional. 
Answer questions about fees. Don't be rude. Help parents understand their 
fees situation. Be accurate.
```

Rewrite it using the five-section structure. The agent works for Kampala Parents School, contacts parents via SMS and WhatsApp, and must operate under these constraints:
- Never reveal another family's balance or payment status
- Always include the payment deadline and the exact amount due in every response
- Support MTN MoMo (paybill: 303030) and Airtel Money (paybill: 404040) payment references
- Escalate to the bursar if a balance is disputed or if a parent claims to have paid but the system shows no record
- Respond in English or Luganda depending on which language the parent used

After writing the rewrite, create three example inputs representing different parent situations — a routine balance inquiry, a payment dispute, and a request for a payment plan — and write the exact output your rewritten system prompt should produce for each. This tests whether your rules are specific enough to produce predictable behaviour.
