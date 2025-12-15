import { Request, Response } from "express";
export declare class UsersController {
    /**
     * @param {Request} req
     * @param {Response} res
     * @returns return all the users in the database with a some filters and pagination functions
     *
     */
    getAllUsers: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     * getSpecificUser
     * @param {Request} req
     * @param {Response} res
     * @description get a specific user
     */
    getSpecificUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     *
     * @param {Request} req
     * @param {Response} res
     * @description update the current user role
     */
    toggleRole: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     *
     * @param {Request} req
     * @param {Response} res
     * @returns delete the user by admins only
     */
    deleteUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     * @todo add the functionality of this code with it's pagination query string
     *
     */
    getPublicUserDeck: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=users.controller.d.ts.map