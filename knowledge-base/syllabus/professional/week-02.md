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

Every agent, no matter how complex, has three and only three components. Understanding these components lets you evaluate any agent system — even without reading the code — and have a productive conversation with any developer about why an agent is failing. The three components are model, context, and tools. Remove any one of them and the agent cannot function. Misunderstand any one of them and you will specify the wrong fix when something goes wrong.

**Model**: The AI brain. It reasons, decides, and generates text. Different models have different capabilities and costs. For most Kampala business use cases, Gemini 2.5 Flash or equivalent is sufficient — and often faster and cheaper than the premium alternatives. The model is frequently the least important component to optimise. Most agent failures are not model failures. Blaming the model first is the professional equivalent of assuming your boda boda crashed because of the engine rather than because the route was wrong.

*Kampala analogy: The model is the employee's intelligence and reasoning ability. A highly intelligent employee with no briefing documents and no access to company systems still cannot do their job. Ability alone is not enough.*

**2. Context: Where Most Agent Problems Live**

Context is everything the model can "see" at the moment it generates a response. This is where the vast majority of agent problems originate, and it is the component you as a Professional have the most direct influence over. Context includes four things: instructions (the system prompt telling the agent what its role is and what rules it must follow), relevant knowledge (documents or database records retrieved to help answer the specific question), current state (what has happened so far in this session), and user input (what the user just asked or submitted).

Poor context produces poor agent behaviour with complete reliability. An agent given vague instructions will produce vague responses. An agent given outdated fee schedules will quote the wrong fees. An agent given no information about a customer's history will ask for information the customer already provided last week. None of these are model failures. They are context failures — and they are the Professional's responsibility to fix. Think of the context as the briefing packet you hand an employee on their first day. If the briefing is thin, contradictory, or out of date, the employee's performance suffers — regardless of how capable they are.

*Kampala analogy: A new loan officer at Centenary Bank who receives a full client file — three years of statements, existing product holdings, credit history, and the purpose of today's meeting — will perform dramatically better than one who receives only the client's name. Same person, same intelligence, different context.*

**3. Tools: The Agent's Hands**

Without tools, an agent can only talk. With tools, it can act. A tool is any function the agent is authorised to call to interact with the world: look up a record in a database, send an email, calculate a value, query an external API, update a spreadsheet, trigger a notification. Tool design is access control in disguise. The list of tools you give an agent defines the boundary of what it can do. An agent with a `get_balance` tool can look up account balances. An agent with a `send_payment` tool can move money. The decision about which tools to include is a governance decision, not a technical one — and it belongs to you, not the developer.

When reviewing an agent, always ask for the full list of tools. For each tool, ask two questions: what system does this access, and what is the worst thing that can happen if this tool executes incorrectly? The answers determine how much human oversight that tool requires.

*Kampala analogy: A customer service representative at Airtel Uganda has access to certain systems and not others. They can view your account but cannot process a refund above a certain threshold without supervisor approval. Tools work the same way — the access list is the governance boundary.*

**4. Business Translation of the Agent Triangle**

| Agent Component | Business Equivalent |
|---|---|
| Model | The analyst's intelligence and reasoning ability |
| Context | The briefing documents and background the analyst receives before starting work |
| Tools | The systems the analyst has access to (CRM, ERP, email, spreadsheets) |

When an agent behaves badly, diagnose before blaming. Ask which component is failing: Does it reason correctly but use wrong information? That is a context problem. Does it have the right information but cannot act on it? That is a tools problem. Does it reason incorrectly even with good information and the right tools? That is a model problem — and it is the rarest of the three. Fix context and tools first. Escalate to model replacement only when both have been verified and the failure persists.

**5. The Context Is the Product**

The most important contribution a Professional can make to an agent project is high-quality context. This means clear, specific instructions about what the agent should and should not do; accurate, up-to-date knowledge documents; and well-structured data that the agent can retrieve reliably. Vague instructions produce vague behaviour. "Be helpful" is not context. "When a customer asks about a disputed MoMo transaction, retrieve their last ten transactions and return the one matching the amount and date they describe, then confirm whether the transaction shows as complete or pending in the payment ledger" is context. The difference between those two instructions is the difference between an agent that is genuinely useful and one that frustrates customers.

*Kampala analogy: "Handle the Owino market suppliers well" is a briefing. "When a supplier calls about a delayed payment, look up the purchase order number, confirm the goods were received on the logged date, check whether payment was initiated, and give them the reference number and expected clearing date" is a briefing that actually enables work to happen.*

