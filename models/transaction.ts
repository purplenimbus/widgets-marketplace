"use strict";
import { hashPassword } from "../utils/hashPassword";
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
} from "sequelize-typescript";

import {
  BeforeCreate,
  BeforeUpdate,
  Column,
  CreatedAt,
  DefaultScope,
  Table,
  UpdatedAt,
} from "sequelize-typescript";
import User from "./user";
import Widget from "./widget";

@DefaultScope(() => ({
  attributes: {
    exclude: ["password", "createdAt", "updatedAt"]
  },
}))
@Table
export default class Transaction extends Model<
  InferAttributes<Transaction>,
  InferCreationAttributes<Transaction>
> {
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  })
  id!: CreationOptional<number>;

  @ForeignKey(() => User)
  @Column(DataTypes.INTEGER)
  buyerId!: CreationOptional<number>;

  @ForeignKey(() => User)
  @Column(DataTypes.INTEGER)
  sellerId!: CreationOptional<number>;

  @ForeignKey(() => Widget)
  @Column(DataTypes.INTEGER)
  widgetId!: CreationOptional<number>;

  @Column(DataTypes.INTEGER)
  typeId!: CreationOptional<number>;

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
  static async reload(model: Transaction) {
    return await model.reload();
  }
}
