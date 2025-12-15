//packages
import express from "express";
import helmet from "helmet";
import limiter from "express-rate-limit";
import cookieParser from "cookie-parser";
//routes
import authRoutes from "../routes/auth.routes.js";
import usersRoutes from "../routes/users.routes.js";
import profileRoutes from "../routes/profile.routes.js";
import deckRoutes from "../routes/deck.routes.js";
//error handlers
import { NotFoundMiddleware, globalErrorHandler, } from "../utils/globalErrorHandlers.js";
//others
import { config } from "../utils/env-config.js";
import { statusCode } from "../utils/status-code.js";
const port = config.port || 3000;
const app = express();
const windowMs = 10 * 60 * 1000;
//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
// app.use(
//   cors({
//     origin: config.frontend_url,
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//   })
// );
app.use(limiter({
    limit: 100,
    windowMs,
    message: `Too many requests from this IP, please try again later after ${windowMs / (1000 * 60)} minutes`,
}));
//middleware routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/deck", deckRoutes);
app.get("/", (req, res) => {
    res.status(statusCode.OK).json({ message: "Hello world" });
});
//error handling middlewares
app.use(NotFoundMiddleware);
app.use(globalErrorHandler);
app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
});
//# sourceMappingURL=server.js.map