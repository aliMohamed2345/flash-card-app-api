import { Request, Response } from "express";
import db from "../lib/prisma.js";
import { statusCode } from "../utils/status-code.js";
import { Validators } from "../lib/validators.js";
import XLSX from "xlsx";
import { TokenPayload } from "../lib/middlewares.js";
const validator = new Validators();
interface ICard {
  front: string;
  back: string;
  hint: string | null;
  createdAt: Date;
  updatedAt: Date;
}
export class DeckController {
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
  public getAllUserDeck = async (req: Request, res: Response) => {
    const { id: userId } = req.user as TokenPayload;

    const pageNumber = req.query.page ? Number(req.query.page) : 1;
    const limitNumber = req.query.limit ? Number(req.query.limit) : 10;
    const queryString = req.query.q ? String(req.query.q).trim() : "";
    const isPublicString = req.query.isPublic
      ? String(req.query.isPublic).trim().toLowerCase()
      : "";

    try {
      const { isValid, message } = validator.validateDeckSearchQuery(
        pageNumber,
        queryString,
        isPublicString,
        limitNumber
      );

      if (!isValid) {
        return res
          .status(statusCode.BAD_REQUEST)
          .json({ success: false, message });
      }

      const skip = (pageNumber - 1) * limitNumber;

      const whereCondition: any = {
        ownerId: userId,
        ...(isPublicString ? { isPublic: isPublicString === "true" } : {}),
        ...(queryString
          ? {
              OR: [
                { title: { contains: queryString, mode: "insensitive" } },
                { description: { contains: queryString, mode: "insensitive" } },
              ],
            }
          : {}),
      };

      const userDeck = await db.deck.findMany({
        where: whereCondition,
        select: {
          id: true,
          title: true,
          description: true,
          isPublic: true,
          createdAt: true,
          updatedAt: true,
        },
        skip,
        take: limitNumber,
        orderBy: { createdAt: "desc" },
      });

      const totalUserDeck = await db.deck.count({
        where: whereCondition,
      });

      if (userDeck.length === 0) {
        return res.status(statusCode.NOT_FOUND).json({
          success: false,
          message: "No deck found",
        });
      }
      const totalPages = Math.ceil(totalUserDeck / limitNumber);

      return res.status(statusCode.OK).json({
        success: true,
        data: userDeck,
        pagination: {
          total: totalUserDeck,
          page: pageNumber,
          limit: limitNumber,
          totalPages,
        },
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Internal server error";
      console.error(message);
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
  public createNewDeck = async (req: Request, res: Response) => {
    const { id: userId } = req.user as TokenPayload;
    const { title, description, isPublic } = req.body;
    try {
      const { message, isValid } = validator.validateDeckData(
        title,
        description,
        isPublic
      );
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
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Internal server error";
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
  public getSpecificDeck = async (req: Request, res: Response) => {
    const { deckId } = req.params;
    const { id: userId } = req.user as TokenPayload;
    const { page = "1", limit = "10", withHint, q = "" } = req.query;
    try {
      const queryString = typeof q === "string" ? q : "";

      const { isValid, message } = validator.validateCardSearchQuery(
        String(page),
        String(limit),
        queryString,
        String(withHint)
      );
      if (!isValid)
        return res
          .status(statusCode.BAD_REQUEST)
          .json({ success: false, message });

      const cardPerPage = +limit! || 10;
      const pageNumber = +page! || 1;
      const skip = pageNumber * cardPerPage - cardPerPage;
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
          cards: {
            select: {
              id: true,
              front: true,
              back: true,
              hint: true,
              deckId: true,
              createdAt: true,
            },
            where: {
              OR: [
                { front: { contains: queryString } },
                { back: { contains: queryString } },
              ],
              ...(withHint !== undefined
                ? withHint === "true"
                  ? { hint: { not: null } }
                  : { hint: null }
                : {}),
            },
            skip,
            take: cardPerPage,
          },
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
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Internal server error";
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
  public updateUserDeck = async (req: Request, res: Response) => {
    const { title, description } = req.body;
    const { deckId } = req.params;
    const { id: userId, isAdmin } = req.user as TokenPayload;
    try {
      const { isValid, message } = validator.validateUpdateDeckData(
        title,
        description
      );
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
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Internal server error";
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
  public deleteUserDeck = async (req: Request, res: Response) => {
    const { id: userId, isAdmin } = req.user as TokenPayload;
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
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Internal server error";
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
  public toggleDeckVisibility = async (req: Request, res: Response) => {
    const { deckId } = req.params;
    const { id: userId, isAdmin } = req.user as TokenPayload;
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
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Internal server error";
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
  public downloadDeckJson = async (req: Request, res: Response) => {
    const { deckId } = req.params;
    const { id: userId, isAdmin } = req.user as TokenPayload;
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
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${deck.title}-deck.json"`
      );

      return res.status(statusCode.CREATED).send(JSON.stringify(deck, null, 2));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Internal server error";
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
  public downloadDeckExcel = async (req: Request, res: Response) => {
    const { deckId } = req.params;
    const { id: userId, isAdmin } = req.user as TokenPayload;

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

      const sheetData = deck.cards.map((card: ICard) => ({
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

      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${fileName}.xlsx`
      );
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader("Content-Length", buffer.length);

      return res.status(statusCode.OK).send(buffer);
    } catch (error) {
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
  public getUserStats = async (req: Request, res: Response) => {
    const { id: userId } = req.user as TokenPayload;
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
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Internal server error";
      console.log(message);
      return res
        .status(statusCode.SERVER_ERROR)
        .json({ success: false, message: `Internal Server error: ${message}` });
    }
  };
}
