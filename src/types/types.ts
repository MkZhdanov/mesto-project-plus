import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";
import mongoose, { ObjectId } from "mongoose";

export interface CustomRequest extends Request {
  user?: string | JwtPayload;
}

export interface OwnerRequest extends Request {
  user?: {
    _id: string;
  };
}

export interface ITokenPayload {
  _id: string;
  iat: number;
  exp: number;
}
