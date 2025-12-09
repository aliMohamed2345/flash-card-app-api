import { Request, Response } from "express";
import { statusCode } from "../utils/status-code.js";
import { PrismaClient } from "@prisma/client";
import { Validators } from "../lib/validators.js";

const db = new PrismaClient();
const validator = new Validators();
export class DeckController {
  /**
   * getAllUserDeck
   */
  public getAllUserDeck = async (req: Request, res: Response) => {
    try {
        /**
         * @todo add pagination and sorting to this controller 
         */
      const { id: userId } = req.user as { id: string };
      const user = await db.user.findUnique({ where: { id: userId } });
      //check if user exist
      if (!user)
        return res
          .status(statusCode.NOT_FOUND)
          .json({ success: false, message: "User not found" });
      const userDeck = await db.deck.findMany({
        where: { ownerId: userId, isPublic: true },
        include: { cards: true },
      });

      if (!userDeck || userDeck.length === 0) {
        return res.status(statusCode.NOT_FOUND).json({
          success: false,
          message: "No deck found for this user",
        });
      }
      return res.status(statusCode.OK).json({ success: true, data: userDeck });
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
   * @description for create a new deck
   */
  public createNewDeck = async (req: Request, res: Response) => {
    const { id: userId } = req.user as { id: string };
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
      const user = await db.user.findUnique({ where: { id: userId } });
      if (!user)
        return res
          .status(statusCode.NOT_FOUND)
          .json({ success: false, message: "User not found" });

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
  public getSpecificDeck = async (req: Request, res: Response) => {
    const { deckId } = req.params;
    const { id: userId } = req.user as { id: string };
    try {
      const deck = await db.deck.findUnique({
        where: { id: deckId },
        include: { cards: true },
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

      if (!deck.cards || deck.cards.length === 0)
        return res
          .status(statusCode.NOT_FOUND)
          .json({ success: false, message: "No cards found for this deck" });

      return res.status(statusCode.OK).json({ success: true, data: deck });
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
  public updateUserDeck = async (req: Request, res: Response) => {
    const { title, description } = req.body;
    const { deckId } = req.params;
    const { id: userId, isAdmin } = req.user as {
      id: string;
      isAdmin: Boolean;
    };
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
  public deleteUserDeck = async (req: Request, res: Response) => {
    const { id: userId } = req.user as { id: string };
    const { deckId } = req.params;

    try {
      const user = await db.user.findUnique({ where: { id: userId } });
      if (!user)
        return res
          .status(statusCode.NOT_FOUND)
          .json({ success: false, message: "User not found" });

      const deck = await db.deck.findUnique({
        where: { id: deckId },
        select: { id: true, ownerId: true },
      });

      if (!deck)
        return res
          .status(statusCode.NOT_FOUND)
          .json({ success: false, message: `Deck not found` });
      //if the user role not admin and the deck owner is not the current user
      if (deck.ownerId !== userId && !user.isAdmin)
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
   * @returns duplicate current user deck
   */
  public duplicateUserDeck = async (req: Request, res: Response) => {
    try {
      const { deckId } = req.params;
      const { id: userId, isAdmin } = req.user as {
        id: string;
        isAdmin: boolean;
      };

      // Fetch deck with cards
      const deck = await db.deck.findUnique({
        where: { id: deckId },
        include: { cards: true },
      });

      if (!deck) {
        return res
          .status(statusCode.NOT_FOUND)
          .json({ success: false, message: "Deck not found" });
      }

      // Check if the current user is the owner or an admin
      if (deck.ownerId !== userId && !isAdmin) {
        return res.status(statusCode.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized: You cannot duplicate this deck",
        });
      }

      // Prepare card data for duplication
      const cardData = deck.cards.map((card) => ({
        front: card.front,
        back: card.back,
        hint: card.hint ?? "",
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      // Create new deck with duplicated cards
      const newDeck = await db.deck.create({
        data: {
          title: deck.title,
          description: deck.description,
          isPublic: deck.isPublic,
          ownerId: userId, // assign to current user
          cards:
            cardData.length > 0
              ? { createMany: { data: cardData } }
              : undefined,
        },
        include: { cards: true },
      });

      return res.status(statusCode.CREATED).json({
        success: true,
        message: "Deck duplicated successfully",
        data: newDeck,
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
   * @returns toggle the deck visibility
   */
  public toggleDeckVisibility = async (req: Request, res: Response) => {
    const { deckId } = req.params;
    const { id: userId, isAdmin } = req.user as {
      id: string;
      isAdmin: boolean;
    };
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
}
