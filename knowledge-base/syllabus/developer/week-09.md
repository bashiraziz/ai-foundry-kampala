## Week 9 — Deployment Basics

**Track:** Developer
**Week:** 9 of 12

---

### Learning objectives

By the end of this week you will be able to:
1. Deploy a Next.js agent app to Vercel with environment variables configured
2. Set up a PostgreSQL database with pgvector on Neon or Supabase
3. Run the seed script against a production database
4. Configure basic monitoring and error alerting

---

### Key concepts

**1. Deployment Stack for This App**

This app is designed to deploy on a combination of managed services that require zero server administration. You do not need to configure nginx, manage SSL certificates, or SSH into a machine at 2am when something breaks. The stack handles the infrastructure so you can focus on the agent behaviour.

- **Vercel**: Hosts the Next.js frontend and API routes (serverless functions)
- **Neon or Supabase**: Hosted PostgreSQL with pgvector extension
- **Gemini API**: Primary LLM (Google AI Studio key)
- **OpenRouter**: Fallback LLM

Total cost for a small cohort (30 students, 3 months): approximately $0-20/month. The main cost driver is Gemini API calls; the knowledge base RAG embeddings are a one-time seeding cost. For Kampala developers used to paying for hosting in US dollars, this stack competes favourably with a shared cPanel hosting account and delivers far more capability.

**2. Environment Variables**

Every secret lives in `.env.local` locally and in Vercel's environment variable dashboard in production. Environment variables are the dividing line between code you commit to git (safe to share) and credentials you never commit (catastrophic if shared). Think of your `.env.local` file like your MTN MoMo PIN — you would never write it on a sticky note and leave it on your desk.

The five variables for this app:

```
GEMINI_API_KEY        — Google AI Studio
OPENROUTER_API_KEY    — OpenRouter.ai (free tier available)
DATABASE_URL          — PostgreSQL connection string with pgvector
BETTER_AUTH_SECRET    — 32-character random string (use: openssl rand -base64 32)
NEXT_PUBLIC_APP_URL   — Your Vercel deployment URL
```

Never commit `.env.local` to git. The `.gitignore` in this app excludes it. If you accidentally commit a secret, treat it as compromised immediately: rotate the key in the provider's dashboard, do not rely on git history rewrites to keep it safe.

**3. Database Setup on Neon**

```bash
# 1. Create project at neon.tech
# 2. Copy connection string to DATABASE_URL
# 3. Enable pgvector extension:
npx prisma db push  # applies schema without migrations

# 4. Run the seed script:
npm run seed
```

Neon's free tier provides 0.5GB storage and sufficient compute for a cohort of 30 students. The branching feature — create a database branch like a git branch — is useful for testing schema changes before running them against the production database. Create a branch, test your migration, confirm it works, then run the same migration against production.

**4. Vercel Deployment**

```bash
# Push to GitHub, connect repo in Vercel dashboard
# Add all 5 environment variables in Vercel dashboard
# Deploy button or:
vercel --prod
```

Key Vercel config for this app:
- Framework preset: Next.js
- Node.js version: 20.x
- Build command: `next build`
- Output directory: `.next`

Every push to the `main` branch on GitHub triggers an automatic deployment. Pull requests get preview URLs — a staging environment for every feature branch at no extra cost. For a Kampala team with members in different parts of the city, preview URLs mean the frontend developer in Ntinda can share a testable link with the backend developer in Najjera without either of them needing to install the project locally.

**5. Monitoring Basics**

Monitoring answers the question: "Is my app working right now, and when did it stop working?" Without monitoring, you learn about outages from angry users. With monitoring, you learn about problems before users do — or at least at the same time, with enough information to fix them quickly.

For a student cohort app, monitoring needs are simple:
- **Vercel logs**: Available in the dashboard, shows all function invocations and errors
- **Error alerting**: Add `console.error` in catch blocks — Vercel captures these and you can configure email alerts
- **Database monitoring**: Neon dashboard shows query counts, slow queries, connection pool usage
- **API cost tracking**: Google AI Studio dashboard shows token usage per day

For production apps serving real businesses in Kampala, add Sentry (error tracking with stack traces and user context) and an uptime monitor like Better Uptime, which will send you a WhatsApp message when your app goes down — appropriate for an ecosystem where WhatsApp is the primary communication channel.

---

### Kampala example

**Deploying the SafeSchools Fees Agent**

A school fees notification agent serving 15 Kampala schools across Nakasero, Kamwokya, and Rubaga, with 8,000 enrolled students. Parents receive WhatsApp notifications when fees are due, when payments are received, and when their child's balance reaches zero.

