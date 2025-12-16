import { statusCode } from "../utils/status-code.js";
import { Validators } from "../lib/validators.js";
import db from "../lib/prisma.js";
const validator = new Validators();
export class UsersController {
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
    getAllUsers = async (req, res) => {
        const { isAdmin, page = "1", q = "", limit = "10", } = req.query;
        try {
            const { isValid, message } = validator.validateUsersSearchQuery(isAdmin, page, q, limit);
            if (!isValid)
                return res
                    .status(statusCode.BAD_REQUEST)
                    .json({ success: false, message });
            const userPerPage = +limit || 10;
            const skip = +page * userPerPage - userPerPage;
            const isQString = typeof q === "string" ? q : "";
            const totalNumberOfUsers = await db.user.count({
                where: {
                    OR: [
                        { username: { contains: isQString } },
                        { email: { contains: isQString } },
                    ],
                    // check if isAdmin exist and return the users where isAdmin is true or false
                    ...(isAdmin !== undefined ? { isAdmin: isAdmin === "true" } : {}),
                },
            });
            const totalPage = Math.ceil(totalNumberOfUsers / userPerPage);
            if (+page > totalPage)
                return res.status(statusCode.BAD_REQUEST).json({
                    success: false,
                    message: `Invalid page value :page must be between 1 and ${totalPage}`,
                });
            //give the users where the username or email contains the query
            const users = await db.user.findMany({
                where: {
                    OR: [
                        { username: { contains: isQString } },
                        { email: { contains: isQString } },
                    ],
                    // check if isAdmin exist and return the users where isAdmin is true or false
                    ...(isAdmin !== undefined ? { isAdmin: isAdmin === "true" } : {}),
                },
                //take is the number of users that would be shown per page
                take: userPerPage,
                // skip will skip the users depend on the page
                skip,
                select: {
                    createdAt: true,
                    id: true,
                    profileImg: true,
                    isAdmin: true,
                    username: true,
                    email: true,
                },
            });
            if (users.length === 0)
                return res
                    .status(statusCode.NOT_FOUND)
                    .json({ success: false, message: "No users found" });
            return res.status(statusCode.OK).json({
                success: true,
                page: +page,
                totalPage,
                totalNumberOfUsers,
                users,
                userPerPage,
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
    getSpecificUser = async (req, res) => {
        const { id } = req.params;
        const { id: userId, isAdmin } = req.user;
        //for checking weather the user is admin or the user is the owner
        const isUserPermitted = userId === id || isAdmin;
        try {
            const user = await db.user.findUnique({
                where: { id },
                select: {
                    bio: true,
                    createdAt: true,
                    id: true,
                    profileImg: true,
                    updatedAt: true,
                    username: true,
                    email: isUserPermitted === true,
                    isAdmin: isUserPermitted === true,
                },
            });
            if (!user)
                return res
                    .status(statusCode.NOT_FOUND)
                    .json({ success: false, message: "User not found" });
            return res.status(statusCode.OK).json({
                success: true,
                user,
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
    toggleRole = async (req, res) => {
        try {
            const { id } = req.params;
            const { id: userId } = req.user;
            const userRole = await db.user.findUnique({
                where: { id },
                select: { isAdmin: true },
            });
            if (!userRole)
                return res.status(statusCode.NOT_FOUND).json({
                    success: false,
                    message: "User not found",
                });
            if (id === userId)
                return res.status(statusCode.BAD_REQUEST).json({
                    success: false,
                    message: "You can't toggle your own role",
                });
            const currentRole = await db.user.update({
                where: { id },
                data: { isAdmin: !userRole.isAdmin },
                select: { isAdmin: true },
            });
            return res.status(statusCode.OK).json({
                success: true,
                message: `user is now ${currentRole.isAdmin ? "admin" : "user"}`,
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
    deleteUser = async (req, res) => {
        try {
            const { id: userId } = req.user;
            const { id } = req.params;
            if (id === userId)
                return res
                    .status(statusCode.BAD_REQUEST)
                    .json({ success: false, message: "You can't delete yourself" });
            const user = await db.user.findUnique({ where: { id } });
            if (!user)
                return res.status(statusCode.NOT_FOUND).json({
                    success: false,
                    message: "User not found",
                });
            if (user.isAdmin)
                return res
                    .status(statusCode.BAD_REQUEST)
                    .json({ success: false, message: "You can't delete an admin" });
            await db.user.delete({ where: { id } });
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
    getPublicUserDeck = async (req, res) => {
        const { id } = req.params;
        const { page = "1", limit = "10", q = "" } = req.query;
        const { isValid, message } = validator.validatePublicUserDeckSearchQuery(String(page), String(limit), String(q));
        if (!isValid)
            return res
                .status(statusCode.BAD_REQUEST)
                .json({ success: false, message });
        const skip = (+page - 1) * +limit;
        try {
            const totalDecks = await db.deck.count({
                where: {
                    ownerId: id,
                    isPublic: true,
                    OR: [
                        { title: { contains: String(q) } },
                        { description: { contains: String(q) } },
                    ],
                },
            });
            const userDeck = await db.deck.findMany({
                where: {
                    ownerId: id,
                    isPublic: true,
                    OR: [
                        { title: { contains: String(q) } },
                        { description: { contains: String(q) } },
                    ],
                },
                skip,
                take: +limit,
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    createdAt: true,
                },
            });
            if (!userDeck || userDeck.length === 0)
                return res.status(statusCode.NOT_FOUND).json({
                    success: false,
                    message: "No deck found",
                });
            return res.status(statusCode.OK).json({
                success: true,
                decks: userDeck,
                totalDecks,
                page,
                limit,
                totalPages: Math.ceil(totalDecks / +limit),
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
    getSpecificUserDeck = async (req, res) => {
        const { deckId } = req.params;
        try {
            const deck = await db.deck.findUnique({
                where: { id: deckId },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    createdAt: true,
                    updatedAt: true,
                    cards: {
                        select: {
                            id: true,
                            front: true,
                            back: true,
                            createdAt: true,
                            updatedAt: true,
                            deckId: true,
                            hint: true,
                        },
                    },
                    isPublic: true,
                },
            });
            if (!deck)
                return res.status(statusCode.NOT_FOUND).json({
                    success: false,
                    message: "No deck found",
                });
            if (!deck.isPublic)
                return res.status(statusCode.UNAUTHORIZED).json({
                    success: false,
                    message: "Unauthorized:You Don't have access to this deck",
                });
            return res.status(statusCode.OK).json({ success: true, deck });
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
    getUserStats = async (req, res) => {
        const { id } = req.params;
        try {
            // Check if user exists
            const user = await db.user.findUnique({ where: { id } });
            if (!user) {
                return res.status(statusCode.NOT_FOUND).json({
                    success: false,
                    message: "User not found",
                });
            }
            // Count all decks for this user
            const totalDecks = await db.deck.count({ where: { ownerId: id } });
            // Count public decks
            const totalPublicDecks = await db.deck.count({
                where: { ownerId: id, isPublic: true },
            });
            // Count all cards for this user's decks
            const totalCards = await db.flashcard.count({
                where: { deck: { ownerId: id } },
            });
            // Count cards in public decks
            const totalCardsInPublicDecks = await db.flashcard.count({
                where: { deck: { ownerId: id, isPublic: true } },
            });
            return res.status(statusCode.OK).json({
                success: true,
                data: {
                    userId: id,
                    username: user.username,
                    totalDecks,
                    totalPublicDecks,
                    totalCards,
                    totalCardsInPublicDecks,
                },
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
}
//# sourceMappingURL=users.controller.js.map