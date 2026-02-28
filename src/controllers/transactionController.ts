import { NextFunction, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import { TransactionService } from "../services/transactionService.js";
import {
  DepositInput,
  TransferInput,
  WithdrawalInput,
} from "../types/transaction.dto.js";

const transactionService = new TransactionService();

export class TransactionController {
  async deposit(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res
          .status(401)
          .json({ status: "fail", message: "Unauthorized" });
      }

      const { accountNumber, amount, description } = req.body as DepositInput;
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

  async withdraw(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res
          .status(401)
          .json({ status: "fail", message: "Unauthorized" });
      }

      const { accountNumber, amount, description } =
        req.body as WithdrawalInput;
      const userId = req.user.id;

      const result = await transactionService.makeWithdrawal(
        userId,
        accountNumber,
        amount,
        description,
      );

      //send responses back
      res.status(200).json({
        status: "success",
        message: "Withdrawal successful",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async transfer(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: "fail",
          message: "Unauthorized",
        });
      }

      //Destructure the validated transfer data
      const {
        senderAccountNumber,
        receiverAccountNumber,
        amount,
        description,
      } = req.body as TransferInput;
      const userId = req.user.id;

      //excecution of the cross-account transfer
      const result = await transactionService.makeTransfer(
        userId,
        senderAccountNumber,
        receiverAccountNumber,
        amount,
        description,
      );

      res.status(200).json({
        status: "success",
        message: "Transfer completed successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
