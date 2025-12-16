import { Router } from "express";
import { Middlewares } from "../lib/middlewares.js";
import { UsersController } from "../controllers/users.controller.js";
const router = Router();

const {
  getAllUsers,
  toggleRole,
  deleteUser,
  getSpecificUser,
  getPublicUserDeck,
  getSpecificUserDeck,
  getUserStats,
} = new UsersController();
const { verifyToken, isAdmin } = new Middlewares();

router.get("/", verifyToken, isAdmin, getAllUsers);
router
  .route("/:id")
  .get(verifyToken, getSpecificUser)
  .delete(verifyToken, isAdmin, deleteUser);

router.post("/:id/role", verifyToken, isAdmin, toggleRole);
router.get("/:id/deck", verifyToken, getPublicUserDeck);
router.get("/:id/deck/:deckId", verifyToken, getSpecificUserDeck);
router.get("/:id/deck/stats", verifyToken, getUserStats);
export default router;
