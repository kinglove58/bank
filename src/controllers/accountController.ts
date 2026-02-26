import { NextFunction, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import { AccountService } from "../services/accountService.js";

const accountService = new AccountService();

export class AccountController {
  async getAccounts(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res
          .status(401)
          .json({ status: "fail", message: "Unauthorized" });
      }

      // Hand the user object straight to the service layer
      const accounts = await accountService.getAccountsForUser(req.user);

      //send the result back to postman
      res.status(200).json({
        status: "success",
        results: accounts.length,
        data: accounts,
      });
    } catch (error) {
      next(error);
    }
  }
}
