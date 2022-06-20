import { faker } from "@faker-js/faker";
import User from "../../models/user";
import { HttpStatusCode } from "../../enums/http";
import Widget from "../../models/widget";
import express from "express";
import PaymentTransaction from "../../models/paymentTransaction";
import { PaymentTransactionType } from "../../enums/paymentTransaction";

const request = require("supertest");

const app = express();
app.use(require("body-parser").json());
const authRouter = app.use("/", require("../../routes/auth"));
const paymentRouter = app.use("/", require("../../routes/payment"));

describe("PaymentController", () => {
  let token: string, currentUser: User;

  beforeEach(async () => {
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
    describe("when the user has a sufficent balance", () => {
      beforeEach(async () => {
        await PaymentTransaction.truncate();
        await PaymentTransaction.create({
          typeId: PaymentTransactionType.CREDIT,
          amount: 500,
          userId: currentUser.id,
        });
      });

      describe("the payment is successful", () => {
        test("credits the seller", async () => {
          const seller = await User.create({
            email: faker.internet.email().toLowerCase(),
            firstName: "rick",
            lastName: "morty",
            password: "123456",
          });

          const widget = await Widget.create(
            {
              sellerId: seller.id,
              description: faker.lorem.words(5),
              price: 100,
            },
            {
              include: [User],
            }
          );

          const response = await request(paymentRouter)
            .post("/payments")
            .type("json")
            .set({ authorization: token })
            .send({
              widgetId: widget.id,
            });

          expect(response.status).toEqual(HttpStatusCode.OK);
          expect(response.body).toEqual(
            expect.objectContaining({
              amount: "100.00",
              userId: currentUser.id,
              widgetId: widget.id,
            })
          );
          expect(await widget.seller.balance()).toEqual(85);
        });

        test("debits the buyer", async () => {
          const seller = await User.create({
            email: faker.internet.email().toLowerCase(),
            firstName: "rick",
            lastName: "morty",
            password: "123456",
          });

          const widget = await Widget.create({
            sellerId: seller.id,
            description: faker.lorem.words(5),
            price: 100,
          });

          const response = await request(paymentRouter)
            .post("/payments")
            .type("json")
            .set({ authorization: token })
            .send({
              widgetId: widget.id,
            });

          expect(response.status).toEqual(HttpStatusCode.OK);
          expect(await currentUser.balance()).toEqual(400);
        });
      });
    });

    describe("when the user has a zero balance", () => {
      beforeEach(async () => {
        await PaymentTransaction.truncate();
      });

      test("returns a zero balance error", async () => {
        const seller = await User.create({
          email: faker.internet.email().toLowerCase(),
          firstName: "rick",
          lastName: "morty",
          password: "123456",
        });

        const widget = await Widget.create(
          {
            sellerId: seller.id,
            description: faker.lorem.words(5),
            price: 100,
          },
          {
            include: [User],
          }
        );

        const response = await request(paymentRouter)
          .post("/payments")
          .type("json")
          .set({ authorization: token })
          .send({
            widgetId: widget.id,
          });

        expect(response.status).toEqual(HttpStatusCode.FORBIDDEN);
        expect(response.text).toEqual("Cannot purchase widget with a balance of 0, deposit some money or sell some widgets");
      });
    });

    describe("when the user has an Insufficent balance for the purchase", () => {
      beforeEach(async () => {
        await PaymentTransaction.truncate();
        await PaymentTransaction.create({
          typeId: PaymentTransactionType.CREDIT,
          amount: 50,
          userId: currentUser.id,
        });
      });

      test("returns an Insufficent funds error", async () => {
        const seller = await User.create({
          email: faker.internet.email().toLowerCase(),
          firstName: "rick",
          lastName: "morty",
          password: "123456",
        });

        const widget = await Widget.create(
          {
            sellerId: seller.id,
            description: faker.lorem.words(5),
            price: 100,
          },
          {
            include: [User],
          }
        );

        const response = await request(paymentRouter)
          .post("/payments")
          .type("json")
          .set({ authorization: token })
          .send({
            widgetId: widget.id,
          });

        expect(response.status).toEqual(HttpStatusCode.FORBIDDEN);
        expect(response.text).toEqual("Insufficent funds");
      });
    });
  });
});
