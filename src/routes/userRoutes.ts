import { Router } from "express";
import { UserController } from "../controllers/userController.js";
import { loginUserSchema, RegisterUserSchema } from "../types/user.dto.js";
import { validate } from "../middlewares/validateResource.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = Router();
const userController = new UserController();

//POST/register
//The Request travels left to right: Route -> zod validation -> controller

router.post(
  "/register",
  validate(RegisterUserSchema),
  userController.register.bind(userController),
);

router.post(
  "/login",
  validate(loginUserSchema),
  userController.login.bind(userController),
);

router.post(
  "/profile",
  requireAuth,
  userController.getProfile.bind(userController),
);

export default router;
