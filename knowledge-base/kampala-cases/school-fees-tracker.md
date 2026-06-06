## Case Study: The School Fees Tracker Agent

**Domain:** Education / Financial Services
**Location:** Multiple schools, Kampala
**Problem class:** Payment tracking, parent communication, and compliance

---

### The Problem

Kampala Primary Schools face a universal challenge: tracking school fees across hundreds of families, following up on late payments, and communicating with parents — all while running a school.

**Current state at a typical 800-student Kampala school**:

- Bursary office: 2 staff handling all fee collection and tracking
- Parents pay via MTN MoMo (40%), Airtel Money (25%), bank transfer (20%), and cash (15%)
- MoMo payments often arrive without clear student reference — the bursary must manually match each payment to a student account
- Fee reminders are sent manually by phone or SMS — 2 staff days per term
- Parents frequently call to ask their current balance, especially before parents' evenings
- Late payment follow-up is inconsistent — some families are called multiple times, others not at all
- End-of-term fee reports take 3 days to compile manually

**The bursary team's real problem**: They spend 70% of their time on tasks that are information lookup and communication. Only 30% of their time is spent on the work that requires human judgment (hardship cases, disputes, bank error resolution).

---

### The Agent Solution

**Agent name**: School Fees Tracker (internal name; parents see "Kampala Academy Support")

**Trigger 1**: Incoming parent WhatsApp message
**Trigger 2**: Daily 7am cron job for payment matching and reminder scheduling
**Trigger 3**: MoMo payment webhook (when a payment arrives)

**Tools**:

```
get_student_account(student_name_or_id)
  → Returns student record: name, class, term fees, payments made, balance

record_payment(student_id, amount_ugx, payment_method, reference, date)
  → Adds payment to student account, updates balance, returns new balance

match_momo_payment(momo_reference, amount_ugx, sender_name)
  → Attempts to match incoming MoMo payment to a student account using fuzzy name matching.
    Returns: matched student ID + confidence score, or "unmatched"

get_term_deadlines()
  → Returns current term's fee deadline, exam registration deadline, and report card deadline

generate_fee_statement(student_id)
  → Returns formatted fee statement: what was charged, what has been paid, what is outstanding

send_whatsapp(phone_number, message)
  → Sends a WhatsApp message via Meta Cloud API

flag_hardship(student_id, bursary_note)
  → Creates a hardship review case for the bursary office, suppresses automated reminders

get_overdue_accounts(days_overdue)
  → Returns list of students with outstanding balances past the due date
```

**System prompt excerpt**:

```
ROLE
You are the fees assistant for Kampala Academy. You help parents understand 
their child's fee status and payment options. You are professional, patient, 
and never judgmental about outstanding balances.

RULES
1. Verify parent identity before sharing balance: ask for child's name and class.
   Do not share balance details until both match a student record.
2. Never reveal another family's balance under any circumstances.
3. All amounts in UGX with comma separators. No decimals.
4. If a parent disputes a balance, say: "I've noted your concern. The bursary 
   office will contact you within 24 hours." Do not attempt to resolve disputes.
5. For hardship situations: if a parent mentions financial difficulty, do not 
   continue sending automated reminders. Flag for bursary office review.
6. Never threaten consequences for non-payment. Only state the facts: the 
   balance due and the payment deadline.
7. Support: MTN MoMo (Pay Bill 78234), Airtel Money (Pay Bill 90123), 
   Bank transfer (Stanbic A/C 9040023456). Cash: bursary office, Mon-Fri 8am-5pm.
8. End every payment-related response with the payment reference format: 
   student name + class (e.g., "AMINA P4B")
```

**Knowledge base**:
- School fee schedule for current academic year
- Term dates and deadlines
- Payment methods and procedures
- Common parent questions and answers (FAQ)
- NSSF and government levy information for parents asking about deductions

---

### Key Concepts Demonstrated

**1. Payment matching — the hardest problem**

The most technically interesting challenge is matching incoming MoMo payments to student accounts. A parent pays 1,250,000 UGX via MoMo. The MoMo notification shows the sender name as "Hajjat Namyalo." The student's name in the school database is "Ibrahim Ssekandi." How does the agent know this is Ibrahim's payment?

