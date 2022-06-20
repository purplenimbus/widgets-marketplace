import { asyncHandler } from "../utils";
import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import * as jwt from "jsonwebtoken";
import { HttpStatusCode } from "../enums/http";

export interface AppRequest extends Request {
  user: User,
}

const authRequired = asyncHandler(
  async (req: AppRequest, res: Response, next: NextFunction) => {
    let token = "";
  
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) return res.status(HttpStatusCode.FORBIDDEN).send("Access token required");

    try {
      const decoded = <any>jwt.verify(token, process.env.JWT_SECRET!);
      const user = await User.findByPk(decoded.user.id);

      if (user) req.user = user;
      next();
    } catch (error: unknown | any) {
      console.log("Auth error", error);
      return next(new Error("Access denied!."));
    }
  }
);

export default authRequired;