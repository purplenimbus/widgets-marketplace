import { body } from "express-validator";
import User from "../models/user";
const bcrypt = require("bcryptjs");

const loginUser = () => {
  return [
    body("email")
      .exists()
      .withMessage("Email can't be blank")
      .isEmail()
      .withMessage("Invalid email format")
      .bail()
      .custom(async (email) => {
        const user = await User.findOne({ where: { email } });

        if (!user) {
          return Promise.reject(new Error("Email doesn't exist"));
        }
      })
      .bail(),
    body("password")
      .exists()
      .withMessage("Password can't be blank")
      .custom(async (password, { req }) => {
        const user = await User.findOne({
          where: { email: req.body.email },
          attributes: {
            include: ["password"],
          },
        });

        const isMatch = await bcrypt.compareSync(password, user?.password);

        if (!isMatch) {
          return Promise.reject(new Error("invalid credentials"));
        }
      }),
  ];
};

export default loginUser();
