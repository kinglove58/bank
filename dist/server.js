// Server startup
import app from "./app.js";
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//graceful shutdown
process.on("unhandledRejection", (reason, promise) => {
    console.error("unhandled rejection! Shutting down...", reason);
    server.close(() => {
        process.exit(1); //Exit with failure code
    });
});
//catch terminal termination signals (e.g., Ctrl+C)
process.on("SIGTERM", () => {
    console.log("SIGTERM RECEIVED. Shutting down gracefully...");
    server.close(() => {
        console.log("Process terminated");
    });
});
// In a production environment (AWS, Kubernetes, Docker), the infrastructure needs a route to ping to check if the API is alive. This is typically done with a health check endpoint, which we have defined in app.ts as /health. The infrastructure will periodically send requests to this endpoint to ensure that the API is responsive and healthy. If the health check fails, the infrastructure can take appropriate actions, such as restarting the container or sending alerts.
process.on("SIGINT", () => {
    console.log("SIGINT RECEIVED. Shutting down gracefully...");
    server.close(() => {
        console.log("Process terminated");
        process.exit(0); //Exit with success code
    });
});
