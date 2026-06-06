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

Week 11 is a build sprint. No new features, no scope creep, no "what if we also added." Build exactly what your Week 10 spec committed to. Anything not in the spec is Week 13. Sprint discipline is not about being rigid — it is about protecting your ability to finish. Every hour spent on a feature that was not in the spec is an hour not spent making the core loop work. The spec was reviewed by your peers. Trust that review and build what you said you would build.

Daily structure:
- Morning (30 min): What did I commit to completing today? Write it down. Be specific.
- Work block: Build. Minimise context switching.
- Evening (15 min): What did I actually finish? What is blocking tomorrow? Post an update in Slack.

If you are two days in and nothing is working, that is the signal to cut scope — not to stay up all night. Cutting scope early gives you time to make a reduced set of features work well. Staying up all night to save over-scoped features produces a demo where everything half-works and nothing impresses.

**2. MVP Definition**

Your MVP must demonstrate the core agent loop:
1. User provides input
2. Agent reasons and calls at least one tool
3. Tool returns real (or realistic mock) data
4. Agent synthesises a useful response
5. Response is shown to the user in a working UI

Everything else is polish. A working loop with an unstyled HTML form beats a beautiful Tailwind UI with a broken loop every time. Judges are evaluating whether you understand agent architecture, not whether you can write CSS. Get the loop working first. Polish is for the buffer day in Week 12.

**3. Testing Your Agent**

Test the happy path first. Confirm that the scenario in your demo script works end-to-end before testing anything else. Then systematically break it:
- What if the tool returns an error or times out?
- What if the tool returns empty results — no data found?
- What if the user sends a question completely out of scope for your agent?
- What if the user sends a very long message — 500 words of context?
- What if the user sends in Luganda, or a mix of English and Luganda?

