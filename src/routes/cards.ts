import { Router } from "express";
import {
  createCard,
  getCard,
  deleteCard,
  likeCard,
  dislikeCard,
} from "../controllers/cards";

const cardRouter = Router();

cardRouter.get("/", getCard);
cardRouter.post("/", createCard);
cardRouter.delete("/:cardId", deleteCard);
cardRouter.put("/:cardId/likes", likeCard);
cardRouter.delete("/:cardId/likes", dislikeCard);

export default cardRouter;
