import { statusCode } from "../utils/status-code.js";
import db from "../lib/prisma.js";
import { Validators } from "../lib/validators.js";
const validator = new Validators();
export class CardController {
    /**
     *
     * @param req
     * @param res
     * @returns get all user cards
     */
    getAllFlashCardsDeck = async (req, res) => {
        const { deckId } = req.params;
        const { id: userId, isAdmin } = req.user;
        try {
            const card = await db.flashcard.findFirst({
                where: { deckId },
                select: { ownerId: true },
            });
            if (!card)
                return res
                    .status(statusCode.NOT_FOUND)
                    .json({ success: false, message: "No deck found" });
            if (card?.ownerId !== userId && !isAdmin)
                return res.status(statusCode.UNAUTHORIZED).json({
                    success: false,
                    message: `Unauthorized:You Don't have access to this deck`,
                });
            const cards = await db.flashcard.findMany({ where: { deckId } });
            if (!cards || cards.length === 0)
                return res
                    .status(statusCode.NOT_FOUND)
                    .json({ success: false, message: "No cards found" });
            const cardsNumber = await db.flashcard.count({
                where: { deckId, ownerId: userId },
            });
            res.status(statusCode.OK).json({
                success: true,
                cardsNumber,
                cards,
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Internal server error";
            console.log(message);
            return res.status(statusCode.SERVER_ERROR).json({
                success: false,
                message: `Internal server error: ${message}`,
            });
        }
    };
    /**
     *
     * @param req
     * @param res
     * @description create a new flashcard
     */
    createNewFlashCard = async (req, res) => {
        const { id: userId, isAdmin } = req.user;
        const { front, back, hint } = req.body;
        const { deckId } = req.params;
        try {
            const { isValid, message } = validator.validateFlashCard(front, back, hint);
            if (!isValid)
                return res
                    .status(statusCode.BAD_REQUEST)
                    .json({ success: false, message: message });
            const ifCardExist = await db.flashcard.findFirst({
                where: { deckId, front, back },
                select: { id: true },
            });
            if (ifCardExist)
                return res
                    .status(statusCode.BAD_REQUEST)
                    .json({ success: false, message: "Flashcard already exist" });
            const deck = await db.deck.findUnique({
                where: { id: deckId },
                select: { ownerId: true },
            });
            if (!deck)
                return res
                    .status(statusCode.NOT_FOUND)
                    .json({ success: false, message: "Deck not found" });
            if (deck?.ownerId !== userId && !isAdmin)
                return res.status(statusCode.UNAUTHORIZED).json({
                    success: false,
                    message: `Unauthorized:You Don't have access to create a flashcard`,
                });
            const flashcard = await db.flashcard.create({
                data: { front, back, hint, deckId, ownerId: userId },
            });
            return res.status(statusCode.CREATED).json({
                success: true,
                message: "Flashcard created successfully",
                flashcard,
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Internal server error";
            console.log(message);
            return res.status(statusCode.SERVER_ERROR).json({
                success: false,
                message: `Internal server error: ${message}`,
            });
        }
    };
    /**
     *
     * @param req
     * @param res
     * @description delete a flashcard
     */
    deleteFlashCard = async (req, res) => {
        const { cardId } = req.params;
        const { id: userId, isAdmin } = req.user;
        try {
            const card = await db.flashcard.findUnique({
                where: { id: cardId },
                select: { ownerId: true },
            });
            if (!card)
                return res
                    .status(statusCode.NOT_FOUND)
                    .json({ success: false, message: "Flashcard not found" });
            if (card.ownerId !== userId && !isAdmin)
                return res.status(statusCode.UNAUTHORIZED).json({
                    success: false,
                    message: "Unauthorized: You don't have access to delete this flashcard",
                });
            await db.flashcard.delete({ where: { id: cardId } });
            return res.status(statusCode.OK).json({
                success: true,
                message: "Flashcard deleted successfully",
            });
        }
        catch (error) {
            return res
                .status(statusCode.SERVER_ERROR)
                .json({ success: false, message: "Internal server error" });
        }
    };
    /**
     *
     * @param req
     * @param res
     * @description get a flashcard
     */
    getFlashCard = async (req, res) => {
        const { cardId } = req.params;
        const { id: userId, isAdmin } = req.user;
        try {
            const card = await db.flashcard.findUnique({ where: { id: cardId } });
            if (!card)
                return res
                    .status(statusCode.NOT_FOUND)
                    .json({ success: false, message: "Card not found" });
            if (card.ownerId !== userId && !isAdmin)
                return res.status(statusCode.UNAUTHORIZED).json({
                    success: false,
                    message: "Unauthorized:You Don't have access to this card",
                });
            return res.status(statusCode.OK).json({ success: true, card });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Internal server error";
            console.log(message);
            return res
                .status(statusCode.SERVER_ERROR)
                .json({ success: false, message: `Internal Server error: ${message}` });
        }
    };
    /**
     *
     * @param req
     * @param res
     * @default update flashcard
     */
    updateFlashCard = async (req, res) => {
        const { front, back, hint } = req.body;
        const { cardId } = req.params;
        const { id: userId, isAdmin } = req.user;
        try {
            const card = await db.flashcard.findUnique({ where: { id: cardId } });
            if (!card)
                return res
                    .status(statusCode.NOT_FOUND)
                    .json({ success: false, message: "Card not found" });
            if (card.ownerId !== userId && !isAdmin)
                return res.status(statusCode.UNAUTHORIZED).json({
                    success: false,
                    message: "Unauthorized:You Don't have access to this card",
                });
            const updatedCard = await db.flashcard.update({
                where: { id: cardId },
                data: { front, back, hint },
            });
            return res.status(statusCode.OK).json({
                success: true,
                message: "Flashcard updated successfully",
                card: updatedCard,
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Internal server error";
            console.log(message);
            return res
                .status(statusCode.SERVER_ERROR)
                .json({ success: false, message: `Internal Server error: ${message}` });
        }
    };
}
//# sourceMappingURL=card.controller.js.map