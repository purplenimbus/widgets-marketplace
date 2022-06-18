import { body } from "express-validator";
import User from "../models/user";

const createUser = () => {
  return [
    body("firstName").exists().withMessage("First Name can't be blank"),
    body("lastName").exists().withMessage("Last Name can't be blank"),
    body("email")
      .exists()
      .withMessage("Email can't be blank")
      .isEmail()
      .withMessage("Invalid email format")
      .bail()
      .custom(async (email) => {
        const user = await User.findOne({ where: { email } });

        if (user) {
          return Promise.reject(new Error("This email is already taken."));
        }
      }),
    body("password").exists().withMessage("Password can't be blank"),
  ];
};

export default createUser();
