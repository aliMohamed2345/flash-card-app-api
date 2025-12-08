import { Router } from "express";
import { Middlewares, UploadService } from "../lib/middlewares.js";
import { ProfileController } from "../controllers/profile.controller.js";
// import {UploadService} from ''
const router = Router();
const { verifyToken } = new Middlewares();
const { upload } = new UploadService();
const {
  profile,
  updateUserData,
  deleteCurrentUser,
  uploadProfileImage,
  deleteProfileImage,
  changeUserPassword,
} = new ProfileController();

router
  .route("/")
  .get(verifyToken, profile)
  .put(verifyToken, updateUserData)
  .delete(verifyToken, deleteCurrentUser);
router.post(
  "/upload-image",
  verifyToken,
  upload.single("image"),
  uploadProfileImage
);
router.delete("/delete-image", verifyToken, deleteProfileImage);
router.put("/change-password", verifyToken, changeUserPassword);

export default router;
