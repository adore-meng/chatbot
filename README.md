<a href="https://chatbot.ai-sdk.dev/demo">
  <img alt="BioAnalyst workbench" src="app/(dashboard)/opengraph-image.png">
  <h1 align="center">BioAnalyst Workbench</h1>
</a>

<p align="center">
  <strong>EN</strong> · AI-native scientific analysis workbench built with <strong>Next.js</strong>, <strong>React</strong>, and the <strong>Vercel AI SDK</strong>.<br/>
  <strong>中文</strong> · 基于 <strong>Next.js</strong>、<strong>React</strong> 与 <strong>Vercel AI SDK</strong> 的 AI 原生科学数据分析工作台。
</p>

<p align="center">
  <a href="#architecture"><strong>Architecture / 架构</strong></a> ·
  <a href="#project-structure"><strong>Structure / 结构</strong></a> ·
  <a href="#authentication"><strong>Auth / 认证</strong></a> ·
  <a href="#data-model"><strong>Data / 数据</strong></a> ·
  <a href="#running-locally"><strong>Local dev / 本地</strong></a>
</p>

<br/>

<a id="architecture"></a>

## Architecture · 架构

**EN.** BioAnalyst Workbench is a **pure frontend plus lightweight BFF** stack. Next.js renders the UI and dashboard routes; route handlers expose chat, uploads, streaming, etc. **No direct SQL database** lives in this app (no Postgres, Drizzle, migrations, `db:*` scripts, or `POSTGRES_URL`). Replace `lib/mock-store/queries.ts` with HTTP calls to your backends when you need real persistence — keep databases outside this Next boundary.

**中文.** BioAnalyst Workbench 采用 **纯前端 + 轻量 BFF**：Next.js 负责界面与仪表盘路由；`app/(dashboard)/api/**` 提供聊天、上传、流式等接口。本应用 **不包含直连 SQL 数据库**（无 Postgres、Drizzle、迁移、`db:*`、无 `POSTGRES_URL`）。需要真实持久化时，请将 `lib/mock-store/queries.ts` 替换为对自身后端的 HTTP 调用，并把数据库访问放在 Next 应用边界之外。

**Boundaries · 分层**

