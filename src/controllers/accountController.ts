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

  async createAccount(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: "fail",
          message: "Unauthorized",
        });
      }
      //get validated data from the request body (account type)
      const { type } = req.body;
      //tell the service layer to create a new account for this user, and give it the type from the request body
      const newAccount = await accountService.createNewAccount(
        req.user.id,
        type,
      );

      //send the shiny new account back to postman
      res.status(201).json({
        status: "success",
        message: `${type} account created successfully`,
        data: newAccount,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTransactions(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: "fail",
          message: "Unauthorized",
        });
      }

      const accountNumberParam = req.params.accountNumber;
      const accountNumber = Array.isArray(accountNumberParam)
        ? accountNumberParam[0]
        : accountNumberParam;
      const pageQuery = Array.isArray(req.query.page)
        ? req.query.page[0]
        : req.query.page;
      const limitQuery = Array.isArray(req.query.limit)
        ? req.query.limit[0]
        : req.query.limit;
      const page = Number(pageQuery) || 1;
      const limit = Number(limitQuery) || 10;

      const result = await accountService.getAccountTransactions(
        req.user.id,
        accountNumber,
        page,
        limit,
      );

      res.status(200).json({
        status: "success",
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }
}
