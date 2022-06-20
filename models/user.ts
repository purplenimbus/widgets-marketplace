"use strict";
import { hashPassword } from "../utils";
import {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
} from "sequelize";
import { AfterCreate, HasMany, Model } from "sequelize-typescript";

import {
  BeforeCreate,
  BeforeUpdate,
  Column,
  CreatedAt,
  DefaultScope,
  Table,
  UpdatedAt,
} from "sequelize-typescript";
import PaymentTransaction from "./paymentTransaction";
import { PaymentTransactionType } from "../enums/paymentTransaction";

@DefaultScope(() => ({
  attributes: {
    exclude: ["password"],
  },
}))
@Table
export default class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  @Column({
    type: DataTypes.STRING,
    unique: true,
    validate: {
      isEmail: true,
    },
  })
  email!: CreationOptional<string>;

  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  })
  id!: CreationOptional<number>;

  @Column(DataTypes.STRING)
  firstName!: CreationOptional<string>;

  @Column(DataTypes.STRING)
  lastName!: CreationOptional<string>;

  @Column(DataTypes.STRING)
  password!: CreationOptional<string>;

  async balance() {
    const credits = await this.totalCredits();
    const debits = await this.totalDebits();

    return credits - debits;
  }

  async totalCredits() {
    return await PaymentTransaction.scope("credits").sum("amount", {
      where: {
        userId: this.id,
      },
    }) || 0;
  }

  async totalDebits() {
    return await PaymentTransaction.scope("debits").sum("amount", {
      where: {
        userId: this.id,
      },
    }) || 0;
  }

  @HasMany(() => PaymentTransaction)
  paymentTransactions!: CreationOptional<PaymentTransaction[]>;

  @HasMany(() =>
    PaymentTransaction.scope({
      where: {
        typeId: PaymentTransactionType.CREDIT,
      },
    })
  )
  creditTransactions!: CreationOptional<PaymentTransaction[]>;

  @HasMany(() =>
    PaymentTransaction.scope({
      where: {
        typeId: PaymentTransactionType.DEBIT,
      },
    })
  )
  debitTransactions!: CreationOptional<PaymentTransaction[]>;

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

  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(user: User) {
    if (!user.changed("password")) return;
    user.password = await hashPassword(user.password);
  }

  @AfterCreate
  static async reload(model: User) {
    return await model.reload();
  }
}
