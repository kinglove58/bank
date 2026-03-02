import pino from "pino";
const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    // In a real production app, we just log raw JSON. 
    // But for local development, raw JSON is hard to read in the terminal.
    // We can use 'pino-pretty' to format it locally if we want, but let's stick to the raw power first.
    formatters: {
        level: (label) => {
            return { level: label.toUpperCase() };
        }
    },
    timestamp: pino.stdTimeFunctions.isoTime, // Use ISO 8601 format for timestamps
});
export default logger;
