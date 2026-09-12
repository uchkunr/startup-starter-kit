# AGENTS.md — Guidelines for AI Coding Agents

This repository is **Startup Starter Kit**, a Turborepo monorepo with `apps/web` (Next.js 16) and `apps/api` (Express.js 5).

When working in this codebase, adhere strictly to the following instructions, conventions, and architectural principles.

---

## 🛠 Tech Stack & Versions

- **Monorepo**: Turborepo v2 (`turbo`), `pnpm` workspaces (v12)
- **Frontend (`apps/web`)**:
  - Next.js 16 (App Router with Turbopack)
  - React 19
  - Tailwind CSS v4 (`@tailwindcss/postcss`, OKLCH CSS variables in `globals.css`)
  - shadcn/ui with `@base-ui/react` primitives
  - `next-intl` for i18n routing (`uz`, `en`, `ru`)
  - Proxy convention: `src/proxy.ts` (Next.js 16 convention replacing `middleware.ts`)
- **Backend (`apps/api`)**:
  - Express.js 5 (modern routing & error handling)
  - TypeScript with NodeNext module resolution
  - Prisma ORM 7 (`@prisma/adapter-libsql` with `@libsql/client`, `prisma.config.ts`)
  - Argon2id password hashing (`argon2`)
  - Jose JWT signing & verification (`jose`)
  - Zod validation (`zod`)
  - CORS middleware (`cors`)

---

## 🏗 Architecture Patterns

### 1. Backend (`apps/api`)

- Follow the **Modular Layered Architecture**:
  - `src/modules/<feature>/`: Keep feature modules self-contained.
    - `<feature>.schema.ts`: Zod validation schemas and TypeScript types.
    - `<feature>.service.ts`: Business logic and database interactions via Prisma.
    - `<feature>.controller.ts`: HTTP request/response handling.
    - `<feature>.routes.ts`: Express Router endpoints using `validate()` and `requireAuth` middlewares.
  - `src/middlewares/`: Global middlewares (`error.middleware.ts`, `auth.middleware.ts`, `validate.middleware.ts`, `not-found.middleware.ts`).
  - `src/lib/`: Shared utilities (`prisma.ts`, `hash.ts`, `jwt.ts`).
  - `src/config/`: Environment configuration validated with Zod (`env.ts`). Never read `process.env` directly outside this file.
- Express 5 specific note: Route parameters `req.params.id` can be `string | string[]`. Handle with array check before passing to services.

### 2. Frontend (`apps/web`)

- **i18n**: All user-facing strings must use `next-intl` messages located in `messages/{locale}.json`.
- **Pages**: Placed inside `src/app/[locale]/`. Use `setRequestLocale(locale)` in Server Components and Layouts.
- **Components**:
  - Generic UI components go into `src/components/ui/` (managed via shadcn CLI).
  - Feature components go into `src/components/`.
- **Styling**: Always use Tailwind CSS utility classes adhering to OKLCH theme variables (`bg-primary`, `bg-card`, `border-border`, etc.). Avoid hardcoded arbitrary color values.

---

## ⚡ Essential Commands

Always run commands using `pnpm` from the root:

```bash
# Start all apps in development mode
pnpm dev

# Build all applications
pnpm build

# Typecheck all packages
pnpm check-types

# Lint all packages
pnpm lint

# Database operations (inside apps/api or via filter)
pnpm --filter api exec prisma generate
pnpm --filter api exec prisma db push
```

---

## ⚠️ Critical Rules for Agents

1. **Never downgrade packages**: Always keep dependencies at modern `@latest` versions.
2. **Strict TypeScript**: Do not use `any`. Use proper types or `unknown` with type guards.
3. **Workspace Discipline**: Do not create redundant `pnpm-workspace.yaml` files inside sub-apps.
4. **Environment Variables**: Always update `.env.example` when introducing new environment variables.
5. **Always Verify**: After making changes, always run `pnpm check-types`, `pnpm lint`, and `pnpm build` to guarantee zero regressions.
