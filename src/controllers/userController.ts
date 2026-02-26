import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/UserService.js";
import { AuthRequest } from "../middlewares/authMiddleware.js";

const userService = new UserService();

export class UserController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      //get the data from the req (zod has verifield)
      const userData = req.body;

      //pass the data to the service layer to handle the business logic
      const newUser = await userService.registerUser(userData);

      //send the response back to the client
      res.status(201).json({
        status: "success",
        message: "User registered successfully",
        data: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,

          //we do NOT send the password back in the response for security reasons
        },
      });
    } catch (error) {
      //if the service throw an error
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const loginData = req.body;

      const result = await userService.loginUser(loginData);

      res.status(200).json({
        status: "success",
        message: "User logged in successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      //because it the requireAuth middleware, we KNOW req.user exists
      const userId = req.user?.id;

      //now we could use the this ID  to fetch their bank accounts from the db
      // for now, let's just prove it works:

      res.status(200).json({
        status: "success",
        message: "User profile fetched successfully",
        data: {
          userid: userId,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
