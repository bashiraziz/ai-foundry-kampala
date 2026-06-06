## Case Study: The Duka Accountant Agent

**Domain:** Small Business / Retail
**Location:** Kampala Road, Kampala
**Problem class:** Financial record-keeping and inventory management

---

### The Problem

Moses Ssali owns a duka on Kampala Road selling imported electronics, phone accessories, and household goods. He employs two staff and turns over approximately 4 million UGX per month. His accounting challenge is common among Kampala small traders:

- Sales are tracked in a school exercise book
- No inventory management — he estimates stock by looking at the shelves
- He cannot tell which products are most profitable
- VAT filing to URA is done by his cousin once a year, using the exercise book records
- He has no idea what his margins are per product category

Moses spends approximately 2 hours per day on bookkeeping tasks — noting sales, checking change, reconciling the MTN MoMo merchant account at the end of each day. He would rather spend that time with customers.

---

### The Agent Solution

**Agent name**: Duka Accountant

**Trigger**: Always-on WhatsApp connection. Moses (or his staff) sends a voice note or text message describing the day's activity.

**Core loop**:
1. Moses sends: "Bosco alinunula phone charger yange 15,000 ne power bank 35,000" (English: "Bosco bought my phone charger 15,000 and power bank 35,000")
2. Agent extracts: two sales — charger 15,000 UGX, power bank 35,000 UGX, total 50,000 UGX
3. Agent updates daily sales log
4. Agent checks inventory: charger count was 8, now 7; power bank count was 3, now 2
5. Agent notes power bank is below reorder threshold (3 units)
6. Agent replies: "Recorded. Total today so far: 50,000 UGX. Power banks: 2 remaining (reorder when below 3 — send message to supplier?)"

**Tools**:

```
record_sale(product_name, quantity, price_ugx, payment_method)
  → Appends sale to daily log, updates inventory, returns confirmation

check_inventory(product_name)
  → Returns current stock count and reorder threshold

get_daily_summary(date)
  → Returns total sales, breakdown by category, cash vs. MoMo split

get_weekly_report(week_start_date)
  → Returns 7-day sales, top 5 products by revenue, MTN MoMo reconciliation

flag_reorder(product_name, supplier_contact)
  → Drafts a WhatsApp message to supplier with standard reorder text

get_margin(product_name)
  → Calculates gross margin % based on purchase price and sale price
```

**Knowledge base**:
- Moses's product catalogue with purchase prices (seeded once, updated when he adds new products)
- URA VAT guidance for small businesses (for annual filing assistant feature)
- Supplier contacts

**System prompt excerpt**:
```
ROLE
You are the Duka Accountant for Moses Ssali's shop on Kampala Road. You help 
Moses track sales, manage inventory, and understand his business performance. 
You communicate in English and Luganda — match the language Moses uses.

RULES
1. Always confirm the sale amount back to Moses before recording
2. Never round amounts — record exact UGX figures
3. When a product drops below its reorder threshold, always mention it
4. For MTN MoMo payments, note the MoMo reference number if Moses provides it
5. Weekly reports are sent automatically every Sunday at 8pm
6. Never give tax advice — for VAT questions, say: "You should discuss this with your accountant"
```

---

### Key Concepts Demonstrated

**1. Voice-to-structured-data pipeline**

