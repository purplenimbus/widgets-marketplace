import User from "../../models/user";
import { faker } from "@faker-js/faker";
import { HttpStatusCode } from "../../enums/http";

const request = require("supertest");
const express = require("express");

const app = express();
app.use(require("body-parser").json());
app.use("/", require("../../routes/auth"));

describe("AuthController", () => {
  describe("login", () => {
    test("logins a user with valid credentials", async () => {
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();

      const user = await User.create({
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

      expect(response.status).toEqual(HttpStatusCode.OK);
      expect(response.body.token).toBeDefined();
    });

    test("doesn't login a user with an invalid password", async () => {
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();

      const user = await User.create({
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

      expect(response.status).toEqual(HttpStatusCode.FORBIDDEN);
      expect(response.text).toEqual("invalid credentials");
    });

    test("doesn't login a user with an invalid email", async () => {
      const response = await request(app)
        .post("/login")
        .type("json")
        .send({
          email: "bademail@yopmail.com",
          password: "12345"
        });

      expect(response.status).toEqual(HttpStatusCode.UNPROCESSABLE);
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