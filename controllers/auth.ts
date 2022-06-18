import { Request, Response } from "express";
import generate from "../utils/jwt";
import User from "../models/user";

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

    res.status(200).json({ token });
  }
}

export default new AuthController();