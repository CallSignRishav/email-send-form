# Email Send Form

A minimal, ready-to-use contact form built with Next.js 15 that sends two emails on every submission: an admin notification and an auto-receipt to the sender. Built for anyone who needs a reliable form without a backend service. Just add your Gmail App Password and you are ready to go.

## How It Works

1. Visitor fills in Full Name, Email, Mobile, Subject, and Message.
2. The form validates input in the browser using Zod (`src/lib/schemas.ts:3`).
3. On submit, a Next.js Server Action `sendEmail` (`src/hooks/email.ts:20`) runs on the server.
4. Nodemailer connects to Gmail (`service: "gmail"`) and sends two emails one after another:
   - To you (`EMAIL_TO`) with all form details. Reply-To is set to the visitor's email so you can reply directly.
   - To the visitor as a receipt with a copy of their message.
5. The UI shows a success or error toast and clears the form on success.

You host it with your own Gmail account. No third-party email service needed.

## Prerequisites

- Node.js 18+ installed
- Bun installed (recommended, `bun.lock` is included) or npm / pnpm will also work
- A Google account with 2-Step Verification enabled (this guide assumes you already have a Google account)

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/CallSignRishav/email-send-form.git
cd email-send-form

# 2. Install dependencies
bun install
# or: npm install

# 3. Set up environment variables (see next section)

