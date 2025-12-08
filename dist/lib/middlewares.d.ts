import type { Request, Response, NextFunction } from "express";
import multer from "multer";
declare module "express-serve-static-core" {
    interface Request {
        user?: {
            id: string;
            isAdmin: boolean;
        };
    }
}
export declare class Middlewares {
    /**
     *
     * @param req
     * @param res
     * @param next
     * @returns checking the token existence before start with any operations
     */
    verifyToken: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    /**
     *
     * @param req
     * @param res
     * @param next
     * @returns checking weather the user admin or no
     */
    isAdmin: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
}
export declare class UploadService {
    private storage;
    private fileFilter;
    upload: multer.Multer;
}
//# sourceMappingURL=middlewares.d.ts.map