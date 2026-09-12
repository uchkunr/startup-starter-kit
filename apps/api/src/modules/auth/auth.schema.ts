import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    )
    .optional(),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  identifier: z.string().min(1, "Email or username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const oauthSchema = z.object({
  provider: z.enum(["google", "github", "apple", "linkedin"]),
  providerAccountId: z.string().min(1, "Provider Account ID is required"),
  email: z.string().email("Invalid email address"),
  name: z.string().optional(),
  avatar: z.string().url().optional().or(z.literal("")),
});

export const telegramAuthSchema = z.object({
  id: z.union([z.number(), z.string()]).transform((v) => String(v)),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  username: z.string().optional(),
  photo_url: z.string().optional(),
  auth_date: z.union([z.number(), z.string()]).transform((v) => Number(v)),
  hash: z.string().min(1, "Hash is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type OAuthInput = z.infer<typeof oauthSchema>;
export type TelegramAuthInput = z.infer<typeof telegramAuthSchema>;
