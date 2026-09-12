# 🚀 Startup Starter Kit

A production-ready **Turborepo** monorepo template built with **Next.js 16 (web)**, **Express.js 5 (api)**, and shared packages.

Designed for modern SaaS, startup, and full-stack enterprise applications.

---

## 🏗️ Architecture & Features

### 💻 Frontend (`apps/web`)
- **Next.js 16** with App Router & Turbopack
- **shadcn/ui** design system with `@base-ui/react` primitives
- **Tailwind CSS v4** with OKLCH theme variables and dark mode support
- **next-intl** Internationalization (`uz`, `en`, `ru`) with localized routing
- **Lucide Icons** integration

### ⚙️ Backend (`apps/api`)
- **Express.js 5** with clean modular architecture (`modules/auth`, `modules/user`, `modules/health`)
- **Prisma 7** ORM with SQLite (via `@prisma/adapter-libsql` and `@libsql/client`, easily switchable to PostgreSQL)
- **Argon2id** password hashing (`argon2`)
- **Jose** JWT authentication (signing & verification with `HS256`)
- **Zod** request validation for body, query, and params
- **CORS** middleware with environment-based origin configuration

### 📦 Tooling & Infrastructure
- **Turborepo 2** build orchestration
- **pnpm workspaces** fast package management
- **TypeScript 5** with strict typechecking and shared configs (`packages/typescript-config`)
- **ESLint 9** configuration

---

## 📂 Monorepo Structure

```text
startup-starter-kit/
├── apps/
│   ├── web/                        # Frontend Application
│   │   ├── messages/               # i18n Translations (uz.json, en.json, ru.json)
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── [locale]/       # Localized App Router pages (layout.tsx, page.tsx)
│   │   │   │   └── globals.css     # Tailwind CSS v4 variables & base theme
│   │   │   ├── components/
│   │   │   │   ├── ui/             # shadcn UI components (Button, Card, Input)
│   │   │   │   ├── api-health-check.tsx
│   │   │   │   └── locale-switcher.tsx
│   │   │   ├── i18n/               # next-intl configuration & routing
│   │   │   │   ├── routing.ts
│   │   │   │   └── request.ts
│   │   │   └── proxy.ts            # Next.js 16 i18n proxy middleware
│   │   ├── components.json         # shadcn configuration
│   │   └── package.json
│   │
│   └── api/                        # Backend Application
│       ├── prisma/
│       │   └── schema.prisma       # Database schema (User, Session)
│       ├── prisma.config.ts        # Prisma 7 configuration file
│       ├── src/
│       │   ├── config/env.ts       # Type-safe environment variables
│       │   ├── lib/                # Prisma client, Argon2 hash, Jose JWT
│       │   ├── middlewares/        # Auth, Validate, Error, NotFound
│       │   ├── modules/            # Modular feature structure
│       │   │   ├── auth/           # Authentication (Register, Login, Me)
│       │   │   ├── user/           # User management
│       │   │   └── health/         # Health check
│       │   ├── routes.ts           # Central API routes aggregator
│       │   ├── app.ts              # Express application instance
│       │   └── index.ts            # Entrypoint & graceful shutdown
│       ├── .env.example
│       └── package.json
│
├── packages/
│   └── typescript-config/          # Shared tsconfig packages
│       ├── base.json
│       ├── nextjs.json
│       └── node.json
│
├── AGENTS.md                       # AI Agent guidelines & workflow
├── CLAUDE.md                       # Assistant context pointer
├── package.json                    # Root package scripts
├── pnpm-workspace.yaml             # pnpm workspace definition
├── turbo.json                      # Turborepo task pipeline
└── .gitignore
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Run in Development Mode
Starts both the Next.js web application and the Express.js API concurrently:
```bash
pnpm dev
```
- **Web**: [http://localhost:3000](http://localhost:3000)
- **API**: [http://localhost:4000](http://localhost:4000)

### 3. Build All Projects
```bash
pnpm build
```

### 4. Typecheck & Lint
```bash
pnpm check-types
pnpm lint
```

---

## 📡 API Reference

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/health` | Service health status | No |
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Login and receive a JWT token | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Bearer Token |
| `GET` | `/api/users` | List all users | Bearer Token |
| `GET` | `/api/users/:id` | Get user by ID | Bearer Token |

---

## 📄 License
MIT
