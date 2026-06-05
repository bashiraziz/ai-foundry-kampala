## The Agent Factory: Core Concepts

**Source:** AI Foundry Kampala Programme
**Applies to:** Both Developer and Professional tracks

---

### What is the Agent Factory?

The Agent Factory is the operating philosophy of the Kampala Agentic AI Club. It treats agent-building as a production discipline — repeatable, quality-controlled, and improvable — rather than as artistry or guesswork.

The name is intentional. A factory implies:
- Standardised inputs and outputs
- Quality checkpoints at each stage
- Reproducible processes
- Continuous improvement
- A team that can maintain the line, not just the inventor

The opposite of the Agent Factory is the Demo Trap: building something impressive once, shipping it to production without guardrails, and watching it fail unpredictably on real data.

---

### The Five-Stage Production Line

**Stage 1: Spec**

Every agent starts with a written specification. The spec answers:
- Who uses this agent and for what?
- What tools does it have and what are their boundaries?
- What must it never do?
- What does a correct output look like?
- How will it be tested?

Agents built without a spec have no standard to measure against. You cannot improve what you cannot define.

**Stage 2: Scaffold**

Set up the three components:
- Model: select, configure temperature and context window
- Context: write system prompt, identify knowledge sources, design retrieval
- Tools: define interfaces, implement, test each tool in isolation

The scaffold is the factory floor. Before you run the production line, every machine must work independently.

**Stage 3: Test**

Run the agent against your test suite before anyone else sees it. Test:
- Happy path (normal inputs, expected outputs)
- Edge cases (unusual but valid inputs)
- Adversarial inputs (users trying to break the agent)
- Failure modes (tool errors, missing data, context overflow)

A test suite is a specification artifact — it defines what "working correctly" means. It lives in the repository alongside the code.

**Stage 4: Ship**

Deploy with guardrails in place. Before shipping:
- Error handling covers all identified failure modes
- Escalation path is implemented and tested
- Audit logging is active
- Cost monitoring is in place
- Rollback plan exists

Shipping without these is not speed — it is debt.

**Stage 5: Iterate**

Production is the best teacher. Collect:
- User inputs that triggered unexpected behaviour
- Tool calls that failed
- Cases where the agent escalated unnecessarily (or didn't escalate when it should have)
- User feedback

Add these to the test suite. Fix the root cause. Redeploy. The factory improves with every cycle.

---

### The Three Components in Depth

**The Model**

The model is the reasoning engine. Different models have different trade-offs:

| Model | Strengths | Kampala use case fit |
|---|---|---|
| Gemini 2.5 Flash | Fast, cheap, 1M context, multimodal | 90%+ of business workflows |
| Gemini 2.5 Pro | Stronger reasoning, more expensive | Complex multi-step analysis |
| Claude Sonnet | Strong instruction following | Precise rule-following agents |
| Llama 3.3 70B (via OpenRouter) | Free tier available, open weights | Development/fallback |

For most agents in Kampala, Gemini 2.5 Flash is the right starting point. It is fast enough for real-time use, cheap enough for high volume, and capable enough for the majority of business tasks.

**The Context**

Context is everything the model can see when it makes a decision. It has four layers:

1. **System prompt**: The agent's standing instructions. Defined by the spec. Changes rarely.
2. **Retrieved knowledge**: Chunks from the knowledge base relevant to this query. Retrieved via RAG.
3. **Conversation history**: The messages so far in this session. Grows as the conversation continues.
4. **Tool results**: What tools returned in previous steps. Injected as the loop runs.

Good context engineering means putting the right information in each layer, in the right order, at the right granularity. This is the primary skill separating effective agent builders from those who can only demo.

**The Tools**

Tools are the agent's interface to the world. Without tools, an agent can only generate text. With tools, it can:
- Read from databases
- Write to databases
- Call external APIs
- Send notifications
- Trigger other agents

Tool design principles (from the Agent Factory):
1. **Narrow scope**: One tool, one purpose
2. **Descriptive names**: `calculate_ugx_fee(amount, rate)` not `process(x, y)`
3. **Rich descriptions**: The model reads the description to decide when to call the tool
4. **Structured returns**: JSON, not prose
5. **Error context**: Failures explain themselves

---

### The Agent Triangle Summary

```
         MODEL
        /     \
       /       \
  CONTEXT --- TOOLS

The triangle is balanced. All three matter.
Most problems live in context.
Most solutions live in context.
```

When an agent misbehaves, diagnose:
- Is the reasoning wrong given the information it had? → Model problem (rare)
- Did it reason correctly but from wrong/missing information? → Context problem (common)
- Did it have the right information but no way to act on it? → Tools problem (addressable)

---

### Kampala-Specific Considerations

**Language**: Ugandan users communicate in English, Luganda, and mixtures of both. Agents deployed in Uganda must be tested with code-switched inputs. "Nze nfuna 50,000 UGX from MoMo" is a valid user input. Test for it.

**Connectivity**: Internet in parts of Kampala (Kawempe, Makindye, Rubaga) is less reliable than Nakasero. Build agents with timeouts and offline-graceful degradation. A loading spinner that hangs forever is worse than an immediate error message.

**Data formats**: Uganda uses UGX (no decimal places in common usage), DD/MM/YYYY dates (different from US format), and phone numbers starting 256 or 0 followed by 9 digits. Validate these in tool parameter schemas.

**Regulatory context**: Uganda's Data Protection and Privacy Act (2019) requires a legal basis for processing personal data. Agents that store conversation history containing personal information must comply. Build data retention policies into the specification, not as an afterthought.

**Payment infrastructure**: MTN MoMo and Airtel Money are the primary digital payment rails. Bank cards are secondary. Any agent involving payments must support MoMo and Airtel. The Central Bank of Uganda (BOU) API is available for licensed providers. For unlicensed parties, payments must go through aggregators (Beyonic, Pesapal, FlexiPay).

---

### Common Questions About the Agent Factory

**Q: Is the Agent Factory just another framework?**
A: No. It is a discipline, not a framework. It does not require specific libraries or tools. You can apply it with raw API calls and plain TypeScript, or with LangChain and LlamaIndex. The discipline is in the process: spec → scaffold → test → ship → iterate.

**Q: How do I get my team to follow the Factory process?**
A: Start with the spec. Make it a team norm that nothing gets built without a written spec. A two-hour spec session catches problems that take two weeks to fix in code. Demonstrate this once and the team converts.

**Q: What's the most important thing to get right in the Factory?**
A: The test suite. A spec without tests is aspiration. A test suite is a precise, executable definition of correct behaviour. Build it early, update it always, and never ship without running it.
