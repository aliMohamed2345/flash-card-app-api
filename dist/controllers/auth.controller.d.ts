import type { Request, Response } from "express";
declare class AuthController {
    /**
     *
     * @param req
     * @param res
     * @returns handle the login process
     */
    login: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     *
     * @param req
     * @param res
     * @returns handle signup process
     */
    signup: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     *
     * @param req
     * @param res
     * @returns get the current user profile
     */
    profile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     *
     * @param req
     * @param res
     * @returns handle the logout process to the current user
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