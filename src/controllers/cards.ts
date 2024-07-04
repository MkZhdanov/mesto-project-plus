import { Request, Response } from "express";
import { Error as MongooseError, ObjectId } from "mongoose";
import Card from "../models/card";

export const getCard = async (req: Request, res: Response) => {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch (err) {
    return res.status(500).send(err);
  }
};

export const createCard = async (req: Request, res: Response) => {
  try {
    console.log(req.user._id);
    const owner = req.user?._id;
    const { name, link } = req.body;
    return res.status(201).send(await Card.create({ name, link, owner }));
  } catch (err) {
    if (err instanceof MongooseError.ValidationError) {
      return res.status(400).send(err);
    }
    return res.status(500).send(err);
  }
};

export const deleteCard = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndDelete(cardId).orFail(() => {
      const error = new Error("Карточка не найдена");
      error.name = "notFoundError";
      return error;
    });
    if (card.owner.toString() !== req.user?._id) {
      const error = new Error("Удаление чужих карточек запрещено");
      error.name = "requestError";
      return error;
    }
    return res.send(card);
  } catch (err) {
    if (err instanceof MongooseError.CastError) {
      return res.status(400).send(err);
    }
    if (err instanceof Error && err.name === "notFoundError") {
      return res.status(404).send(err);
    }
    return res.status(500).send(err);
  }
};

export const likeCard = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId as unknown as ObjectId } },
      { new: true }
    ).orFail(() => {
      const error = new Error("Пользователь не найден");
      error.name = "notFoundError";
      return error;
    });
    return res.send(card);
  } catch (err) {
    if (err instanceof MongooseError.CastError) {
      return res.status(400).send(err);
    }
    if (err instanceof Error && err.name === "notFoundError") {
      return res.status(404).send(err);
    }
    return res.status(500).send(err);
  }
};

export const dislikeCard = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId as unknown as ObjectId } },
      { new: true }
    ).orFail(() => {
      const error = new Error("Пользователь не найден");
      error.name = "notFoundError";
      return error;
    });
    return res.send(card);
  } catch (err) {
    if (err instanceof MongooseError.CastError) {
      return res.status(400).send(err);
    }
    if (err instanceof Error && err.name === "notFoundError") {
      return res.status(404).send(err);
    }
    return res.status(500).send(err);
  }
};
