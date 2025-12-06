import express from "express";
import { config } from "../utils/env-config.js";
import authRoutes from '../routes/auth.routes.js'
import { NotFoundMiddleware, globalErrorHandler } from '../utils/globalErrorHandlers.js';
import cookieParser from 'cookie-parser';
import { statusCode } from "../utils/status-code.js";
const port = config.port || 3000;
const app = express();

app.use(express.json());
app.use(cookieParser())
app.use('/v1/auth', authRoutes)

app.get("/", (req, res) => {
  res.status(statusCode.OK).json({ message: "Hello world" });
});

app.use(NotFoundMiddleware)

app.use(globalErrorHandler)

if (config.nodeEnv === 'development') {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })
}

export default app;
