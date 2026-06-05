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

### Common Questions

**Q: How does the agent know a customer has paid?**
A: The MTN MoMo merchant account sends a payment notification via webhook to the agent's backend. When the webhook fires with the correct reference code, the `assign_rider` flow triggers automatically. No manual payment confirmation by Fatima.

**Q: What if a rider doesn't respond to an assignment?**
A: The agent waits 3 minutes for rider acknowledgement. If no response, it attempts to assign the second-best rider and flags the non-responsive rider for Fatima's attention.

**Q: Can the agent handle multiple simultaneous orders?**
A: Yes. Each order runs as an independent state machine in the database. The agent processes each customer message in its own context, with the order state loaded from the database. Multiple orders do not interfere with each other.

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
