import { statusCode } from "./status-code.js"
// export const globalErrorHandler = (app) => {
//     app.use('', (err, req, res, next) => {
//         return res.status(statusCode.SERVER_ERROR).json({ status: false, message: err.message })
//     })
// }

// Global Error Handler
export const globalErrorHandler = (err, req, res, next) => {
    return res.status(statusCode.SERVER_ERROR).json({ status: false, message: err.message });
};

// 404 Not Found Middleware
export const NotFoundMiddleware = (req, res, next) => {
    return res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found`,
    });
};