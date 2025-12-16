import { Request, Response } from "express";
export declare class DeckController {
    /**
     * @param req
     * @param res
     * @returns all user deck
     */
    /**
     * @swagger
     * /api/v1/decks:
     *   get:
     *     summary: Get all user decks
     *     description: Returns all decks of the authenticated user with optional pagination, search, and visibility filters.
     *     tags:
     *       - Decks
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *         description: Page number
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *         description: Number of decks per page
     *       - in: query
     *         name: q
     *         schema:
     *           type: string
     *         description: Search query for title or description
     *       - in: query
     *         name: isPublic
     *         schema:
     *           type: boolean
     *         description: Filter by public/private decks
     *     responses:
     *       200:
     *         description: Decks retrieved successfully
     *       400:
     *         description: Invalid query parameters
     *       404:
     *         description: No decks found
     *       500:
     *         description: Internal server error
     */
    getAllUserDeck: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     *
     * @param req
     * @param res
     * @description for create a new deck
     */
    /**
     * @swagger
     * /api/v1/decks:
     *   post:
     *     summary: Create a new deck
     *     description: Creates a new deck for the authenticated user.
     *     tags:
     *       - Decks
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               title:
     *                 type: string
     *               description:
     *                 type: string
     *               isPublic:
     *                 type: boolean
     *     responses:
     *       201:
     *         description: Deck created successfully
     *       400:
     *         description: Invalid data or duplicate title
     *       500:
     *         description: Internal server error
     */
    createNewDeck: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     *
     * @param req
     * @param res
     * @returns user specific deck
     */
    /**
     * @swagger
     * /api/v1/decks/{deckId}:
     *   get:
     *     summary: Get a specific deck
     *     description: Returns a specific deck for the authenticated user. Supports pagination, search, and hint filtering.
     *     tags:
     *       - Decks
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: deckId
     *         required: true
     *         schema:
     *           type: string
     *         description: Deck ID
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *       - in: query
     *         name: q
     *         schema:
     *           type: string
     *       - in: query
     *         name: withHint
     *         schema:
     *           type: boolean
     *     responses:
     *       200:
     *         description: Deck retrieved successfully
     *       400:
     *         description: Invalid query parameters
     *       403:
     *         description: Forbidden, deck is private
     *       404:
     *         description: Deck not found
     *       500:
     *         description: Internal server error
     */
    getSpecificDeck: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     *
     * @param req
     * @param res
     * @returns updated user deck
     */
    /**
     * @swagger
     * /api/v1/decks/{deckId}:
     *   put:
     *     summary: Update a user deck
     *     description: Updates the title and description of a deck. Only the owner or admin can update.
     *     tags:
     *       - Decks
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: deckId
     *         required: true
     *         schema:
     *           type: string
     *         description: Deck ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               title:
     *                 type: string
     *               description:
     *                 type: string
     *     responses:
     *       200:
     *         description: Deck updated successfully
     *       400:
     *         description: Invalid data
     *       403:
     *         description: Unauthorized
     *       404:
     *         description: Deck not found
     *       500:
     *         description: Internal server error
     */
    updateUserDeck: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    /**
     *
     * @param req
     * @param res
     * @returns delete the current user deck only (except admin)
     */
    /**
     * @swagger
     * /api/v1/decks/{deckId}:
     *   delete:
     *     summary: Delete a user deck
     *     description: Deletes a deck. Only the owner or admin can delete.
     *     tags:
     *       - Decks
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: deckId
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Deck deleted successfully
     *       401:
     *         description: Unauthorized
     *       404:
     *         description: Deck not found
     *       500:
     *         description: Internal server error
     */
    deleteUserDeck: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     *
     * @param req
     * @param res
     * @returns toggle the deck visibility
     */
    /**
     * @swagger
     * /api/v1/decks/{deckId}/visibility:
     *   put:
     *     summary: Toggle deck visibility
     *     description: Change a deck from public to private or vice versa. Only the owner or admin can toggle visibility.
     *     tags:
     *       - Decks
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: deckId
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Deck visibility updated successfully
     *       401:
     *         description: Unauthorized
     *       404:
     *         description: Deck not found
     *       500:
     *         description: Internal server error
     */
    toggleDeckVisibility: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     * @param req
     * @param res
     * @returns export the deck data as json file
     */
    /**
   * @swagger
   * /api/v1/decks/{deckId}/export/json:
   *   get:
   *     summary: Download deck as JSON
   *     description: Export a deck as a JSON file. Only the owner or admin can download private decks.
   *     tags:
   *       - Decks
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: deckId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       201:
   *         description: JSON file created successfully
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Deck not found
   *       500:
   *         description: Internal server error
   */
    downloadDeckJson: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     *
     * @param req
     * @param res
     * @returns return an excel version of the deck
     */
    /**
     * @swagger
     * /api/v1/decks/{deckId}/export/excel:
     *   get:
     *     summary: Download deck as Excel
     *     description: Export a deck as an Excel file. Only the owner or admin can download private decks.
     *     tags:
     *       - Decks
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: deckId
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Excel file created successfully
     *       401:
     *         description: Unauthorized
     *       404:
     *         description: Deck not found or deck is empty
     *       500:
     *         description: Internal server error
     */
    downloadDeckExcel: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     * @param req
     * @param res
     * @returns get user stats about the deck
     */
    /**
     * @swagger
     * /api/v1/decks/stats:
     *   get:
     *     summary: Get deck statistics for user
     *     description: Returns total decks, public decks, private decks, and total cards for the authenticated user.
     *     tags:
     *       - Decks
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Stats retrieved successfully
     *       500:
     *         description: Internal server error
     */
    getUserStats: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=deck.controller.d.ts.map