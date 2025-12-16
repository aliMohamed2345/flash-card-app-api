import type { Request, Response } from "express";
declare class AuthController {
    /**
     *
     * @param req
     * @param res
     * @returns handle the login process
     */
    /**
     * @swagger
     * /api/v1/auth/login:
     *   post:
     *     summary: Login user
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *             properties:
     *               email:
     *                 type: string
     *                 example: user@example.com
     *               password:
     *                 type: string
     *                 example: P@ssw0rd!
     *     responses:
     *       200:
     *         description: Login successful
     *       400:
     *         description: Invalid credentials
     *       404:
     *         description: User not found
     */
    login: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     *
     * @param req
     * @param res
     * @returns handle signup process
     */
    /**
     * @swagger
     * /api/v1/auth/signup:
     *   post:
     *     summary: Register new user
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - username
     *               - password
     *             properties:
     *               email:
     *                 type: string
     *                 example: user@example.com
     *               username:
     *                 type: string
     *                 example: ali_mansour
     *               password:
     *                 type: string
     *                 example: P@ssw0rd!
     *     responses:
     *       201:
     *         description: User created successfully
     *       400:
     *         description: Validation error
     *       409:
     *         description: User already exists
     */
    signup: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     *
     * @param req
     * @param res
     * @returns handle the logout process to the current user
     */
    /**
     * @swagger
     * /api/v1/auth/logout:
     *   post:
     *     summary: Logout current user
     *     tags: [Auth]
     *     security:
     *       - cookieAuth: []
     *     responses:
     *       200:
     *         description: Logout successful
     *       401:
     *         description: Unauthorized
     */
    logout: (req: Request, res: Response) => Response<any, Record<string, any>>;
    /**
     *
     * @param res
     * @param id current user id
     * @param isAdmin checking weather the user admin or not
     * @param numberOfDays optional parameter of handle the cookie age
     * @returns private method that generate the user token
     */
    private generateToken;
}
export default AuthController;
//# sourceMappingURL=auth.controller.d.ts.map