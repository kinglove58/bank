import { Router } from "express";
import { UserController } from "../controllers/userController.js";
import { RegisterUserSchema } from "../types/user.dto.js";
import { validate } from "../middlewares/validateResource.js";

const router = Router();
const userController = new UserController();

// POST /register
//The Request travels left to right: Route -> zod validation -> controller

router.post(
  "/register",
  validate(RegisterUserSchema),
  userController.register.bind(userController),
);

export default router;
