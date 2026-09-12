# 🚀 Startup Starter Kit

A production-ready **Turborepo** monorepo template built with **Next.js 16 (web)**, **Express.js 5 (api)**, **shadcn/ui**, **Tailwind CSS v4**, **Multi-Provider Auth**, and an **Admin Panel**.

Designed for modern SaaS, startups, and full-stack enterprise applications.

---

## 🏗️ Architecture & Features

### 💻 Frontend (`apps/web`)

- **Next.js 16** with App Router & Turbopack
- **shadcn/ui** design system with `@base-ui/react` primitives (Cards, Tables, Dialogs, Badges, Avatars, Inputs, Buttons)
- **Tailwind CSS v4** with OKLCH theme variables and dynamic **Dark / Light mode** (`next-themes`)
- **next-intl** Internationalization in 3 languages: English (`en`), Russian (`ru`), Uzbek (`uz`)
- **Multi-Provider Auth UI**:
  - Email & Username + Password (min 6 characters)
  - Social OAuth buttons: **Google**, **GitHub**, **Apple**, **LinkedIn**
  - **Telegram** authentication widget integration
- **Admin Panel**:
  - Full CRUD on user accounts (`/admin/users`) with search, role filters, and status toggling (`ACTIVE` / `SUSPENDED`)
  - Active device sessions manager (`/admin/sessions`) with single-session and all-user session revocation
- **Lucide Icons** integration

### ⚙️ Backend (`apps/api`)

- **Express.js 5** with clean modular architecture (`modules/auth`, `modules/admin`, `modules/user`, `modules/health`)
- **Prisma 7** ORM with SQLite (via `@prisma/adapter-libsql` and `@libsql/client`, easily switchable to PostgreSQL)
- **Multi-Provider Authentication**:
  - Argon2id password hashing (`argon2`)
  - Jose JWT session management (`jose`, `HS256`)
  - Telegram HMAC-SHA256 signature verification helper
  - Multi-provider accounts linking model (`Account`)
  - User sessions model (`Session`)
- **Role-Based Access Control**:
  - `requireAuth` and `requireAdmin` middlewares
- **Zod** request validation for body, query, and params
- **CORS** middleware with environment-based origin configuration
- **Dedicated ESLint 9** flat configuration for zero-lint-error backend code

### 📦 Tooling & Infrastructure

- **Turborepo 2** build orchestration
- **pnpm workspaces** fast package management
- **TypeScript 5** with strict typechecking and shared configs (`packages/typescript-config`)
- **Prettier 3** configured with `prettier-plugin-tailwindcss` and root format scripts
- **Dependabot & GitHub Actions CI** workflow configured

---

## 📂 Monorepo Structure

```text
startup-starter-kit/
├── apps/
│   ├── web/                        # Frontend Application (Next.js 16)
│   │   ├── messages/               # i18n Translations (en.json, ru.json, uz.json)
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── [locale]/       # Localized App Router pages
│   │   │   │   │   ├── admin/      # Admin Panel (users & sessions)
│   │   │   │   │   ├── login/      # Sign In (email/username, social, telegram)
│   │   │   │   │   ├── register/   # Sign Up
│   │   │   │   │   ├── layout.tsx  # Root localized layout with providers
│   │   │   │   │   └── page.tsx    # Landing page
│   │   │   │   └── globals.css     # Tailwind CSS v4 variables & OKLCH theme
│   │   │   ├── components/
│   │   │   │   ├── ui/             # shadcn UI components
│   │   │   │   ├── navbar.tsx      # Responsive header with auth & theme toggle
│   │   │   │   ├── theme-toggle.tsx# Light/Dark mode switcher
│   │   │   │   ├── social-auth-buttons.tsx # OAuth & Telegram buttons
│   │   │   │   ├── locale-switcher.tsx     # Language selector
│   │   │   │   └── api-health-check.tsx
│   │   │   ├── lib/
│   │   │   │   ├── api.ts          # Typed API client for auth & admin
│   │   │   │   └── auth-context.tsx# React auth state & hooks
│   │   │   ├── i18n/               # next-intl configuration & routing
│   │   │   └── proxy.ts            # Next.js 16 i18n proxy
│   │   └── package.json
│   │
│   └── api/                        # Backend Application (Express.js 5)
│       ├── prisma/
│       │   └── schema.prisma       # Database schema (User, Account, Session)
│       ├── prisma.config.ts        # Prisma 7 configuration file
│       ├── src/
│       │   ├── config/env.ts       # Validated environment variables
│       │   ├── lib/                # Prisma client, Argon2 hash, Jose JWT, Telegram
│       │   ├── middlewares/        # Auth, Admin, Validate, Error, NotFound
│       │   ├── modules/
│       │   │   ├── admin/          # Admin CRUD (Users, Sessions)
│       │   │   ├── auth/           # Multi-Provider Auth (OAuth, TG, Email, Sessions)
│       │   │   ├── user/           # User profile
│       │   │   └── health/         # Health check
│       │   ├── routes.ts           # Central API routes aggregator
│       │   ├── app.ts              # Express application instance
│       │   └── index.ts            # Server entrypoint
│       ├── .env.example
│       └── package.json
│
├── packages/
│   └── typescript-config/          # Shared tsconfig packages
│
├── .prettierrc                     # Root Prettier config
├── AGENTS.md                       # AI Agent guidelines & workflow
├── CLAUDE.md                       # Assistant context pointer
├── package.json                    # Root package scripts
├── pnpm-workspace.yaml             # pnpm workspace definition
└── turbo.json                      # Turborepo task pipeline
```

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Prepare Database

