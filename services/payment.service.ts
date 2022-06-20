import Widget from "models/widget";
import { PaymentTransactionType } from "../enums/paymentTransaction";
import { sequelize } from "../database/sequelize";
import PaymentTransaction from "../models/paymentTransaction";
import User from "../models/user";
import { applyFees } from "../utils";

class PaymentService {
  constructor(public widget: Widget, private buyer: User) {}

  async create() {
    return await sequelize.transaction(async () => {
      const paymentTransaction = await PaymentTransaction.create({
        amount: this.widget.price,
        typeId: PaymentTransactionType.DEBIT,
        widgetId: this.widget.id,
        userId: this.buyer.id,
      });

      await PaymentTransaction.create({
        amount: applyFees(parseInt(this.widget.price as any, 10)),// some typing is off when converting from decimal to int
        typeId: PaymentTransactionType.CREDIT,
        widgetId: this.widget.id,
        userId: this.widget.sellerId,
      });

      return paymentTransaction;
    });
  }
}

export default PaymentService;