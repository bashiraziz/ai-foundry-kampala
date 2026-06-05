## Week 11 — Build Sprint

**Track:** Developer
**Week:** 11 of 12

---

### Learning objectives

By the end of this week you will have:
1. A working MVP of your capstone project deployed to a staging URL
2. At least 3 tools implemented and tested
3. A demo script written and rehearsed once
4. A list of known bugs and a triage priority for each

---

### Key concepts

**1. Sprint Discipline**

Week 11 is a build sprint. No new features, no scope creep, no "what if we also added." Build exactly what your Week 10 spec said. Anything not in the spec is Week 13.

Daily structure:
- Morning (30 min): What did I commit to completing today?
- Work block: Build
- Evening (15 min): What did I actually finish? What is blocking tomorrow?

If you are 2 days in and nothing is working, that is the signal to cut scope — not to stay up all night.

**2. MVP Definition**

Your MVP must demonstrate the core agent loop:
1. User provides input
2. Agent reasons and calls at least one tool
3. Tool returns real (or realistic mock) data
4. Agent synthesises a useful response
5. Response is shown to the user in a working UI

Everything else is polish. A working loop with ugly UI beats a beautiful UI with a broken loop.

**3. Testing Your Agent**

Test the happy path first. Then test:
- What if the tool returns an error?
- What if the tool returns empty results?
- What if the user sends a question completely out of scope?
- What if the user sends a very long message?
- What if the user sends in Luganda (or a mix of English and Luganda)?

For Kampala-deployed agents, Luganda/English code-switching is not an edge case — it is a common case. Test it.

**4. Common Build Sprint Problems**

- **Tool integration takes longer than expected**: MTN API, government databases, WhatsApp Business API — all have setup and approval processes. Mock them with realistic fake data and note it in your demo.
- **Context too long**: If your agent is slow or incoherent, check token count. Log it.
- **Model hallucination on local content**: The model doesn't know Kampala street names, NIRA ID formats, or UGX amounts. Always inject this as context, never rely on training data.
- **Database schema wrong**: Fix it now, not during the demo. `prisma migrate dev` locally, update and redeploy.

**5. Demo Script Structure**

Write your demo script as a sequence of exact user inputs and expected agent outputs:

```
Step 1: User opens app, enters name "Amina", selects "Nakasero Market"
Step 2: User asks: "What's the price of fresh tomatoes today?"
Expected: Agent calls get_market_price("tomatoes", "Nakasero"), returns price in UGX
Step 3: User asks: "Is that higher or lower than last week?"
Expected: Agent calls get_price_trend("tomatoes", 7), responds with comparison
Step 4: User asks: "Which market has the best tomato price right now?"
Expected: Agent calls compare_markets("tomatoes"), names the best market
```

Rehearse this script twice before Demo Day.

---

### Kampala example

**Week 11 Build Log — School Fees Agent**

Day 1-2:
- Prisma schema deployed to Neon ✓
- WhatsApp webhook endpoint working ✓
- Tool 1: `get_student_balance(student_id)` implemented ✓

Day 3:
- Tool 2: `generate_payment_reference(student_id, amount)` — MTN API not approved yet, mocked with realistic fake references ✓
- Tool 3: `get_term_deadline()` — returns current term payment deadline ✓

Day 4:
- System prompt tuned after testing with real parent questions
- Discovered: parents send student names, not IDs → added `find_student_by_name(name, class)` tool

Day 5:
- Deployed to Vercel staging URL ✓
- Demo script written ✓
- Known issues: response sometimes slow (>5s) when knowledge base retrieval runs — will pre-warm on demo day

This is real build sprint output. Not everything goes to plan, but the core loop works.

---

### Common questions

**Q: How much should I worry about the UI during the build sprint?**
A: Enough to demo. The facilitator and cohort can evaluate an agent through a basic chat interface. You do not need animations, dark mode, or a custom design system. If the agent loop works, the UI is secondary.

**Q: My agent is hallucinating Kampala street addresses. What do I do?**
A: Add a "Never invent Kampala addresses, phone numbers, or business locations" rule to your system prompt. Then provide a tool that looks up real addresses from your data. The model will call the tool instead of guessing.

**Q: I'm behind schedule. What do I cut?**
A: Cut in this order: (1) multi-agent complexity → make it single-agent, (2) nice-to-have tools → keep only the tools needed for the demo script, (3) polish → raw but working beats polished and broken.

---

### Practice exercise

This week's exercise is your build sprint itself. The deliverable is your deployed staging URL and your completed demo script. Post both to the Slack channel by end of Week 11.

If you are blocked on anything, post a specific question in Slack: "I am trying to do X, I have tried Y and Z, the error is [paste error], what should I do?" Vague "I'm stuck" messages don't get useful help.
