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

const app: Application = express();

//1. Global middleware
app.use(helmet()); //security header first
app.use(cors()); //enable CORS for all routes
app.use(express.json()); //parse json body
app.use(httpLogger);

//1. global rate limiter: protects the whole api from being spammed
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, //15 minutes
  max: 100, //limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", globalLimiter);

// 2. Health Check Endpoint
// In a production environment (AWS, Kubernetes, Docker),
// the infrastructure needs a route to ping to check if the API is alive.

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
