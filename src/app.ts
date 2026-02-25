// Main application setup
import express, { Request, Response, Application } from "express";
import helmet from "helmet";
import cors from "cors";
import { httpLogger } from "./middlewares/loggerMiddle.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";

const app: Application = express();

//1. Global middleware
app.use(helmet()); //security header first
app.use(cors()); //enable CORS for all routes
app.use(express.json()); //parse json body
app.use(httpLogger);

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

app.use(errorHandler); //global error handler, should be last middleware

//we DO NOT call app.listen() here because we want to separate the app setup from the server startup
export default app;