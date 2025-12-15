import { Router } from "express";
import { Middlewares } from "../lib/middlewares.js";
import { CardController } from "../controllers/card.controller.js";
const {
  createNewFlashCard,
  deleteFlashCard,
  getAllFlashCardsDeck,
  getFlashCard,
  updateFlashCard,
} = new CardController();
const { verifyToken } = new Middlewares();
//use mergeParams to access the outer route params
const router = Router({ mergeParams: true });

router
  .route("/")
  .get(verifyToken, getAllFlashCardsDeck)
  .post(verifyToken, createNewFlashCard);
router
  .route("/:cardId")
  .get(verifyToken, getFlashCard)
  .delete(verifyToken, deleteFlashCard)
  .put(verifyToken, updateFlashCard);

export default router;
