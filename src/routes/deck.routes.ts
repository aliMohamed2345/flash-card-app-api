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
  duplicateUserDeck,
  toggleDeckVisibility,
} = new DeckController();
const { verifyToken } = new Middlewares();

router
  .route("/")
  .get(verifyToken, getAllUserDeck)
  .post(verifyToken, createNewDeck);
router
  .route("/:deckId")
  .get(verifyToken, getSpecificDeck)
  .put(verifyToken, updateUserDeck)
  .delete(verifyToken, deleteUserDeck);
router.post("/:deckId/duplicate", verifyToken, duplicateUserDeck);
router.put("/:deckId/visibility", verifyToken, toggleDeckVisibility);
/**
 * @todo add the export route for export decks to excel or json
 */
export default router;
