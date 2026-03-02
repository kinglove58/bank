import { Router } from "express";
import { TransactionController } from "../controllers/transactionController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateResource.js";
import {
  DepositSchema,
  transferSchema,
  WithdrawalSchema,
} from "../types/transaction.dto.js";

const router = Router();
const transactionController = new TransactionController();

/**
 * @swagger
 * /api/v1/transactions/deposit:
 *   post:
 *     tags: [Transactions]
 *     summary: Deposit money into an account
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [accountNumber, amount]
 *             properties:
 *               accountNumber:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 10
 *                 example: "1234567890"
 *               amount:
 *                 type: number
 *                 minimum: 0.01
 *                 example: 5000
 *               description:
 *                 type: string
 *                 example: "Cash deposit at branch"
 *     responses:
 *       200:
 *         description: Deposit successful
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Account not found
 */
router.post(
  "/deposit",
  requireAuth,
  validate(DepositSchema),
  transactionController.deposit.bind(transactionController),
);

/**
 * @swagger
 * /api/v1/transactions/withdraw:
 *   post:
 *     tags: [Transactions]
 *     summary: Withdraw money from an account
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [accountNumber, amount]
 *             properties:
 *               accountNumber:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 10
 *                 example: "1234567890"
 *               amount:
 *                 type: number
 *                 minimum: 0.01
 *                 example: 250
 *               description:
 *                 type: string
 *                 example: "ATM cash withdrawal"
 *     responses:
 *       200:
 *         description: Withdrawal successful
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Account not found
 */
router.post(
  "/withdraw",
  requireAuth,
  validate(WithdrawalSchema),
  transactionController.withdraw.bind(transactionController),
);

/**
 * @swagger
 * /api/v1/transactions/transfer:
 *   post:
 *     tags: [Transactions]
 *     summary: Transfer money between two accounts
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [senderAccountNumber, receiverAccountNumber, amount]
 *             properties:
 *               senderAccountNumber:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 10
 *                 example: "1234567890"
 *               receiverAccountNumber:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 10
 *                 example: "0987654321"
 *               amount:
 *                 type: number
 *                 minimum: 0.01
 *                 example: 1000
 *               description:
 *                 type: string
 *                 example: "Rent payment"
 *     responses:
 *       200:
 *         description: Transfer completed successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Account not found
 */
router.post(
  "/transfer",
  requireAuth,
  validate(transferSchema),
  transactionController.transfer.bind(transactionController),
);

export default router;
