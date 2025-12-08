import { Router } from "express";
import { Middlewares } from "../lib/middlewares.js";
import AuthController from "../controllers/auth.controller.js";
const router = Router();
const { verifyToken } = new Middlewares();
const { login, signup, logout } = new AuthController();
router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", verifyToken, logout);
export default router;
//# sourceMappingURL=auth.routes.js.map