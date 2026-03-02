import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
const databaseUrl = process.env.DATABASE_URL;
const directUrl = process.env.DIRECT_URL;
if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set");
}
if (!directUrl) {
    throw new Error("DIRECT_URL is not set");
}
const adapter = new PrismaPg({ connectionString: databaseUrl, directUrl });
const prisma = new PrismaClient({ adapter });
export class UserRepository {
    /**
     * CREATE: Saves a new user to the database
     * @param data - The email, name, and password for the user
     */
    async create(data) {
        return await prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                password: data.password,
            },
        });
    }
    async findByEmail(email) {
        return await prisma.user.findUnique({
            where: { email },
        });
    }
    async findById(id) {
        return await prisma.user.findUnique({
            where: { id },
        });
    }
}
