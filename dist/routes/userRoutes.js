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
    message: "Too many login attempts from this IP, please try again after 15 minutes",
});
/**
 * @swagger
 * /api/v1/users/register:
 *   post:
 *     tags: [Users]
 *     summary: Register a new user
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Elijah King"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "elijah@example.com"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already exists
 */
router.post("/register", validate(RegisterUserSchema), userController.register.bind(userController));
/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     tags: [Users]
 *     summary: Login and get JWT token
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "elijah@example.com"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid email or password
 *       429:
 *         description: Too many requests
 */
router.post("/login", loginLimiter, validate(loginUserSchema), userController.login.bind(userController));
/**
 * @swagger
 * /api/v1/users/profile:
 *   post:
 *     tags: [Users]
 *     summary: Get current user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/profile", requireAuth, userController.getProfile.bind(userController));
/**
 * @swagger
 * /api/v1/users/admin-dashboard:
 *   get:
 *     tags: [Users]
 *     summary: Admin-only dashboard endpoint
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Access granted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 */
router.get("/admin-dashboard", requireAuth, restrictTo("ADMIN"), (req, res) => {
    res
        .status(200)
        .json({ message: "Welcome to the bank manager admin dashboard!" });
});
export default router;
