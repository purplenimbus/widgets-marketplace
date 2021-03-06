import User from "../../models/user";
import { faker } from "@faker-js/faker";
import { HttpStatusCode } from "../../enums/http";

const request = require("supertest");
const express = require("express");

const app = express();
app.use(require("body-parser").json());
app.use("/", require("../../routes/registration"));

describe("RegistrationController", () => {
  describe("register", () => {
    test("registers a new user with valid data", async () => {
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();

      const user = await User.build({
        firstName,
        lastName,
        email: faker.internet
          .email(firstName, lastName, "yopmail.com")
          .toLowerCase(),
        password: "123456",
      });

      const { id, ...data } = user.toJSON();

      const response = await request(app)
        .post("/register")
        .type("json")
        .send(data);

      expect(response.status).toEqual(HttpStatusCode.OK);
      expect(response.body).toEqual(
        expect.objectContaining({
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        })
      );

      const latestUser = await User.findOne({
        where: { email: user.email },
      });

      expect(latestUser).toBeDefined();
    });

    test("doesn't register a new user without a password", async () => {
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();

      const user = await User.build({
        firstName,
        lastName,
        email: faker.internet
          .email(firstName, lastName, "yopmail.com")
          .toLowerCase(),
      });

      const { id, ...data } = user.toJSON();

      const response = await request(app)
        .post("/register")
        .type("json")
        .send(data);

      expect(response.status).toEqual(HttpStatusCode.UNPROCESSABLE);
      expect(response.body.error.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            password: "Password can't be blank",
          }),
        ])
      );
    });
  });
});
