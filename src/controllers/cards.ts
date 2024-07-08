import { Request, Response, NextFunction } from "express";
import { Error as MongooseError, ObjectId } from "mongoose";
import Card from "../models/card";
import { CustomRequest, OwnerRequest, ITokenPayload } from "../types/types";
import BadRequestError from "../errors/bad-request-error";
import NotFoundError from "../errors/not-found-error";
import ForbiddenError from "../errors/forbidden-error";

export const getCard = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

export const createCard = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const owner = req.user;
    const { name, link } = req.body;
    return res.status(201).send(await Card.create({ name, link, owner }));
  } catch (err) {
    if (err instanceof MongooseError.ValidationError) {
      return next(new BadRequestError("BadRequestError"));
    }
    return next(err);
  }
};

export const deleteCard = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cardId } = req.params;
    const { _id } = req.user as ITokenPayload;
    const card = await Card.findById(cardId).orFail(
      () => new NotFoundError("Not Found Error")
    );
    if (card.owner.toString() !== _id) {
      return next(new ForbiddenError("Удаление чужих карточек запрещено"));
    } else {
      await card.deleteOne();
      return res.send(card);
    }
  } catch (error) {
    if (error instanceof MongooseError.CastError) {
      next(new BadRequestError("BadRequestError"));
    }
    return next(error);
  }
};

export const likeCard = async (
  req: OwnerRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId as unknown as ObjectId } },
      { new: true }
    ).orFail(() => new NotFoundError("Not Found Error"));
    return res.send(card);
  } catch (err) {
    if (err instanceof MongooseError.CastError) {
      return next(new BadRequestError("BadRequestError"));
    }
    return next(err);
  }
};

export const dislikeCard = async (
  req: OwnerRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId as unknown as ObjectId } },
      { new: true }
    ).orFail(() => new NotFoundError("Not Found Error"));
    return res.send(card);
  } catch (err) {
    if (err instanceof MongooseError.CastError) {
      return next(new BadRequestError("BadRequestError"));
    }
    return next(err);
  }
};
