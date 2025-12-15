import { Request, Response } from "express";
export declare class DeckController {
    /**
     * @param req
     * @param res
     * getAllUserDeck
     */
    getAllUserDeck: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     *
     * @param req
     * @param res
     * @description for create a new deck
     */
    createNewDeck: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     *
     * @param req
     * @param res
     * @returns user specific deck
     */
    getSpecificDeck: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     *
     * @param req
     * @param res
     * @returns updated user deck
     */
    updateUserDeck: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    /**
     *
     * @param req
     * @param res
     * @returns delete the current user deck only (except admin)
     */
    deleteUserDeck: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     *
     * @param req
     * @param res
     * @returns toggle the deck visibility
     */
    toggleDeckVisibility: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     * @param req
     * @param res
     * @returns export the deck data as json file
     */
    downloadDeckJson: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     *
     * @param req
     * @param res
     * @returns return an excel version of the deck
     */
    downloadDeckExcel: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     * @param req
     * @param res
     * @returns get user stats about the deck
     */
    getUserStats: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=deck.controller.d.ts.map