For Kampala-deployed agents, Luganda/English code-switching is not an edge case — it is a common case. A parent asking about school fees might send "Balance ya mwana wange?" (What is my child's balance?). A market vendor might mix "price ya tomatoes" and "etofaali za kawaida." If your agent cannot handle this, it cannot serve Kampala users. Test it in Week 11, not on Demo Day.

**4. Common Build Sprint Problems**

- **Tool integration takes longer than expected**: MTN API, government databases, WhatsApp Business API — all have setup delays, approval processes, and documentation that is less complete than you hoped. Budget one day of buffer per external API integration. If the API is not approved by Day 3, mock it and move on.
- **Context too long**: If your agent is slow (more than 8 seconds to respond) or giving incoherent answers, check token count. Log `promptTokens` and `completionTokens` on every call. A conversation that has been running for 30 messages may have grown to 15,000 tokens. Implement history truncation: keep only the last 10 messages plus the system prompt.
- **Model hallucination on local content**: The LLM does not know Kampala street names, NIRA ID number formats, current UGX exchange rates, or the fee structure at St. Mary's College Kisubi. Never rely on the model's training data for local facts. Inject every local fact as context or provide a tool that retrieves it.
- **Database schema wrong**: If you discover your schema cannot support a feature your demo needs, fix it now, in Week 11, not the evening before Demo Day. Run `prisma migrate dev` locally to generate the migration file, test it, then `prisma migrate deploy` to production. A schema change takes 15 minutes to do properly; on Demo Day eve it takes three panic-stricken hours.

**5. Demo Script Structure**

Write your demo script as a sequence of exact user inputs and the expected agent behaviour for each. This is not a description of what the agent can do — it is a step-by-step walkthrough you will follow in front of an audience. Rehearse it until you can run it without thinking about the steps, so that your attention on Demo Day is on the audience, not on remembering what comes next.

```
Step 1: User opens app, enters name "Amina", selects "Nakasero Market"
Step 2: User sends: "What's the price of fresh tomatoes today?"
Expected: Agent calls get_market_price("tomatoes", "Nakasero"), returns UGX price with timestamp
Step 3: User asks: "Is that higher or lower than last week?"
Expected: Agent calls get_price_trend("tomatoes", 7), responds with percentage change and context
Step 4: User asks: "Which market has the best tomato price right now?"
Expected: Agent calls compare_markets("tomatoes"), names the best market with the price difference
```

Rehearse this script twice before Demo Day: once alone, once with someone watching. The watcher should interrupt with realistic questions so you practise handling interruptions while keeping the demo on track.

---

### Kampala example

**Week 11 Build Log — School Fees Agent**

This is a representative build log from a previous cohort's Week 11 sprint. It shows what real progress looks like: not smooth, but steady.

Day 1-2:
- Prisma schema deployed to Neon — Student, FeeBalance, PaymentRecord, Session models ✓
- WhatsApp webhook endpoint accepting messages and returning 200 to Meta ✓
- Tool 1: `get_student_balance(student_id)` — queries FeeBalance table, returns current balance in UGX ✓
- Blocker discovered: parents send student names, not IDs. Added to Day 3 scope.

Day 3:
- Tool 2: `generate_payment_reference(student_id, amount)` — MTN MoMo API approval still pending, mocked with realistic 10-character alphanumeric references in MTN's actual format ✓
- Tool 3: `get_term_deadline()` — returns current term end date from configuration ✓
- Added Tool 4: `find_student_by_name(name, class)` — fuzzy match on student name for parents who do not know their child's ID ✓

Day 4:
- System prompt tuned after testing with 15 real parent-style questions typed by a cousin in Rubaga
- Discovered: two parents in the test sent messages entirely in Luganda — agent handled the language correctly but the tool confirmation messages were in English only. Fixed: tool responses now come with a Luganda translation in the agent's system prompt.
- Response time averaging 4.2 seconds — acceptable for WhatsApp, where users expect a few seconds

Day 5:
- Deployed to Vercel staging URL ✓
- Demo script written — 5 steps, covers the happy path and one error case (student not found) ✓
- Known issues list: (1) response occasionally slow when history > 8 messages — workaround is history truncation at 8, will fix before Demo Day; (2) `find_student_by_name` returns multiple results for common names like "Nakato" — needs disambiguation step

This is real build sprint output. The MTN API never arrived. The Luganda issue was only discovered because a real person tested it. The schema needed a fourth tool that was not in the original spec. The agent still works and the demo is ready.

---

### Common questions

**Q: How much should I worry about the UI during the build sprint?**

Enough to make the demo comprehensible to a non-technical observer, no more. A basic chat interface — input field, send button, messages displayed in order — is sufficient. The facilitator and cohort are evaluating agent behaviour, not visual design. If you spend Day 3 and Day 4 working on dark mode, animations, or a custom design system, you have made a mistake. The UI earns its development time only after the agent loop is solid. If you finish the loop early and have buffer time, then polish. Most people do not have buffer time.

**Q: My agent is hallucinating Kampala street addresses. What do I do?**

Two steps. First, add an explicit instruction to your system prompt: "Never invent Kampala street addresses, phone numbers, business names, or locations. If you do not have this information from a tool result, say you do not have it." Second, provide a tool that looks up real addresses from your database. The model will call the tool rather than guessing if the tool exists and the system prompt instructs it to use tools for local facts. Test this by asking for the address of a business that is not in your database — the agent should say it does not know, not invent a plausible-sounding address on Bombo Road.

**Q: I am behind schedule. What do I cut?**

Cut in this order, from least painful to most:

1. **Multi-agent complexity**: If you planned an orchestrator with two sub-agents, collapse it to a single agent that handles all the tools directly. Same behaviour, simpler architecture.
2. **Nice-to-have tools**: Keep only the tools that appear in your demo script steps. Every tool that is not in the demo is a tool you do not need this week.
3. **Persistence features**: If full conversation history is slowing you down, implement a simple in-memory session for the demo. Real persistence can come after Demo Day.
4. **Luganda support**: If language handling is taking too much time, constrain the demo to English and note in your presentation that Luganda support is planned.

Never cut the core loop. A working loop with two tools beats a broken loop with six.

**Q: What if a tool I depend on keeps returning errors during testing?**

Add robust error handling to the tool and to the agent's system prompt. The system prompt should tell the agent what to do when a tool returns an error: "If get_market_price returns an error, tell the user the price information is temporarily unavailable and suggest they check again in a few minutes." A graceful degradation is better than a crash, and it is often a better demo — showing the judge that your agent handles errors cleanly demonstrates engineering maturity.

---

### Practice exercise

This week's exercise is your build sprint itself. The deliverable by end of Week 11 is:

1. **A deployed staging URL** — your app running on Vercel (not localhost), accessible via HTTPS, with at least one successful agent interaction already recorded in the database.

2. **A completed demo script** — the exact sequence of inputs you will send during your 5-minute Demo Day demonstration, with the expected agent output for each step.

3. **A known issues list** — every bug you found during testing, triaged into three categories:
   - Must fix before Demo Day (breaks the demo script)
   - Should fix if time allows (degrades the experience but does not break the demo)
   - Post-Demo Day (nice to have, no time this week)

Post all three to the Slack channel by midnight on Friday of Week 11.

If you are blocked on anything during the sprint, post a specific question in Slack using this format: "I am trying to [X]. I have tried [Y] and [Z]. The error message is: [paste exact error]. What should I do?" Vague messages — "I'm stuck" or "it's not working" — do not contain enough information for anyone to help you.
