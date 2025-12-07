import type { Request, Response } from "express";
declare class AuthController {
    #private;
    login: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    signup: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    profile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    logout: (req: Request, res: Response) => Response<any, Record<string, any>>;
}
export default AuthController;
//# sourceMappingURL=auth.controller.d.ts.map