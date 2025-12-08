import type { Request, Response } from "express";
export declare class ProfileController {
    /**
     * updateUserData
     * @param {Request} req
     * @param {Response} res
     * @description update the user data
     */
    updateUserData: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     *
     * @param req
     * @param res
     * @returns get the current user profile
     */
    profile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     *
     * @param  {Request} req
     * @param {Response} res
     * @description delete the current user account
     */
    deleteCurrentUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     * @param  {Request} req
     * @param {Response} res
     * @description upload the user profile image
     */
    uploadProfileImage: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * @param {Request} req
     * @param {Response} res
     * @description delete the user profile image
     */
    deleteProfileImage: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * @param {Request}req
     * @param {Response} res
     * @description change the user password
     */
    changeUserPassword: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=profile.controller.d.ts.map