import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
const secret = config.jwtSecret;
if (!secret) {
    throw new Error("JWT_SECRET is not set");
}
const expiresIn = (config.jwtExpiresIn ??
    "1d");
export const generateToken = (userId) => {
    // jwt.sign() creates the wristband.
    // we hide the userId in the wristband, and sign it with our secret key. We also set an expiration time for the token.
    return jwt.sign({ id: userId }, secret, { expiresIn });
};
