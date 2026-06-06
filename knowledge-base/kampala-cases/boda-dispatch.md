## Case Study: The Boda Dispatch Agent

**Domain:** Transport / Logistics
**Location:** Bugolobi, Kampala
**Problem class:** Real-time resource allocation and coordination

---

### The Problem

QuickBoda is a small courier startup in Bugolobi, Kampala. They operate 12 boda boda riders for same-day package deliveries within Kampala. The business runs on WhatsApp:

- Customers send delivery requests via WhatsApp
- The dispatcher (one person, Fatima) matches riders to requests manually
- Fatima manages 12 rider WhatsApp chats simultaneously
- Peak hours (7-9am, 12-2pm, 5-7pm) overwhelm her — requests get missed or delayed
- Riders sometimes take orders they've already accepted elsewhere
- No automatic price calculation — Fatima estimates based on experience
- No tracking for customers — they call Fatima to ask "where is my parcel?"

Fatima works 6am-8pm, 6 days a week. She cannot take a break during peak hours. The business is limited by what one person can coordinate, not by rider availability.

---

### The Agent Solution

**Agent name**: QuickBoda Dispatcher

**Architecture**: Two agents (orchestrator + rider management sub-agent)

**Orchestrator Agent**:
- Receives customer requests
- Calculates price
- Identifies best available rider
- Sends assignments
- Handles customer status queries

**Rider Management Sub-Agent**:
- Tracks rider availability and location
- Updates rider status after each delivery
- Flags riders overdue for check-in

**Tools**:

```
receive_order(customer_whatsapp, pickup_location, dropoff_location, package_description)
  → Creates order record, returns order_id and estimated price

calculate_delivery_price(pickup_zone, dropoff_zone, urgency)
  → Returns UGX price based on zone matrix (e.g., Bugolobi→Kololo = 8,000 UGX)

get_available_riders(zone)
  → Returns list of riders currently in or near the specified zone, with last check-in time

assign_rider(order_id, rider_id)
  → Sends assignment to rider via WhatsApp, updates order status to ASSIGNED

get_order_status(order_id)
  → Returns current status: RECEIVED, ASSIGNED, PICKED_UP, DELIVERED, FAILED

update_rider_location(rider_id, current_zone)
  → Updates rider's last known zone and check-in timestamp

complete_delivery(order_id, proof_photo_url)
  → Marks order delivered, triggers payment confirmation, updates rider availability

flag_overdue(order_id)
  → Creates escalation alert for Fatima when delivery is 30+ minutes past estimated time
```

**System prompt excerpt**:

```
ROLE
You are QuickBoda's AI dispatcher. You match riders to delivery requests 
efficiently, communicate with customers professionally, and keep Fatima 
informed of exceptions. You manage 12 riders across Kampala zones.

ZONES: CBD, Nakasero, Kololo, Ntinda, Bugolobi, Bukoto, Muyenga, 
       Kisementi, Kabalagala, Kawempe, Naalya

RULES
1. Never assign a rider who has not checked in within the last 30 minutes
2. Always confirm price with customer before assigning a rider
3. Customers receive a rider name and phone number only after payment confirmation
4. For fragile packages, only assign riders with 4.5+ rating
5. If no rider is available within 15 minutes of pickup zone, notify Fatima immediately
6. Never promise delivery times — only say "estimated X-Y minutes"
7. All amounts in UGX with no decimals
```

---

### Key Concepts Demonstrated

**1. Real-time resource allocation**

The core pattern: match a request to an available resource based on proximity and availability. This is the same pattern as SafeBoda, Uber, and every dispatch system. The agent version works via WhatsApp (no app required), which is critical for Kampala where smartphone penetration is moderate but WhatsApp usage is near-universal.

The availability check is the most important guardrail: never assign a rider who hasn't checked in recently. A 30-minute stale check-in in Kampala traffic can mean the rider is now in a different part of the city or handling another order.

**2. Price calculation as a tool, not a rule**

