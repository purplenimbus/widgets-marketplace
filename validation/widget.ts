import { body } from "express-validator";

const createWidget = () => {
  return [
    body("description").exists().withMessage("Description can't be blank"),
    body("price").exists().withMessage("Price can't be blank"),
  ];
};

export default createWidget();