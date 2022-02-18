import { Publisher, OrderCreatedEvent, Subjects } from "@gmutti/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
 