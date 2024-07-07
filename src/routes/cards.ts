import { Router } from "express";
import {
  getCard,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} from "../controllers/cards";
import { validateCardId, validateCreateCard } from "../middleware/validator";

const cardRouter = Router();

cardRouter.get("/", getCard);
cardRouter.post("/", validateCreateCard, createCard);
cardRouter.delete("/:cardId", validateCardId, deleteCard);
cardRouter.put("/:cardId/likes", validateCardId, likeCard);
cardRouter.delete("/:cardId/likes", validateCardId, dislikeCard);

export default cardRouter;
