import { Router } from "express";
import { TransactionController } from "../controllers/transactionController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateResource.js";
import { DepositSchema } from "../types/transaction.dto.js";

const router = Router();
const transationController = new TransactionController();

router.post(
  "/deposit",
  requireAuth,
  validate(DepositSchema),
  transationController.deposit.bind(transationController),
);

export default router;
