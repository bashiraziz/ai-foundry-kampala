## Week 12 — Demo Day

**Track:** Developer
**Week:** 12 of 12

---

### Learning objectives

By the end of this week you will have:
1. Delivered a live 10-minute demo of your capstone agent
2. Answered technical questions from the cohort and facilitator
3. Written a retrospective on what you built, what you would do differently, and what is next
4. Received peer feedback and provided feedback to at least 2 other projects

---

### Key concepts

**1. Demo Day Format**

- **10-minute slot per project**: 5 minutes demo + 5 minutes Q&A
- **Live demo only**: No videos, no slides during the demo portion. The agent must run live in front of the cohort.
- **Real data**: No placeholder or "lorem ipsum" content. Use realistic Kampala data — real UGX amounts, real place names, real scenarios. A school fees agent should show a student named Nakato Namukasa at Bat Valley Primary, not "Test Student 001."
- **Crash plan**: Have a backup approach (screenshots showing each step of the agent loop plus a verbal walkthrough) if the live demo fails. State openly if you are using mocks. Honesty about mocks is respected; pretending a mock is a live integration is not.

The 10-minute format is designed to mirror the real conditions under which you will pitch tools to businesses, NGOs, and potential users in Kampala. Decision-makers do not give you 45 minutes. You have 10 minutes to show them something that works and explain why it matters.

**2. What the Judges Are Looking For**

For the Developer track, judges evaluate five things:

- **Does the core agent loop work?** The model receives input, reasons about which tool to call, calls the tool, receives a result, and synthesises a response. This is the fundamental test. Everything else is secondary.
- **Are the tools sensible and specific?** Each tool should do one clear thing. A tool called `do_everything` that handles all business logic is not a tool — it is a disguised monolith. Judges want to see tools that reflect a real understanding of what agentic decomposition means.
- **Is there at least one working guardrail?** The agent should demonstrate safe behaviour in at least one scenario. Show the guardrail firing: trigger the input that would violate the rule and show the agent handling it correctly.
- **Does the developer understand their own system?** You will be asked questions about your code, your architecture choices, and your reasoning. "I followed a tutorial" is not an answer. You must understand why you made each decision.
- **Would this solve a real Kampala problem?** The problem must be real, the users must be real, and the agent's solution must be plausible for actual deployment in the Ugandan context.

You are not judged on visual design, number of features, or code elegance. A plain HTML interface with a working agent beats a beautiful Tailwind app with a broken loop.

**3. Answering Technical Questions**

The Q&A session is not a test of whether you memorised documentation. It is a conversation about your system, your choices, and your thinking. Judges respect honest uncertainty more than confident bluffing.

Expect these questions:
- "What happens if [tool] fails?"
- "How did you handle [specific edge case you mentioned]?"
- "What is in your system prompt?" (or "can you show us the system prompt?")
- "How would you scale this to 1,000 users in Kampala?"
- "What would you build next if you had another two weeks?"

For each of these, prepare a one-sentence starting point for your answer. You do not need to memorise a full paragraph — just know where you would begin. "The system prompt defines the agent's role, the tools it has access to, and three guardrails. I can show you the exact text." That sentence buys you five seconds to breathe and recall the details.

"I don't know" is an acceptable answer for things you genuinely have not investigated. "That's a great question — I haven't looked at that yet, but my instinct would be X" is even better because it shows you can reason about unknown territory.

**4. After Demo Day**

Demo Day is a beginning, not an end. The 12 weeks built your foundation. What you do with it in the following months determines the impact. The AI Foundry Kampala community exists to support what comes next.

- **Continue building**: If there is genuine user interest — a school that wants to pilot your fees agent, a market association that wants the price intelligence tool — take it further. The club can connect you with potential early users and potential co-founders.
- **Document for the knowledge base**: Write a case study of what you built, what worked, and what you would do differently. The next cohort learns more from honest retrospectives than from polished success stories.
- **Open source it**: If the code is appropriate to share, publish it. Uganda's developer community benefits from shared tooling. A well-documented WhatsApp agent boilerplate for Kampala use cases is genuinely useful.
- **Pivot**: What you learned building this project may point to a different, better problem. The market price agent taught you how to ingest Uganda Commodity Exchange data. Maybe the better product is a commodity futures advisory service. Follow the insight, not the original plan.

**5. Retrospective Format**

The retrospective is written, submitted before Demo Day, and shared with the cohort after. It is your honest assessment of the build — not a marketing document, not a list of everything you wish you had done. Write it as if you are briefing the next person who will work on this project.

1. **What I built**: One paragraph, no jargon, readable by a headteacher at a Kampala primary school or a vendor at Owino Market.
2. **What worked**: Three specific things that went well. "The ReAct loop" is specific. "The AI was good" is not.
3. **What I would do differently**: Three specific things you would change if you started again Monday. Focus on architectural and process decisions, not "I would have slept more."
4. **What I learned about agents**: The most surprising or counter-intuitive thing you discovered about building agentic systems. Something you believed in Week 1 that you no longer believe.
5. **What is next**: If you continued for one more month with two hours per day available, what would you build?

---

### Kampala example

**Demo Day Retrospective: Boda Track**

*What I built*: An agent that automatically assigns boda boda riders to delivery requests for a small courier startup based in Bugolobi. Riders send their location and availability status via WhatsApp. Customers book a delivery via a web form. The agent finds the nearest available rider, assigns them to the booking, and sends a WhatsApp confirmation to both the customer and the rider with an estimated arrival time based on Kampala traffic patterns.

