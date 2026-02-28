import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";


const datasourceUrl = process.env.DATABASE_URL;
if (!datasourceUrl) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const adapter = new PrismaPg({ connectionString: datasourceUrl });
const prisma = new PrismaClient({ adapter });

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

  async withdraw(accountId: number, amount: number, description?: string) {
    return await prisma.$transaction(async (tsx) => {
      const transactionRecord = await tsx.transaction.create({
        data: {
          accountId: accountId,
          amount: amount,
          type: "WITHDRAWAL",
          description: description,
        },
      });

      const updatedAccount = await tsx.account.updateMany({
        where: {
          id: accountId,
          balance: { gte: amount }, // gte means greater than or equal to, this ensures we don't overdraw
        },
        data: {
          balance: { decrement: amount },
        },
      });

      if (updatedAccount.count === 0) {
        throw new Error(
          `Transaction failed: Insufficient funds at the moment of processing`,
        );
      }

      const finalAccount = await tsx.account.findUnique({
        where: { id: accountId },
      });

      if (!finalAccount) {
        throw new Error(
          `Account with id ${accountId} not found after withdrawal`,
        );
      }

      return {
        transaction: transactionRecord,
        newBalance: finalAccount.balance,
      };
    });
  }

  async transfer(
    senderAccountId: number,
    receiverAccountId: number,
    amount: number,
    description?: string,
  ) {
    return await prisma.$transaction(async (tsx) => {
      //1. atomic withdrawal
      const senderUpdate = await tsx.account.updateMany({
        where: { id: senderAccountId, balance: { gte: amount } },
        data: { balance: { decrement: amount } },
      });

      if (senderUpdate.count === 0) {
        throw new Error(
          "Transfer failed: Insufficient funds in sender account at the moment of processing",
        );
      }

      //deposit
      await tsx.account.update({
        where: { id: receiverAccountId },
        data: { balance: { increment: amount } },
      });

      //ledger record money leaving sender
      const senderRecord = await tsx.transaction.create({
        data: {
          accountId: senderAccountId,
          amount: amount,
          type: "TRANSFER",
          description: description || "Outgoing Transfer",
        },
      });

      // ledger record money arriving to the receiver
      const receiverRecord = await tsx.transaction.create({
        data: {
          accountId: receiverAccountId,
          amount: amount,
          type: "TRANSFER",
          description: description || "Incoming Transfer",
        },
      });

      const finalSenderAccount = await tsx.account.findUnique({
        where: { id: senderAccountId },
      });

      if (!finalSenderAccount) {
        throw new Error(`Sender account with id ${senderAccountId} not found`);
      }
      return {
        transaction: senderRecord,
        newBalance: finalSenderAccount.balance,
      };
    });
  }
}
