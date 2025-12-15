import { statusCode } from "../utils/status-code.js";
import { Validators } from "../lib/validators.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
import db from "../lib/prisma.js";
const validator = new Validators();
export class ProfileController {
    /**
     * updateUserData
     * @param {Request} req
     * @param {Response} res
     * @description update the user data
     */
    updateUserData = async (req, res) => {
        const { id: userId } = req.user;
        const { username, email, bio } = req.body;
        try {
            //validate the user credentials
            const { isValid, message } = validator.validateUpdateUser(email, username, bio);
            if (!isValid)
                return res
                    .status(statusCode.BAD_REQUEST)
                    .json({ success: false, message });
            //update the user data
            const updatedUser = await db.user.update({
                data: { username, email, bio },
                where: { id: userId },
                select: {
                    username: true,
                    bio: true,
                    createdAt: true,
                    updatedAt: true,
                    id: true,
                    profileImg: true,
                },
            });
            //check if the user exist in the db
            if (!updatedUser)
                return res
                    .status(statusCode.NOT_FOUND)
                    .json({ success: false, message: "User not found" });
            return res.status(statusCode.OK).json({
                success: true,
                message: "User updated successfully",
                user: updatedUser,
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Internal server error";
            console.log(message);
            return res.status(statusCode.SERVER_ERROR).json({
                success: false,
                message: `Internal server error: ${message}`,
            });
        }
    };
    /**
     *
     * @param req
     * @param res
     * @returns get the current user profile
     */
    profile = async (req, res) => {
        try {
            const { id: userId } = req.user;
            //checking if the user exist
            const user = await db.user.findUnique({
                where: { id: userId },
                select: {
                    isAdmin: true,
                    email: true,
                    username: true,
                    id: true,
                    bio: true,
                    createdAt: true,
                    profileImg: true,
                    updatedAt: true,
                    Decks: { where: { isPublic: true } },
                },
            });
            if (!user)
                return res
                    .status(statusCode.NOT_FOUND)
                    .json({ success: false, message: "User not found" });
            return res.status(statusCode.OK).json({ success: true, user });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Internal server error";
            console.log(message);
            return res.status(statusCode.SERVER_ERROR).json({
                status: false,
                message: `Internal server error: ${message}`,
            });
        }
    };
    /**
     *
     * @param  {Request} req
     * @param {Response} res
     * @description delete the current user account
     */
    deleteCurrentUser = async (req, res) => {
        const { id: userId } = req.user;
        try {
            await db.user.delete({ where: { id: userId } });
            return res
                .status(statusCode.OK)
                .json({ success: true, message: "User deleted successfully" });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Internal server error";
            console.log(message);
            return res.status(statusCode.SERVER_ERROR).json({
                success: false,
                message: `Internal server error: ${message}`,
            });
        }
    };
    /**
     * @param  {Request} req
     * @param {Response} res
     * @description upload the user profile image
     */
    uploadProfileImage = async (req, res) => {
        const { id: userId } = req.user;
        try {
            if (!req.file)
                return res
                    .status(400)
                    .json({ success: false, message: "No file uploaded" });
            // Upload from buffer
            const result = cloudinary.uploader.upload_stream({
                folder: "user_profiles",
            }, async (error, uploadResult) => {
                if (error) {
                    console.error(error);
                    return res
                        .status(500)
                        .json({ success: false, message: error.message });
                }
                // Save Cloudinary URL to user
                await db.user.update({
                    where: { id: userId },
                    data: { profileImg: uploadResult?.secure_url },
                });
                return res
                    .status(200)
                    .json({ success: true, imageURL: uploadResult?.secure_url });
            });
            // Write the file buffer into the upload stream
            result.end(req.file.buffer);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Internal server error";
            console.log(message);
            return res.status(statusCode.SERVER_ERROR).json({
                success: false,
                message: `Internal server error: ${message}`,
            });
        }
    };
    /**
     * @param {Request} req
     * @param {Response} res
     * @description delete the user profile image
     */
    deleteProfileImage = async (req, res) => {
        const { id: userId } = req.user;
        try {
            // Fetch the current user to get the profileImg URL
            const user = await db.user.findUnique({ where: { id: userId } });
            if (!user || !user.profileImg) {
                return res
                    .status(404)
                    .json({ success: false, message: "Profile image not found" });
            }
            // Extract public ID from Cloudinary URL
            const segments = user.profileImg.split("/");
            const fileNameWithExtension = segments[segments.length - 1]; // abc123.jpg
            const publicId = `user_profiles/${fileNameWithExtension.split(".")[0]}`; // user_profiles/abc123
            // Delete image from Cloudinary
            cloudinary.uploader.destroy(publicId, async (error, result) => {
                if (error) {
                    console.error(error);
                    return res
                        .status(500)
                        .json({ success: false, message: error.message });
                }
                // Update user in database
                await db.user.update({
                    where: { id: userId },
                    data: {
                        profileImg: "https://cdn-icons-png.flaticon.com/512/149/149071.png", // default image
                    },
                });
                return res.status(200).json({
                    success: true,
                    message: "Profile image deleted successfully",
                });
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Internal server error";
            console.log(message);
            return res.status(statusCode.SERVER_ERROR).json({
                success: false,
                message: `Internal server error: ${message}`,
            });
        }
    };
    /**
     * @param {Request}req
     * @param {Response} res
     * @description change the user password
     */
    changeUserPassword = async (req, res) => {
        const { id: userId } = req.user;
        const { password, newPassword, confirmPassword } = req.body;
        try {
            //validate user credentials
            const { message, isValid } = validator.validatePasswordChange(password, newPassword, confirmPassword);
            if (!isValid)
                return res
                    .status(statusCode.BAD_REQUEST)
                    .json({ success: false, message });
            //check if the user exists
            const user = await db.user.findUnique({ where: { id: userId } });
            if (!user)
                return res.status(statusCode.NOT_FOUND).json({
                    success: false,
                    message: "User not found",
                });
            //check if the correctness of the old  password
            const isMatched = await bcrypt.compare(password, user.password);
            if (!isMatched) {
                return res.status(statusCode.BAD_REQUEST).json({
                    success: false,
                    message: "Old password is incorrect",
                });
            }
            //encrypt the new password
            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            await db.user.update({
                where: { id: userId },
                data: { password: hashedPassword },
            });
            return res
                .status(statusCode.OK)
                .json({ success: true, message: "Password changed successfully" });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Internal server error";
            console.log(message);
            return res.status(statusCode.SERVER_ERROR).json({
                success: false,
                message: `Internal server error: ${message}`,
            });
        }
    };
}
//# sourceMappingURL=profile.controller.js.map