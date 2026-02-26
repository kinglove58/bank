import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error("JWT_SECRET is not set");
}

const expiresIn = (process.env.JWT_EXPIRES_IN ?? "1d") as jwt.SignOptions["expiresIn"];

export const generateToken = (userId: number): string => {
  // jwt.sign() creates the wristband.
  // we hide the userId in the wristband, and sign it with our secret key. We also set an expiration time for the token.
  return jwt.sign({ id: userId }, secret, { expiresIn });
};
