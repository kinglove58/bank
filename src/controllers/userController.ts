import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/UserService.js";

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
}
