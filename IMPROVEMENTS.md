# Mshauri — Improvement Plan
## The AI Foundry Kampala

Tracked here. Check off as implemented. Do not delete completed items — they serve as a record.

---

## Priority 1 — Silent failures (students get no feedback when things break)

- [x] **1.1** Add `safeParseJson()` helper in `lib/utils.ts` — strips markdown fences, parses JSON, returns null on failure. Used everywhere LLM output is parsed.
- [x] **1.2** Apply `safeParseJson` in `/api/quiz` POST — if LLM returns malformed JSON, retry with a stricter prompt before returning 500
- [x] **1.3** Apply `safeParseJson` in `/api/assess/complete` — if scoring JSON fails, retry once, then return a graceful degraded result rather than crashing
- [x] **1.4** Apply `safeParseJson` in `/api/runway/evaluate` — score parse failure should return a clear error to the student, not a 500
- [x] **1.5** Error state + message in `ChatWindow.tsx` — catch fetch failures, show "Mshauri is unavailable right now — try again in a moment" inline
- [x] **1.6** Error state in `QuizCard.tsx` — catch fetch failures on quiz load and answer submit, show inline message with retry button
- [x] **1.7** Error state on `app/assess/page.tsx` — catch failures on message send, show inline error so student knows to retry
- [x] **1.8** Error state on `app/runway/[module]/page.tsx` chat — same pattern as ChatWindow

---

## Priority 2 — Streaming LLM responses (perceived speed on slow connections)

- [x] **2.1** Add `geminiStream()` to `lib/gemini.ts` using `streamGenerateContent` — returns a `ReadableStream`
- [x] **2.2** Add `openrouterStream()` to `lib/openrouter.ts` using SSE streaming
- [x] **2.3** Update `/api/chat/route.ts` to return a streaming response (`StreamingTextResponse` or native `Response` with readable stream)
- [x] **2.4** Update `ChatWindow.tsx` to consume the stream — append tokens as they arrive, show cursor while streaming
- [x] **2.5** Update `/api/runway/chat/route.ts` to stream
- [x] **2.6** Streaming fallback: if Gemini stream errors mid-response, complete with OpenRouter non-stream (acceptable degradation)

---

## Priority 3 — RAG track/week filtering (wrong content retrieved)

- [x] **3.1** Remove `_track` and `_week` underscore prefixes in `lib/rag.ts` — make them real parameters
- [x] **3.2** Add WHERE clause to `retrieveContext()`: when no `sourcePrefix` provided, filter `source LIKE 'knowledge-base/syllabus/{track}/%'` to scope to the right track
- [x] **3.3** Update all call sites (`/api/chat`, `/api/runway/chat`) to pass track correctly
- [x] **3.4** Verify with a test query: Developer Week 3 question should not pull Professional track chunks

---

## Priority 4 — Assessment robustness (students getting stuck)

- [x] **4.1** Force-complete trigger: if user has sent 14+ messages and `[ASSESSMENT_COMPLETE]` has not appeared, automatically POST to `/api/assess/complete` — prevents infinite loops
- [x] **4.2** Add "I've answered everything" button to `app/assess/page.tsx` that manually triggers completion — escape hatch for edge cases
- [x] **4.3** Scoring retry: in `/api/assess/complete`, if JSON parse fails, resend with an explicit "return ONLY raw JSON, no other text" instruction and try once more before failing (done in Priority 1)

---

## Priority 5 — Dashboard performance (won't scale past ~100 applicants)

- [x] **5.1** Add pagination to `/dashboard/applicants/page.tsx` — `take: 50, skip: page * 50`, prev/next controls
- [x] **5.2** Add name search input to applicants page — filter by `name ILIKE %query%` server-side
- [x] **5.3** Add pagination to student session history in `/dashboard/students/[id]/page.tsx` — load latest 10 sessions, "load more" button

---

## Priority 6 — Database indexes (slow queries as data grows)

- [ ] **6.1** Add `@@index([studentId])` to `Session` model in `prisma/schema.prisma`
- [ ] **6.2** Add `@@index([studentId])` to `QuizResult` model
- [ ] **6.3** Add `@@index([studentId])` to `WeekProgress` model (already has unique constraint but explicit index helps reads)
- [ ] **6.4** Run `prisma migrate dev --name add-indexes` and deploy

---

## Priority 7 — Runway chat persistence (students lose context navigating between modules)

- [ ] **7.1** Save Runway module chat messages to the `Session` model on each reply (same pattern as `/api/chat`)
- [ ] **7.2** On Runway module page load, fetch the most recent Session for this applicant + module and restore chat history
- [ ] **7.3** Add `applicantId` to the Runway chat API call so sessions can be attributed

---

## Smaller wins

- [ ] **S1** `AcceptRejectButtons.tsx` — add loading state (disable button + spinner) on click; prevent double-submit
- [ ] **S2** Login page — add `type="email"` to email input and basic client-side validation before submitting
- [ ] **S3** `/api/runway/evaluate` — try `main` branch first, then `master` if 404; return helpful error if both fail
- [x] **S4** `QuizCard.tsx` — replace `window.location.reload()` with state reset (`setPhase("loading")`, `setQuestions([])` etc.) for smoother retry
- [ ] **S5** Extract all system prompts to `lib/prompts.ts` — tutor prompt, assessment prompt, scoring prompt, runway prompt. Remove duplication across route files.
- [ ] **S6** Move magic numbers to `lib/constants.ts`: `MAX_ASSESSMENT_MESSAGES = 14`, `RUNWAY_MODULE_COUNT = 4`, `PASS_THRESHOLD = 70`, `WEEKS_PER_TRACK = 12`
- [ ] **S7** Dashboard filter: add track toggle (All / Developer / Professional) to `/dashboard/page.tsx` student grid
- [ ] **S8** `/api/applicants` GET — add session auth check (currently relies on page-level auth only; API is unprotected)

---

## Phase 2 prep (not building now — but keep in mind during implementation)

- The WhatsApp gateway (brief Phase 2) routes to `/api/chat` internally. Keep the chat API stateless and phone-number-addressable.
- Streaming (Priority 2) won't apply to WhatsApp — that path will use the non-streaming `chat()` call. Don't break the non-stream path.
- Keep `studentId` optional throughout — WhatsApp users may be looked up by phone, not by session.

---

*Created: June 2026 — implement in order, mark completed with [x]*
