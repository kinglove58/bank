import { pinoHttp } from "pino-http";
import logger from "../config/logger.js";
export const httpLogger = pinoHttp({
    logger,
    //customizing what gets logged so we don't leak senstiove info
    serializers: {
        req: (req) => ({
            id: req.id,
            method: req.method,
            url: req.url,
            remoteAddress: req.remoteAddress,
        }),
        res: (res) => ({
            statusCode: res.statusCode,
        }),
    },
});
