import { Request, Response, NextFunction } from "express";
import { Error as MongooseError } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { CustomRequest, ITokenPayload } from "../types/types";
import { JwtPayload } from "jsonwebtoken";
import UnauthorizedError from "../errors/unauthorized-error";
import BadRequestError from "../errors/bad-request-error";
import NotFoundError from "../errors/not-found-error";
import ConflictError from "../errors/conflict-error";

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (err) {
    return next(err);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail(
      () => new UnauthorizedError("Ошибка аутентификации")
    );
    return res.send(user);
  } catch (err) {
    if (err instanceof MongooseError.CastError) {
      return next(new BadRequestError("Bad Request"));
    }
    return next(err);
  }
};

export const getCurrentUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const currentUser = await User.findById(req.user).orFail(
      () => new NotFoundError("Not Found Error")
    );
    return res.send(currentUser);
  } catch (err) {
    if (err instanceof MongooseError.ValidationError) {
      return next(new BadRequestError("Bad Request"));
    }
    return next(err);
  }
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { email, password, name, about, avatar } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        about,
        avatar,
        password: hash,
        email,
      })
    )
    .then((user) =>
      res.status(201).send({
        data: {
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
          _id: user._id,
        },
      })
    )
    .catch((err) => {
      if (err instanceof MongooseError.ValidationError) {
        return next(new BadRequestError("requestError"));
      }
      if (err.code === 11000) {
        return next(new ConflictError("conflictError"));
      }
      return next(err);
    });
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, "jwt-secret-key", {
      expiresIn: "7d",
    });
    return res
      .cookie("jwt", token, {
        httpOnly: true,
        sameSite: true,
        maxAge: 3600000,
      })
      .send({ token });
  } catch (err) {
    return next(err);
  }
};

export const updateUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, about } = req.body;
    const userId = req.user as ITokenPayload;
    const updatedUser = await User.findByIdAndUpdate(
      { _id: userId._id },
      { name, about },
      { new: true, runValidators: true }
    ).orFail(() => new NotFoundError("Not Found Error"));
    return res.send(updatedUser);
  } catch (err) {
    if (err instanceof MongooseError.ValidationError) {
      return next(new BadRequestError("Bad Request"));
    }
    if (err instanceof Error && err.name === "Not Found Error") {
      return next(new NotFoundError("Not Found Error"));
    }
    return next(err);
  }
};

export const updateUserAvatar = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { avatar } = req.body;
    const userId = req.user as ITokenPayload;
    const updatedUser = await User.findByIdAndUpdate(
      { _id: userId._id },
      { avatar },
      { new: true, runValidators: true }
    ).orFail(() => new NotFoundError("Not Found Error"));
    return res.send(updatedUser);
  } catch (err) {
    if (err instanceof MongooseError.ValidationError) {
      return next(new BadRequestError("Bad Request"));
    }
    if (err instanceof Error && err.name === "Not Found Error") {
      return next(new NotFoundError("Not Found Error"));
    }
    return next(err);
  }
};