```bash
pnpm --filter api exec prisma generate
pnpm --filter api exec prisma db push
```

### 3. Run in Development Mode

Starts both the Next.js web application and the Express.js API concurrently:

```bash
pnpm dev
```

- **Web**: [http://localhost:3000](http://localhost:3000)
- **API**: [http://localhost:4000](http://localhost:4000)

### 4. Build All Projects

```bash
pnpm build
```

### 5. Code Quality (Lint, Types, Format)

```bash
# Typecheck
pnpm check-types

# Lint
pnpm lint

# Format code with Prettier
pnpm format
pnpm format:check
```

---

## 📡 API Reference

### Authentication (`/api/auth`)

| Method   | Endpoint                 | Description                                         | Auth Required |
| -------- | ------------------------ | --------------------------------------------------- | ------------- |
| `POST`   | `/api/auth/register`     | Register a new user (password min 6 chars)          | No            |
| `POST`   | `/api/auth/login`        | Login with email or username                        | No            |
| `POST`   | `/api/auth/oauth`        | Social login (Google, GitHub, Apple, LinkedIn)      | No            |
| `POST`   | `/api/auth/telegram`     | Telegram widget authentication with signature check | No            |
| `GET`    | `/api/auth/me`           | Fetch authenticated profile & connected accounts    | Bearer Token  |
| `POST`   | `/api/auth/logout`       | Invalidate current session                          | Bearer Token  |
| `GET`    | `/api/auth/sessions`     | List user's active device sessions                  | Bearer Token  |
| `DELETE` | `/api/auth/sessions/:id` | Revoke specific session                             | Bearer Token  |

### Admin Panel (`/api/admin`)

| Method   | Endpoint                            | Description                                      | Access |
| -------- | ----------------------------------- | ------------------------------------------------ | ------ |
| `GET`    | `/api/admin/users`                  | List users with search, role, and status filters | ADMIN  |
| `POST`   | `/api/admin/users`                  | Create a user with specified role and status     | ADMIN  |
| `GET`    | `/api/admin/users/:id`              | Get single user details with sessions & accounts | ADMIN  |
| `PATCH`  | `/api/admin/users/:id`              | Update user profile, credentials, role, status   | ADMIN  |
| `DELETE` | `/api/admin/users/:id`              | Delete user account                              | ADMIN  |
| `GET`    | `/api/admin/sessions`               | List all active sessions across all users        | ADMIN  |
| `DELETE` | `/api/admin/sessions/:id`           | Revoke any user session                          | ADMIN  |
| `DELETE` | `/api/admin/users/:userId/sessions` | Revoke all active sessions for a specific user   | ADMIN  |

### Health Check (`/api/health`)

| Method | Endpoint      | Description           | Auth Required |
| ------ | ------------- | --------------------- | ------------- |
| `GET`  | `/api/health` | Service health status | No            |

---

## 📄 License

MIT
