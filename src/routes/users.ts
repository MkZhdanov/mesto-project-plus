import { Router } from "express";
import {
  getUser,
  getUserById,
  getCurrentUser,
  updateUser,
  updateUserAvatar,
} from "../controllers/users";
import {
  validateUpdateAvatar,
  validateUpdateUser,
  validateUser,
} from "../middleware/validator";

const userRouter = Router();

userRouter.get("/", getUser);
userRouter.get("/me", getCurrentUser);
userRouter.get("/:userId", validateUser, getUserById);
userRouter.patch("/me", validateUpdateUser, updateUser);
userRouter.patch("/me/avatar", validateUpdateAvatar, updateUserAvatar);

export default userRouter;
