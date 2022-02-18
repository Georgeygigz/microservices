import  { Publisher, Subjects, TicketUpdatedEvent } from '@gmutti/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{

    subject: Subjects.TicketUpdated = Subjects.TicketUpdated

}
