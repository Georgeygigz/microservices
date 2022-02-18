import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";

const createTicket = () => {
  return request(app).post("/api/tickets").set("Cookie", global.signin()).send({
    title: "meme",
    price: 20,
  });
};

it("returns 404 if endpoint /api/tickets does not exist", async () => {
  const response = await request(app).get("/api/tickets").send();

  expect(response.status).not.toEqual(404);
});

it("can fetch  a list of tickets", async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app).get("/api/tickets/").send().expect(200);
  expect(response.body.length).toEqual(3)
});