---

### Kampala example

**Stanbic Bank's Agent Triangle**

Stanbic Uganda wants an agent to help relationship managers prepare for client meetings. The request is: "Build something that helps our RMs walk into meetings prepared." That sentence is not a spec. Mapping it onto the Agent Triangle produces one.

**Model**: Gemini 2.5 Flash. Sufficient for document synthesis and question-answering tasks. No need for the most expensive model — the task is well-defined retrieval and summarisation, not complex multi-step reasoning.

**Context** (what goes into the agent's briefing at runtime):
- Client's account history for the last twelve months, including transactions, products held, and credit facilities
- CRM notes from all previous relationship manager interactions
- Client's industry category (for example: "textile importer, Kampala Road, ten years relationship")
- Current Stanbic product offerings relevant to the client's industry and size
- Meeting objective as entered by the relationship manager ("introduce the new trade finance product")

**Tools**:
- `get_client_history(client_id)`: pulls account summary from core banking
- `get_crm_notes(client_id)`: retrieves all RM notes from the CRM system
- `get_product_sheet(product_code)`: returns current product specification and pricing
- `generate_meeting_brief(client_id, meeting_objective)`: synthesises the above into a one-page brief formatted for the RM

The Professional's job here is not coding any of this. It is defining what goes in the context (which account fields actually matter for meeting preparation?), specifying which tools are needed and which access levels are appropriate, and reviewing the generated meeting briefs for quality before the RM team trusts them before a client call.

---

### Common questions

**Q: How do I evaluate whether a model is good enough for our use case?**

Define test cases using real examples from your business — inputs with known correct answers. Run them through the agent and score the results. If the agent gets 90% or more correct, the model is probably not the bottleneck. If it is getting 60%, check the context first: are the instructions clear for these cases? Is the right information being retrieved? Is it the current version? Only after verifying the context is strong and the failure persists across ten or more test cases should you consider upgrading the model. For standard Kampala business workflows — fee queries, application status checks, document generation — current generation models handle the vast majority of cases well. The bottleneck is almost always context quality.

**Q: If context is so important, who is responsible for it in our organisation?**

The domain expert who knows how the business actually works. In a bank, the loan officer should review and approve the context for a loan advisory agent — not the IT team and not the developer. In a school, the head teacher or bursar should own the context for a fee query agent. In a SACCO, the credit committee chair should own the context for a loan pre-qualification agent. The "business owner" of an agent is the person responsible for context quality. If that person is not engaged in the agent project, the context will be generic and the agent will underperform. This is not a technical responsibility — it is a management responsibility.

**Q: What does a "tool" look like from a business perspective?**

Think of it as a formal authorisation. Saying "this agent is authorised to look up customer account balances" means the developer gives it the `get_account_balance` tool. Saying "this agent is not authorised to initiate any transactions" means it does not have a `send_payment` or `initiate_transfer` tool — regardless of what a customer asks it to do. When you review an agent specification with a developer, the tools list is your access control list. Every tool on that list is a capability the agent can exercise without asking permission. Every tool absent from the list is something the agent cannot do, even if a user demands it. Review this list with the same care you would review an employee's system access permissions on their first day.

---

### Practice exercise

**Exercise 2.1 — Agent Triangle Mapping**

Take one of the three workflow candidates you identified in Week 1. This week you will map it fully onto the Agent Triangle before you hand anything to a developer.

**Step 1 — Model**: What level of reasoning does this task require? Choose one: simple lookup (retrieve and return a specific piece of data), rule application (check a fact against a set of rules and return a decision), multi-step reasoning (combine information from multiple sources to reach a conclusion), or creative synthesis (generate a document or response that requires judgement about what to include). The simpler the reasoning requirement, the lower the model cost.

**Step 2 — Context**: List every piece of information the agent needs to complete one instance of this task. Be specific — not "customer information" but "customer name, account number, last five transactions, and current outstanding balance." For each item on your list, write where that information lives today (a spreadsheet, a database, a filing cabinet, someone's memory) and how frequently it changes.

**Step 3 — Tools**: List every action the agent must be able to take to complete the task. For each action, write: what system does it touch, who currently has permission to perform this action, and what is the risk if it executes incorrectly?

**Step 4 — Single most important context item**: Identify the one piece of context whose absence or inaccuracy would most damage the agent's usefulness. Write two sentences explaining what happens if that context is wrong. This is your highest-priority quality control point.

Bring your completed Agent Triangle to Week 3. It becomes the input for your first system prompt draft.
