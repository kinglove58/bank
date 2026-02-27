import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class TransactionRepository {
  //safely deposit money
  async deposit(accountId: number, amount: number, description?: string) {
    return await prisma.$transaction(async (tsx) => {
      //1. create the transaction record
      const transactionRecord = await tsx.transaction.create({
        data: {
          accountId: accountId,
          amount: amount,
          type: "DEPOSIT",
          description: description,
        },
      });

      //2. safely update the account balance
      const updateAccount = await tsx.account.update({
        where: { id: accountId },
        data: {
          // Prisma has a native 'increment' operation for atomic balance updates
          balance: { increment: amount },
        },
      });

      return {
        transaction: transactionRecord,
        newBalance: updateAccount.balance,
      };
    });
  }
}
