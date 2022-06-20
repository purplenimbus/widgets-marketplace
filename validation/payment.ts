import { body } from "express-validator";
import Widget from "../models/widget";

const createPayment = () => {
  return [
    body("widgetId")
      .exists()
      .withMessage("Widget id can't be blank")
      .bail()
      .custom(async (value) => {
        const widget = await Widget.findByPk(value);

        if (!widget) {
          return Promise.reject(new Error("Widget doesn't exist"));
        }
      }),
  ];
};

export default createPayment();
