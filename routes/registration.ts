import { RegistrationController } from "../controllers";
import express, { Router } from "express";
import { asyncHandler } from "../utils";
import { registerUser, validationHandler } from "../validation";

const router: Router = express.Router();

router.post(
  "/register",
  registerUser,
  validationHandler,
  asyncHandler(RegistrationController.register)
);

module.exports = router;