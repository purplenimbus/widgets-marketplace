import { asyncHandler } from "../utils";
import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import { HttpStatusCode } from "../enums/http";

export interface AppRequest extends Request {
  user: User;
}

const hasBalance = asyncHandler(
  async (req: AppRequest, res: Response, next: NextFunction) => {
    const balance = await req.user.balance();

    if (balance === 0) return res.status(HttpStatusCode.FORBIDDEN).send("Cannot purchase widget with a balance of 0, deposit some money or sell some widgets");

    next();
  }
);

export default hasBalance;
