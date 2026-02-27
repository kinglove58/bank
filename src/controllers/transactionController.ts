import { NextFunction, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import { TransactionService } from "../services/transactionService.js";

const transactionService = new TransactionService();

export class TransactionController {
  async deposit(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res
          .status(401)
          .json({ status: "fail", message: "Unauthorized" });
      }

      const { accountNumber, amount, description } = req.body;
      const userId = req.user.id;

      const result = await transactionService.makeDeposit(
        userId,
        accountNumber,
        amount,
        description,
      );

      //send responses back
      res.status(200).json({
        status: "success",
        message: "Deposit successful",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
