import type { Request, Response } from "express";
export declare class CardController {
    /**
     *
     * @param req
     * @param res
     * @returns get all user cards
     */
    getAllFlashCardsDeck: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    /**
     *
     * @param req
     * @param res
     * @description create a new flashcard
     */
    createNewFlashCard: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     *
     * @param req
     * @param res
     * @description delete a flashcard
     */
    deleteFlashCard: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     *
     * @param req
     * @param res
     * @description get a flashcard
     */
    getFlashCard: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     *
     * @param req
     * @param res
     * @default update flashcard
     */
    updateFlashCard: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=card.controller.d.ts.map