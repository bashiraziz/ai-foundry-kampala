# Mshauri — Setup Instructions

## Prerequisites
- Node.js 18+
- A [Neon](https://neon.tech) account (free tier)
- A [Google AI Studio](https://aistudio.google.com) account (free tier)
- An [OpenRouter](https://openrouter.ai) account (free tier)

---

## Step 1 — Configure `.env.local`

Open `.env.local` in the project root and fill in all five values:

```
GEMINI_API_KEY=        # from aistudio.google.com — no card needed
OPENROUTER_API_KEY=    # from openrouter.ai — set $0 credit limit
DATABASE_URL=          # from neon.tech — see Step 2
BETTER_AUTH_SECRET=    # run: openssl rand -base64 32
NEXT_PUBLIC_APP_URL=   # http://localhost:3000 for local dev
```

---

## Step 2 — Set up PostgreSQL with pgvector

1. Create a project at [neon.tech](https://neon.tech) (free tier)
2. Copy the connection string into `DATABASE_URL` in `.env.local`
3. The `pgvector` extension is enabled by default on Neon
4. Run the migration (this also regenerates the Prisma client):

```bash
npx prisma migrate dev --name init
```

---

## Step 3 — Seed the knowledge base

Embeds all knowledge base markdown files into the vector database using Gemini embeddings.
Takes approximately 5–7 minutes. Requires `GEMINI_API_KEY` to be set.

```bash
npm run seed
```

Verify in the Neon SQL console:

```sql
SELECT COUNT(*) FROM "KnowledgeChunk";
-- Must return >= 200

SELECT source, COUNT(*) FROM "KnowledgeChunk" GROUP BY source ORDER BY source;
-- Should show entries for every syllabus file, case study, and prep module
```

---

## Step 4 — Create a facilitator account

Start the dev server first (`npm run dev`), then run:

```bash
curl -X POST http://localhost:3000/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{"name":"Facilitator","email":"you@email.com","password":"yourpassword"}'
```

---

## Step 5 — Run the app

```bash
npm run dev
```

### Student-facing URLs

| URL | Description |
|---|---|
| `http://localhost:3000/` | Student tutor (landing page) |
| `http://localhost:3000/chat` | Chat interface |
| `http://localhost:3000/quiz` | Weekly quiz |
| `http://localhost:3000/assess` | Track assessment (new applicants start here) |
| `http://localhost:3000/assess/complete?id=...` | Assessment result screen |
| `http://localhost:3000/prep?applicantId=...` | Runway module dashboard |
| `http://localhost:3000/prep/1?applicantId=...` | Runway 1: The Terminal |
| `http://localhost:3000/prep/2?applicantId=...` | Runway 2: Git |
| `http://localhost:3000/prep/3?applicantId=...` | Runway 3: Python Basics |
| `http://localhost:3000/prep/4?applicantId=...` | Runway 4: The Mini-Project |
| `http://localhost:3000/prep/project?applicantId=...` | Mini-project submission |

### Facilitator URLs (login required)

| URL | Description |
|---|---|
| `http://localhost:3000/login` | Facilitator login |
| `http://localhost:3000/dashboard` | Main dashboard — student cohort overview |
| `http://localhost:3000/dashboard/applicants` | All applicants with scores and status |
| `http://localhost:3000/dashboard/applicants/[id]` | Applicant transcript + accept/reject |
| `http://localhost:3000/dashboard/prep` | Runway cohort progress |
| `http://localhost:3000/dashboard/prep/[id]` | Individual prep student detail |

---

## How the assessment flow works

1. New applicant visits `/assess` and enters their name
2. Mshauri runs an 8-signal conversational assessment (~10 minutes)
3. On completion, `/api/assess/complete` scores the transcript using weighted rubrics:
   - **Developer score ≥ 11** → `DEVELOPER` track
   - **Professional score ≥ 5** (and Developer < 11) → `PROFESSIONAL` track
   - **Prep score ≥ 4** (and both others < threshold) → `PREP` track
   - Otherwise → `NOT_READY`
4. PREP applicants are auto-enrolled and redirected to `/prep`
5. Facilitator reviews all applicants at `/dashboard/applicants` and accepts or rejects
6. Accepting a DEVELOPER or PROFESSIONAL applicant creates a `Student` record

## How the Runway program works

1. Student works through 4 modules at their own pace
2. Each module has lesson content + Mshauri chat (RAG-filtered to that module's knowledge base)
3. Module N+1 is locked until module N is marked complete
4. After completing module 4, student submits their GitHub mini-project URL
5. `/api/prep/evaluate` autonomously fetches and scores the project (score ≥ 70 to pass)
6. On pass, student takes the exit re-assessment at `/assess` — a fresh 8-signal assessment
7. If they score DEVELOPER, their `PrepEnrollment` status becomes `GRADUATED` and a `Student` record is created

---

## Deployment to Vercel

```bash
npm install -g vercel
vercel login
vercel
vercel env add GEMINI_API_KEY
vercel env add OPENROUTER_API_KEY
vercel env add DATABASE_URL
vercel env add BETTER_AUTH_SECRET
vercel env add NEXT_PUBLIC_APP_URL
vercel --prod
```

Update `NEXT_PUBLIC_APP_URL` in your Vercel environment variables to the live URL (e.g. `https://mshauri.vercel.app`).

---

## Smoke tests (run after deploy)

### Core tutor

1. `POST /api/chat` — response must reference the knowledge base
```bash
curl -X POST https://your-app.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"What is a Digital FTE?"}],"track":"DEVELOPER","week":1}'
```

2. `POST /api/quiz` — must return 3 parsed questions with Kampala examples
```bash
curl -X POST https://your-app.vercel.app/api/quiz \
  -H "Content-Type: application/json" \
  -d '{"track":"PROFESSIONAL","week":3}'
```

3. Open `/dashboard` — must redirect to `/login` if not authenticated
4. Facilitator logs in — dashboard shows student grid

### Assessment module

5. Complete an assessment as a strong Developer candidate — confirm `DEVELOPER` result
6. Complete an assessment as a Professional candidate (strong on business process, weak on coding) — confirm `PROFESSIONAL`, not a fallback
7. Complete an assessment as a motivated beginner — confirm `PREP`, `PrepEnrollment` record created, `/prep` page accessible
8. Complete an assessment as an unmotivated beginner — confirm `NOT_READY`, no enrollment created

### Runway

9. Work through all 4 modules — confirm module 2 is locked until module 1 is complete
10. Submit a valid GitHub URL with correct mini-project — confirm score ≥ 70 and `READY_FOR_EXIT` status
11. Submit an incomplete mini-project — confirm score < 70, specific feedback returned
12. Complete exit re-assessment as a now-qualified Developer — confirm `GRADUATED` status and Student record created

### OpenRouter fallback

13. Set a bad `GEMINI_API_KEY` temporarily — confirm OpenRouter fallback returns a valid response

---

## Phase 2 — WhatsApp Gateway (after web app is stable)

Add `app/api/whatsapp/route.ts` as a Twilio webhook handler:
1. Parse incoming WhatsApp message + sender phone number
2. Look up or create `Student` by phone number
3. Route message body to the same `/api/chat` logic
4. Reply via Twilio WhatsApp API

The RAG backend, quiz engine, assessment module, and Runway program are unchanged.

---

*Mshauri — The AI Foundry Kampala — June 2026*
