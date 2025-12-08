import { Router } from "express";
import { Middlewares } from "../lib/middlewares.js";
import { UsersController } from "../controllers/users.controller.js";
const router = Router();

const { getAllUsers, toggleRole, deleteUser, getSpecificUser } =
  new UsersController();
const { verifyToken, isAdmin } = new Middlewares();

router.get("/", verifyToken, isAdmin, getAllUsers);
router
  .route("/:id")
  .get(verifyToken, getSpecificUser)
  .delete(verifyToken, isAdmin, deleteUser);

router.post("/:id/role", verifyToken, isAdmin, toggleRole);
export default router;
