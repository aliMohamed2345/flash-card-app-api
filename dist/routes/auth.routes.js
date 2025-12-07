import { Router } from "express";
import Middlewares from "../lib/middlewares.js";
import AuthController from "../controllers/auth.controller.js";
const router = Router();
const { verifyToken } = new Middlewares();
const { login, signup, logout, profile } = new AuthController();
router.post("/login", login);
router.get("/signup", signup);
router.get("/profile", verifyToken, profile);
router.post("/logout", verifyToken, logout);
export default router;
//# sourceMappingURL=auth.routes.js.map