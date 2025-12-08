import express from "express";
import { config } from "../utils/env-config.js";
import authRoutes from "../routes/auth.routes.js";
import usersRoutes from "../routes/users.routes.js";
import profileRoutes from "../routes/profile.routes.js";
import { NotFoundMiddleware, globalErrorHandler, } from "../utils/globalErrorHandlers.js";
import cookieParser from "cookie-parser";
import { statusCode } from "../utils/status-code.js";
const port = config.port || 3000;
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/users", usersRoutes);
app.get("/", (req, res) => {
    res.status(statusCode.OK).json({ message: "Hello world" });
});
app.use(NotFoundMiddleware);
app.use(globalErrorHandler);
app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
});
//# sourceMappingURL=server.js.map