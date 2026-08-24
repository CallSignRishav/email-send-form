# AGENTS.md

## Stack
- Next.js 15.3 App Router (RSC) + React 19.1 + TypeScript 5 + Tailwind CSS 4.1 + shadcn `base-nova` (neutral, CSS variables, `src/app/globals.css`).
- `bun` (`bun.lock` present); `npm`/`pnpm` work but prefer `bun`. No monorepo, no `opencode.json`, no CI workflows, no tests.

## Commands
- `bun run dev` — `next dev --turbopack` on :3000. `bun run build` / `bun run start` / `bun run lint` (`next lint`). `bun run prod` — `rm -rf .next && next lint && next build && next start`.
- No test/formatter scripts. Typecheck: `bunx tsc --noEmit`. On Windows use `bun run prod` (pwsh handles `rm -rf`) or `Remove-Item -Recurse -Force .next`.

## Env
- Required: `EMAIL_FROM`, `EMAIL_PASS`, `EMAIL_TO` — validated at import `src/lib/env.ts:24` (`serverEnvSchema.parse`). Missing/invalid crashes startup, not just send.
- `EMAIL_FROM` = Gmail owning App Password. `EMAIL_PASS` = 16-char Gmail App Password (2-Step Verification, https://myaccount.google.com/apppasswords); spaces stripped by zod transform. `EMAIL_TO` = admin inbox. See `.env.example:1`. `.env` gitignored; loaded by Next.js (no `dotenv`).

## Architecture
- `src/app/layout.tsx:15` — root layout, `Geist` font, `ThemeProvider` (`next-themes`, `defaultTheme: dark`, `enableSystem: false`), `Header` + `main.pt-14`.
- `src/app/page.tsx:10` — single page, centered `Display` in viewport grid.
- `src/components/Display.tsx:1` — `"use client"`, `react-hook-form` + `zodResolver(formSchema)` `mode: "onSubmit"`, `Controller` + `Field`/`FieldLabel`/`FieldError`/`FieldGroup` from `src/components/ui/field.tsx:1` (not `Form*`). `message` uses `InputGroup`/`InputGroupTextarea` + char counter `/2000` from `src/components/ui/input-group.tsx:1`. Buttons in `CardFooter` with `<Field orientation="horizontal">` Reset + Submit (`form="form-rhf-display"`). Toasts via `react-toastify`; `form.reset()` on success.
- `src/hooks/email.ts:1` — server action (`"use server"`), not route handler. `nodemailer` `service: "gmail"` (`src/hooks/email.ts:12`), sends admin notification + sender receipt sequentially. Templates `src/lib/email-templates.ts:10` (`adminTemplate`/`receiptTemplate`, `escapeHtml`, inline-CSS `baseLayout` 600px).
- `src/lib/schemas.ts:3` — `formSchema` (5 fields: `fullName` 2-80, `email`, `mobile` digits 8-12, `subject` 3-120, `message` 3-2000). `src/lib/types.ts:4` — `FormDataType` inferred. `src/lib/env.ts:27` exports `serverEnv` + `env` alias.
- Path alias `@/*` -> `src/*` (`tsconfig.json:22`, `components.json:15`). shadcn aliases: `@/components`, `@/lib/utils`, `@/components/ui`, `@/lib`, `@/hooks`.

## Conventions
- `components.json:3` — `style: base-nova`, `rsc: true`, `tsx: true`, `iconLibrary: lucide`, `tailwind.css: src/app/globals.css`, empty `registries`.
- UI primitives in `src/components/ui/` are shadcn-generated; edit sparingly. `src/lib/utils.ts:4` — `cn()` = `clsx` + `twMerge`.
- ESLint `eslint.config.mjs:13` — `FlatCompat` extends `next/core-web-vitals` + `next/typescript`, no custom rules. No Prettier config.

## Gotchas
- Env parsed at module load: any import chain touching `src/hooks/email.ts:4` (`import { serverEnv }`) fails without valid env — set env before `next dev`/`build`/`lint` typecheck that imports it.
- Gmail requires App Password, not regular password; `catch` in `src/hooks/email.ts:59` returns `{ success: false, message: "Error sending email" }` silently (check server logs).
- `src/components/ui/form.tsx:1` is legacy (`Form`/`FormField`/`FormItem`...) — unused after Field migration; keep for now, do not reintroduce. Current form uses `field.tsx` + `input-group.tsx` + `Controller` with `data-invalid`/`aria-invalid` and `FieldError errors={[fieldState.error]}`.
- `next-env.d.ts` gitignored but included by `tsconfig.json:24` and `.next/types`.
