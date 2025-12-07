import { statusCode } from "../utils/status-code.js";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../utils/env-config.js";
import { Validators } from "../lib/validators.js";
const db = new PrismaClient();
const Validator = new Validators();
class AuthController {
    login = async (req, res) => {
        try {
            const { email, password } = req.body;
            //validate the user credentials
            const { isValid, message } = Validator.validateLogin(email, password);
            if (!isValid)
                return res
                    .status(statusCode.BAD_REQUEST)
                    .json({ status: false, message });
            // const user = await db.user.findUnique({ where: { email }, select: { password: false, isAdmin: false, email: true, username: true, id: true } })
            const user = await db.user.findUnique({ where: { email } });
            if (!user)
                return res
                    .status(statusCode.NOT_FOUND)
                    .json({ status: false, message: "User not found" });
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (!isPasswordMatch)
                res
                    .status(statusCode.BAD_REQUEST)
                    .json({ status: false, message: "Invalid password" });
            this.#generateToken(res, user.id, user.isAdmin);
            return res.status(statusCode.OK).json({
                status: true,
                message: `Login successfully`,
                user: {
                    email: user.email,
                    username: user.username,
                    bio: user.bio,
                    isAdmin: user.isAdmin,
                    id: user.id,
                    profileImg: user.profileImg,
                    createAt: user.createdAt,
                },
            });
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
    signup = async (req, res) => {
        try {
            const { email, password, username } = req.body;
            //validate the user credentials
            const { isValid, message } = Validator.validateSignup(username, email, password);
            if (!isValid)
                return res
                    .status(statusCode.BAD_REQUEST)
                    .json({ success: false, message });
            //check if the user exist
            const user = await db.user.findUnique({
                where: { email },
                select: {
                    password: false,
                    isAdmin: false,
                    email: true,
                    username: true,
                    id: true,
                },
            });
            if (user)
                return res.status(statusCode.CONFLICT).json({
                    status: false,
                    message: "User already exists, please login",
                });
            //hash the password
            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(password, salt);
            const newUser = await db.user.create({
                data: { email, password: hashedPassword, username },
            });
            this.#generateToken(res, newUser.id, newUser.isAdmin);
            return res
                .status(statusCode.CREATED)
                .json({ status: true, message: "User created successfully", newUser });
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
    profile = async (req, res) => {
        try {
            const { id: userId } = req.user;
            //checking if the user exist
            const user = await db.user.findUnique({
                where: { id: userId },
                select: {
                    password: false,
                    isAdmin: false,
                    email: true,
                    username: true,
                    id: true,
                    bio: true,
                    createdAt: true,
                    profileImg: true,
                    updatedAt: true,
                },
            });
            if (!user)
                return res
                    .status(statusCode.NOT_FOUND)
                    .json({ status: false, message: "User not found" });
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
    logout = (req, res) => {
        try {
            res.clearCookie("token");
            return res
                .status(statusCode.OK)
                .json({ success: true, message: `Logout successfully` });
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
    #generateToken = (res, id, isAdmin, numberOfDays = 1) => {
        const token = jwt.sign({ id, isAdmin }, config.jwtSecret, {
            expiresIn: "1d",
        });
        res.cookie("token", token, {
            httpOnly: true, //only allow the server to access the cookie and preventing the XSS Attacks
            sameSite: "strict", //prevents the cookie from being sent to other sites
            secure: process.env.NODE_ENV === "production", //only allow the cookie to be sent over HTTPS
            maxAge: numberOfDays * 24 * 60 * 60 * 1000, //max age 1 days
        });
    };
}
export default AuthController;
//# sourceMappingURL=auth.controller.js.map