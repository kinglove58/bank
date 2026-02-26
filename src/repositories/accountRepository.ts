import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Account } from "@prisma/client";

const datasourceUrl = process.env.DATABASE_URL;

const adapter = new PrismaPg({ connectionString: datasourceUrl });
const prisma = new PrismaClient({ adapter });

export class AccountRepository {
  /* for ADMINS: Gets every single account in the bank */

  async findAll(): Promise<Account[]> {
    return await prisma.account.findMany();
  }

  async findByUserId(userId: number): Promise<Account[]> {
    return await prisma.account.findMany({
      where: { userId },
    });
  }

  //we will add a create method later

  async create(data: any): Promise<Account> {
    return await prisma.account.create({
      data,
    });
  }
}
