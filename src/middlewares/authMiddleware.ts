import { NextFunction, Response, Request } from "express";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/userRepository.js";
import { Role } from "@prisma/client";

const userRespository = new UserRepository();

//add role to our authreq
export interface AuthRequest extends Request {
  user?: {
    id: number;
    role: Role;
  };
}

// we must make this function now a async bc we talk to db
export const requireAuth = async (
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

    //4. fetch the user from the vault to ensure they haven't been delleted
    // and to fet their current role
    const currentUser = await userRespository.findById(decoded.id);

    if (!currentUser) {
      throw new ApiError(
        401,
        "The user belonging to this token no longer exists.",
      );
    }
    //Attach the user Id and ROLE to the req to the controllers can use it to identify the user making the request
    req.user = { id: currentUser.id, role: currentUser.role };

    //let the user through the controller
    next();
  } catch (error) {
    //if jwt.verify fails, it throw and error that we catch here and send a 401 response to the client
    next(new ApiError(401, "Not authorized, invalid token"));
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          "Forbidden: You don't have permission to access this action",
        ),
      );
    }

    //if they are allowed, let them through
    next();
  };
};
