Purpose
-------
This file gives concise, actionable guidance for AI coding agents working in this repository so they can be productive immediately.

High-level architecture (what to know fast)
- App: Next.js (app/ directory) — server components and server actions are used heavily. Look for "use server" at top of server-side functions (example: `ai/analyze.ts`).
- DB: Prisma + PostgreSQL. Schema lives in `prisma/schema.prisma` and models map directly to application concepts: `User`, `File`, `Transaction`, `Field`, `Category`, `Project`.
- AI layer: LLM integration and prompts live in `ai/` (notably `ai/providers/llmProvider.ts`, `ai/prompt.ts`, `ai/analyze.ts`). LLM requests use LangChain adapters and structured output (`withStructuredOutput(schema)`).
- Infra: Dockerfile + `docker-compose.yml` provide the production packaging; `docker-entrypoint.sh` runs `prisma generate` and `prisma migrate deploy` and waits for the DB.

Key developer workflows (explicit commands)
- Local dev (recommended):
  - npm install
  - copy `.env.example` -> `.env` and set DB / API keys
  - npx prisma generate && npx prisma migrate dev
  - npm run dev

- Build / production:
  - npm run build  (note: this runs `prisma migrate deploy && next build`)
  - npm run start

- Docker / Compose:
  - docker compose up   # uses pre-built image from GHCR by default
  - Dockerfile's entrypoint will run Prisma migrations at container start

Important environment variables (used in code / builds)
- DATABASE_URL — used by runtime and docker entrypoint
- POSTGRES_PRISMA_URL and POSTGRES_URL_NON_POOLING — Prisma datasource env keys in `prisma/schema.prisma`
- BETTER_AUTH_SECRET — auth secret required by `better-auth`
- OPENAI_API_KEY, GOOGLE_API_KEY, MISTRAL_API_KEY — optional LLM keys
- PORT default 7331 (see `package.json` scripts and Dockerfile)

Project-specific conventions and patterns
- DB changes: edit `prisma/schema.prisma` then run `npx prisma migrate dev` locally. Production uses `prisma migrate deploy` (called during build/start).
- Unique codes scoped to user: many tables use a compound unique ([userId, code]) — e.g. `Field`, `Category`, `Project`. When adding new code-based lookups, preserve this pattern.
- Transaction items and dynamic data are stored as JSON (e.g. `Transaction.items`, `File.cachedParseResult`) — prefer JSON columns for extensible fields rather than adding many small columns.
- LLM usage pattern: callers build a prompt with `ai/prompt.ts` and call `requestLLM` from `ai/providers/llmProvider.ts`. The provider tries configured providers in order and returns the first successful structured response. Respect that retry order.
- Server vs Client: put authentication/DB mutations and LLM calls on the server (server actions or API routes). UI components under `app/` should remain presentational.

Integration points & native dependencies
- PDF and image processing: Ghostscript and GraphicsMagick are required (installed in Dockerfile and mentioned in README). `sharp` is also used for image operations.
- External services: OpenAI / Google / Mistral (via LangChain), Stripe, Resend (email), Sentry — credentials live in env vars.

Where to look for examples
- LLM flow: `ai/analyze.ts` → `ai/providers/llmProvider.ts` → `ai/prompt.ts` (shows structured output usage and caching of result to `models/files`)
- DB interactions & models: `prisma/schema.prisma` and `models/*.ts` (e.g. `models/files.ts`, `models/transactions.ts`)
- Entry points: `app/layout.tsx`, `app/page.tsx`, `api/` and `docker-entrypoint.sh`

Quick tips for edits and PRs
- If you change DB schema: include a Prisma migration and run `npx prisma migrate dev` locally; ensure new env names are documented if added.
- If you change LLM prompts or schema: update `ai/prompt.ts` and add regression examples (sample inputs) to make it reproducible.
- Use the same port (7331) in docs and Docker unless intentionally changing it.

Limitations found (so the agent doesn't invent behavior)
- No automated test suite discovered in repo — prefer small manual validation steps when changing logic.
- Multiple DB env names (`DATABASE_URL` vs `POSTGRES_PRISMA_URL`) — check both when testing migrations and runtime connectivity.

If anything is unclear or you want deeper rules (code style, testing conventions, CI), tell me which area to expand and I'll iterate.
