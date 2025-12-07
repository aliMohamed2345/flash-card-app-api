import type { Request, Response, NextFunction } from "express";
export declare const globalErrorHandler: (err: Error, req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
export declare const NotFoundMiddleware: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
//# sourceMappingURL=globalErrorHandlers.d.ts.map