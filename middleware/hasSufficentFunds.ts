import { asyncHandler } from "../utils";
import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import { HttpStatusCode } from "../enums/http";
import Widget from "../models/widget";

export interface AppRequest extends Request {
  user: User;
}

const hasSufficentBalance = asyncHandler(
  async (req: AppRequest, res: Response, next: NextFunction) => {
    const balance = await req.user.balance();
    const widget = await Widget.findByPk(req.body.widgetId);

    if(widget!.price > balance) return res.status(HttpStatusCode.FORBIDDEN).send("Insufficent funds");
  
    next();
  }
);

export default hasSufficentBalance;
