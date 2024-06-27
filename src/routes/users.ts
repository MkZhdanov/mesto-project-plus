import { Router } from "express";
import {
  getUser,
  getUserById,
  createUser,
  updateUser,
  updateUserAvatar,
} from "../controllers/users";

const userRouter = Router();

userRouter.get("/", getUser);
userRouter.get("/:userId", getUserById);
userRouter.post("/", createUser);
userRouter.patch("/me", updateUser);
userRouter.patch("/me/avatar", updateUserAvatar);

export default userRouter;
