import { Request, Response } from "express";
import generate from "../utils/jwt";
import User from "../models/user";
import { HttpStatusCode } from "../enums/http";

class AuthController {
  login = async (req: Request, res: Response) => {
    const data = req.body;

    const user = await User.findOne({
      where: { email: data.email },
      attributes: {
        include: ["password"],
      },
    });

    const token = generate(user!);

    res.status(HttpStatusCode.OK).json({ token });
  }
}

export default new AuthController();