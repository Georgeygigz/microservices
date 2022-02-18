import { OrderCreatedEvent, OrderStatus } from "@gmutti/common";
import mongoose from "mongoose";
import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Order } from "../../../models/order";

jest.mock("../../../nats-wrapper");

const setUp = () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    expiresAt: "wesrfr",
    userId: "w4e5rt",
    status: OrderStatus.Created,
    ticket: {
      id: "eeeeer",
      price: 10,
    },
  };

  //   @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("it replicates the order info", async () => {
  const { listener, data, msg } = setUp();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);
  expect(order!.price).toEqual(data.ticket.price);
});

it("acks the message", async () => {
  const { listener, data, msg } = setUp();

  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
