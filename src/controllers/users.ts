import { Request, Response } from "express";
import { Error as MongooseError } from "mongoose";
import User from "../models/user";

export const getUser = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (err) {
    return res.status(500).send(err);
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail(() => {
      const error = new Error("Пользователь не найден");
      error.name = "Not Found Error";
      return error;
    });
    return res.send(user);
  } catch (err) {
    if (err instanceof MongooseError.CastError) {
      return res.status(400).send(err);
    }
    if (err instanceof Error && err.name === "Not Found Error") {
      return res.status(404).send(err);
    }
    return res.status(500).send(err);
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, about, avatar } = req.body;
    const newUser = await new User({
      name,
      about,
      avatar,
    });
    await newUser.save();
    return res.status(201).send({
      data: {
        name: newUser.name,
        about: newUser.about,
        avatar: newUser.avatar,
      },
    });
  } catch (err) {
    if (err instanceof MongooseError.ValidationError) {
      return res.status(400).send(err);
    }
    return res.status(500).send(err);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { name, about } = req.body;
    const userId = req.user?._id;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true }
    ).orFail(() => {
      const error = new Error("Пользователь не найден");
      error.name = "notFoundError";
      return error;
    });
    return res.send(updatedUser);
  } catch (err) {
    if (err instanceof MongooseError.ValidationError) {
      return res.status(400).send(err);
    }
    if (err instanceof Error && err.name === "notFoundError") {
      return res.status(404).send(err);
    }
    return res.status(500).send(err);
  }
};

export const updateUserAvatar = async (req: Request, res: Response) => {
  try {
    const { avatar } = req.body;
    const userId = req.user?._id;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true }
    ).orFail(() => {
      const error = new Error("Пользователь не найден");
      error.name = "notFoundError";
      return error;
    });
    return res.send(updatedUser);
  } catch (err) {
    if (err instanceof MongooseError.ValidationError) {
      return res.status(400).send(err);
    }
    if (err instanceof Error && err.name === "notFoundError") {
      return res.status(404).send(err);
    }
    return res.status(500).send(err);
  }
};
