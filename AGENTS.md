# AGENTS.md

## Stack
- Next.js 15.3 (App Router, RSC) + React 19.1 + TypeScript 5 + Tailwind CSS 4.1 + shadcn `base-nova` (neutral, CSS variables).
- Package manager: `bun` (`bun.lock` present). `npm`/`pnpm` work but prefer `bun`.
- No monorepo, no `opencode.json`, no `.github/workflows`, no tests.

## Commands
- `bun run dev` — `next dev --turbopack` (port 3000). `bun run build` / `bun run start` / `bun run lint` (`next lint`). `bun run prod` — `rm -rf .next && next lint && next build && next start` (full verify before prod).
- No test, typecheck, or formatter script. Typecheck via `npx tsc --noEmit`. No Prettier config.

## Env
- Required: `EMAIL_FROM`, `EMAIL_PASS`, `EMAIL_TO` — validated at import in `src/lib/env.ts:24` via `zod` (`serverEnvSchema.parse`). Missing/invalid env crashes server startup, not just send.
- `EMAIL_FROM` must be Gmail owning the App Password. `EMAIL_PASS` is 16-char Gmail App Password (2-Step Verification required); spaces stripped by zod transform. `EMAIL_TO` is admin inbox. See `.env.example:1` and https://myaccount.google.com/apppasswords.
- Loaded via Next.js `.env` (`.env` gitignored). No `dotenv` call needed.

## Architecture
- `src/app/layout.tsx:15` — root layout, `next/font/google` Geist, `ThemeProvider` (`next-themes`, `defaultTheme: dark`, `enableSystem: false`), `Header` + `main.pt-14`.
- `src/app/page.tsx:10` — single page rendering `Display` centered in viewport grid.
- `src/components/Display.tsx:1` — client component, `react-hook-form` + `zodResolver(formSchema)` (`mode: "all"`), `react-toastify` toasts. Calls server action `sendEmail`.
- `src/hooks/email.ts:1` — server action (`"use server"`), not a route handler. `nodemailer` `service: "gmail"` (`src/hooks/email.ts:12`), sends two mails sequentially: admin notification + sender receipt. Uses templates from `src/lib/email-templates.ts:76`.
- `src/lib/schemas.ts:3` — `formSchema` (`email` + `message` min 3). `src/lib/types.ts:4` — `FormDataType` inferred from it. `src/lib/email-templates.ts:10` — `adminTemplate`/`receiptTemplate` with `escapeHtml` and inline-CSS `baseLayout` (600px, Gmail-safe).
- `src/lib/env.ts:27` — exports both `serverEnv` and `env` alias.
- Path alias `@/*` -> `src/*` (`tsconfig.json:22`, `components.json:15`). shadcn aliases: `@/components`, `@/lib/utils`, `@/components/ui`, `@/lib`, `@/hooks`.

## Conventions
- `components.json:3` — style `base-nova`, `rsc: true`, `tsx: true`, `iconLibrary: lucide`, Tailwind CSS `src/app/globals.css`.
- UI primitives in `src/components/ui/` are shadcn-generated; edit sparingly. `src/lib/utils.ts:4` — `cn()` = `clsx` + `twMerge`.
- ESLint: `eslint.config.mjs:13` — `next/core-web-vitals` + `next/typescript` via `FlatCompat`. No custom rules.

## Gotchas
- `src/lib/env.ts:24` parses at module load — `import { serverEnv }` in `src/hooks/email.ts:4` means any import chain touching email fails without valid env. Provide env before `next dev`/`build`.
- Gmail `service: "gmail"` requires App Password, not regular password; fails silently via `catch` returning `{ success: false, message: "Error sending email" }` (`src/hooks/email.ts:47`).
- `prod` script does `rm -rf .next` — Windows: use `bun run prod` via pwsh (works) or `Remove-Item -Recurse -Force .next`.
- `next-env.d.ts` is gitignored but `tsconfig.json:24` includes it and `.next/types`.
