import { Request, Response } from "express";
import { generate } from "../utils";
import User from "../models/user";
import { HttpStatusCode } from "../enums/http";
const bcrypt = require("bcryptjs");
class AuthController {
  login = async (req: Request, res: Response) => {
    const data = req.body;

    const user = await User.findOne({
      where: { email: data.email },
      attributes: {
        include: ["password"],
      },
    });

    const isMatch = await bcrypt.compareSync(req.body.password, user!.password);

    if (!isMatch) return res.status(HttpStatusCode.FORBIDDEN).send("invalid credentials")

    const token = generate(user!);

    res.status(HttpStatusCode.OK).json({ token });
  }
}

export default new AuthController();