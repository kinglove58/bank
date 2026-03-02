import { ApiError } from "../utils/ApiError.js";
import logger from "../config/logger.js";
export const errorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = "Internal Server Error";
    if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    //log the error using our pino logger
    logger.error(err);
    res.status(statusCode).json({
        status: "error",
        statusCode,
        message,
        //only show stack trace in development for debugging, not in production
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};
