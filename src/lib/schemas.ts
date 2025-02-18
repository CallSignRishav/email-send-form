import { z } from "zod";

export const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  message: z.string().min(3, { message: "Minimum 3 characters" }),
});
