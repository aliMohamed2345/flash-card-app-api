import db from "../lib/prisma.js";
import { statusCode } from "../utils/status-code.js";
import { Validators } from "../lib/validators.js";
import XLSX from "xlsx";
const validator = new Validators();
export class DeckController {
    /**
     * @param req
     * @param res
     * getAllUserDeck
     */
    getAllUserDeck = async (req, res) => {
        try {
            /**
             * @todo add pagination and sorting to this controller
             */
            const { id: userId } = req.user;
            const userDeck = await db.deck.findMany({
                where: { ownerId: userId },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    isPublic: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            if (!userDeck || userDeck.length === 0) {
                return res.status(statusCode.NOT_FOUND).json({
                    success: false,
                    message: "No deck found",
                });
            }
            return res.status(statusCode.OK).json({ success: true, data: userDeck });
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
     * @description for create a new deck
     */
    createNewDeck = async (req, res) => {
        const { id: userId } = req.user;
        const { title, description, isPublic } = req.body;
        try {
            const { message, isValid } = validator.validateDeckData(title, description, isPublic);
            if (!isValid)
                return res
                    .status(statusCode.BAD_REQUEST)
                    .json({ success: false, message });
            //check the uniqueness of the title of the deck
            const isDeckTitleExist = await db.deck.findFirst({
                where: { ownerId: userId, title },
                select: { id: true }, //minimal data to select
            });
            if (isDeckTitleExist || isDeckTitleExist === title)
                return res.status(statusCode.BAD_REQUEST).json({
                    success: false,
                    message: "Deck title already exist, please add another title",
                });
            const newDeck = await db.deck.create({
                data: {
                    title,
                    description,
                    isPublic: Boolean(isPublic),
                    ownerId: userId,
                },
            });
            return res
                .status(statusCode.CREATED)
                .json({ success: true, data: newDeck });
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
     * @returns user specific deck
     */
    getSpecificDeck = async (req, res) => {
        const { deckId } = req.params;
        const { id: userId } = req.user;
        /**
         * @todo add pagination and sorting to show the cards of the deck
         */
        try {
            const deck = await db.deck.findUnique({
                where: { id: deckId },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    isPublic: true,
                    createdAt: true,
                    updatedAt: true,
                    ownerId: true,
                    cards: true,
                },
            });
            if (!deck)
                return res
                    .status(statusCode.NOT_FOUND)
                    .json({ success: false, message: "Deck not found" });
            //check if the current user not the owner and the deck is private
            if (deck.isPublic === false && deck.ownerId !== userId)
                return res
                    .status(statusCode.FORBIDDEN)
                    .json({ success: false, message: "Cannot access: deck is private" });
            const cardsNumber = await db.flashcard.count({
                where: { deckId, ownerId: userId },
            });
            return res
                .status(statusCode.OK)
                .json({ success: true, data: deck, cardsNumber });
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
     * @returns updated user deck
     */
    updateUserDeck = async (req, res) => {
        const { title, description } = req.body;
        const { deckId } = req.params;
        const { id: userId, isAdmin } = req.user;
        try {
            const { isValid, message } = validator.validateUpdateDeckData(title, description);
            if (!isValid)
                return res
                    .status(statusCode.BAD_REQUEST)
                    .json({ success: false, message });
            const deck = await db.deck.findUnique({ where: { id: deckId } });
            if (!deck)
                return res
                    .status(statusCode.NOT_FOUND)
                    .json({ success: false, message: "Deck not found" });
            if (userId !== deck.ownerId && !isAdmin)
                return res.status(statusCode.FORBIDDEN).json({
                    success: false,
                    message: "Unauthorized:You are not allowed to update this deck",
                });
            const updatedDeck = await db.deck.update({
                where: { id: deckId },
                include: { cards: true },
                data: { title, description },
            });
            if (!updatedDeck)
                return res
                    .status(statusCode.NOT_FOUND)
                    .json({ success: false, message: "Deck not found" });
            res.status(statusCode.OK).json({
                success: true,
                deck: updatedDeck,
                message: "Deck updated successfully",
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
     * @returns delete the current user deck only (except admin)
     */
    deleteUserDeck = async (req, res) => {
        const { id: userId, isAdmin } = req.user;
        const { deckId } = req.params;
        try {
            const deck = await db.deck.findUnique({
                where: { id: deckId },
                select: { id: true, ownerId: true },
            });
            if (!deck)
                return res
                    .status(statusCode.NOT_FOUND)
                    .json({ success: false, message: `Deck not found` });
            //if the user role not admin and the deck owner is not the current user
            if (deck.ownerId !== userId && !isAdmin)
                return res.status(statusCode.UNAUTHORIZED).json({
                    success: false,
                    message: `Unauthorized:You are not authorized to delete this deck`,
                });
            await db.deck.delete({
                where: { id: deckId },
            });
            return res
                .status(statusCode.OK)
                .json({ success: true, message: "Deck deleted successfully" });
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
     * @returns toggle the deck visibility
     */
    toggleDeckVisibility = async (req, res) => {
        const { deckId } = req.params;
        const { id: userId, isAdmin } = req.user;
        try {
            const deck = await db.deck.findUnique({
                where: { id: deckId },
                select: { isPublic: true, ownerId: true },
            });
            if (!deck)
                return res
                    .status(statusCode.NOT_FOUND)
                    .json({ success: false, message: "Deck not found" });
            if (userId !== deck.ownerId && !isAdmin)
                return res.status(statusCode.UNAUTHORIZED).json({
                    success: false,
                    message: `Unauthorized:You are not authorized to update visibility of this deck`,
                });
            const updatedDeck = await db.deck.update({
                where: { id: deckId },
                data: { isPublic: !deck.isPublic },
            });
            return res.status(statusCode.OK).json({
                success: true,
                message: "Deck visibility updated successfully",
                deck: updatedDeck,
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
     * @param req
     * @param res
     * @returns export the deck data as json file
     */
    downloadDeckJson = async (req, res) => {
        const { deckId } = req.params;
        const { id: userId, isAdmin } = req.user;
        try {
            const deck = await db.deck.findUnique({
                where: { id: deckId },
                include: { cards: true },
            });
            if (!deck)
                return res
                    .status(statusCode.NOT_FOUND)
                    .json({ success: false, message: "Deck not found" });
            if (deck.isPublic && deck.ownerId !== userId && !isAdmin)
                return res.status(statusCode.UNAUTHORIZED).json({
                    success: false,
                    message: `Unauthorized:You are not authorized to download this deck`,
                });
            res.setHeader("Content-Type", "application/json");
            res.setHeader("Content-Disposition", `attachment; filename="${deck.title}-deck.json"`);
            return res.status(statusCode.CREATED).send(JSON.stringify(deck, null, 2));
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
     * @returns return an excel version of the deck
     */
    downloadDeckExcel = async (req, res) => {
        const { deckId } = req.params;
        const { id: userId, isAdmin } = req.user;
        try {
            const deck = await db.deck.findUnique({
                where: { id: deckId },
                include: { cards: true, owner: true },
            });
            if (!deck)
                return res
                    .status(statusCode.NOT_FOUND)
                    .json({ success: false, message: "Deck not found" });
            if (!deck.isPublic && deck.ownerId !== userId && !isAdmin)
                return res.status(statusCode.UNAUTHORIZED).json({
                    success: false,
                    message: "Unauthorized: You are not authorized to download this deck",
                });
            if (deck.cards.length === 0)
                return res
                    .status(statusCode.NOT_FOUND)
                    .json({ success: false, message: "Deck is empty, no cards found" });
            const sheetData = deck.cards.map((card) => ({
                Question: card.front,
                Answer: card.back,
                Hint: card.hint || "",
                CreatedAt: card.createdAt.toISOString(),
                UpdatedAt: card.updatedAt.toISOString(),
            }));
            const worksheet = XLSX.utils.json_to_sheet(sheetData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, deck.title || "Deck");
            const buffer = XLSX.write(workbook, {
                type: "buffer",
                bookType: "xlsx",
            });
            const safeTitle = deck.title.replace(/[^a-z0-9]/gi, "_").toLowerCase();
            const fileName = `${safeTitle || "deck"}_${Date.now()}`;
            res.setHeader("Content-Disposition", `attachment; filename=${fileName}.xlsx`);
            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.setHeader("Content-Length", buffer.length);
            return res.status(statusCode.OK).send(buffer);
        }
        catch (error) {
            console.error(error);
            return res.status(statusCode.SERVER_ERROR).json({
                success: false,
                message: "Internal server error",
            });
        }
    };
    /**
     * @param req
     * @param res
     * @returns get user stats about the deck
     */
    getUserStats = async (req, res) => {
        const { id: userId } = req.user;
        try {
            const [totalDecks, publicDecks, totalCards] = await Promise.all([
                db.deck.count({ where: { ownerId: userId } }),
                db.deck.count({ where: { ownerId: userId, isPublic: true } }),
                db.flashcard.count({ where: { deck: { ownerId: userId } } }),
            ]);
            const privateDecks = totalDecks - publicDecks;
            return res.status(statusCode.OK).json({
                success: true,
                totalDecks,
                totalCards,
                publicDecks,
                privateDecks,
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
//# sourceMappingURL=deck.controller.js.map