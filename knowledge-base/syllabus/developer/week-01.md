## Week 1 — The Agent Factory Paradigm

**Track:** Developer
**Week:** 1 of 12

---

### Learning objectives

By the end of this week you will be able to:
1. Explain what an "agentic AI" system is and how it differs from a chatbot
2. Describe the Agent Factory paradigm: treating agent-building as a repeatable manufacturing process
3. Identify the three core components of any agent: model, context, and tools
4. Apply the Digital FTE concept to size and pitch an agent project
5. Connect the 10-80-10 Rule to realistic AI project scoping in a Kampala business context

---

### Key concepts

**1. Agents vs. Chatbots**

A chatbot answers a question and stops. An agent receives a goal, makes a plan, takes actions using tools, observes the results, and keeps working until the goal is complete or it needs human input. The difference is not the AI model — it is the loop. A chatbot is a vending machine: you press a button and get a fixed response. An agent is a staff member: you give them an objective and they work through it step by step, adapting as things change. The distinction matters enormously in practice because agents can fail silently, get stuck in loops, and take real-world actions with consequences. Building them requires engineering discipline, not just good prompts.

*Kampala analogy:* Think of a Kampala courier company. A chatbot can answer "where is my parcel?" An agent can receive "deliver 200 parcels before 5pm," check traffic on Entebbe Road, re-route boda bodas, send MTN MoMo payment confirmations, and flag the three deliveries that failed — without a human directing each step.

**2. The Agent Factory Paradigm**

The Agent Factory is the idea that building agents should be a repeatable, quality-controlled process — not magic, not art, not guesswork. Just like Roofings Group in Namanve runs a production line for steel sheets, you will run a production line for agents. Every agent you build goes through the same five-stage process: Spec, Scaffold, Test, Ship, Iterate. The factory mindset exists because the biggest failure in AI projects is not the model — it is undisciplined development. Developers who build agents the way they build weekend projects end up with systems that work once in a demo and collapse the first week in production. The factory is your defence against that failure.

- **Spec**: Write a clear markdown spec of what the agent must do
- **Scaffold**: Set up the loop — model + context + tools
- **Test**: Run it on real inputs, capture failures
- **Ship**: Deploy with guardrails and monitoring
- **Iterate**: Improve based on production observations

*Kampala analogy:* Roofings doesn't produce a steel sheet and then decide how to test it. Quality control is built into the line. Your agent production line works the same way.

**3. The Three Agent Components**

Every agent — no matter how complex — has exactly three parts: the model, the context, and the tools. The model is the reasoning engine — Gemini, Claude, Llama, or GPT. It cannot act on the world directly; it can only read its context and decide what to do. The context is everything the model can see right now: the system prompt, conversation history, retrieved knowledge, and results from previous tool calls. The tools are functions the agent can call to affect the real world — read a database, send a WhatsApp message, call an API, write a file. Changing any one of these three changes what the agent can do. Critically: most agent failures are context problems, not model problems. Before blaming the AI, audit what the model could actually see when it made the bad decision.

*Kampala analogy:* A boda boda rider (model) can only deliver to addresses they know about (context). Give them a map and a phone (tools) and they can handle any delivery.

**4. The Digital FTE Concept**

A Digital FTE (Full-Time Equivalent) is a way of measuring and pitching an agent's value in language that business owners and finance teams understand. Instead of saying "we built an agent," you say "we replaced or augmented two staff positions of manual data entry work." One Digital FTE represents roughly 40 hours per week of task capacity that the agent handles without human intervention. When you scope an agent project, estimate: how many hours per week does this task currently consume across the team? That number, divided by 40, is your Digital FTE impact. A business owner in Kampala managing school fee collections who spends 15 hours a week on SMS follow-ups and manual reconciliation is spending 0.375 FTEs on that task. An agent that handles it fully delivers 0.375 Digital FTEs of capacity back to the business.

*Kampala analogy:* MTN Uganda's MoMo customer support team handles thousands of balance queries per day. Each query handled by an agent is time a human agent can spend on a complex complaint. Measure the shift in Digital FTEs and you have your ROI story.

**5. The 10-80-10 Rule**

The 10-80-10 Rule describes how humans and agents should divide labour on any complex task. The first 10% is human work: understanding the goal, setting strategy, writing the spec, deciding what the agent is allowed to do. The middle 80% is agent work: research, data processing, drafting, routing, executing the repeatable steps. The final 10% is human again: reviewing the output, making the judgment call, approving the action, and signing off. This rule prevents two failure modes. The first is under-delegating — humans doing the 80% manually because they don't trust the agent, defeating the purpose. The second is over-delegating — letting agents handle the final 10% without review, which exposes the business to unreviewed AI decisions with real consequences. In any agent project, make the 10-80-10 split explicit in your spec.

*Kampala analogy:* A Kampala lawyer reviewing 50 contracts uses an agent to extract key clauses (the 80%). The lawyer still decides which clauses are acceptable and signs the opinion letter (the final 10%). The agent never signs.

**6. OpenCode Setup and the Agent Loop**

