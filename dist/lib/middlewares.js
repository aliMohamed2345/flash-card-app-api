import { config } from "../utils/env-config.js";
import { statusCode } from "../utils/status-code.js";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
const db = new PrismaClient();
export class Middlewares {
    /**
     *
     * @param req
     * @param res
     * @param next
     * @returns checking the token existence before start with any operations
     */
    verifyToken = (req, res, next) => {
        try {
            const token = req.cookies?.token;
            if (!token)
                return res
                    .status(statusCode.UNAUTHORIZED)
                    .json({ success: false, message: "Unauthorized:No token provided" });
            const decoded = jwt.verify(token, config.jwtSecret);
            req.user = decoded;
            next();
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Invalid Token";
            console.log(`invalid Token:${message}`);
            return res
                .status(statusCode.UNAUTHORIZED)
                .json({ success: false, message: `Unauthorized:${message}` });
        }
    };
    /**
     *
     * @param req
     * @param res
     * @param next
     * @returns checking weather the user admin or no
     */
    isAdmin = async (req, res, next) => {
        const { id: userId } = req.user;
        try {
            const user = await db.user.findUnique({
                where: { id: userId },
                select: { isAdmin: true },
            });
            if (!user)
                return res
                    .status(statusCode.NOT_FOUND)
                    .json({ success: false, message: "User not found" });
            if (!user.isAdmin)
                return res
                    .status(statusCode.UNAUTHORIZED)
                    .json({ success: false, message: "Unauthorized:User is not admin" });
            next();
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Invalid Token";
            console.log(`invalid Token:${message}`);
            return res
                .status(statusCode.UNAUTHORIZED)
                .json({ success: false, message: `Unauthorized:${message}` });
        }
    };
}
export class UploadService {
    storage = multer.memoryStorage();
    // Use arrow function to preserve 'this' and get correct typing
    fileFilter = (req, file, cb) => {
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true); // allow file
        }
        else {
            cb(null, false); // reject file
            console.log("only image files are allowed");
        }
    };
    upload = multer({
        storage: this.storage,
        fileFilter: this.fileFilter, // no need to bind when using arrow function
    });
}
//# sourceMappingURL=middlewares.js.map