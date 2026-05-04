import { z } from "zod";

export const RegisterUserSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "name is required"),
    email: z.email("email must be valid").transform((value) => value.toLowerCase().trim()),
    password: z.string().min(8, "password must be at least 8 characters"),
    role: z.enum(["user", "admin"]).optional(),
  }),
});

export const LoginUserSchema = z.object({
  body: z.object({
    email: z.email("email must be valid").transform((value) => value.toLowerCase().trim()),
    password: z.string().min(1, "password is required"),
  }),
});
