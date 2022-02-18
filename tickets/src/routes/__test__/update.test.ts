import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { idText } from "typescript";
import { natsWrapper } from "../../nats-wrapper";
import { Ticket } from "../../models/ticket";

jest.mock("../../nats-wrapper");

const id = new mongoose.Types.ObjectId().toHexString();

const createTicket = async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "Action",
      price: 20,
    })
    .expect(201);

  return response.body.id;
};

it("returns 404 if the provided id does not exist", async () => {
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({
      title: "movies",
      price: 20,
    })
    .expect(404);
});

it("returns 401 if the user not authenticated ", async () => {
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "movies",
      price: 20,
    })
    .expect(401);
});

it("returns 401 if user not the owner of the ticket", async () => {
  const ticketId = await createTicket();
  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set("Cookie", global.signin())
    .send({
      title: "Action",
      price: 20,
    })
    .expect(401);
});

it("returns 400 if the user provides an invalid title or price", async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "Action",
      price: 20,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 10,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "Action",
      price: -10,
    })
    .expect(400);
});

it("updates the ticket provided valid inputs", async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "Action",
      price: 20,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "action",
      price: 10,
    })
    .expect(200);
});

it("publishes and event", async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "Action",
      price: 20,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "action",
      price: 10,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it("reject updates if the ticket is reserved", async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "Action",
      price: 20,
    })
    .expect(201);

  const ticket = await Ticket.findById(response.body.id);
  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "action",
      price: 10,
    })
    .expect(400);
});
