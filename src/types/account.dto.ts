import z from "zod";

export const CreateAccountSchema = z.object({
  body: z.object({
    type: z.enum(["SAVINGS", "CHECKING"], {
      message: "Account type must be either SAVINGS or CHECKING",
    }),
  }),
});

export type CreateAccountInput = z.infer<typeof CreateAccountSchema>["body"];


