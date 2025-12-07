import type { Request, Response, NextFunction } from "express";
declare module "express-serve-static-core" {
    interface Request {
        user?: {
            id: string;
            isAdmin: boolean;
        };
    }
}
declare class Middlewares {
    verifyToken: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
}
export default Middlewares;
//# sourceMappingURL=middlewares.d.ts.map