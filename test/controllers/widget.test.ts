import { faker } from "@faker-js/faker";
import User from "../../models/user";
import { HttpStatusCode } from "../../enums/http";
import Widget from "../../models/widget";
import express from "express";

const request = require("supertest");

const app = express();
app.use(require("body-parser").json());
const authRouter = app.use("/", require("../../routes/auth"));
const widgetRouter = app.use("/", require("../../routes/widget"));

describe("WidgetController", () => {
  let token: string, currentUser: User;

  beforeAll(async () => {
    currentUser = await User.create({
      email: faker.internet.email().toLowerCase(),
      firstName: "mr",
      lastName: "nimbus",
      password: "123456",
    });

    const response = await request(authRouter)
      .post("/login")
      .type("json")
      .send({
        email: currentUser.email,
        password: "123456",
      });

    token = `Bearer ${response.body.token}`;
  });

  describe("create", () => {
    it("creates a widget with valid data", async () => {
      const widget = await Widget.build({
        description: faker.lorem.words(5),
        price: parseInt(faker.commerce.price(50000, 25000000, 0), 10),
      });

      const { id, ...data } = widget.toJSON();

      const response = await request(widgetRouter)
        .post("/widgets")
        .type("json")
        .set({ authorization: token })
        .send(data);

      expect(response.status).toEqual(HttpStatusCode.OK);
    });

    it("doesn't create a widget without a token", async () => {
      const response = await request(widgetRouter)
        .post("/widgets")
        .type("json")
        .send({});

      expect(response.status).toEqual(HttpStatusCode.FORBIDDEN);
    });

    it("doesn't create a widget without a price", async () => {
      const widget = await Widget.build({
        description: faker.lorem.words(5),
        price: parseInt(faker.commerce.price(50000, 25000000, 0), 10),
      });

      const { id, price, ...data } = widget.toJSON();

      const response = await request(widgetRouter)
        .post("/widgets")
        .type("json")
        .set({ authorization: token })
        .send(data);

      expect(response.status).toEqual(HttpStatusCode.UNPROCESSABLE);
      expect(response.body.error.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            price: "Price can't be blank",
          }),
        ])
      );
    });
  });
});
