import { Subjects, Listener, ExpirationCompleteEvent } from "@gmutti/common";
import { Message } from "node-nats-streaming";
import { Order, OrderStatus } from "../../models/order";
import { queueGroupName } from "./queue-group-name";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId).populate("ticket");

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }
    order.set({
      status: OrderStatus.Cancelled,
    });

    await order.save();

    new OrderCancelledPublisher(this.client).publish({
      id: data.orderId,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    msg.ack();
  }
}
