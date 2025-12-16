import type { Request, Response } from "express";
export declare class ProfileController {
    /**
     * updateUserData
     * @param {Request} req
     * @param {Response} res
     * @description update the user data
     */
    /**
     * @swagger
     * /api/v1/profile:
     *   put:
     *     summary: Update user data
     *     description: Update username, email, and bio of the logged-in user
     *     tags:
     *       - Profile
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               username:
     *                 type: string
     *               email:
     *                 type: string
     *               bio:
     *                 type: string
     *     responses:
     *       200:
     *         description: User updated successfully
     *       400:
     *         description: Invalid input
     *       404:
     *         description: User not found
     *       500:
     *         description: Internal server error
     */
    updateUserData: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     *
     * @param req
     * @param res
     * @returns get the current user profile
     */
    /**
     * @swagger
     * /api/v1/profile:
     *   get:
     *     summary: Get current user profile
     *     description: Returns the profile information of the logged-in user
     *     tags:
     *       - Profile
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: User profile retrieved successfully
     *       404:
     *         description: User not found
     *       500:
     *         description: Internal server error
     */
    profile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     *
     * @param  {Request} req
     * @param {Response} res
     * @description delete the current user account
     */
    /**
     * @swagger
     * /api/v1/profile:
     *   delete:
     *     summary: Delete current user
     *     description: Deletes the logged-in user's account
     *     tags:
     *       - Profile
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: User deleted successfully
     *       500:
     *         description: Internal server error
     */
    deleteCurrentUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     * @param  {Request} req
     * @param {Response} res
     * @description upload the user profile image
     */
    /**
     * @swagger
     * /api/v1/profile/upload-image:
     *   post:
     *     summary: Upload profile image
     *     description: Uploads a profile image for the logged-in user
     *     tags:
     *       - Profile
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               image:
     *                 type: string
     *                 format: binary
     *     responses:
     *       200:
     *         description: Image uploaded successfully
     *       400:
     *         description: No file uploaded
     *       500:
     *         description: Internal server error
     */
    uploadProfileImage: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * @param {Request} req
     * @param {Response} res
     * @description delete the user profile image
     */
    /**
     * @swagger
     * /api/v1/profile/upload-image:
     *   post:
     *     summary: Upload profile image
     *     description: Uploads a profile image for the logged-in user
     *     tags:
     *       - Profile
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               image:
     *                 type: string
     *                 format: binary
     *     responses:
     *       200:
     *         description: Image uploaded successfully
     *       400:
     *         description: No file uploaded
     *       500:
     *         description: Internal server error
     */
    deleteProfileImage: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * @param {Request}req
     * @param {Response} res
     * @description change the user password
     */
    /**
     * @swagger
     * /api/v1/profile/change-password:
     *   put:
     *     summary: Change user password
     *     description: Allows a user to change their password
     *     tags:
     *       - Profile
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               password:
     *                 type: string
     *               newPassword:
     *                 type: string
     *               confirmPassword:
     *                 type: string
     *     responses:
     *       200:
     *         description: Password changed successfully
     *       400:
     *         description: Invalid input / old password incorrect
     *       404:
     *         description: User not found
     *       500:
     *         description: Internal server error
     */
    changeUserPassword: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=profile.controller.d.ts.map