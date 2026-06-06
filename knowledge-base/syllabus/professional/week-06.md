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

Code is a formal specification of what a system does. Managers who can read code — even imperfectly — ask better questions, give better feedback, and catch implementation errors before they reach production and affect customers. You do not need to understand every line. You need to understand enough to know what to look for: where the agent's instructions live, what actions it is authorised to take, and what happens when something goes wrong. That is the 20% of code literacy that gives you 80% of the governance value. A manager who can point to a function and ask "what does this do and what happens if it fails?" is doing their job. A manager who signs off on an agent without asking these questions is not.

*Kampala analogy: A branch manager at Equity Bank does not need to understand how the core banking system's database indexing works. But they must understand which transactions require dual authorisation, what the system does when a transaction is declined, and where the audit trail is. Code review for a Professional works the same way — you are reviewing for governance, not implementation.*

**2. The Three Things to Find in Any Agent Code**

When a developer shows you their agent code, look for three specific things. Everything else is implementation detail that the developer owns. These three are governance concerns that you own.

**The system prompt**: Where are the agent's instructions defined? Ask the developer to show you exactly where in the code the system prompt is stored. Read it in full. Compare it line by line against your specification from Week 3. Is every rule present? Are any rules missing? Are there rules the developer added that you did not specify — and if so, what do they do and why were they added? The system prompt is your spec translated into the production system. Any deviation is either a bug or an undiscussed decision.

**The tool definitions**: What can the agent do? Ask for the full list of tools defined in the agent code. Match each tool against your tool list from the Week 2 Agent Triangle mapping. If a tool is missing, the agent cannot perform that function — and your workflow has a gap. If there is a tool you did not specify, ask what it does, what system it accesses, and why it was included. A tool you did not authorise is a capability boundary you did not set. In an agent with access to financial systems, an unspecified tool is a potential audit finding.

**The error handling**: What happens when something goes wrong? Ask the developer to walk you through what happens if each tool fails — if the database query returns an error, if the payment API times out, if the AI model is unavailable. The answer should never be "an uncaught exception" or "the user sees a technical error message." Every failure path should have a defined user experience: a fallback response, an escalation, a retry with a timeout. Absent error handling is a production incident waiting to happen.

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

Business translation: "This function sends a conversation to Gemini. If Gemini fails for any reason, it logs the error quietly and tries a different AI provider called OpenRouter instead. The user never sees the failure — they receive an answer from one provider or the other."

Management questions this code raises:
- "What if both Gemini and OpenRouter fail?" (This code does not handle that case — it would throw an error upward. A good manager asks where that error goes and what the user sees.)
- "Do Gemini and OpenRouter produce the same quality responses for our use case?" (A fallback that silently degrades quality without notification may not be acceptable for regulated outputs.)
- "Is the OpenRouter fallback authorised by our data governance policy?" (Sending conversation data to a second AI provider may require an additional agreement or disclosure.)

None of these questions require you to understand how TypeScript compiles or how async/await works. They require you to understand your governance responsibilities and ask them directly.

**4. Implementation Gaps**

The three most common gaps between a Professional's specification and what gets built:

**Gap 1 — Missing rules**: The developer implemented six of your ten rules. The other four were not technically complex to implement — they were simply overlooked or deprioritised. This is why you test against your spec, not against the developer's demonstration. A developer demo will always show the features that work. Your test suite will find the ones that do not. Run all ten rule-violation test cases from Week 4 against every build before sign-off.

**Gap 2 — Wrong thresholds or parameters**: Your spec says escalate when the transaction amount exceeds 5,000,000 UGX. The developer implemented the threshold as 500,000 UGX. This is a ten-times error that produces ten times as many human escalations as intended, overloading the review team. Thresholds, amounts, time limits, and percentage values in your spec must appear verbatim in the code — or be explicitly reviewed and agreed when they differ.

**Gap 3 — No audit trail**: You did not specify it, the developer did not build it, and now the agent is making decisions with no record of what it decided, what information it had at the time, or what its reasoning was. When a customer disputes an agent decision, or when a regulator asks for records, there is no audit log. Audit trail requirements must be in every agent specification — not assumed. Add a standard clause to every spec you write: "Every agent decision that affects a customer record, financial balance, or communication must be logged with: timestamp, agent session ID, the context available at the time of the decision, the decision made, and the user input that triggered it."

**5. Verifying Spec Compliance Without Coding**

Your acceptance criteria from Week 3 and your test cases from Week 4 are your verification tools. You do not need to read every line of code to verify an agent meets its spec. You need to:

- Run every test case and record pass/fail
- Read the system prompt as deployed and compare to your spec rule by rule
- Review the tool list and verify it matches your authorised tool list
- Ask the developer to walk you through one error scenario and observe what the user would experience
- Check that the output format matches your specification in three separate test runs

If all five pass, the agent meets its spec. If any fail, you have a specific, evidence-based finding to bring back to the developer.