Pricing is handled by a tool (`calculate_delivery_price`), not hardcoded in the system prompt. This is important:
- Prices can change (fuel prices affect boda costs) without changing the system prompt
- The price calculation logic can be audited and updated independently
- A wrong price from the tool produces a clear error the agent can handle, rather than a silent wrong answer baked into the prompt

**3. Human-in-the-loop for exceptions**

Fatima is not replaced — she is freed from routine dispatch to handle exceptions. The agent escalates to Fatima:
- When no rider is available
- When a delivery is 30+ minutes overdue
- When a customer disputes a charge
- When a rider reports an incident

This is the correct Human-in-the-Loop design: agents handle high-volume routine cases, humans handle low-volume high-judgment cases.

**4. WhatsApp as the interface**

No app required. Customer sends a message like: "I need to send a laptop from Bugolobi to Ntinda today, how much?"

Agent responds: "Hi! Delivery from Bugolobi to Ntinda is 9,000 UGX (standard) or 12,000 UGX (urgent, within 1 hour). Which would you like?"

Customer: "Standard is fine"

Agent: "Confirmed. Your order ID is QBD-2847. I'll send you rider details once payment is received. Please pay 9,000 UGX to MTN MoMo merchant code 4521 with reference QBD-2847."

This entire flow happens in WhatsApp. The agent tracks the order, watches for payment confirmation, assigns the rider, and sends tracking updates — all without Fatima's involvement.

---

### Technical Implementation Notes

**State machine per order:**

Each delivery order is modelled as a state machine with defined transitions:

```
RECEIVED → PAYMENT_PENDING → PAID → ASSIGNED → PICKED_UP → DELIVERED
                                              ↘ FAILED (no rider, incident)
```

The state is stored in PostgreSQL. Every agent action checks and updates the state. This prevents impossible transitions — an agent cannot mark an order DELIVERED if it was never PICKED_UP.

**Webhook-driven payment confirmation:**

The MTN MoMo merchant account is connected via a webhook to the agent backend. When a payment arrives with the correct reference code (e.g., "QBD-2847"), the webhook fires and triggers the `assign_rider` flow automatically. The agent does not poll for payment — it reacts to the payment event. This eliminates the 30-60 second delay of manual confirmation and the risk of Fatima missing a payment notification.

**Rider check-in protocol:**

Every 30 minutes, the Rider Management Sub-Agent sends a zone check-in request to all riders: "Quick check-in: reply with your current zone (e.g., NTINDA, CBD, KOLOLO)." Riders reply with a zone name. The sub-agent updates `update_rider_location` for each reply. Riders who do not reply within 5 minutes are marked UNAVAILABLE. This is the most critical reliability mechanism in the system — without current location data, the assignment algorithm cannot make good decisions.

**Zone matrix:**

Kampala is divided into 11 zones. The price matrix is a 11x11 table stored in the database, not in the system prompt. Each cell contains the standard price and the urgent price. Updating prices requires a database update only — no system prompt change. Example:

| From \ To | CBD | Nakasero | Kololo | Ntinda | Bugolobi |
|---|---|---|---|---|---|
| CBD | 4,000 | 5,000 | 6,000 | 8,000 | 7,000 |
| Bugolobi | 7,000 | 6,000 | 8,000 | 9,000 | 4,000 |

Zones not in the matrix (e.g., Entebbe, Mukono) are outside the service area. The agent responds: "We currently deliver within Kampala only. For deliveries to [location], please contact Fatima directly."

**Two-agent architecture rationale:**

The Orchestrator handles customer-facing conversation — it must be responsive and polite. The Rider Management Sub-Agent runs on a cron schedule and handles internal operations. Separating them means customer response time is never delayed by background rider management tasks. The sub-agent runs independently and updates the shared database, which the Orchestrator reads.

---

### Acceptance Criteria

