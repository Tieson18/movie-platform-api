import { z } from "zod";

export const RegisterUserSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(1, "name is required"),
      email: z.email("email must be valid").transform((value) => value.toLowerCase().trim()),
      password: z.string().min(6, "password must be at least 6 characters"),
    })
    .strict(),
});

export const LoginUserSchema = z.object({
  body: z.object({
    email: z.email("email must be valid").transform((value) => value.toLowerCase().trim()),
    password: z.string().min(1, "password is required"),
  }),
});
