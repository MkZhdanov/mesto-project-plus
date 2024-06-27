import { Router } from "express";
import userRouter from "./users";
import cardRouter from "./cards";

const router = Router();
router.use("/cards", cardRouter);
router.use("/users", userRouter);

export default router;
