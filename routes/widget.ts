import { WidgetController } from "../controllers";
import express, { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { createWidget, validationHandler } from "../validation";
import { authRequired } from "../middleware";

const router: Router = express.Router();

router.post(
  "/widgets",
  authRequired,
  createWidget,
  validationHandler,
  asyncHandler(WidgetController.create)
);

module.exports = router;