*What worked*:
1. The ReAct loop — once I understood it properly in Week 2, every feature added in subsequent weeks built cleanly on top of it. The loop is the foundation. Getting it right early compounded across the whole project.
2. Few-shot examples in the system prompt eliminated the JSON formatting errors I was getting in Week 3. Showing the model two examples of the exact output format I expected was more effective than two paragraphs of written instructions.
3. Mocking the GPS location tool early — Week 3 — let me build the full agent logic, the assignment algorithm, and the WhatsApp confirmation flow before I had any real location data. By the time I integrated real data, the rest of the system was stable.

*What I would do differently*:
1. Design the database schema before starting Week 7 rather than during it. I had to run two schema migrations in Week 11 because I had not thought through the relationship between Riders, Bookings, and AssignmentHistory carefully enough at the start.
2. Build smaller tools from the beginning. My first `assign_rider` tool did the distance calculation, the availability check, the assignment write, and the WhatsApp send in one function. Splitting it into four tools made each one testable independently and made the agent's reasoning legible — you could see in the logs exactly which step the agent was on.
3. Test Luganda inputs from Day 1. Riders in Bugolobi and Katwe communicate in Luganda. I found problems with the agent's handling of code-switched messages in Week 11 that I could have caught and fixed in Week 3 with ten minutes of testing.

*What I learned about agents*: The model is not the hard part. You install the SDK, write a system prompt, and the model works. State management and tool design are where real engineering happens. Getting the agent to behave correctly is mostly a question of what information you give it, when you give it, and how you decompose the problem into tool-shaped pieces. The LLM is the reasoning engine. The rest is plumbing.

*What is next*: Integrate real GPS coordinates from riders' phones using the WhatsApp location sharing feature. Add pricing intelligence — the agent currently quotes a fixed rate, but prices should vary by distance and time of day. Pitch to two Kampala courier startups that I identified during Week 10 research. If one is willing to pilot, deploy the production version in the first month after the cohort ends.

---

### Common questions

**Q: What if my demo crashes live?**

State it calmly and without apology: "The live demo has an issue. Let me walk you through the flow using the screenshots I prepared." Then open your backup — screenshots of each step of the agent interaction, ideally captured from a successful run during your Wednesday rehearsal — and walk the audience through exactly what they would have seen. The cohort has been through the build sprint. They understand that demos crash. What they are watching is how you handle it: calmly and professionally, or panicked and apologising. Be the former.

**Q: Do I need to present the code?**

You are not required to show code during the demo. The demo is about agent behaviour — what the agent does, how it reasons, what it produces. However, be prepared for questions about specific implementation choices, and know where in your codebase to point if someone asks to see a particular piece. "I do not know" is acceptable for things you have not yet explored. "Let me find that" followed by navigating to the relevant file is an excellent answer that demonstrates you know your own codebase.

**Q: What is the best way to show the agent's reasoning during the demo?**

Two good options. First, add a collapsible "Thinking" panel to your UI that shows tool calls and observations in real time as they happen — the audience can watch the ReAct loop execute step by step. This is the most compelling visual demonstration of agentic behaviour. Second, run through a recent agent log in your terminal during the demo, narrating what each line means. "Here you can see the agent decided to call `get_market_price`, received this result, then called `get_price_trend` because the first result prompted a follow-up question." Either approach is effective. The goal is to make the ReAct loop visible — to show the audience that what they are watching is a real agent reasoning through a problem, not a scripted response.

**Q: I finished building on Wednesday and Demo Day is Friday. What do I do with the extra time?**

Polish in order of highest Demo Day impact: (1) fix the known bugs in your "must fix" category if any remain; (2) improve the realism of your demo data — real Kampala names, accurate UGX amounts, plausible scenarios; (3) rehearse the demo twice more and time yourself precisely; (4) prepare more thorough answers to the five likely questions; (5) write your retrospective while the build is fresh in your mind. Do not add new features. You are polishing, not extending.

---

### Practice exercise

**Exercise 12.1 — Demo Prep Checklist**

Complete this checklist 24 hours before Demo Day. Each item is a binary check: done or not done. Partial credit does not exist on Demo Day.

- [ ] Deployed to production URL — not localhost, not a staging URL that requires special access. Any judge should be able to open it in a browser on their phone.
- [ ] Demo script rehearsed at least twice — once alone, once with a person watching and asking questions mid-demo.
- [ ] Backup screenshots prepared — a screenshot for each step of the demo script, captured from a successful run, stored on your phone and on a second device.
- [ ] Five likely Q&A questions identified and starting answers prepared — write the first sentence of your answer to each. The rest will flow.
- [ ] Retrospective written and submitted to the Slack channel.
- [ ] Peer review completed for at least two other projects — post specific, actionable feedback, not just "great work."
- [ ] Facilitator notified of any outstanding blockers that might affect your demo slot.
- [ ] Demo data reviewed — no placeholder names, no lorem ipsum, no "Test User 1". Real Ugandan names, realistic UGX amounts, believable Kampala scenarios.

Post your completed checklist and production URL in the Slack channel before midnight on the night before Demo Day. If any item is unchecked, name the specific blocker so the facilitator can help you resolve it before morning.
