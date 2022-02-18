import { Publisher, OrderCancelledEvent, Subjects } from "@gmutti/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
