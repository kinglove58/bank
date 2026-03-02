import z from "zod";

export const CreateAccountSchema = z.object({
  body: z.object({
    type: z.enum(["SAVINGS", "CHECKING"], {
      message: "Account type must be either SAVINGS or CHECKING",
    }),
  }),
});

export const GetTransactionsSchema = z.object({
  params: z.object({
    accountNumber: z.string(),
  }),

  query: z.object({
    //we transform the string from the url to number
    page: z
      .string()
      .optional()
      .transform((val) => Number(val ?? 1)),
    limit: z
      .string()
      .optional()
      .transform((val) => Number(val ?? 10)),
  }),
});

export type CreateAccountInput = z.infer<typeof CreateAccountSchema>["body"];
export type GetTransactionalInput = z.infer<typeof GetTransactionsSchema>;
