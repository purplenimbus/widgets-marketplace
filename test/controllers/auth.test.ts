import User from "../../models/user";
import { faker } from "@faker-js/faker";
import * as jwt from "../../utils/jwt";

const request = require("supertest");
const express = require("express");

const app = express();
app.use(require("body-parser").json());
app.use("/", require("../../routes/auth"));

describe("AuthController", () => {
  describe("login", () => {
    it("logins a user with valid credentials", async () => {
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();

      const user = await User.unscoped().create({
        firstName,
        lastName,
        email: faker.internet
          .email(firstName, lastName, "yopmail.com")
          .toLowerCase(),
        password: "123456",
      });

      const response = await request(app)
        .post("/login")
        .type("json")
        .send({
          email: user.email,
          password: "123456"
        });

      expect(response.status).toEqual(200);
      expect(response.body.token).toBeDefined();
    });

    it("doesn't login a user with an invalid password", async () => {
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();

      const user = await User.unscoped().create({
        firstName,
        lastName,
        email: faker.internet
          .email(firstName, lastName, "yopmail.com")
          .toLowerCase(),
        password: "123456",
      });

      const response = await request(app)
        .post("/login")
        .type("json")
        .send({
          email: user.email,
          password: "12345"
        });

      expect(response.status).toEqual(422);
      expect(response.body.error.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            password: "invalid credentials",
          }),
        ])
      );
    });

    it("doesn't login a user with invalid credentials", async () => {
      const response = await request(app)
        .post("/login")
        .type("json")
        .send({
          email: "bademail@yopmail.com",
          password: "12345"
        });

      expect(response.status).toEqual(422);
      expect(response.body.error.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            email: "Email doesn't exist",
          }),
        ])
      );
    });
  })
});