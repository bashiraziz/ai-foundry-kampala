## Week 2 — The Agent Triangle

**Track:** Professional
**Week:** 2 of 12

---

### Learning objectives

By the end of this week you will be able to:
1. Explain the three components of any agent (model, context, tools) in business language
2. Map a specific Kampala business workflow onto the Agent Triangle
3. Ask the right questions when a developer shows you an agent they built
4. Spot the most common reason agents fail (bad context, not bad model)

---

### Key concepts

**1. The Agent Triangle**

Every agent, no matter how complex, has three and only three components. Understanding these components lets you evaluate any agent system, even without reading the code.

**Model**: The AI brain. It reasons, decides, and generates text. Different models have different capabilities and costs. For most Kampala business use cases, Gemini 2.5 Flash or equivalent is sufficient. The model is often the least important thing to optimise — most agent failures are not model failures.

**Context**: Everything the model can "see" right now. This is where most agent problems live. Poor context = poor agent behaviour. Context includes:
- Instructions (the system prompt)
- Relevant knowledge (retrieved from a database)
- Current state (what has happened so far in this task)
- User input (what was just asked)

**Tools**: The agent's hands. Without tools, an agent can only talk. With tools, it can act. A tool is any function the agent can call to interact with the world: look up a database record, send an email, calculate a value, query an API.

**2. Business Translation**

| Agent Component | Business Equivalent |
|---|---|
| Model | The analyst's intelligence and reasoning ability |
| Context | The briefing documents and background the analyst receives before starting work |
| Tools | The systems the analyst has access to (CRM, ERP, email, spreadsheets) |

When an agent behaves badly, ask which component is the problem:
- Does it reason correctly but use wrong information? → Context problem
- Does it have the right information but can't act on it? → Tools problem
- Does it reason incorrectly even with good information? → Model problem (rare)

**3. The Context Is the Product**

The most important thing a Professional can contribute to an agent project is high-quality context. This means:
- Clear, specific instructions about what the agent should and should not do
- Accurate, up-to-date knowledge documents
- Well-structured data that the agent can retrieve reliably

Vague instructions produce vague behaviour. "Be helpful" is not context. "When a customer asks about a disputed MoMo transaction, retrieve their last 10 transactions and return the one matching the amount and date they describe" is context.

**4. Reading Agent Behaviour**

When an agent does something wrong, diagnose before blaming the model:
- Look at what information was in the context at the moment it went wrong
- Was the right knowledge retrieved?
- Were the instructions clear about this case?
- Was the tool available and working?

Nine times out of ten, the fix is improving the context or the tools, not switching to a more expensive model.

---

### Kampala example

**Stanbic Bank's Agent Triangle**

Stanbic Uganda wants an agent to help relationship managers prepare for client meetings.

**Model**: Gemini 2.5 Flash. Sufficient for document synthesis and question-answering. No need for the most expensive model.

**Context** (what goes into the agent's briefing):
- Client's account history (last 12 months transactions, products held)
- CRM notes from previous interactions
- Client's industry (e.g., "textile importer from Kampala Road")
- Current Stanbic product offerings relevant to the industry
- Meeting objective (e.g., "introduce the new trade finance product")

**Tools**:
- `get_client_history(client_id)`: pulls account data from core banking
- `get_crm_notes(client_id)`: retrieves relationship manager notes
- `get_product_sheet(product_code)`: returns product specification
- `generate_meeting_brief(client_id, meeting_objective)`: synthesises everything into a 1-page brief

The Professional's job here is not coding any of this. It is: defining what goes in the context (which account fields matter?), specifying which tools are needed, and reviewing the meeting briefs for quality before trusting the agent.

---

### Common questions

**Q: How do I evaluate whether a model is good enough for our use case?**
A: Define test cases — real examples from your business with known correct answers. Run them through the agent. If the agent gets 90%+ right, the model is probably not the bottleneck. If it's getting 60%, check the context first, then consider a better model.

**Q: If context is so important, who is responsible for it in our organisation?**
A: Domain experts — the people who know how the business actually works. In a bank, a loan officer should review and approve the context for a loan advisory agent. In a school, the head teacher should review the context for a student support agent. The "business owner" of an agent is responsible for the quality of its context.

**Q: What does a "tool" look like from a business perspective?**
A: Think of it as an authorisation. "This agent is authorised to look up customer balances" means it has the `get_customer_balance` tool. "This agent is not authorised to initiate transactions" means it does not have the `send_payment` tool. Tool design is access control in disguise.

---

### Practice exercise

**Exercise 2.1 — Agent Triangle Mapping**

Take one of the three workflow candidates you identified in Week 1. Map it onto the Agent Triangle:

1. **Model**: What reasoning capability does this task require? (simple lookup, multi-step reasoning, creative writing, analysis?)
2. **Context**: List every piece of information the agent needs to complete the task. Where does each piece of information live today?
3. **Tools**: List every action the agent must be able to take. For each, write: what system does it access, and what is the risk if it goes wrong?

Then answer: what is the single most important piece of context to get right for this agent? What happens if that context is wrong or missing?
