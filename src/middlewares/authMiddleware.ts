import { NextFunction, Response, Request } from "express";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    id: number;
  };
}

export const requireAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    //it should be in the format "Bearer token
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      throw new ApiError(401, "Not authorized, no token provided");
    }

    const token = authHeader.split(" ")[1];

    //verify the token using our secret code
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is missing");
    }

    //verify automatically throws an error if the token is fake or expired
    const decoded = jwt.verify(token, secret) as { id: number };

    //Attach the user Id to the req to the controllers can use it to identify the user making the request
    req.user = { id: decoded.id };

    //let the user through the controller
    next();
  } catch (error) {
    //if jwt.verify fails, it throw and error that we catch here and send a 401 response to the client
    next(new ApiError(401, "Not authorized, invalid token"));
  }
};
