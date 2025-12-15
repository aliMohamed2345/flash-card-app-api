import { Router } from "express";
import { Middlewares } from "../lib/middlewares.js";
import { DeckController } from "../controllers/deck.controller.js";

const router = Router();

const {
  getAllUserDeck,
  createNewDeck,
  getSpecificDeck,
  updateUserDeck,
  deleteUserDeck,
  toggleDeckVisibility,
  downloadDeckJson,
  downloadDeckExcel,
  getUserStats,
} = new DeckController();
const { verifyToken } = new Middlewares();
import cardRoutes from "./card.routes.js";
router
  .route("/")
  .get(verifyToken, getAllUserDeck)
  .post(verifyToken, createNewDeck);
router.get("/stats", verifyToken, getUserStats);
router
  .route("/:deckId")
  .get(verifyToken, getSpecificDeck)
  .put(verifyToken, updateUserDeck)
  .delete(verifyToken, deleteUserDeck);
router.put("/:deckId/visibility", verifyToken, toggleDeckVisibility);
router.get("/:deckId/export/json", verifyToken, downloadDeckJson);
router.get("/:deckId/export/excel", verifyToken, downloadDeckExcel);

router.use("/:deckId/cards", cardRoutes);
export default router;
