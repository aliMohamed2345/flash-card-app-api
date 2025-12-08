import { PrismaClient } from "@prisma/client";
import { statusCode } from "../utils/status-code.js";
import { Validators } from "../lib/validators.js";
const db = new PrismaClient();
const validator = new Validators();
export class UsersController {
    /**
     * @param {Request} req
     * @param {Response} res
     * @returns return all the users in the database with a some filters and pagination functions
     *
     */
    getAllUsers = async (req, res) => {
        const { isAdmin, page = "1", q = "", userNumbers = "10", } = req.query;
        try {
            const { isValid, message } = validator.validateUsersSearchQuery(isAdmin, page, q, userNumbers);
            if (!isValid)
                return res
                    .status(statusCode.BAD_REQUEST)
                    .json({ success: false, message });
            const userPerPage = +userNumbers || 10;
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
}
//# sourceMappingURL=users.controller.js.map