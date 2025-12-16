import { Request, Response } from "express";
export declare class UsersController {
    /**
     * @param {Request} req
     * @param {Response} res
     * @returns return all the users in the database with a some filters and pagination functions
     *
     */
    /**
     * @swagger
     * /api/v1/users:
     *   get:
     *     summary: Get all users
     *     description: Returns all users with optional filters and pagination. Admin only.
     *     tags:
     *       - Users
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *         description: Page number
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *         description: Number of users per page
     *       - in: query
     *         name: q
     *         schema:
     *           type: string
     *         description: Search query for username or email
     *       - in: query
     *         name: isAdmin
     *         schema:
     *           type: boolean
     *         description: Filter by admin role
     *     responses:
     *       200:
     *         description: Users retrieved successfully
     *       400:
     *         description: Invalid query parameters
     *       404:
     *         description: No users found
     *       500:
     *         description: Internal server error
     */
    getAllUsers: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     * getSpecificUser
     * @param {Request} req
     * @param {Response} res
     * @description get a specific user
     */
    /**
     * @swagger
     * /api/v1/users/{id}:
     *   get:
     *     summary: Get a specific user
     *     description: Returns a specific user's details. Email and admin fields are only visible to the user themselves or an admin.
     *     tags:
     *       - Users
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: User ID
     *     responses:
     *       200:
     *         description: User retrieved successfully
     *       404:
     *         description: User not found
     *       500:
     *         description: Internal server error
     */
    getSpecificUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     *
     * @param {Request} req
     * @param {Response} res
     * @description update the current user role
     */
    /**
     * @swagger
     * /api/v1/users/{id}/role:
     *   post:
     *     summary: Toggle user role
     *     description: Admins can toggle a user's role between user and admin. Users cannot toggle their own role.
     *     tags:
     *       - Users
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: User ID
     *     responses:
     *       200:
     *         description: User role updated successfully
     *       400:
     *         description: Invalid request or cannot toggle own role
     *       404:
     *         description: User not found
     *       500:
     *         description: Internal server error
     */
    toggleRole: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     *
     * @param {Request} req
     * @param {Response} res
     * @returns delete the user by admins only
     */
    /**
     * @swagger
     * /api/v1/users/{id}:
     *   delete:
     *     summary: Delete a user
     *     description: Admins can delete a user. Cannot delete self or admin users.
     *     tags:
     *       - Users
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: User ID
     *     responses:
     *       200:
     *         description: User deleted successfully
     *       400:
     *         description: Cannot delete yourself or admin user
     *       404:
     *         description: User not found
     *       500:
     *         description: Internal server error
     */
    deleteUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     *
     * @param req
     * @param res
     * @returns public deck of a user
     */
    /**
     * @swagger
     * /api/v1/users/{id}/deck:
     *   get:
     *     summary: Get public decks of a user
     *     description: Returns all public decks of a specific user with pagination and search query
     *     tags:
     *       - Users
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: User ID
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *         description: Page number
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *         description: Number of decks per page
     *       - in: query
     *         name: q
     *         schema:
     *           type: string
     *         description: Search query
     *     responses:
     *       200:
     *         description: Public decks retrieved successfully
     *       400:
     *         description: Invalid query parameters
     *       404:
     *         description: No decks found
     *       500:
     *         description: Internal server error
     */
    getPublicUserDeck: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     *
     * @param req
     * @param res
     * @returns get user deck by deckId
     */
    /**
     * @swagger
     * /api/v1/users/{id}/deck/{deckId}:
     *   get:
     *     summary: Get specific user deck
     *     description: Returns a specific deck of a user. Only accessible if deck is public.
     *     tags:
     *       - Users
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: User ID
     *       - in: path
     *         name: deckId
     *         required: true
     *         schema:
     *           type: string
     *         description: Deck ID
     *     responses:
     *       200:
     *         description: Deck retrieved successfully
     *       401:
     *         description: Unauthorized access
     *       404:
     *         description: Deck not found
     *       500:
     *         description: Internal server error
     */
    getSpecificUserDeck: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     *
     * @param req
     * @param res
     * @returns return user deck stats
     */
    /**
     * @swagger
     * /api/v1/users/{id}/deck/stats:
     *   get:
     *     summary: Get user stats
     *     description: Returns deck and card statistics for a specific user
     *     tags:
     *       - Users
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: User ID
     *     responses:
     *       200:
     *         description: User stats retrieved successfully
     *       404:
     *         description: User not found
     *       500:
     *         description: Internal server error
     */
    getUserStats: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=users.controller.d.ts.map