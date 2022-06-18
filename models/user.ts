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

@DefaultScope(() => ({
  attributes: {
    exclude: ["password", "createdAt", "updatedAt"]
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
