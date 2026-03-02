import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
const datasourceUrl = process.env.DATABASE_URL;
const directUrl = process.env.DIRECT_URL;
if (!datasourceUrl) {
    throw new Error("DATABASE_URL environment variable is not set");
}
if (!directUrl) {
    throw new Error("DIRECT_URL environment variable is not set");
}
const adapter = new PrismaPg({ connectionString: datasourceUrl, directUrl });
const prisma = new PrismaClient({ adapter });
export class AccountRepository {
    /* for ADMINS: Gets every single account in the bank */
    async findAll() {
        return await prisma.account.findMany();
    }
    async findByUserId(userId) {
        return await prisma.account.findMany({
            where: { userId },
        });
    }
    //we will add a create method later
    async findByAccountNumber(accountNumber) {
        return await prisma.account.findUnique({
            where: { accountNumber },
        });
    }
    async createAccount(userId, accountNumber, type) {
        return await prisma.account.create({
            data: {
                userId: userId,
                accountNumber: accountNumber,
                type: type,
                balance: 0.0,
            },
        });
    }
    async findTransactionsByAccount(accountId, limit, skip, type) {
        return await prisma.transaction.findMany({
            where: { accountId, ...(type && { type }) },
            take: limit,
            skip: skip,
            orderBy: { createdAt: "desc" },
        });
    }
    async countTransactions(accountId, type) {
        return await prisma.transaction.count({
            where: { accountId, ...(type && { type }) },
        });
    }
}