# 4. Start the dev server
bun run dev
# or: npm run dev
```

Open http://localhost:3000 to see the form.

Other useful commands:

```bash
bun run build   # production build
bun run start   # start production server
bun run lint    # run ESLint
bun run prod    # lint + build + start (on Windows this uses pwsh)
```

## Google App Password Setup (Step-by-Step)

This project uses a Gmail App Password, not your regular Gmail password. You need 2-Step Verification turned on. Assuming you already have a Google account, follow these steps:

**Step 1: Turn on 2-Step Verification**

1. Go to https://myaccount.google.com/security
2. Under "How you sign in to Google", click **2-Step Verification** and follow the prompts to turn it on if it is not already.

**Step 2: Create an App Password**

1. Go to https://myaccount.google.com/apppasswords (this page only works when 2-Step Verification is on).
2. At the bottom, find the **App passwords** section. You may need to sign in again.
3. In the "App name" field, type something like `Email Send Form` and click **Create**.
4. Google will show a 16-character password like `abcd abcd abcd abcd`. Copy it immediately. You will not see it again.
5. Keep this password safe. Do not share it or commit it to git.

> Note: If you cannot see App Passwords, make sure 2-Step Verification is fully enabled and try again after a few minutes. A regular Gmail password will not work here.

Useful reference: https://nodemailer.com/guides/using-gmail#app-password-requires-2-step-verification

## Environment Variables

The app checks these variables at startup (`src/lib/env.ts:24`). If any are missing or invalid, the app will not start.

**Step 1: Create the env file**

```bash
cp .env.example .env
```

If `cp` does not work on Windows, manually create a file named `.env` in the project root.

**Step 2: Fill in the values**

Open `.env` and set:

```env
EMAIL_FROM="you@gmail.com"              # The Gmail address that owns the App Password above
EMAIL_PASS="abcd abcd abcd abcd"        # The 16-character App Password (spaces are okay, they are stripped automatically)
EMAIL_TO="admin@example.com"            # Where you want to receive admin notifications
```

- `EMAIL_FROM` must be the same Gmail account that generated the App Password.
- `EMAIL_PASS` can be pasted with or without spaces. The app removes spaces for you.
- `EMAIL_TO` can be the same as `EMAIL_FROM` or any other inbox you monitor.

**Step 3: Restart the dev server**

After editing `.env`, stop the server (Ctrl+C) and run `bun run dev` again so Next.js picks up the new values.

> `.env` is ignored by git (`.gitignore:34`). Never commit it.

## Tech Stack and Dependencies

| Package | Version | Purpose |
|---|---|---|
| `next` | 15.3.0 | App Router (RSC), Server Actions, Turbopack |
| `react` / `react-dom` | 19.1.0 | UI |
| `typescript` | 5 | Type safety |
| `tailwindcss` | 4.1.4 | Styling |
| `tailwind-merge` / `clsx` / `class-variance-authority` | 3.2.0 / 2.1.1 / 0.7.1 | Class merging and variants |
| `shadcn` (`base-nova`, neutral) | 4.19.0 | UI primitives (`src/components/ui/`) |
| `@base-ui/react` | 1.7.0 | Headless UI base |
| `lucide-react` | 0.488.0 | Icons |
| `next-themes` | 0.4.6 | Dark mode (default dark, system off) |
| `react-hook-form` | 7.55.0 | Form state |
| `@hookform/resolvers` | 5.0.1 | Connects Zod to React Hook Form |
| `zod` | 3.24.2 | Schema validation (`src/lib/schemas.ts:3`, `src/lib/env.ts:3`) |
| `nodemailer` | 9.0.5 | Sends email via Gmail SMTP (`src/hooks/email.ts:12`) |
| `react-toastify` | 11.0.5 | Success / error toasts |
| `tw-animate-css` / `tailwindcss-animate` | 1.4.0 / 1.0.7 | Animations |

Dev: `eslint 9`, `eslint-config-next 15.3.0`, `@types/*`, `@tailwindcss/postcss`, `postcss`.

## Project Logic and Architecture

```
src/app/layout.tsx:15   -> Root layout, Geist font, ThemeProvider, Header + main.pt-14
src/app/page.tsx:10     -> Single page, centered Display component
src/components/Display.tsx -> Client component, useForm + zodResolver, Controller + Field/FieldLabel/FieldError,
                             InputGroupTextarea with 2000 char counter, Reset + Submit in CardFooter
src/hooks/email.ts:12   -> Server Action, nodemailer.createTransport({ service: "gmail" }), sends admin + receipt sequentially
src/lib/email-templates.ts:10 -> escapeHtml, baseLayout (600px inline-CSS), adminTemplate + receiptTemplate (html + text)
src/lib/schemas.ts:3    -> formSchema: fullName 2-80, email, mobile digits 8-12, subject 3-120, message 3-2000
src/lib/env.ts:24      -> Zod validation for EMAIL_FROM / EMAIL_PASS / EMAIL_TO at import time
src/lib/types.ts:4      -> FormDataType inferred from formSchema
```

- Path alias `@/*` maps to `src/*` (`tsconfig.json:22`).
- Styling uses `src/app/globals.css` with CSS variables.
- `src/components/ui/form.tsx` is legacy and not used; the current form uses `field.tsx` + `input-group.tsx`.

## Download and Contributing

You are always welcome to download, use, or contribute.

**To download:**

- Click **Code -> Download ZIP** on GitHub, or clone with git as shown above.

**To contribute:**

1. Fork the repo on GitHub.
2. Create a branch: `git checkout -b feat/your-feature`
3. Make your changes and test locally with `bun run dev`.
4. Run `bun run lint` and `bun run build` to make sure nothing is broken.
5. Commit and push, then open a Pull Request.

Ideas are welcome: better templates, rate limiting, additional providers, accessibility improvements, or tests. Please open an issue first if you plan a large change.

## License

MIT License. See [LICENSE](./LICENSE) for details.

## Troubleshooting

- **App crashes on start with Zod error**: Check `.env` values. `EMAIL_FROM` and `EMAIL_TO` must be valid emails, `EMAIL_PASS` must be at least 8 characters after spaces are removed.
- **"Invalid login" or "Authentication failed" when sending**: Regenerate the App Password and make sure `EMAIL_FROM` is the Gmail that created it. Use the App Password, not your normal password.
- **Not receiving emails**: Check spam folder and server logs. The action logs errors to the console but returns a generic message to the client (`src/hooks/email.ts:59`).

---

Built with Next.js, Nodemailer, and Tailwind CSS.
