import { Router } from "express";
import { UserController } from "../controllers/userController.js";
import { loginUserSchema, RegisterUserSchema } from "../types/user.dto.js";
import { validate } from "../middlewares/validateResource.js";
import { requireAuth, restrictTo } from "../middlewares/authMiddleware.js";
import rateLimit from "express-rate-limit";

const router = Router();
const userController = new UserController();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message:
    "Too many login attempts from this IP, please try again after 15 minutes",
});

//POST/register
//The Request travels left to right: Route -> zod validation -> controller
router.post(
  "/register",
  validate(RegisterUserSchema),
  userController.register.bind(userController),
);

router.post(
  "/login",
  loginLimiter,
  validate(loginUserSchema),
  userController.login.bind(userController),
);

router.post(
  "/profile",
  requireAuth,
  userController.getProfile.bind(userController),
);

//GET /admin-dashboard (super secret route)
router.get("/admin-dashboard", requireAuth, restrictTo("ADMIN"), (req, res) => {
  res
    .status(200)
    .json({ message: "Welcome to the bank manager admin dashboard!" });
});

export default router;