Architecture decisions for this deployment:
- **Vercel**: API routes for the WhatsApp webhook (Meta Cloud API) and the admin dashboard used by school bursars
- **Neon PostgreSQL**: Student records, payment history, and session logs in a single database with separate schemas per school
- **Cron job**: A weekly Vercel cron function triggers the "overdue fees" notification batch at 7am every Monday, before most parents have started their commute and while they have time to act on the message

MTN MoMo integration note: MTN Uganda's Merchant API requires a static IP address for webhook callbacks. Vercel serverless functions do not have static IPs. The solution is a lightweight proxy on a fixed-IP server — Liquid Intelligent Technologies operates a data centre in Kampala and offers small virtual machine plans — or to use a Ugandan mobile money aggregator that handles the static-IP requirement on your behalf.

Connectivity resilience: Schools in Kawempe and Makindye experience less reliable connectivity than those in Nakasero. Build offline-first behaviour on the client side — queue WhatsApp messages locally if internet drops, flush the queue when connection resumes. Vercel's edge network delivers static assets from the nearest available CDN node, reducing the impact of slow international links.

---

### Common questions

**Q: Should I use Vercel or a Ugandan hosting provider?**

Use Vercel for development and early-stage production. It eliminates operational complexity and gives you preview deployments, automatic HTTPS, and a global CDN without configuration. For apps with data residency requirements (government contracts typically specify that data must remain in Uganda), latency sensitivity, or payment processing that requires static IPs, evaluate Ugandan options: Liquid Intelligent Technologies has a Kampala data centre, and DigitalOcean's nearest region is Johannesburg, which provides lower latency than US or European regions for Kampala users. The application code is identical regardless of where you deploy — only the deployment target changes. Start on Vercel, migrate when specific requirements demand it.

**Q: How do I handle database migrations in production?**

Use `prisma migrate deploy` in production, not `prisma migrate dev`. The dev command generates migration files interactively and is destructive if the schema has changed significantly. The deploy command applies pre-generated migration files safely. Always take a database backup before running migrations. Neon offers point-in-time recovery on paid plans — before a schema change, note the timestamp, so you can restore to exactly that point if the migration causes problems. For Kampala developers shipping to schools where term-end is the busiest period, schedule schema migrations during school holidays when traffic is lowest.

**Q: What about HTTPS for the WhatsApp webhook?**

Vercel provides HTTPS automatically on all deployments, including preview URLs. Meta's Cloud API requires HTTPS for webhook endpoints — this is a hard requirement with no workaround. Vercel's automatic TLS is one of the strongest reasons to use it for WhatsApp-integrated agents during development: you get a valid HTTPS endpoint immediately, without configuring certificates or running ngrok tunnels. When you move to a Ugandan host, configure a certificate via Let's Encrypt (free) or use Cloudflare as a proxy, which provides TLS termination without changing your server configuration.

**Q: How do I keep costs predictable on the Gemini API?**

Set a budget alert in Google AI Studio at 80% of your monthly budget threshold. Log token counts for every LLM call — `console.log({ promptTokens, completionTokens, totalTokens })` in your LLM wrapper. Review the logs weekly and identify which features consume the most tokens. For a student cohort app, the most common cost driver is long conversation histories being sent on every message — implement a history truncation strategy that keeps the last 10 messages rather than the full session, reducing token cost by 60-80% for students who have been chatting for an hour.

---

### Practice exercise

**Exercise 9.1 — Deployment Plan**

Write a deployment plan for taking this app from your laptop to production for a 20-student cohort starting next Monday. Be specific — this plan should be usable as a checklist on the day.

1. **The complete list of steps in order** — from "create Neon account" to "send the first student their login link." Include every command you will run and every dashboard action you will take. There should be no gaps where a step is "figure out how to do X."

2. **The environment variables** — list all five, where to get each value, and how long it takes to obtain (some API keys are instant; others require approval). Flag any that might block your Monday launch date.

3. **Verification checks** — three specific checks you will run to confirm the deployment is working correctly before sending the student link. Each check should be a concrete action with an expected result: "I will send this message and expect this response" or "I will query this database table and expect N rows."

4. **Contingency plan** — what you will do if the Gemini API is down or rate-limited on launch day. Write the exact steps, not a general description. Which fallback will you use? How will you switch? How will you communicate status to students?

5. **Cost estimate** — estimate the monthly Gemini API cost for 20 students each making 5 quiz attempts and 10 chat sessions per week. State your assumptions about tokens per interaction. Calculate whether you are within the free tier or need a paid plan.
