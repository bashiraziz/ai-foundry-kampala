## Week 4 — MCP: Giving Agents Tools

**Track:** Developer
**Week:** 4 of 12

---

### Learning objectives

By the end of this week you will be able to:
1. Explain the Model Context Protocol (MCP) and why it was created
2. Write a tool definition with name, description, and JSON schema parameters
3. Implement a simple MCP server that exposes one tool
4. Connect an MCP server to an agent via OpenCode's MCP config
5. Distinguish tools, resources, and prompts in the MCP standard

---

### Key concepts

**1. What is MCP?**

The Model Context Protocol is an open standard released by Anthropic in 2024 for connecting AI models to external tools and data sources in a standardised way. Before MCP, every agent framework and every AI application had its own incompatible interface for tools. A tool written for LangChain would not work with a different framework. A tool built for one company's agent would not be reusable in another project. MCP solves this by defining a single, open interface — analogous to USB in hardware or REST in web APIs. Once a tool is packaged as an MCP server, any MCP-compatible client can use it: Claude Desktop, Cursor, your custom agent built in this programme, or any other host that implements the client side of the protocol. The ecosystem effect matters: as more tools are published as MCP servers, you can assemble agent capabilities from existing building blocks rather than writing everything from scratch.

MCP defines three server primitives: **Tools** (functions the model can call to take actions or retrieve data), **Resources** (data sources the model can read from, like files or database tables), and **Prompts** (reusable prompt templates the host application can invoke). In this week, we focus primarily on tools.

*Kampala analogy:* MCP is the standardised interface that means you can plug any Ugandan plug into any socket — the socket doesn't need to know which appliance is plugged in, and the appliance doesn't need to know which brand of socket it will find. Before this standard existed, every appliance needed its own custom socket.

**2. Tool Definition Anatomy**

Every MCP tool has four parts: a name, a description, an input schema, and a handler function that executes when the tool is called. The name must be unique within the server and should follow snake_case convention. The description is the most important part of the definition — the model reads it to decide when to call the tool. If your description is vague, the model will call the tool at wrong times or fail to call it when it should. A good description answers three questions: what does this tool do, when should it be used, and what are its limitations?

```json
{
  "name": "check_momo_balance",
  "description": "Check the MTN Mobile Money balance for a given phone number. Use this when a customer asks about their current MoMo balance or when confirming payment capacity before a transaction. Do not use for Airtel Money accounts — use check_airtel_balance instead.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "phone_number": {
        "type": "string",
        "description": "Uganda MTN phone number in format 256XXXXXXXXX — must start with 256, not 0"
      }
    },
    "required": ["phone_number"]
  }
}
```

The input schema uses JSON Schema format. Every parameter needs a name, a type, and a description. Mark parameters as required or optional explicitly — do not leave the model to guess. Common mistakes: skipping the parameter description (the model doesn't know what format is expected), using generic names like "input" or "data" (forces the model to guess intent), and making too many parameters optional (the model will omit them when it shouldn't).

**3. Tools vs. Resources vs. Prompts**

Understanding when to use each MCP primitive prevents overloading tools with responsibilities they shouldn't have.

**Tools** are for actions that have side effects or that require active computation — looking up live data, writing to a database, sending a message, calling an external API. Tools are invoked by the model through tool calls in its response. They are the most common primitive and the focus of this week.

**Resources** are for read-only data that the host application can expose to the model — the contents of a file, a database table, a configuration document. Resources are listed by the server and the host can inject their content into context without the model explicitly requesting them. Think of resources as the model's reference library, and tools as its hands.

**Prompts** are pre-built prompt templates that the host application can populate and present to the user or model. For example: a "summarise_ugandan_law" prompt template that the user can invoke from their IDE or client application, pre-filled with the standard context for Ugandan legal analysis. Prompts are about reusability and consistency at the UX layer.

**4. Writing an MCP Server**

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
    description: "Get current fuel price per litre at Kampala Total stations. Use when the user asks about fuel costs for trip planning or vehicle expense calculations.",
    inputSchema: { type: "object", properties: {}, required: [] }
  }]
}));

