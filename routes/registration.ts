import { RegistrationController } from "../controllers";
import express, { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { createUser, validationHandler } from "../validation";

const router: Router = express.Router();

router.post(
  "/register",
  createUser,
  validationHandler,
  asyncHandler(RegistrationController.register)
);

module.exports = router;