| EN | ZH |
|----|-----|
| **Frontend** — sidebar, header, chat, artifacts, placeholders | **前端** — 侧栏、顶栏、聊天、Artifacts、占位页 |
| **BFF** — `app/(dashboard)/api/**` (served as `/api/*`) | **BFF** — `app/(dashboard)/api/**（对外仍为 `/api/*`）|
| **SSO** — `middleware.ts`, `app/api/auth/**`, `lib/auth/auth.ts` | **SSO** — 中间件、回调 / 登出、`lib/auth/auth.ts` |
| **Mock store** — in-memory only in `lib/mock-store/queries.ts` | **Mock 仓库** — 仅内存，`lib/mock-store/queries.ts` |

<a id="project-structure"></a>

## Project Structure · 项目结构

**EN.** Route groups such as `(dashboard)` are for organization only. Example: `app/(dashboard)/api/history/route.ts` → **`/api/history`**.

**中文.** 路由分组如 `(dashboard)` 仅为代码组织：例如 `app/(dashboard)/api/history/route.ts` 映射为 **`/api/history`**。

```text
app/
  (dashboard)/
    layout.tsx                 Chrome: sidebar · header · main / 仪表盘壳层
    page.tsx                   / — new-task chat workspace / 新任务工作台
    chat/[id]/page.tsx         Legacy /chat/:id / 兼容旧会话路径
    recent|community|projects  Placeholders / 占位页
    actions.ts                 Server actions / 服务端动作
    api/**                     BFF → /api/* / BFF，对外前缀 /api/

  api/auth/
    callback/route.ts          SSO callback · 回调
    logout/route.ts           Log out · 登出

components/chat/              Workbench & chat UI / 工作台与聊天 UI
hooks/
lib/
  ai/
  artifacts/
  auth/auth.ts
  domain-types.ts             Plain types / 领域类型（无 ORM）
  mock-store/queries.ts       In-memory data / 内存 Mock
  password-utils.ts           Hash helpers · 占位密码哈希
```

## Dashboard UX · 仪表盘交互

**EN.**

- **`/`** — Default new-task workspace.
- **`/chat/:id`** — Shares the home shell for existing sessions.
- **`/recent`**, **`/community`**, **`/projects`** — Placeholders for product content.

**中文.**

- **`/`** — 默认新开任务工作台。
- **`/chat/:id`** — 与首页共用外壳，兼容已有会话 URL。
- **`/recent`、`/community`、`/projects`** — 可扩展占位页。

**EN.** Sidebar: `components/chat/bioanalyst-sidebar.tsx` (collapse, routing, branding). Header title: `components/chat/workbench-header.tsx` (fallback **Workspace**).

**中文.** 侧边栏：`components/chat/bioanalyst-sidebar.tsx`（折叠、高亮、品牌）。标题栏：`components/chat/workbench-header.tsx`（未知路径默认为 **Workspace**）。

**EN.** Sidebar cookie reads are wrapped in `<Suspense>` in the dashboard layout for Next.js dynamic rendering rules.

**中文.** 布局中在 `<Suspense>` 内读取侧栏 Cookie，以满足 Next.js 动态渲染与安全规则。

<a id="authentication"></a>

## Authentication · 身份认证

**EN.** Company SSO (not Auth.js templates): middleware redirects browsers without auth to **`COMPANY_SSO_LOGIN_URL`** with **`redirect_uri` → `/api/auth/callback`**. Callback validates the token and sets **`company_auth_token`** (http-only). **`lib/auth/auth.ts`** reads it on the server for APIs and actions. **`GET /api/auth/logout`** clears the cookie.

**中文.** 企业 SSO（非 Auth.js 模板）：中间件将未登录请求重定向到 **`COMPANY_SSO_LOGIN_URL`**，并附带 **`redirect_uri` 指向 `/api/auth/callback`**。回调校验 token 并写入 **`company_auth_token`**（http-only）。服务端通过 **`lib/auth/auth.ts`** 读取，供 API 与 Server Actions 使用；**`/api/auth/logout`** 清除 Cookie。

Configure · 配置 **`COMPANY_SSO_LOGIN_URL`** in **`.env.local`**.

<a id="api-routes"></a>

## API Routes · API 路由

**EN.** Implementations live under **`app/(dashboard)/api/**`**; public paths are **`/api/*`** (not `/dashboard/api/...`). Examples:

**中文.** 实现在 **`app/(dashboard)/api/**`**；对外 URL 仍为 **`/api/*`**。

- `/api/chat`, `/api/chat/[id]/stream`
- `/api/messages`, `/api/history`, `/api/document`, `/api/vote`, `/api/suggestions`
- `/api/models`, `/api/files/upload`

**EN.** Keep handlers thin — AI, auth helpers, Blob, Redis, or future backends are fine; avoid opening SQL from this codebase.

**中文.** 保持 Handler 精简：可调 AI、鉴权辅助、Blob、Redis 或未来后端；请勿在本仓库内直连数据库。

<a id="data-model"></a>

## Data Model · 数据模型

**EN.** There is **no application database** in-repo. **`lib/mock-store/queries.ts`** holds in-memory chats, messages, votes, documents, suggestions, streams, and mock users. Domain shapes are in **`lib/domain-types.ts`**: `User`, `Chat`, `DBMessage`, `Vote`, `Document`, `Suggestion`, `Stream` — type-safe UI/API contracts without ORM types.

**中文.** **无应用数据库。** 工作台数据暂时存在 **`lib/mock-store/queries.ts`**（内存异步 API，对齐旧持久化语义）。共用类型在 **`lib/domain-types.ts`**：`User`、`Chat`、`DBMessage`、`Vote`、`Document`、`Suggestion`、`Stream`，避免依赖 ORM 类型。

Restarting dev server resets mock data · 重启进程后 Mock 数据会清空。

<a id="model-providers"></a>

## Model Providers · 模型提供商

**EN.** Uses [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) via the AI SDK. Models · **`lib/ai/models.ts`**, providers · **`lib/ai/providers.ts`**. On Vercel, OIDC is usually automatic; elsewhere set **`AI_GATEWAY_API_KEY`** in `.env.local`.

**中文.** 通过 AI SDK 使用 [Vercel AI Gateway](https://vercel.com/docs/ai-gateway)。模型见 **`lib/ai/models.ts`**，供应商见 **`lib/ai/providers.ts`**。在非 Vercel 环境需在 `.env.local` 配置 **`AI_GATEWAY_API_KEY`**。

## Storage Integrations · 存储集成

**EN.**

- **Vercel Blob** — multimodal uploads. **`BLOB_READ_WRITE_TOKEN`**
- **Redis** — optional rate limiting / resumable streams. **`REDIS_URL`**

**中文.**

- **Vercel Blob** — 多模态上传。**`BLOB_READ_WRITE_TOKEN`**
- **Redis** — 限流或可恢复流（可选）。**`REDIS_URL`**

Neither replaces SQL persistence · 二者都不是已移除的关系型持久层的替代品。

<a id="running-locally"></a>

## Running Locally · 本地运行

```bash
cp .env.example .env.local   # Fill values · 按需填写变量
pnpm install
pnpm dev
```

Open **[http://localhost:3000](http://localhost:3000)**.

**EN.** No Postgres or Drizzle required; mock data is memory-only until you swap the store layer.

**中文.** 无需 Postgres / Drizzle；在替换仓库层之前，数据仅在内存中。

<a id="scripts"></a>

## Scripts · 脚本

```bash
pnpm dev      # Dev server (Turbopack) · 开发（Turbopack）
pnpm build    # next build · 生产构建
pnpm start    # Production server · 生产启动
pnpm check    # Ultracite lint · Ultracite 检查
pnpm fix      # Ultracite fix · Ultracite 修复
pnpm test     # Playwright e2e · 端到端测试
```

There are intentionally no **`db:*`** scripts · 仓库内 **不提供** **`db:*`** 脚本。

<a id="deployment"></a>

## Deployment · 部署

**EN.** Typical Next.js deploy. Set **`COMPANY_SSO_LOGIN_URL`**, and as needed **`AI_GATEWAY_API_KEY`**, **`BLOB_READ_WRITE_TOKEN`**, **`REDIS_URL`**. Do **not** wire **`POSTGRES_URL`** — this app has no DB client.

**中文.** 按常规 Next 应用部署。配置 **`COMPANY_SSO_LOGIN_URL`**，按需配置 **`AI_GATEWAY_API_KEY`**、**`BLOB_READ_WRITE_TOKEN`**、**`REDIS_URL`**。无需也不应配置 **`POSTGRES_URL`**，本仓库不含数据库客户端。

<a id="development-notes"></a>

## Development Notes · 开发备忘

**EN.**

- Prefer hooks/services for heavy logic · keep UI lean.
- When adding persistence, call external APIs — not SQL from here.
- Reuse **`components/`** before new UI primitives.
- Share shapes via **`lib/domain-types.ts`**.

**中文.**

- 复杂逻辑尽量放在 Hook / Service，组件保持单薄。
- 真实持久化通过外部后端 API；勿在本应用内串联数据库。
- 新 UI 优先复用 **`components/`**。
- 领域类型共用 **`lib/domain-types.ts`**。

---

<p align="center">
  <strong>EN</strong> Derived from the <a href="https://vercel.com/templates/next.js/chatbot">Vercel AI Chatbot</a> template.<br/>
  <strong>中文</strong> 衍生自 <a href="https://vercel.com/templates/next.js/chatbot">Vercel AI Chatbot</a> 模板；定制化为企业 SSO、BioAnalyst 式仪表盘与不直连数据库的 BFF。
</p>
