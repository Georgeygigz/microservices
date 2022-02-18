import  { Publisher, Subjects, TicketCreatedEvent } from '@gmutti/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{

    subject: Subjects.TicketCreated = Subjects.TicketCreated

}
