## Week 12 — Demo Day

**Track:** Developer
**Week:** 12 of 12

---

### Learning objectives

By the end of this week you will have:
1. Delivered a live 10-minute demo of your capstone agent
2. Answered technical questions from the cohort and facilitator
3. Written a retrospective on what you built, what you'd do differently, and what's next
4. Received peer feedback and provided feedback to at least 2 other projects

---

### Key concepts

**1. Demo Day Format**

- **10-minute slot per project**: 5 minutes demo + 5 minutes Q&A
- **Live demo only**: No videos, no slides during the demo portion. The agent must run live.
- **Real data**: No placeholder or "lorem ipsum" content. Use realistic Kampala data.
- **Crash plan**: Have a backup approach (screenshots + walkthrough) if the live demo fails. State openly if you are using mocks.

**2. What the Judges Are Looking For**

For Developer track:
- Does the core agent loop work? (model → tool → observe → respond)
- Are the tools sensible and specific?
- Is there at least one working guardrail?
- Does the developer understand their own system? (they will be asked)
- Would this solve a real Kampala problem?

You are not judged on visual design, number of features, or code elegance. You are judged on working agentic behaviour.

**3. Answering Technical Questions**

Expect these questions:
- "What happens if [tool] fails?"
- "How did you handle [specific edge case]?"
- "What's in the system prompt?"
- "How would you scale this to 1,000 users?"
- "What would you build next if you had another 2 weeks?"

Prepare one-sentence answers to each. You don't need to memorise them — just think through each one before Demo Day.

**4. After Demo Day**

Demo Day is a beginning, not an end. Options:
- **Continue building**: If there's genuine user interest, take the project further. The AI Foundry Kampala community can connect you with potential users.
- **Document for the knowledge base**: Write a case study of what you built. It helps the next cohort.
- **Open source**: If appropriate, publish the code. Uganda's developer community benefits from shared tooling.
- **Pivot**: What you learned building this project may point to a different, better problem to solve.

**5. Retrospective Format**

Write a retrospective covering:
1. **What I built**: One paragraph, no jargon, readable by a non-technical person
2. **What worked**: 3 specific things that went well
3. **What I'd do differently**: 3 specific things you would change
4. **What I learned about agents**: The most surprising or counter-intuitive thing you discovered
5. **What's next**: If you continued for one more month, what would you build?

---

### Kampala example

**Demo Day Retrospective: Boda Track**

What I built: An agent that automatically assigns boda boda riders to delivery requests for a small courier startup in Bugolobi. Riders send their location via WhatsApp. Customers book via a web form. The agent assigns the nearest available rider and sends both parties a confirmation with estimated arrival time.

What worked:
1. The ReAct loop — once I got it right in Week 2, every subsequent feature built cleanly on top of it
2. Few-shot examples in the system prompt eliminated the JSON format errors I was getting in Week 3
3. Mocking the GPS tool early let me build the full agent logic before I had real location data

What I'd do differently:
1. Design the database schema before starting Week 7 instead of during — I had to migrate twice
2. Smaller tools — my first `assign_rider` tool did too many things; splitting it made testing easier
3. Test Luganda inputs from Day 1 — I found problems in Week 11 that I could have caught in Week 3

What I learned: The model is not the hard part. State management and tool design are the hard parts.

What's next: Integrate real GPS from riders' phones, add pricing intelligence, pitch to two Kampala courier startups.

---

### Common questions

**Q: What if my demo crashes live?**
A: State it calmly: "The live demo has an issue. Let me walk you through the flow using screenshots." Then walk through your backup. The cohort has all been through the build sprint — they understand.

**Q: Do I need to present the code?**
A: No, but be prepared to answer questions about the code. "I don't know" is acceptable for questions about things you haven't explored yet. "I'll find out" is better.

**Q: What's the best way to show the agent's reasoning?**
A: Either add a "thinking" panel to your UI that shows tool calls and observations in real time, or walk through a recent agent run log during the demo. Seeing the ReAct loop in action is the clearest way to show you built a real agent, not a fancy chatbot.

---

### Practice exercise

**Exercise 12.1 — Demo Prep Checklist**

Complete this checklist 24 hours before Demo Day:

- [ ] Deployed to production URL (not localhost)
- [ ] Demo script rehearsed at least twice
- [ ] Backup screenshots prepared for crash scenario
- [ ] One-sentence answers prepared for 5 likely questions
- [ ] Retrospective written
- [ ] Peer review completed for at least 2 other projects
- [ ] Facilitator notified of any outstanding blockers

Post your completed checklist and production URL in Slack before midnight the night before Demo Day.
