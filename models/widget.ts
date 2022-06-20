"use strict";
import {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
} from "sequelize";
import {
  AfterCreate,
  BelongsTo,
  ForeignKey,
  Model,
} from "sequelize-typescript";

import {
  Column,
  CreatedAt,
  Table,
  UpdatedAt,
} from "sequelize-typescript";
import User from "./user";

@Table
export default class Widget extends Model<
  InferAttributes<Widget>,
  InferCreationAttributes<Widget>
> {
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  })
  id!: CreationOptional<number>;

  @ForeignKey(() => User)
  @Column(DataTypes.INTEGER)
  sellerId!: CreationOptional<number>;

  @BelongsTo(() => User)
  seller!: CreationOptional<User>;

  @Column(DataTypes.DECIMAL)
  price!: CreationOptional<number>;

  @Column(DataTypes.STRING)
  description!: CreationOptional<string>;

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
  static async reload(model: Widget) {
    return await model.reload();
  }
}
