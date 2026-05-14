<a href="https://chatbot.ai-sdk.dev/demo">
  <img alt="BioAnalyst workbench" src="app/(dashboard)/opengraph-image.png">
  <h1 align="center">BioAnalyst Workbench</h1>
</a>

<p align="center">
  AI-native scientific analysis workbench built with <strong>Next.js</strong>, <strong>React</strong>, and the <strong>Vercel AI SDK</strong>.
</p>

<p align="center">
  <a href="#architecture"><strong>Architecture</strong></a> ·
  <a href="#project-structure"><strong>Project Structure</strong></a> ·
  <a href="#authentication"><strong>Authentication</strong></a> ·
  <a href="#data-model"><strong>Data Model</strong></a> ·
  <a href="#running-locally"><strong>Running Locally</strong></a>
</p>

<br/>

## Architecture

BioAnalyst Workbench is intentionally structured as a **frontend application with a lightweight BFF layer**.

The Next.js app owns UI rendering, dashboard routing, company SSO session handling, AI streaming routes, and temporary mock data used for local development. It does **not** connect directly to Postgres, Drizzle, or any other SQL database.

When real persistence is needed, replace the mock store with calls to external backend services. Keep database access outside this Next.js application boundary.

Current boundaries:

- **Frontend**: dashboard shell, sidebar navigation, workbench header, chat UI, artifact editors, placeholder pages.
- **BFF routes**: route handlers under `app/(dashboard)/api/**` for chat, history, messages, documents, votes, suggestions, uploads, models, and resumable streams.
- **Auth bridge**: company SSO cookie handling in `middleware.ts`, `app/api/auth/**`, and `lib/auth/auth.ts`.
- **Mock data only**: in-memory records in `lib/mock-store/queries.ts`; data resets when the server process restarts.
- **No direct database stack**: no Drizzle schema, migrations, `db:*` scripts, or `POSTGRES_URL`.

## Project Structure

```text
app/
  (dashboard)/
    layout.tsx                 Dashboard chrome: sidebar, header, main outlet
    page.tsx                   Home route /, new task chat workspace
    chat/[id]/page.tsx          Existing chat route compatibility
    recent/page.tsx             Recent placeholder page
    community/page.tsx          Community placeholder page
    projects/page.tsx           Projects placeholder page
    actions.ts                  Server actions used by the chat surface
    api/**                      BFF route handlers served as /api/*
  api/auth/
    callback/route.ts           SSO callback
    logout/route.ts             Logout endpoint

components/chat/                Workbench shell, chat UI, artifact UI
hooks/                          Client hooks
lib/
  ai/                           AI models, prompts, providers, tools
  artifacts/                    Server-side artifact handlers
  auth/auth.ts                  Server-only SSO session helper
  domain-types.ts               Plain TypeScript domain types
  mock-store/queries.ts          In-memory mock data layer
  password-utils.ts             Password hash helpers for mock users
```

Route groups such as `(dashboard)` are organizational only. A file under `app/(dashboard)/api/history/route.ts` is still served at `/api/history`.

## Dashboard UX

- `/` renders the default chat workspace for a new task.
- `/chat/:id` keeps compatibility with existing session URLs and reuses the home chat shell.
- `/recent`, `/community`, and `/projects` are placeholder pages ready for product-specific content.
- `components/chat/bioanalyst-sidebar.tsx` provides the BioAnalyst sidebar, route-aware active state, collapse behavior, and branding.
- `components/chat/workbench-header.tsx` derives the title from the current route. Unknown paths fall back to **Workspace**.
- The dashboard layout reads the sidebar cookie behind `<Suspense>` to avoid Next.js dynamic rendering issues.

## Authentication

Authentication is handled through company SSO, not Auth.js template routes.

1. `middleware.ts` redirects unauthenticated browser requests to `COMPANY_SSO_LOGIN_URL`.
2. The login redirect includes a `redirect_uri` pointing back to `/api/auth/callback`.
3. `app/api/auth/callback/route.ts` validates the token query, sets the `company_auth_token` httpOnly cookie, and redirects back to the app.
4. `lib/auth/auth.ts` reads the cookie server-side for API routes and server actions.
5. `app/api/auth/logout/route.ts` clears the cookie.

Configure `COMPANY_SSO_LOGIN_URL` in `.env.local`.

## API Routes

Workbench route handlers live under `app/(dashboard)/api/**` and are served as `/api/*`.

Important routes include:

- `/api/chat`
- `/api/chat/[id]/stream`
- `/api/messages`
- `/api/history`
- `/api/document`
- `/api/vote`
- `/api/suggestions`
- `/api/models`
- `/api/files/upload`

These routes should remain lightweight BFF endpoints. They may call AI providers, auth helpers, upload services, Redis, or future backend APIs, but they should not open SQL connections directly.

## Data Model

There is no application database in this repository.

Temporary workbench data is stored in `lib/mock-store/queries.ts`. It provides async functions that mirror the previous persistence contract, including chats, messages, votes, documents, suggestions, streams, and mock users.

Plain TypeScript domain types live in `lib/domain-types.ts`:

- `User`
- `Chat`
- `DBMessage`
- `Vote`
- `Document`
- `Suggestion`
- `Stream`

This keeps the UI and API contracts type-safe without importing ORM-specific types.

## Model Providers

The app uses the [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) through the AI SDK.

- Model metadata is configured in `lib/ai/models.ts`.
- Provider setup lives in `lib/ai/providers.ts`.
- On Vercel, OIDC authentication is typically automatic.
- Outside Vercel, set `AI_GATEWAY_API_KEY` in `.env.local`.

## Storage Integrations

- **Vercel Blob**: optional upload storage for multimodal flows. Configure `BLOB_READ_WRITE_TOKEN`.
- **Redis**: optional support for rate limiting or resumable streams. Configure `REDIS_URL`.

Neither integration is a replacement for the removed SQL persistence layer.

## Running Locally

Copy the example environment file and fill in the values you need:

```bash
cp .env.example .env.local
```

Install dependencies and start the dev server:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

The app will run without Postgres or Drizzle. Mock chat/document data is created in memory and is reset when the dev server restarts.

## Scripts

```bash
pnpm dev      # Start Next.js dev server with Turbopack
pnpm build    # Production build
pnpm start    # Start production server
pnpm check    # Run Ultracite checks
pnpm fix      # Run Ultracite auto-fixes
pnpm test     # Run Playwright e2e tests
```

There are intentionally no `db:*` scripts.

## Deployment

Deploy this as a standard Next.js app. Configure production environment variables for:

- `COMPANY_SSO_LOGIN_URL`
- `AI_GATEWAY_API_KEY` when not using Vercel OIDC
- `BLOB_READ_WRITE_TOKEN` if uploads are enabled
- `REDIS_URL` if Redis-backed features are enabled

Do not configure `POSTGRES_URL`; this app does not connect to an application database.

## Development Notes

- Keep business logic outside React components where practical. Use hooks and services for non-trivial logic.
- Keep BFF handlers thin. If persistence becomes real, call external backend APIs instead of adding database clients here.
- Reuse components under `components/` before introducing new UI.
- Use `lib/domain-types.ts` for shared domain shapes instead of ORM-generated types.

---

<p align="center">
  Derived from the <a href="https://vercel.com/templates/next.js/chatbot">Vercel AI Chatbot</a> template; customized for a BioAnalyst-style dashboard, company SSO, and a no-direct-database BFF architecture.
</p>
