import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class TransactionRepository {
  //safely deposit money
  async deposit(accountId: number, amount: number, desciiption?: string) {
    return await prisma.$transaction(async (tsx) => {
      //1. create the transaction record
      const transactionRecord = await tsx.transaction.create({
        data: {
          accountId: accountId,
          amount: amount,
          type: "DEPOSIT",
          description: desciiption,
        },
      });

      //2. safely update the account balance
      const updateAccount = await tsx.account.update({
        where: { id: accountId },
        data: {
          //prisma has a massive 'increment'
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
