import { Router } from "express";
import { AccountController } from "../controllers/accountController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateResource.js";
import { CreateAccountSchema } from "../types/account.dto.js";

const router = Router();
const accountController = new AccountController();

router.get(
  "/",
  requireAuth,
  accountController.getAccounts.bind(accountController),
);

router.post(
  "/",
  requireAuth,
  validate(CreateAccountSchema),
  accountController.createAccount.bind(accountController),
);

export default router;
