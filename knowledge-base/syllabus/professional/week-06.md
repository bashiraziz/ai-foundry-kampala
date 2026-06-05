## Week 6 — Reading Code Like a Manager

**Track:** Professional
**Week:** 6 of 12

---

### Learning objectives

By the end of this week you will be able to:
1. Read a TypeScript/JavaScript function and describe what it does in business terms
2. Identify where business logic lives in an agent codebase
3. Ask the right questions during a developer code review
4. Spot the three most common implementation gaps between spec and code

---

### Key concepts

**1. You Don't Need to Write Code to Read It**

Code is a formal specification of what a system does. Managers who can read code — even imperfectly — ask better questions, give better feedback, and catch implementation errors before they reach production. You do not need to understand every line. You need to understand enough to know what to look for.

**2. The Three Things to Find in Any Agent Code**

When a developer shows you their agent code, look for three things:

**1. The system prompt**: Where are the agent's instructions defined? Read them. Compare them to your spec. Are any rules missing? Are there rules you didn't put there?

**2. The tool definitions**: What can the agent do? List the tool names and match them to your tool list from the spec. If a tool is missing, the agent can't perform that function. If there's a tool you didn't specify, ask what it does and whether it's appropriate.

**3. The error handling**: What happens when something goes wrong? Look for try/catch blocks and fallback logic. Ask: "If this fails, what does the user see?" The answer should not be "an uncaught exception."

**3. Reading a Function**

```typescript
export async function chat(messages: Message[], systemPrompt: string): Promise<string> {
  try {
    return await geminiChat(messages, systemPrompt);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn("Gemini failed, falling back to OpenRouter:", msg);
    return openrouterChat(messages, systemPrompt);
  }
}
```

Business translation: "This function sends a conversation to Gemini. If Gemini fails for any reason, it logs the error and tries OpenRouter instead. The user never sees the failure — they get an answer from one provider or the other."

Management question: "What if both fail?" (The answer from this code is: it throws an error. A good manager would ask whether that error is caught higher up and what the user experience is.)

**4. Implementation Gaps**

The three most common gaps between spec and code:

**Gap 1: Missing rules**: Developer only implemented 6 of your 10 rules. Test for all 10 explicitly before sign-off.

**Gap 2: Wrong escalation logic**: Your spec says escalate when confidence is below 0.8. Developer implemented it as escalate when confidence is below 0.5. The threshold matters enormously in production.

**Gap 3: No audit trail**: You didn't specify it, the developer didn't build it, and now you have no record of what the agent decided and why. Audit requirements should be in every spec.

---

### Kampala example

**Code Review Session: Bank of Africa Uganda**

A developer presents the following tool definition to their manager:

```typescript
server.setRequestHandler("tools/call", async (request) => {
  if (request.params.name === "approve_loan") {
    const { customer_id, amount } = request.params.arguments;
    await prisma.loan.create({ data: { customerId: customer_id, amount, status: "APPROVED" } });
    return { content: [{ type: "text", text: `Loan of ${amount} UGX approved for ${customer_id}` }] };
  }
});
```

What the manager should catch:
1. This tool **directly creates** a loan record. There is no human approval step. The agent can approve loans with zero oversight.
2. There is no amount validation — the agent could approve a loan of any size.
3. There is no audit trail beyond the database record — no log of who triggered this, which model call invoked the tool, or what the reasoning was.
4. The spec said the agent should "recommend" loans, not "approve" them. This is a critical implementation gap.

Manager's feedback: "This needs to be `recommend_loan` not `approve_loan`. The status should be 'PENDING_REVIEW', not 'APPROVED'. And we need to cap the amount at 10,000,000 UGX for agent-initiated recommendations. This doesn't go to production until these are fixed."

---

### Common questions

**Q: What if I ask a code question and the developer dismisses me?**
A: "Help me understand what this does" is not a technical question — it is a governance question. If you are the business owner of an agent and you don't understand how it works, that is a risk to the organisation. You have standing to ask, and a good developer will explain.

**Q: How much code should I be able to read before this starts being useful?**
A: Enough to identify function names, inputs, outputs, and error handling. That's the 20% of code reading that gives you 80% of the governance value. You don't need to understand the implementation details of how vectors are computed or how the HTTP client works.

**Q: Should I review every change to the agent codebase?**
A: Review changes to: system prompts, tool definitions, escalation logic, audit logging, and database schema for agent-related tables. Routine infrastructure changes (dependency updates, logging format changes) can go through developer review only.

---

### Practice exercise

**Exercise 6.1 — Code Reading Audit**

Read the following code from the AI Foundry Kampala app:
- `app/api/chat/route.ts`: the main chat endpoint
- `lib/llm.ts`: the LLM abstraction
- `app/api/quiz/route.ts`: the quiz generator

For each file, write:
1. What it does in one sentence of business English
2. The three most important business decisions encoded in the code
3. One question you would ask the developer about a business risk you see
4. Whether the implementation matches what you would have specified

You don't need to understand every line — focus on the functions, the tool calls, and the error handling.
