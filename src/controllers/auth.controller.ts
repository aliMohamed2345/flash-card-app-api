import { statusCode } from "../utils/status-code.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../utils/env-config.js";
import { Validators } from "../lib/validators.js";
import type { Request, Response } from "express";
import { TokenPayload } from "../lib/middlewares.js";
import db from "../lib/prisma.js";
const Validator = new Validators();
class AuthController {
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
  public login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      //validate the user credentials
      const { isValid, message } = Validator.validateLogin(email, password);
      if (!isValid)
        return res
          .status(statusCode.BAD_REQUEST)
          .json({ success: false, message });

      // const user = await db.user.findUnique({ where: { email }, select: { password: false, isAdmin: false, email: true, username: true, id: true } })
      const user = await db.user.findUnique({ where: { email } });
      if (!user)
        return res
          .status(statusCode.NOT_FOUND)
          .json({ success: false, message: "User not found" });

      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch)
        res
          .status(statusCode.BAD_REQUEST)
          .json({ success: false, message: "Invalid password" });

      this.generateToken(res, user.id, user.isAdmin);

      return res.status(statusCode.OK).json({
        success: true,
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
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Internal server error";
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
  public signup = async (req: Request, res: Response) => {
    try {
      const { email, password, username } = req.body;
      //validate the user credentials
      const { isValid, message } = Validator.validateSignup(
        username,
        email,
        password
      );
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
          success: false,
          message: "User already exists, please login",
        });

      //hash the password
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await db.user.create({
        data: { email, password: hashedPassword, username },
      });
      this.generateToken(res, newUser.id, newUser.isAdmin);

      return res
        .status(statusCode.CREATED)
        .json({ success: true, message: "User created successfully", newUser });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Internal server error";
      console.log(message);
      return res.status(statusCode.SERVER_ERROR).json({
        status: false,
        message: `Internal server error: ${message}`,
      });
    }
  };

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
  public logout = (req: Request, res: Response) => {
    try {
      res.clearCookie("token");
      return res
        .status(statusCode.OK)
        .json({ success: true, message: `Logout successfully` });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Internal server error";
      console.log(message);
      return res.status(statusCode.SERVER_ERROR).json({
        success: false,
        message: `Internal server error: ${message}`,
      });
    }
  };

  /**
   *
   * @param res
   * @param id current user id
   * @param isAdmin checking weather the user admin or not
   * @param numberOfDays optional parameter of handle the cookie age
   * @returns private method that generate the user token
   */
  private generateToken = (
    res: Response,
    id: string,
    isAdmin: Boolean,
    numberOfDays: number = 1
  ) => {
    const token = jwt.sign({ id, isAdmin }, config.jwtSecret as string, {
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
