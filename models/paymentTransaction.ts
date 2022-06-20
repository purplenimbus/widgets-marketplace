"use strict";
import { PaymentTransactionType } from "../enums/paymentTransaction";
import {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
} from "sequelize";
import {
  AfterCreate,
  ForeignKey,
  Model,
  Scopes,
} from "sequelize-typescript";

import {
  Column,
  CreatedAt,
  Table,
  UpdatedAt,
} from "sequelize-typescript";
import User from "./user";
import Widget from "./widget";

@Scopes(() => ({
  credits: {
    where: {
      typeId: PaymentTransactionType.CREDIT
    }
  },
  debits: {
    where: {
      typeId: PaymentTransactionType.DEBIT
    }
  }
}))
@Table
export default class PaymentTransaction extends Model<
  InferAttributes<PaymentTransaction>,
  InferCreationAttributes<PaymentTransaction>
> {
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  })
  id!: CreationOptional<number>;

  @ForeignKey(() => User)
  @Column(DataTypes.INTEGER)
  userId!: CreationOptional<number>;

  @ForeignKey(() => Widget)
  @Column(DataTypes.INTEGER)
  widgetId!: CreationOptional<number>;

  @Column(DataTypes.INTEGER)
  typeId!: CreationOptional<number>;

  @Column(DataTypes.DECIMAL)
  amount!: CreationOptional<number>;

  @Column({
    type: DataTypes.DATE,
  })
  @UpdatedAt
  updatedAt!: CreationOptional<Date>;

  @Column({
    type: DataTypes.DATE,
  })
  @CreatedAt
  createdAt!: CreationOptional<Date>;

  @AfterCreate
  static async reload(model: PaymentTransaction) {
    return await model.reload();
  }
}
