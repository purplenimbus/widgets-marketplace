import { HttpStatusCode } from "../enums/http";
import { Response } from "express";
import { AppRequest } from "../middleware/auth";
import Widget from "../models/widget";

class WidgetController {
  create = async (req: AppRequest, res: Response) => {
    res.status(HttpStatusCode.OK).json(await Widget.create({
      ...req.body,
      sellerId: req.user.id
    }));
  }
}

export default new WidgetController();