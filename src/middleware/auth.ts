import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { CustomRequest } from "../types/types";
import UnauthorizedError from "../errors/unauthorized-error";

export const auth = (req: CustomRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    const notAuthErr = new UnauthorizedError();
    return next(notAuthErr);
  }

  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, "jwt-secret-key");
  } catch (err) {
    next(new UnauthorizedError());
    return;
  }

  req.user = payload;
  next();
};
