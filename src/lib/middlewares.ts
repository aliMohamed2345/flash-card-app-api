import { config } from "../utils/env-config.js";
import { statusCode } from "../utils/status-code.js";
import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
      isAdmin: boolean;
    };
  }
}
class Middlewares {
  verifyToken = (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies?.token;
      if (!token)
        return res
          .status(statusCode.UNAUTHORIZED)
          .json({ status: false, message: "Unauthorized:No token provided" });

      const decoded = jwt.verify(token, config.jwtSecret as string);

      req.user = decoded as { id: string; isAdmin: boolean };
      next();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid Token";
      console.log(`invalid Token:${message}`);
      return res
        .status(statusCode.UNAUTHORIZED)
        .json({ status: false, message: `Unauthorized:${message}` });
    }
  };
}

export default Middlewares;
