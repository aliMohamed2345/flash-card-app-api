import { statusCode } from "./status-code.js";
// Global Error Handler
export const globalErrorHandler = (err, req, res, next) => {
    return res
        .status(statusCode.SERVER_ERROR)
        .json({ success: false, message: err.message });
};
// 404 Not Found Middleware
export const NotFoundMiddleware = (req, res, next) => {
    return res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found`,
    });
};
//# sourceMappingURL=globalErrorHandlers.js.map