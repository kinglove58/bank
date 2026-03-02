import { Router } from "express";
import { AccountController } from "../controllers/accountController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateResource.js";
import {
  CreateAccountSchema,
  GetTransactionsSchema,
} from "../types/account.dto.js";

const router = Router();
const accountController = new AccountController();

/**
 * @swagger
 * /api/v1/accounts:
 *   get:
 *     tags: [Accounts]
 *     summary: Get all accounts for the current user (or all accounts for admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Accounts fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/",
  requireAuth,
  accountController.getAccounts.bind(accountController),
);

/**
 * @swagger
 * /api/v1/accounts:
 *   post:
 *     tags: [Accounts]
 *     summary: Create a new bank account
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type]
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [SAVINGS, CHECKING]
 *                 example: SAVINGS
 *     responses:
 *       201:
 *         description: Account created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  requireAuth,
  validate(CreateAccountSchema),
  accountController.createAccount.bind(accountController),
);

/**
 * @swagger
 * /api/v1/accounts/{accountNumber}/transactions:
 *   get:
 *     tags: [Accounts]
 *     summary: Get paginated transactions for an account
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: accountNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: Bank account number
 *         example: "1234567890"
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *       - in: query
 *         name: type
 *         required: false
 *         schema:
 *           type: string
 *           enum: [DEPOSIT, WITHDRAWAL, TRANSFER]
 *     responses:
 *       200:
 *         description: Transactions fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Account not found
 */
router.get(
  "/:accountNumber/transactions",
  requireAuth,
  validate(GetTransactionsSchema),
  accountController.getTransactions.bind(accountController),
);

export default router;
