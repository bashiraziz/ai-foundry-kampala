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

**Agent name**: Schol Fees Tracker (internal name; parents see "Kampala Academy Support")

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

### Common Questions

**Q: What if a parent receives a reminder for a payment they already made?**
A: If the payment was made via a recognised channel (MoMo, Airtel, bank transfer), it should be matched and recorded before reminders run. If the parent paid cash, they must have a receipt. The agent says: "Our records show a balance of X UGX. If you believe this is incorrect, please bring your receipt to the bursary office or WhatsApp a photo of it to this number." This is the escalation path for cash payment disputes.

**Q: Can the agent process refunds?**
A: No. Refunds are handled manually by the bursary office. The agent can acknowledge a refund request and create a ticket: "I've created a refund request for the bursary office. Reference: RF-2847. They will process it within 5 business days." But the actual refund transaction requires human authorisation.

**Q: Is this compliant with Uganda's Data Protection and Privacy Act?**
A: The processing of student and parent financial data requires a legal basis. In a school-parent relationship, the contract for educational services provides the legal basis for processing fee-related data. Schools should include a data processing notice in their admission paperwork. Conversation logs should be retained for a limited period (e.g., 12 months) and not shared with third parties.

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