OpenCode is the development environment used in this programme for building and testing agents locally. It runs in your terminal, connects to your chosen model provider (Gemini by default, since it has a generous free tier), and gives you a live loop you can observe and debug. The agent loop is the core runtime: your code calls the model, receives a response, checks if the response contains a tool call, executes the tool if so, injects the result back into the conversation, and calls the model again. This loop continues until the model produces a final answer with no tool call, or until an error or timeout occurs. Understanding this loop at the code level — not just conceptually — is the foundational skill of this track. Every framework you will encounter (LangChain, LlamaIndex, CrewAI) is just a wrapper around this loop.

*Kampala analogy:* OpenCode is your workshop bench. You could build a chair with expensive factory equipment, or you could learn to use hand tools first so you understand what the machines are actually doing. We start with hand tools.

---

### Kampala example

**The Owino Market Stock Agent**

Owino Market in downtown Kampala has thousands of vendors. Most track inventory on paper or in their heads. A vendor selling Irish potatoes, tomatoes, and onions might lose 15-20% of revenue to spoilage simply because they over-ordered without knowing current stock levels.

A simple agent built on the Agent Factory model could solve this. The spec is straightforward: accept a daily voice note from the vendor, update inventory, trigger reorders, and produce a weekly summary. The Digital FTE value is clear: the vendor spends about 2 hours daily on manual stock tracking — 0.05 FTEs. The agent reclaims that time. The 10-80-10 split is: vendor sets reorder thresholds (10%), agent runs the daily tracking and reorder logic (80%), vendor reviews the Friday summary and approves any large orders (10%).

Built on the three-component model: the model (Gemini Flash) classifies the voice note and decides what to update; the context contains current inventory levels and supplier contact details; the tools are speech-to-text, a database write function, and a WhatsApp message sender.

This is a three-tool agent. It requires no advanced AI. The value is the loop — it runs every day without the vendor having to open a laptop or remember what they sold three days ago.

---

### Common questions

**Q: Do I need to know machine learning to build agents?**

No. You are working at the application layer — calling APIs, writing prompts, connecting tools. The model training happened elsewhere, done by teams at Google, Anthropic, Meta, or Mistral. Your job is to use the trained model effectively, which is closer to software engineering than to data science. Think of it like building a web app: you do not need to know how PostgreSQL's query planner works internally to build a reliable database-backed application. You need to know how to write good queries, design good schemas, and handle errors gracefully. Same principle applies here. That said, knowing the basics of how models work — tokens, temperature, context windows — makes you a better agent developer, and we cover those in Week 2.

**Q: Is this just prompt engineering?**

Prompt engineering is one part of agent development — specifically the part that concerns the context component. But agents also involve tool design, loop architecture, error handling, state management, and deployment infrastructure. A developer who writes beautiful system prompts but cannot build a reliable loop will ship fragile demos that impress in the meeting and break on Tuesday morning. A developer who builds a solid loop but writes poor prompts will ship an agent that technically works but gives wrong answers. Both skills are required. The Agent Factory paradigm treats prompt engineering as one stage in the production line, not the whole factory.

**Q: Why do agents fail?**

The three most common failure modes are: (1) context overflow — the agent accumulates too much information over a long run and loses track of the original goal; (2) tool errors — a tool returns unexpected output (an API goes down, a database returns null, a phone number format is wrong) and the agent does not know what to do next; (3) goal drift — the agent starts solving a slightly different problem than the one specified, often because the spec was ambiguous. All three are fixable with good engineering: context management strategies fix overflow, defensive tool wrappers fix tool errors, and precise specs fix goal drift. None of these failures require a better model. They require better engineering.

**Q: How is the Agent Factory approach different from just using ChatGPT?**

ChatGPT and similar consumer products are designed for single-turn or short-conversation interactions. They do not maintain persistent state between sessions, cannot be connected to your business's database, cannot take actions in your systems, and cannot run autonomously on a schedule. The Agent Factory approach produces software — a running process that connects to your specific tools, follows your specific rules, and operates reliably across thousands of real inputs. The model inside your agent might be the same underlying technology as ChatGPT, but the system around it is entirely different. You own the loop, the tools, the context, and the deployment.

---

### Practice exercise

**Exercise 1.1 — Agent Anatomy Audit**

Pick any digital service you use in Kampala: Jumia Uganda, SafeBoda, Yo! Uganda payments, Airtel Money, or any app on your phone. Write a 200-word description covering all of the following:

1. What a useful agent would do for that service — not a chatbot that answers questions, but an agent that takes autonomous actions on behalf of the business or the user.
2. What model you would use and why (consider cost, speed, and capability).
3. What the context would need to contain for the agent to do its job reliably.
4. What tools it would need — be specific: name each tool and what it does.
5. Where the 10-80-10 split falls: what does the human do in the first 10%, what does the agent handle in the 80%, what does the human review in the final 10%?
6. What the biggest failure risk would be — and how you would detect it in production.

Calculate the Digital FTE value: estimate how many hours per week the manual version of this task currently takes, and state the FTE impact the agent would deliver.

Post your answer in the club Slack before the next session. Come ready to defend your tool list — your peers will ask why you chose those specific tools and not others.
