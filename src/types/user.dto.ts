import { z } from "zod";

export const RegisterUserSchema = z.object({
  //zod check request body against these rules

  body: z.object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters long"),
    email: z
      .string()
      .email("Not a valid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long"),
  }),
});

export type RegisterUserInput = z.infer<typeof RegisterUserSchema>;
