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

This app is designed to deploy on:
- **Vercel**: Hosts the Next.js frontend and API routes (serverless functions)
- **Neon or Supabase**: Hosted PostgreSQL with pgvector extension
- **Gemini API**: Primary LLM (Google AI Studio key)
- **OpenRouter**: Fallback LLM

Total cost for a small cohort (30 students, 3 months): approximately $0-20/month. The main cost driver is Gemini API calls; the knowledge base RAG embeddings are one-time.

**2. Environment Variables**

Every secret lives in `.env.local` locally and in Vercel's environment variable dashboard in production. The five variables for this app:

```
GEMINI_API_KEY        — Google AI Studio
OPENROUTER_API_KEY    — OpenRouter.ai (free tier available)
DATABASE_URL          — PostgreSQL connection string with pgvector
BETTER_AUTH_SECRET    — 32-character random string (use: openssl rand -base64 32)
NEXT_PUBLIC_APP_URL   — Your Vercel deployment URL
```

Never commit `.env.local` to git. The `.gitignore` in this app excludes it.

**3. Database Setup on Neon**

```bash
# 1. Create project at neon.tech
# 2. Copy connection string to DATABASE_URL
# 3. Enable pgvector extension:
npx prisma db push  # applies schema without migrations

# 4. Run the seed script:
npm run seed
```

Neon's free tier (0.5GB storage, unlimited compute-hours) is sufficient for a cohort of 30 students.

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

**5. Monitoring Basics**

For a student cohort app, monitoring needs are simple:
- **Vercel logs**: Available in the dashboard, shows all function invocations and errors
- **Error alerting**: Add `console.error` in catch blocks — Vercel captures these and you can configure email alerts
- **Database monitoring**: Neon dashboard shows query counts, slow queries, connection pool usage
- **API cost tracking**: Google AI Studio dashboard shows token usage per day

For production apps serving real businesses in Kampala, add Sentry (error tracking) and an uptime monitor like Better Uptime.

---

### Kampala example

**Deploying the SafeSchools Fees Agent**

A school fees notification agent for 15 Kampala schools, 8,000 students:

Architecture:
- Vercel: API routes for the WhatsApp webhook (Meta Cloud API) and admin dashboard
- Neon PostgreSQL: Student records, payment history, session logs
- Cron job: Weekly Vercel cron triggers the "overdue fees" notification batch at 7am Monday

MTN MoMo integration:
- MTN Uganda Merchant API requires a static IP — use a Vercel Edge Function with a fixed-IP proxy, or use a Ugandan cloud provider (Liquid Intelligent Technologies has Kampala presence)

Connectivity resilience:
- Build in offline-first on the client: queue WhatsApp messages locally if internet drops, flush when connection resumes
- This matters for schools in Kawempe, Rubaga, and Makindye where connectivity is less reliable than Nakasero

---

### Common questions

**Q: Should I use Vercel or a Ugandan hosting provider?**
A: Vercel for simplicity and reliability during development and early deployment. For apps with data residency requirements, latency sensitivity, or government contracts, consider Liquid Intelligent Technologies (has a Kampala data centre) or DigitalOcean (nearest region: Johannesburg). The code is identical; only the deployment target changes.

**Q: How do I handle database migrations in production?**
A: Use `prisma migrate deploy` (not `prisma migrate dev`) in production. Always take a database backup before running migrations. Neon has point-in-time recovery on paid plans.

**Q: What about HTTPS for the WhatsApp webhook?**
A: Vercel provides HTTPS automatically on all deployments. Meta's Cloud API requires HTTPS — this is one reason Vercel is a good fit for Kampala developers: you get TLS for free without configuring nginx or certificates.

---

### Practice exercise

**Exercise 9.1 — Deployment Plan**

Write a deployment plan for taking this app from your laptop to production for a 20-student cohort starting next Monday. Include:

1. The complete list of steps in order (setup database → seed → deploy → test → launch)
2. The environment variables you need and where to get each value
3. How you would verify the deployment is working correctly (3 specific checks)
4. What you would do if the Gemini API is down on launch day
5. The estimated monthly cost for 20 students making 5 quiz attempts and 10 chat sessions each per week