The `match_momo_payment` tool uses fuzzy name matching (the parent's MoMo name against the parent names on file for each student) combined with amount matching (which student has 1,250,000 UGX outstanding?). If confidence is below 0.85, the payment is flagged as unmatched and routed to the bursary office.

This is a case where the agent should be conservative: it is better to flag an uncertain match than to credit the wrong account.

**2. Identity verification before data sharing**

A privacy guardrail: before sharing any balance information, the agent asks for the child's name and class. This is not a login — schools don't have complex authentication. But it prevents casual disclosure of financial information to the wrong person.

The rule is simple: `student_name + class` must both match a record before balance data is returned. For example, "AMINA" alone is ambiguous (multiple Aminas in the school). "AMINA P4B" is specific.

**3. Hardship detection as an ethical guardrail**

The most important non-technical guardrail: if a parent expresses financial difficulty, stop automated reminders.

"I am trying but my husband lost his job and we are struggling" should not trigger a reminder at 7am the next day. The agent detects hardship language, suppresses automated follow-up, and creates a human review case. This is where the bursary office's human judgment is irreplaceable — they know families, they have discretion about fee assistance, and they can make decisions the agent should never make.

**4. Consistent communication at scale**

Without the agent, two bursary staff send manual reminders. The result: some families get 5 calls (the easiest to reach), others get none (the harder to reach). The agent treats all families consistently — every family with an overdue balance gets a reminder at the same time in the same format.

Consistency is an equity issue in school fee management. Families with business relationships with the bursary staff get informal extensions. Families without connections don't. An agent applies the same rules to everyone.

---

### Technical Implementation Notes

**Daily cron job logic:**

The 7am cron job runs three tasks in sequence:

1. **Payment matching**: Process any overnight MoMo and Airtel Money payments that arrived without being matched in real time. For each unmatched payment, run `match_momo_payment`. Payments with confidence >= 0.85 are auto-matched and the parent receives a confirmation. Payments below 0.85 confidence go to the bursary office's exception queue.

2. **Balance refresh**: Recalculate all student balances for the current term. Flag any accounts where the balance changed unexpectedly (possible data error).

3. **Reminder scheduling**: For accounts with overdue balances, check whether a reminder was sent in the last 7 days. If not, queue a WhatsApp reminder via `send_whatsapp`. The reminder is sent at 9am (not 7am when the cron runs) to be respectful of parents' morning routines.

**Fuzzy name matching algorithm:**

`match_momo_payment` uses a two-factor scoring system:

- **Name similarity score** (0-1): Levenshtein distance between the MoMo sender name and each parent name on file, normalised. "Hajjat Namyalo" vs "Namyalo Hajjat" scores ~0.85 (same names, different order). "Hajjat Namyalo" vs "Namuyalo Hajjati" scores ~0.78 (spelling variations common with mobile money registration).

- **Amount match score** (0 or 0.3 bonus): If the payment amount exactly matches a student's outstanding balance, +0.3 is added to the score. If it matches a partial instalment (e.g., 50% of the term fee), +0.15 is added.

Combined score must exceed 0.85 for auto-match. This threshold was set based on testing with 200 real MoMo transactions from a pilot school — at 0.85, false positive rate (crediting the wrong account) was below 0.5%.

**Hardship detection keywords:**

The system prompt instructs the model to detect hardship language. The knowledge base includes a hardship pattern list: phrases like "struggling", "lost my job", "cannot afford", "asking for more time", "nze sirimu ssente" (Luganda: I have no money), "ntuuze" (Luganda: I am broke). When any of these patterns appear, `flag_hardship` is called before any further response is generated. The model is instructed not to ask follow-up financial questions after detecting hardship — it acknowledges, flags, and closes warmly.

**Data retention:**

Conversation logs are stored for 12 months (one academic year) and then purged. Fee records are retained for 7 years (Uganda tax record retention requirement). Parent phone numbers are stored as hashed values in the conversation log — the actual number is in a separate table. If a parent requests their data, the bursary office retrieves it manually. This design reduces the data available in the conversation log while keeping the fee records intact for audit purposes.

**Multi-payment-method reconciliation:**

Each payment method arrives differently:
- **MoMo**: Webhook fires in real time; reference is in the notification payload
- **Airtel Money**: Webhook fires with 10-15 minute delay
- **Bank transfer**: CSV export from Stanbic uploaded manually by bursary staff each morning
- **Cash**: Entered manually by bursary staff after issuing a receipt

The agent handles MoMo and Airtel automatically. Bank transfers and cash are entered by staff via a simple web interface — the agent then sends the parent a confirmation WhatsApp message.

---

### Acceptance Criteria

1. A parent who sends their child's name and class receives their correct current balance within 30 seconds, with the correct payment instructions included in the reply.
2. A parent who sends only a child's name (without class) is asked to provide the class before any balance information is shared — no balance is returned on name alone.
3. A parent who mentions financial difficulty in any message receives no further automated reminders for that student for at least 14 days; a hardship review case is created in the bursary queue.
4. An incoming MoMo payment with a matching sender name (confidence >= 0.85) and matching amount is auto-matched and the parent receives a confirmation within 2 minutes of the payment notification.
5. An incoming MoMo payment with confidence below 0.85 is never auto-matched — it goes to the bursary exception queue with the sender name, amount, and top 3 candidate matches listed.
6. The daily 9am reminder is only sent to accounts with overdue balances that have not received a reminder in the last 7 days — no family receives more than one reminder per week.
7. A parent asking about another family's balance receives no information about that family, regardless of how the question is phrased.
8. The `generate_fee_statement` output is accurate: total charged, total paid, and balance outstanding all reconcile correctly against the payment records in the database.

---

### Common Implementation Questions

**Q: What if a parent receives a reminder for a payment they already made?**
A: If the payment was made via a recognised channel (MoMo, Airtel, bank transfer), it should be matched and recorded before reminders run. If the parent paid cash, they must have a receipt. The agent says: "Our records show a balance of X UGX. If you believe this is incorrect, please bring your receipt to the bursary office or WhatsApp a photo of it to this number." This is the escalation path for cash payment disputes.

**Q: Can the agent process refunds?**
A: No. Refunds are handled manually by the bursary office. The agent can acknowledge a refund request and create a ticket: "I've created a refund request for the bursary office. Reference: RF-2847. They will process it within 5 business days." But the actual refund transaction requires human authorisation.

**Q: Is this compliant with Uganda's Data Protection and Privacy Act?**
A: The processing of student and parent financial data requires a legal basis. In a school-parent relationship, the contract for educational services provides the legal basis for processing fee-related data. Schools should include a data processing notice in their admission paperwork. Conversation logs should be retained for a limited period (e.g., 12 months) and not shared with third parties.

---

### What Could Go Wrong

**1. Sending a reminder to a family in genuine crisis**

A parent loses a job and WhatsApp messages the school explaining their situation — but sends the message through a family member's phone, not their own. Their account is not flagged for hardship. At 9am the next day, the automated reminder arrives on the parent's registered number. This is a failure of the hardship detection system: the signal came through an unregistered channel. Mitigation: train bursary staff to flag hardship cases manually whenever they learn of one through any channel (calls, parent evenings, notes from teachers). The `flag_hardship` tool must be accessible to bursary staff, not just the agent.

**2. Wrong account credited due to a confident but incorrect match**

Two parents in the school have very similar names and children with similar term fees. The fuzzy matching algorithm scores both candidates above 0.85. The system auto-matches to the wrong account. Fee is credited to Family A; Family B's balance remains unpaid; Family B receives a reminder; dispute ensues. Mitigation: when two candidates score within 0.05 of each other, treat it as a tie and escalate to the bursary office rather than auto-matching. The tiebreak rule protects against the worst-case similarity scenario.

**3. A parent extracting another family's information through a social engineering attempt**

A parent claims: "I am calling on behalf of my sister — her child is AMINA P4B." The agent verifies name and class (both correct) and shares the balance. This is a genuine privacy failure. The identity verification step is minimal by design (the school does not have passwords). Mitigation: the agent should only share balance information in response to direct requests from the registered phone number on file. If the phone number requesting the balance does not match any registered parent number for that student, the agent says: "For security, I can only share balance information to the phone number registered for this student. Please ask the registered contact to get in touch, or visit the bursary office."

**4. MoMo webhook failure causes payments to go unprocessed**

The webhook integration fails silently (common during periods of MTN MoMo maintenance). Payments arrive at MTN but the school's system never receives the notifications. Parents receive no confirmation; the bursary sees no payment; reminders go out for fees that have been paid. Mitigation: the daily cron job includes a reconciliation step that compares the MoMo merchant statement (CSV downloaded each morning) against the payment records in the database. Any payment in the statement that is not in the database is flagged. This catch-up mechanism ensures webhook failures are discovered within 24 hours.

---

### Practice Exercise

**School Fees Agent Extension**: The school wants to add an end-of-term fee collection report for the Board of Governors. The report should show:
1. Total fees charged for the term
2. Total collected
3. Collection rate by class (P1-P7)
4. Number of students with outstanding balances
5. Top 10 outstanding balances (anonymised — Class only, not name)

Design the extension:
1. New tool needed (with full description and return format)
2. Who can trigger this report and how?
3. What data privacy consideration applies to item 5 (anonymised balances)?
4. What format should the report be in (JSON, PDF, WhatsApp message, Google Sheets)?
5. Write a test case verifying that the report does not include identifiable information for outstanding balance items
