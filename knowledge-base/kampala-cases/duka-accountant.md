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

### Common Questions

**Q: What happens if Moses misremembers the price?**
A: The agent confirms: "Recorded: phone charger sold at 15,000 UGX. Is that correct?" Moses can correct before the record is written. For high-value transactions, a second confirmation step is appropriate.

**Q: What if a customer returns a product?**
A: The agent accepts return instructions: "Customer returned power bank 35,000 — refund via MoMo 0772123456." The tool records a negative sale and triggers the inventory update. The MoMo refund itself is initiated by Moses manually — the agent drafts the message but does not execute the payment.

**Q: How does Moses get his data if he stops using the agent?**
A: All data is in a standard PostgreSQL database. A simple export tool produces a CSV that any accountant can use. Data portability is a requirement, not an afterthought.

---

### Practice Exercise

**Duka Agent Extension**: Moses wants to add a feature: when any product has not sold for 14 days, the agent should flag it as "slow-moving stock" and suggest a sale price at 80% of the normal price to clear inventory.

Design the extension:
1. What new tool would you add?
2. What new system prompt rule would you add?
3. What test case would you write to verify it works?
4. What is the risk of this feature? (What could go wrong?)