---

### Kampala example

**Code Review Session: Bank of Africa Uganda**

A developer presents the following tool definition to their manager during a pre-launch review:

```typescript
server.setRequestHandler("tools/call", async (request) => {
  if (request.params.name === "approve_loan") {
    const { customer_id, amount } = request.params.arguments;
    await prisma.loan.create({
      data: { customerId: customer_id, amount, status: "APPROVED" }
    });
    return {
      content: [{
        type: "text",
        text: `Loan of ${amount} UGX approved for ${customer_id}`
      }]
    };
  }
});
```

What the Professional manager must catch — and does, without writing any code:

**Finding 1 — Tool name violates the spec**: The spec said the agent should "recommend loans for human review," not "approve loans." This tool is named `approve_loan` and sets the status to "APPROVED" — meaning the agent can approve a loan without any human involvement. This is a critical implementation gap between spec and build.

**Finding 2 — No amount limit**: The tool accepts any amount value the agent passes. There is no validation checking whether the amount is within authorised limits. The agent could, in theory, approve a loan of any size.

**Finding 3 — No audit trail**: The tool creates a database record but logs nothing about which agent session triggered the approval, what context the agent had, or what reasoning led to the decision.

**Finding 4 — Wrong status value**: The spec required the status "PENDING_REVIEW" so a human credit officer can confirm before the loan is activated. "APPROVED" bypasses that review entirely.

Manager's feedback, delivered clearly and specifically: "This tool needs to be renamed `recommend_loan`, not `approve_loan`. The status field must be set to 'PENDING_REVIEW', not 'APPROVED' — this is the spec from Week 3, Rule 4. We also need an amount cap of 10,000,000 UGX for agent-initiated recommendations, and an audit log entry recording the session ID, the customer ID, the amount recommended, and the timestamp. None of this goes to production until these four changes are made and retested."

That feedback requires zero code-writing ability. It requires knowing your spec, reading the tool definition, and asking what the business consequences of the current implementation are.

---

### Common questions

**Q: What if I ask a code question and the developer dismisses me as non-technical?**

"Help me understand what this does" is not a technical question — it is a governance question. You are the business owner of this agent. You are responsible for what it does to customers and for what it does to the organisation's regulatory standing. If you do not understand a part of the system you are responsible for, that is a governance risk — and you have full standing to insist on an explanation in business language. A developer who cannot or will not explain their implementation in terms the business owner understands is creating a governance gap. Escalate if necessary. No agent should go to production without the business owner understanding what it does and what happens when it fails.

**Q: How much code should I be able to read before this becomes useful?**

Enough to identify function names, understand what parameters go in and what comes out, and locate the error handling. That is genuinely the 20% that provides 80% of the governance value. You do not need to understand how a vector database calculates similarity scores, or how the HTTP client manages connection pooling, or what TypeScript generics do. You need to be able to look at a function called `send_payment` and ask: "What authorises this to execute? What limits the amount? What happens if the payment API is down? Where is this logged?" Those questions do not require understanding the implementation — they require understanding your governance responsibilities.

**Q: Should I review every change to the agent codebase?**

No — that is not a sustainable expectation and not the best use of your time. Review changes to the five categories that directly affect agent governance: system prompts (any change to the agent's instructions), tool definitions (any change to what the agent can do or what limits it operates under), escalation logic (any change to when the agent hands off to a human), audit logging (any change to what gets recorded), and database schema changes for tables the agent reads from or writes to. Routine infrastructure changes — dependency version updates, logging format changes, performance optimisations — can go through developer-only review. The five governance categories are non-negotiable and must include you.

---

### Practice exercise

**Exercise 6.1 — Code Reading Audit**

Read the following files from the AI Foundry Kampala application codebase. You are not expected to understand every line — focus on the three governance elements: system prompt, tool definitions, and error handling.

Files to review:
- `app/api/chat/route.ts` — the main chat endpoint
- `lib/llm.ts` — the LLM abstraction layer
- `app/api/quiz/route.ts` — the quiz generation endpoint

For each file, write the following in plain business English — no technical jargon required:

**1. One-sentence business description**: What does this file do? Who is affected by it? What would a customer or student experience if this file stopped working?

**2. Three most important business decisions encoded in the code**: Look for things like: who can call this function, what limits are applied, what data is read or written, what happens on failure. Write each as a business statement, not a technical one.

**3. One governance question for the developer**: Based on what you read, identify one aspect of the code that presents a business risk you would want clarified before this goes to a real student. Frame it as a specific question: "If X happens, what does the student see?" or "What prevents the agent from doing Y?"

**4. Spec compliance assessment**: Based on what you can read, does this implementation appear to match what you would have specified using the Week 3 framework? If yes, explain why. If no, identify the specific gap.

This exercise is deliberately open-ended. The goal is not a correct technical answer — it is the habit of engaging with code as a governance artifact rather than treating it as a black box you are not permitted to inspect.
