import { z } from "zod";

export const formSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { message: "Full name must be at least 2 characters" })
    .max(80, { message: "Full name must be at most 80 characters" }),
  email: z.string().trim().email({ message: "Invalid email address" }),
  mobile: z
    .string()
    .trim()
    .regex(/^\d+$/, { message: "Mobile must contain only numbers" })
    .min(8, { message: "Mobile must be at least 8 digits" })
    .max(12, { message: "Mobile must be at most 12 digits" }),
  subject: z
    .string()
    .trim()
    .min(3, { message: "Subject must be at least 3 characters" })
    .max(120, { message: "Subject must be at most 120 characters" }),
  message: z
    .string()
    .trim()
    .min(3, { message: "Minimum 3 characters" })
    .max(2000, { message: "Message must be at most 2000 characters" }),
});