1. A customer delivery request in plain English (or Luganda) is correctly parsed into pickup zone, dropoff zone, and package type in at least 9 of 10 test cases.
2. The price returned by `calculate_delivery_price` matches the zone matrix for the given origin/destination pair; price is in whole UGX with no decimals.
3. No rider is ever assigned who has not checked in within the last 30 minutes — this rule is enforced even during peak load with multiple simultaneous requests.
4. When a MoMo payment with a valid order reference arrives via webhook, `assign_rider` is triggered automatically within 60 seconds — no manual intervention by Fatima.
5. When no rider is available within 15 minutes of the pickup zone, Fatima receives an escalation notification within 2 minutes of the unavailability being detected.
6. A delivery marked DELIVERED cannot be re-assigned or modified by the Orchestrator — the state machine enforces terminal state immutability.
7. Customer receives rider name and phone number only after payment confirmation — not before.
8. An order 30+ minutes past its estimated delivery time triggers a `flag_overdue` call and an escalation message to Fatima.

---

### Common Implementation Questions

**Q: How does the agent know a customer has paid?**
A: The MTN MoMo merchant account sends a payment notification via webhook to the agent's backend. When the webhook fires with the correct reference code, the `assign_rider` flow triggers automatically. No manual payment confirmation by Fatima.

**Q: What if a rider doesn't respond to an assignment?**
A: The agent waits 3 minutes for rider acknowledgement. If no response, it attempts to assign the second-best rider and flags the non-responsive rider for Fatima's attention.

**Q: Can the agent handle multiple simultaneous orders?**
A: Yes. Each order runs as an independent state machine in the database. The agent processes each customer message in its own context, with the order state loaded from the database. Multiple orders do not interfere with each other.

---

### What Could Go Wrong

**1. Stale rider location data during Kampala traffic**

A rider checks in from Ntinda at 8:00am and gets assigned an order at 8:28am (just within the 30-minute window). But Ntinda-CBD traffic at peak hour means the rider is now stuck near Makerere and is 45 minutes from the pickup — not 15. The location data is technically fresh but practically useless. Mitigation: the 30-minute window is a minimum safeguard, not a guarantee of accuracy. The system should also use estimated travel time calculations (zone-to-zone average times by hour) to predict whether a rider can realistically reach the pickup. If predicted travel time exceeds 30 minutes, prefer a closer rider even if their last check-in was 25 minutes ago.

**2. Fraudulent payment references**

A bad actor sends "QBD-2847" as a MoMo reference for a payment of 500 UGX (instead of the 9,000 UGX owed). The webhook fires, the reference matches, and the order is assigned. Mitigation: the webhook handler must validate both the reference AND the amount. `match_payment(reference, expected_amount, actual_amount)` — if actual_amount is less than 90% of expected_amount, the payment is flagged as partial and the order is not automatically assigned. Fatima reviews partial payments manually.

**3. Rider double-booked by a customer directly**

A rider (Joshua, phone: 0772-XXXXXX) gets assigned via QuickBoda and also accepts a direct customer job through his personal WhatsApp. He now has two deliveries but the agent does not know about the direct booking. The agent thinks Joshua is available; Joshua is not. Mitigation: the check-in protocol helps — Joshua will miss check-ins while doing the direct job, and the system will mark him UNAVAILABLE after 30 minutes of silence. The deeper fix is contractual: riders agree not to accept direct jobs during QuickBoda working hours. This is a people problem as much as a systems problem.

**4. Zone boundary ambiguity**

A customer says "pick up from near Owino market." Owino sits on the boundary between CBD and Nakasero zones. The price matrix gives different prices for each. The agent must make a call. Mitigation: ambiguous location descriptions trigger a clarification request: "Is that closer to the City Square side or the Ben Kiwanuka Street side?" Alternatively, famous landmarks are mapped to their nearest zone in the knowledge base so the agent can resolve common reference points without asking.

---

### Practice Exercise

**Boda Dispatch Extension**: QuickBoda wants to add a rating system. After each delivery, the customer receives a WhatsApp message asking them to rate the rider (1-5). The agent should:
1. Send the rating request automatically 10 minutes after delivery is marked complete
2. Update the rider's average rating
3. If a rider receives 3 ratings below 3 in one week, notify Fatima

Design the extension:
1. New tools needed (with full descriptions)
2. New system prompt rules
3. How you would test the rating request timing
4. What safeguard would prevent fake ratings (one customer rating the same delivery 5 times)?