The core pattern here is converting unstructured natural language (Moses's voice note in Luganda/English) into structured database records. This is one of the highest-value agent patterns for East African business contexts where voice is a natural interface and typing is slow.

Key challenges:
- Luganda product names: "arinunula phone charger yange" = "bought my phone charger"
- Mixed currency expressions: "fifteen k" = 15,000 UGX
- Implicit product identification: "the big one" requires context from previous turns

Solution: System prompt includes Moses's product catalogue so the model can resolve ambiguous references. Confirmation loop ensures accuracy before recording.

**2. Inventory management without a barcode scanner**

Moses does not have a barcode scanner or POS system. His inventory management is conversational: he tells the agent what he sold, the agent tracks the count. The agent can also accept inventory updates: "Received 20 phone chargers from supplier."

Reorder alerts are proactive — the agent mentions low stock without being asked. This mirrors the behaviour of a good shop manager who notices when shelves are getting thin.

**3. Financial reporting for non-accountants**

The weekly report is designed for Moses, not for an accountant. It answers the questions he actually asks:
- "Which products made me the most money this week?"
- "Did I get more money via MoMo or cash?"
- "How does this week compare to last week?"

The agent does not produce a profit and loss statement — it produces a readable summary in the format that matches Moses's mental model of his business.

---

### Technical Implementation Notes

**Data flow:**

1. Moses sends a WhatsApp message (text or transcribed voice note via WhatsApp's built-in transcription)
2. The message arrives at a webhook endpoint (Meta Cloud API)
3. The agent processes the message, calls tools as needed, and returns a reply
4. Tool calls hit a PostgreSQL database: sales log, inventory table, product catalogue
5. The agent's reply is sent back via the WhatsApp API

**Language handling:**

The model handles English-Luganda code-switching naturally. The system prompt is in English, but examples in the knowledge base include common Luganda product terms and transaction phrases. Key vocabulary is seeded: "alinunula" (bought), "amaze" (finished/sold out), "ssente" (money), "omuwendo" (price). No translation API is needed — Gemini 2.5 Flash handles code-switched Ugandan input well out of the box.

**Confirmation loop:**

Every `record_sale` call is preceded by a confirmation step. The agent extracts the intent, formats a confirmation message, and waits for Moses to reply with "yes", "nze" (me/yes in context), or a correction. This two-step write pattern prevents errors from voice transcription ambiguity. The confirmation times out after 10 minutes — if Moses does not reply, the transaction is not recorded and a reminder is sent.

**MTN MoMo reconciliation:**

MoMo merchant payments arrive as push notifications with a reference number. The agent matches each MoMo reference to a sale record. Unmatched MoMo receipts (payments with no matching sale in the log) are flagged in the weekly report — these typically represent sales that were received but not recorded, a common cash control leak in small dukas.

**Error handling:**

- Product not recognised: "I don't know 'HDMI cable' — is this a new product? Tell me the purchase price and I'll add it."
- Amount unclear: "Did you mean 15,000 or 1,500? Please confirm."
- Tool failure (database unreachable): "I could not save that right now. Please try again in a moment. Do not resend — I will check for duplicates automatically."

---

### Acceptance Criteria

1. Moses sends a sale message in English, Luganda, or mixed — the agent extracts product name, price, and payment method correctly in at least 9 out of 10 test cases.
2. After recording a sale, inventory count decreases by the correct quantity; the agent reports the new count in the confirmation message.
3. When inventory for any product drops below its reorder threshold, the agent mentions it in the confirmation reply without Moses asking.
4. The `get_daily_summary` tool returns correct totals for cash and MoMo separately, matching manually calculated test data.
5. The `get_weekly_report` tool returns the correct top 5 products by revenue for any given week, correctly excluding returns.
6. When Moses reports a customer return, the sale is reversed in the log and inventory is updated upward; the MoMo refund message is drafted but not sent.
7. MTN MoMo reconciliation identifies unmatched payments (payments received without a corresponding sale record) and includes them in the weekly report.
8. The agent never records a sale without explicit confirmation from Moses — the two-step confirmation loop is enforced for every transaction above 0 UGX.

---

### Common Implementation Questions

**Q: How do you handle the product catalogue when Moses adds a new product?**

A: The agent recognises when a product name does not exist in the catalogue and prompts Moses: "I don't know 'USB-C hub' — is this a new product? Tell me the selling price and the price you paid for it and I'll add it." This conversation populates a new catalogue entry. Moses never needs to interact with a form or spreadsheet. New products are available for future transactions immediately.

**Q: How do you prevent double-recording if Moses sends the same message twice?**

A: Each sale record includes a `raw_message_hash` — a fingerprint of the original message text. Before recording, the agent checks whether a sale with the same hash was already recorded in the last 10 minutes. If yes, it says: "It looks like I already recorded this — sale reference DUK-2847 from 2 minutes ago. Is this a different transaction?" This catches duplicate sends from WhatsApp retries and network issues.

**Q: Can the agent handle instalment payments?**

A: Yes, with a minor tool extension. `record_partial_payment(product_name, amount_paid, total_agreed, customer_name)` creates a credit record against the customer's tab. The agent tracks the outstanding balance and Moses can ask "what does Bosco still owe me?" at any time. Instalment selling (credit) is extremely common in Kampala's informal retail sector — it is a core feature, not an edge case.

---

### What Could Go Wrong

**1. Voice transcription errors for Luganda product names**

WhatsApp's voice-to-text may transcribe "power bank" as "pawa benki" or "pawabanka." If the product catalogue uses standard English names and the transcription returns an unfamiliar form, the agent will not recognise the product. Mitigation: the catalogue includes common Luganda/phonetic variants as aliases. The agent also asks for clarification rather than guessing: an unrecognised product triggers the new-product prompt.

**2. Moses's staff recording sales independently**

Moses has two staff members. If they all use the same WhatsApp number, the agent cannot distinguish who made the sale. Attribution is lost. Mitigation: each staff member gets a named user profile, and the agent greets them by name at the start of each shift. Sales are attributed to the person who reported them. Alternatively, each person uses a separate WhatsApp number connected to the same agent backend.

**3. Price confirmation bypassed in a hurry**

During a busy afternoon, Moses may reply "yes" to a confirmation prompt that he did not actually read. A sale gets recorded at the wrong price. Mitigation: the confirmation message always includes the amount in large, clear format: "CONFIRM: Phone charger sold for 15,000 UGX (MoMo). Reply YES to record." The agent also runs an end-of-day plausibility check — any item sold for more than 3x its catalogue price or less than cost price is flagged for review.

**4. Database downtime loses a sale**

If the database is unreachable when Moses sends a sale, the agent must not silently drop it. Mitigation: failed tool calls are queued in a local write-ahead log. When the database reconnects, the queue is replayed. The agent tells Moses: "I saved your sale locally — it will sync when the connection returns. You will receive a confirmation." This prevents data loss during power cuts or connectivity drops, which are common in parts of Kampala.

---

### Practice Exercise

**Duka Agent Extension**: Moses wants to add a feature: when any product has not sold for 14 days, the agent should flag it as "slow-moving stock" and suggest a sale price at 80% of the normal price to clear inventory.

Design the extension:
1. What new tool would you add?
2. What new system prompt rule would you add?
3. What test case would you write to verify it works?
4. What is the risk of this feature? (What could go wrong?)
