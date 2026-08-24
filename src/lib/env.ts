import { z } from "zod";

const serverEnvSchema = z.object({
  // Gmail address that owns the 16-char App Password (2-Step Verification required)
  // See https://nodemailer.com/guides/using-gmail#app-password-requires-2-step-verification
  EMAIL_FROM: z.string().email({ message: "EMAIL_FROM must be a valid email" }),

  // 16-char App Password (spaces allowed in .env, will be stripped). Keep at least 8 chars after stripping.
  EMAIL_PASS: z
    .string()
    .min(1, { message: "EMAIL_PASS is required" })
    .transform((v) => v.replace(/\s+/g, ""))
    .pipe(z.string().min(8, { message: "EMAIL_PASS looks too short – expected 16-char App Password" })),

  EMAIL_TO: z.string().email({ message: "EMAIL_TO must be a valid email" }),
});

const serverEnvVars = {
  EMAIL_FROM: process.env.EMAIL_FROM,
  EMAIL_PASS: process.env.EMAIL_PASS,
  EMAIL_TO: process.env.EMAIL_TO,
};

export const serverEnv = serverEnvSchema.parse(serverEnvVars);

// Keep `env` alias for backward compatibility if any other module imports it
export const env = serverEnv;
export type ServerEnv = z.infer<typeof serverEnvSchema>;
