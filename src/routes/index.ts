import { Router, Request, Response, NextFunction } from "express";
import userRouter from "./users";
import cardRouter from "./cards";
import NotFoundError from "../errors/not-found-error";

const router = Router();
router.use("/cards", cardRouter);
router.use("/users", userRouter);
router.use("*", (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError("Запрашиваемый ресурс не найден"));
});

export default router;
