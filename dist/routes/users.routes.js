import { Router } from "express";
import { userController } from "../controllers/users.controller.js";
const { getAllUsers, deleteUser, updateUserProfile } = new userController();
const router = Router();
router.get("/", getAllUsers);
router.delete("/:id", deleteUser);
router.put("/", updateUserProfile);
export default router;
//# sourceMappingURL=users.routes.js.map