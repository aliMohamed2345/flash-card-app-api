import { Router } from "express";
import { Middlewares } from "../lib/middlewares.js";
import { UsersController } from "../controllers/users.controller.js";
const router = Router();
const { getAllUsers, toggleRole, deleteUser, getSpecificUser, getPublicUserDeck, } = new UsersController();
const { verifyToken, isAdmin } = new Middlewares();
router.get("/", verifyToken, isAdmin, getAllUsers);
router
    .route("/:id")
    .get(verifyToken, getSpecificUser)
    .delete(verifyToken, isAdmin, deleteUser);
router.post("/:id/role", verifyToken, isAdmin, toggleRole);
router.get("/:id/decks", verifyToken, getPublicUserDeck);
/**
 * @todo don't forget to add user stats and user deck stats to
 */
export default router;
//# sourceMappingURL=users.routes.js.map