
import * as jwt from "jsonwebtoken";
import User from "../models/user";

export const generate = (
  user: User,
  secret = process.env.JWT_SECRET!,
  expiresIn = process.env.JWT_EXPIRES_IN!
) => jwt.sign({ user }, secret, { expiresIn });

export default generate;