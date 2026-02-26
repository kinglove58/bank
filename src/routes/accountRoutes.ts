import { Router } from "express";
import { AccountController } from "../controllers/accountController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = Router();
const accountController = new AccountController();

router.get(
  "/",
  requireAuth,
  accountController.getAccounts.bind(accountController),
);

export default router;
