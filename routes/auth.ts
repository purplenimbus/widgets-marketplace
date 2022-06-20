import { AuthController } from "../controllers";
import express, { Router } from "express";
import { asyncHandler } from "../utils";
import { loginUser, validationHandler } from "../validation";

const router: Router = express.Router();

router.post(
  "/login",
  loginUser,
  validationHandler,
  asyncHandler(AuthController.login)
);

module.exports = router;