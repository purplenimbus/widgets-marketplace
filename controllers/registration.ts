import { HttpStatusCode } from "../enums/http";
import { Request, Response } from "express";
import User from "../models/user";

class RegistrationController {
  register = async (req: Request, res: Response) => {
    res.status(HttpStatusCode.OK).json(await User.create(req.body));
  }
}

export default new RegistrationController();