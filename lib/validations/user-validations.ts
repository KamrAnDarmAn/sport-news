import z from "zod";

export const RegisterSchema = z.object({
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(8, "Min 8 characters").max(72),
  displayName: z.string().trim().min(1).max(60),
});

export const LoginSchema = z.object({
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(8, "Min 8 characters").max(72),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
