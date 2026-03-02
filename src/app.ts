// Main application setup
import express, { Request, Response, Application } from "express";
import helmet from "helmet";
import cors from "cors";
import { httpLogger } from "./middlewares/loggerMiddle.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import rateLimit from "express-rate-limit";
import accountRoutes from "./routes/accountRoutes.js";
import transactionRoutes from "./routes/transactionRoute.js";
import { swaggerSpec } from "./config/swagger.js";
import swaggerUi from "swagger-ui-express";

const app: Application = express();

//1. Global middleware

app.use(helmet()); //security header first
app.use(cors()); //enable CORS for all routes
app.use(express.json()); //parse json body
app.use(httpLogger);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
//1. global rate limiter: protects the whole api from being spammed
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, //15 minutes
  max: 100, //limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", globalLimiter);

/**
 * @swagger
 * /health:
 *   get:
 *     tags: [System]
 *     summary: Health check endpoint
 *     security: []
 *     responses:
 *       200:
 *         description: API is healthy
 */
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "API is Operating",
    timestamp: new Date().toISOString(),
  });
});

//this mounts all user routes to the /api/v1/users path
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/accounts", accountRoutes);
app.use("/api/v1/transactions", transactionRoutes);

app.use(errorHandler); //global error handler, should be last middleware

//we DO NOT call app.listen() here because we want to separate the app setup from the server startup
export default app;
