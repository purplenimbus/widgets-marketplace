import { body } from "express-validator";
import User from "../models/user";

const createUser = () => {
  return [
    body("firstName")
      .exists()
      .withMessage("First Name can't be blank")
      .isLength({ min: 2, max: 25 }),
    body("lastName")
      .exists()
      .withMessage("Last Name can't be blank")
      .isLength({ min: 2, max: 25 })
      .withMessage("Last Name must be between 2 and 25 characters"),
    body("email")
      .exists()
      .withMessage("Email can't be blank")
      .isEmail()
      .withMessage("Invalid email format")
      .bail()
      .custom(async (email) => {
        const user = await User.findOne({ where: { email } });

        if (user) {
          return Promise.reject(new Error(
            "This email is already taken.",
          ));
        }
      }),
  ]
};

export {
  createUser
}