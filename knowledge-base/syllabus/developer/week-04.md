## Week 4 — MCP: Giving Agents Tools

**Track:** Developer
**Week:** 4 of 12

---

### Learning objectives

By the end of this week you will be able to:
1. Explain the Model Context Protocol (MCP) and why it was created
2. Write a tool definition with name, description, and JSON schema parameters
3. Implement a simple MCP server that exposes one tool
4. Connect an MCP server to an agent and test it end-to-end

---

### Key concepts

**1. What is MCP?**

The Model Context Protocol is an open standard (released by Anthropic, 2024) for connecting AI models to external tools and data sources in a standardised way. Before MCP, every agent framework had its own incompatible tool interface. MCP is like USB — one standard connector that works across different models and hosts.

MCP defines:
- **Servers**: Processes that expose tools, resources, and prompts
- **Clients**: AI hosts (Claude, Cursor, your custom agent) that connect to servers
- **Transport**: How they communicate (stdio for local, HTTP+SSE for remote)

**2. Tool Definition Anatomy**

Every tool has four parts:

```json
{
  "name": "check_momo_balance",
  "description": "Check the MTN Mobile Money balance for a given phone number. Use this when a customer asks about their current MoMo balance or when confirming payment capacity before a transaction.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "phone_number": {
        "type": "string",
        "description": "Uganda MTN phone number in format 256XXXXXXXXX"
      }
    },
    "required": ["phone_number"]
  }
}
```

The description is the most important part. The model reads it to decide when to call the tool. If your description is vague, the model will call the tool at wrong times or miss it when it should be called.

**3. Writing an MCP Server**

A minimal MCP server in TypeScript:

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server({ name: "kampala-tools", version: "1.0.0" }, {
  capabilities: { tools: {} }
});

server.setRequestHandler("tools/list", async () => ({
  tools: [{
    name: "get_fuel_price",
    description: "Get current fuel price per litre at Kampala Total stations",
    inputSchema: { type: "object", properties: {}, required: [] }
  }]
}));

server.setRequestHandler("tools/call", async (request) => {
  if (request.params.name === "get_fuel_price") {
    // In production: call an API or scrape a source
    return { content: [{ type: "text", text: "Petrol: 4,850 UGX/L as of today" }] };
  }
  throw new Error("Unknown tool");
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

**4. Tool Design Principles**

- **One tool, one purpose**: Don't make a "do_everything" tool. Separate concerns.
- **Idempotent where possible**: Tools that read data are safe to call multiple times. Tools that write data or send messages should confirm before executing.
- **Return structured data**: Return JSON strings rather than prose. The model can parse JSON reliably; it may misread prose.
- **Include error context**: If a tool fails, return enough information for the model to understand why and decide what to do next.

---

### Kampala example

**Tools for a Kampala Property Agent**

A property search agent for Kampala listings would need these tools:

```
get_listings(zone, min_price, max_price, bedrooms)
  → Returns array of available properties in Kampala zones (Ntinda, Kololo, Bukoto, etc.)

schedule_viewing(listing_id, applicant_name, preferred_date)
  → Books a viewing slot and sends WhatsApp confirmation

check_neighborhood_safety(zone)
  → Returns crime statistics and lighting status for the zone

calculate_commute(listing_id, workplace_address)
  → Estimates boda or matatu commute time to Makerere, Garden City, Nakasero

convert_currency(amount_usd)
  → Converts USD rent to UGX at current Bank of Uganda rate
```

Each tool is narrow and specific. The agent can combine them to answer "find me a 2-bedroom in Ntinda under 800,000 UGX/month with less than 30 minutes commute to Makerere."

---

### Common questions

**Q: Do I need MCP to give agents tools?**
A: No — you can define tools directly in the model's API call (OpenAI and Gemini both support function calling without MCP). MCP is a standardisation layer that makes tools reusable across different agent hosts. For a single project, direct function calling is simpler. MCP becomes valuable when you want to share tools across multiple projects or integrate with MCP-compatible clients like Claude Desktop.

**Q: How many tools can an agent have?**
A: Technically hundreds, but practically around 10-20 is the sweet spot. Too many tools and the model gets confused about which to use. If you have 30+ tools, consider organising them into sub-agents, each specialising in a domain.

**Q: What if the model calls a tool with invalid parameters?**
A: Validate every tool call before executing. Return a descriptive error like "phone_number must start with 256, received '0772123456'". The model will usually correct the format on the next attempt.

---

### Practice exercise

**Exercise 4.1 — Design and Document Three Tools**

You are building an agent for a Kampala car hire company (similar to Ubuntu Car Hire on Bombo Road). Design exactly three tools the agent would need.

For each tool write:
1. The name (snake_case)
2. A description that tells the model exactly when to use it (3-4 sentences)
3. The full JSON schema for input parameters
4. Two example return values — one success, one error

Then describe in plain English how the agent would chain all three tools to handle the request: "I need a driver and a clean 7-seater for a Kampala-Mbarara-Kampala trip this Saturday."
