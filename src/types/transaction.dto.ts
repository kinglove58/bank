import z from "zod";

export const DepositSchema = z.object({
  body: z.object({
    accountNumber: z.string().length(10, "Account number must be 10 digits"),
    amount: z.number().positive("Deposit amount must be greater than zero"),
    description: z.string().optional(),
  }),
});

export const WithdrawalSchema = z.object({
  body: z.object({
    accountNumber: z.string().length(10, "Account number must be 10 digits"),
    amount: z.number().positive("Withdrawal amount must be greater than zero"),
    description: z.string().optional(),
  }),
});

export const transferSchema = z.object({
  body: z.object({
    senderAccountNumber: z
      .string()
      .length(10, "Sender account number must be 10 digits"),
    receiverAccountNumber:
      z.string().length(10, "Receiver account number must be 10 digits"),
    amount: z.number().positive("Transfer amount must be greater than zero"),
    description: z.string().optional(),
  }),
});

export type DepositInput = z.infer<typeof DepositSchema>["body"];
export type WithdrawalInput = z.infer<typeof WithdrawalSchema>["body"];
export type TransferInput = z.infer<typeof transferSchema>["body"];
