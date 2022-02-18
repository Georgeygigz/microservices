import { Publisher, PaymentCreatedEvent, Subjects } from "@gmutti/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
