## Week 1 — The Agent Factory Paradigm

**Track:** Developer
**Week:** 1 of 12

---

### Learning objectives

By the end of this week you will be able to:
1. Explain what an "agentic AI" system is and how it differs from a chatbot
2. Describe the Agent Factory paradigm: treating agent-building as a repeatable manufacturing process
3. Identify the three core components of any agent: model, context, and tools
4. Connect the Agent Factory idea to real Kampala business problems

---

### Key concepts

**1. Agents vs. Chatbots**

A chatbot answers a question and stops. An agent receives a goal, makes a plan, takes actions using tools, observes the results, and keeps working until the goal is complete or it needs human input. The difference is not the AI model — it is the loop.

Think of a Kampala courier company. A chatbot can answer "where is my parcel?" An agent can receive "deliver 200 parcels before 5pm," check traffic on Entebbe Road, re-route boda bodas, send MTN MoMo payment confirmations, and flag the three deliveries that failed — without a human directing each step.

**2. The Agent Factory Paradigm**

The Agent Factory is the idea that building agents should be a repeatable, quality-controlled process — not magic, not art, not guesswork. Just like Roofings Group in Namanve runs a production line, you will run a production line for agents:

- **Spec**: Write a clear markdown spec of what the agent must do
- **Scaffold**: Set up the loop — model + context + tools
- **Test**: Run it on real inputs, capture failures
- **Ship**: Deploy with guardrails and monitoring
- **Iterate**: Improve based on production observations

The factory mindset prevents the most common failure: building an agent that works once in a demo and breaks on real data.

**3. The Three Agent Components**

Every agent — no matter how complex — has exactly three parts:

- **Model**: The LLM that does reasoning (Gemini, Claude, Llama, GPT)
- **Context**: Everything the model can "see" right now — system prompt, conversation history, retrieved knowledge, tool results
- **Tools**: Functions the model can call to affect the world — search, database reads/writes, API calls, sending messages

Changing any one of these changes what the agent can do. Most agent problems are context problems, not model problems.

**4. Why Kampala Specifically**

Africa is the frontier of agent deployment. MTN Uganda has 17 million MoMo users. Safeboda routes thousands of boda bodas. Makerere University has 40,000 students. These systems run on outdated manual workflows. A developer who can build agents in Kampala today is not competing with Silicon Valley — they are building infrastructure that does not yet exist.

---

### Kampala example

**The Owino Market Stock Agent**

Owino Market in downtown Kampala has thousands of vendors. Most track inventory on paper or in their heads. A simple agent could:
1. Accept a daily voice note from the vendor ("sold 5 kilos of Irish potatoes, 2 kilos of tomatoes")
2. Update a running inventory in a database
3. When any item drops below threshold, generate a reorder message to the supplier via WhatsApp
4. Every Friday, produce a weekly sales summary

This is a three-tool agent: speech-to-text, database write, messaging. It requires no advanced AI. The value is the loop — it runs every day without the vendor having to open a laptop.

---

### Common questions

**Q: Do I need to know machine learning to build agents?**
A: No. You are working at the application layer — calling APIs, writing prompts, connecting tools. The model training happened elsewhere. Think of it like building a web app: you don't need to know how PostgreSQL's query planner works to build a good database-backed app.

**Q: Is this just prompt engineering?**
A: Prompt engineering is one part of it — specifically the context component. But agents also involve tool design, loop architecture, error handling, and deployment. A great prompter who can't build a reliable loop will ship fragile demos.

**Q: Why do agents fail?**
A: The three most common failure modes are: (1) context overflow — the agent gets too much information and loses track of the goal; (2) tool errors — a tool returns unexpected output and the agent doesn't know what to do; (3) goal drift — the agent starts solving a slightly different problem than the one specified. All three are fixable with good engineering.

---

### Practice exercise

**Exercise 1.1 — Agent Anatomy Audit**

Pick any digital service you use in Kampala: Jumia Uganda, SafeBoda, Yo! Uganda payments, or any app on your phone. Write a 200-word description of:
1. What a useful agent would do for that service (not a chatbot — an agent that takes actions)
2. What the model would be
3. What the context would need to contain
4. What tools it would need
5. What the biggest failure risk would be

Post your answer in the club Slack before the next session.
