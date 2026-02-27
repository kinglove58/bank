import { Router } from "express";
import { TransactionController } from "../controllers/transactionController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateResource.js";
import { DepositSchema } from "../types/transaction.dto.js";

const router = Router();
const transactionController = new TransactionController();

router.post(
  "/deposit",
  requireAuth,
  validate(DepositSchema),
  transactionController.deposit.bind(transactionController),
);

export default router;
