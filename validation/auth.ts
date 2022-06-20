import { body } from "express-validator";
import User from "../models/user";

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
      }),
    body("password")
      .exists()
      .withMessage("Password can't be blank")
  ];
};

export default loginUser();