server.setRequestHandler("tools/call", async (request) => {
  if (request.params.name === "get_fuel_price") {
    // In production: call an API or scrape an authoritative source
    return { content: [{ type: "text", text: "Petrol: 4,850 UGX/L as of today" }] };
  }
  throw new Error("Unknown tool");
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

The server exposes tools over stdio (standard input/output), which is the transport used for local MCP servers. For remote servers accessed over a network, the transport switches to HTTP with Server-Sent Events. OpenCode's MCP config file tells it which local servers to launch and how to connect to remote ones.

**5. OpenCode MCP Config**

To connect your MCP server to OpenCode, add it to the MCP config section of your OpenCode configuration file. Each entry specifies the command to launch the server, any environment variables it needs, and a display name. Once connected, every tool the server exposes becomes available to your agent automatically — you can see them listed in the OpenCode interface and the model can call them in its responses.

**6. Tool Design Principles**

Good tool design is as important as good system prompt design. Four principles: **One tool, one purpose** — do not build a "do_everything" tool that handles multiple unrelated actions based on an internal flag. Separate concerns; let the model choose between narrow, well-described tools. **Idempotent where possible** — tools that read data are safe to call multiple times. Tools that write data, send messages, or spend money should confirm before executing and return a clear indication of what was done. **Return structured data** — return JSON rather than prose wherever possible. The model parses JSON reliably; it may misread a three-paragraph text response. **Include error context** — if a tool fails, return enough information for the model to understand why and decide what to do. `{"error": "not_found", "searched_for": "0772123456", "hint": "number must be in 256XXXXXXXXX format"}` is far more useful than `{"error": true}`.

---

### Kampala example

**Tools for a Kampala Property Agent**

A property search agent for Kampala listings would need these tools:

```
get_listings(zone, min_price, max_price, bedrooms)
  → Returns array of available properties in Kampala zones (Ntinda, Kololo, Bukoto, Nsambya, etc.)
  → Description: Search the property database for available rentals matching the criteria.
    Use when the user specifies location, budget, or size requirements. 
    Prices are in UGX per month.

schedule_viewing(listing_id, applicant_name, preferred_date)
  → Books a viewing slot and sends WhatsApp confirmation to agent and applicant
  → Description: Book a property viewing appointment. Use only after the user has 
    confirmed they want to see a specific listing. Requires listing_id from get_listings.

check_neighborhood_safety(zone)
  → Returns recent crime statistics and street lighting status for the zone from KCCA data
  → Description: Retrieve safety information for a Kampala zone. Use when the user 
    asks about safety or when a listing is in an unfamiliar area.

calculate_commute(listing_id, workplace_address)
  → Estimates boda or matatu commute time from the listing to the specified workplace
  → Description: Calculate realistic commute time to a destination. Use when the user 
    mentions their workplace or asks about distance to Makerere, Garden City, Nakasero, 
    or any other location.

convert_currency(amount_usd)
  → Converts USD amount to UGX at current Bank of Uganda mid-rate
  → Description: Use when a listing price is quoted in USD or when the user asks to 
    compare prices across currencies.
```

Each tool is narrow and specific. The agent can combine them to answer: "Find me a 2-bedroom in Ntinda under 800,000 UGX per month with less than 30 minutes commute to Makerere, and tell me if the area is safe." That answer requires four sequential tool calls — get_listings, calculate_commute, check_neighborhood_safety, and possibly convert_currency — all orchestrated by the model's ReAct loop.

---

### Common questions

**Q: Do I need MCP to give agents tools?**

No. You can define tools directly in the model's API call without MCP — both Gemini and OpenAI support function calling natively, and you can pass tool definitions inline with each API request. MCP is a standardisation layer that makes tools reusable across different agent hosts and projects. For a single project where you are the only developer, direct function calling is simpler and has fewer moving parts. MCP becomes valuable when you want to share tools across multiple projects, integrate with MCP-compatible client applications like Claude Desktop or Cursor, or build tools that your team members can use in their own agents without re-implementing the underlying logic. Think of the decision as: direct function calling for a single project, MCP for a tool you want to publish and reuse.

**Q: How many tools can an agent have?**

Technically hundreds, but practically ten to twenty is the reliable range. Too many tools and the model gets confused about which to use, particularly when several tools have overlapping descriptions. It may call the wrong tool, call multiple tools when one would do, or fail to call any tool because it cannot decide. Two strategies when you have more than twenty tools: organise them into sub-agents, each with a narrow, focused tool set and its own specialised role; or use tool routing — a lightweight classifier agent that reads the user's request and selects the relevant tool subset to inject into the main agent's context for that specific request. Both approaches appear in Week 5 when we cover multi-agent systems.

**Q: What if the model calls a tool with invalid parameters?**

Validate every tool call before executing it. Return a structured, descriptive error message that tells the model exactly what was wrong and what the correct format is. For example: `{"error": "invalid_phone_format", "received": "0772123456", "required_format": "256XXXXXXXXX", "example": "256772123456"}`. The model will use this information in the next loop iteration to correct the call. What causes repeated failures is poor error messages — if you return only `{"error": "bad input"}`, the model has no information to self-correct. Investment in good error messages pays off in fewer loop iterations required, which means lower cost and faster responses for your users.

---

### Practice exercise

**Exercise 4.1 — Design and Document Three Tools**

You are building an agent for a Kampala car hire company similar to Ubuntu Car Hire on Bombo Road. The company provides vehicles with drivers for long-distance trips across Uganda and short Kampala city runs.

Design exactly three tools the agent would need. For each tool write:
1. The tool name in snake_case
2. A description of three to four sentences that tells the model exactly when to use this tool, when not to use it, and any important limitations
3. The full JSON schema for the input parameters — every field must have a name, type, and description
4. Two example return values: one successful response and one error response, both in the JSON format your handler would return

After documenting all three tools, write a plain-English walkthrough of how the agent would chain all three to handle this customer request: "I need a clean 7-seater with a driver for a Kampala-to-Mbarara-and-back trip this Saturday. What's the price and can we leave at 6am?"

Your walkthrough should identify which tool is called first, what it returns, how that output feeds into the next tool call, and what the final response to the customer looks like.
