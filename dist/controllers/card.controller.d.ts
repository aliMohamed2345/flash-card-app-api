import type { Request, Response } from "express";
export declare class CardController {
    /**
     *
     * @param req
     * @param res
     * @returns get all user cards
     */
    /**
     * @swagger
     * /api/v1/decks/{deckId}/cards:
     *   get:
     *     summary: Get all flashcards of a deck
     *     description: Returns all flashcards in a deck. Only the owner or admin can access private decks.
     *     tags:
     *       - Flashcards
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: deckId
     *         required: true
     *         schema:
     *           type: string
     *         description: Deck ID
     *     responses:
     *       200:
     *         description: List of flashcards retrieved
     *       401:
     *         description: Unauthorized
     *       404:
     *         description: No deck or flashcards found
     *       500:
     *         description: Internal server error
     */
    getAllFlashCardsDeck: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    /**
     *
     * @param req
     * @param res
     * @description create a new flashcard
     */
    /**
     * @swagger
     * /api/v1/decks/{deckId}/cards:
     *   post:
     *     summary: Create a new flashcard
     *     description: Add a new flashcard to a deck. Only the owner or admin can create flashcards in a deck.
     *     tags:
     *       - Flashcards
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
     *               front:
     *                 type: string
     *               back:
     *                 type: string
     *               hint:
     *                 type: string
     *                 nullable: true
     *     responses:
     *       201:
     *         description: Flashcard created successfully
     *       400:
     *         description: Invalid data or flashcard already exists
     *       401:
     *         description: Unauthorized
     *       404:
     *         description: Deck not found
     *       500:
     *         description: Internal server error
     */
    createNewFlashCard: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     *
     * @param req
     * @param res
     * @description delete a flashcard
     */
    /**
     * @swagger
     * /api/v1/decks/{deckId}/cards/{cardId}:
     *   delete:
     *     summary: Delete a flashcard
     *     description: Deletes a flashcard. Only the owner or admin can delete.
     *     tags:
     *       - Flashcards
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: deckId
     *         required: true
     *         schema:
     *           type: string
     *       - in: path
     *         name: cardId
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Flashcard deleted successfully
     *       401:
     *         description: Unauthorized
     *       404:
     *         description: Flashcard not found
     *       500:
     *         description: Internal server error
     */
    deleteFlashCard: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     *
     * @param req
     * @param res
     * @description get a flashcard
     */
    /**
     * @swagger
     * /api/v1/decks/{deckId}/cards/{cardId}:
     *   get:
     *     summary: Get a flashcard by ID
     *     description: Returns a single flashcard. Only the owner or admin can access.
     *     tags:
     *       - Flashcards
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: deckId
     *         required: true
     *         schema:
     *           type: string
     *       - in: path
     *         name: cardId
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Flashcard retrieved successfully
     *       401:
     *         description: Unauthorized
     *       404:
     *         description: Flashcard not found
     *       500:
     *         description: Internal server error
     */
    getFlashCard: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     *
     * @param req
     * @param res
     * @default update flashcard
     */
    /**
     * @swagger
     * /api/v1/decks/{deckId}/cards/{cardId}:
     *   put:
     *     summary: Update a flashcard
     *     description: Updates the content of a flashcard. Only the owner or admin can update.
     *     tags:
     *       - Flashcards
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: deckId
     *         required: true
     *         schema:
     *           type: string
     *       - in: path
     *         name: cardId
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               front:
     *                 type: string
     *               back:
     *                 type: string
     *               hint:
     *                 type: string
     *                 nullable: true
     *     responses:
     *       200:
     *         description: Flashcard updated successfully
     *       401:
     *         description: Unauthorized
     *       404:
     *         description: Flashcard not found
     *       500:
     *         description: Internal server error
     */
    updateFlashCard: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=card.controller.d.ts.map