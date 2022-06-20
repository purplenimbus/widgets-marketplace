import { PaymentController } from "../controllers";
import express, { Router } from "express";
import { asyncHandler } from "../utils";
import { createPayment, validationHandler } from "../validation";
import { authRequired, hasBalance, hasSufficentFunds } from "../middleware";

const router: Router = express.Router();

router.post(
  "/payments",
  authRequired,
  hasBalance,
  createPayment,
  validationHandler,
  hasSufficentFunds,
  asyncHandler(PaymentController.create)
);

module.exports = router;