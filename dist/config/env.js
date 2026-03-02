import dotenv from "dotenv";
dotenv.config();
export const config = {
    PORT: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || "development",
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
};
const requiredEnvs = ["DATABASE_URL", "JWT_SECRET"];
requiredEnvs.forEach((env) => {
    if (!process.env[env]) {
        console.error(`Error: Missing required environment variable ${env}`);
        process.exit(1); // Exit with failure code
    }
});
