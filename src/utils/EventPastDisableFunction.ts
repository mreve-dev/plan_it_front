import type { IEvent } from "../types/event.type"



export const isEventPast = ((event: IEvent) => {

    if (!event.end_date || !event.end_hour) return false

    
    const eventEndDateTime = new Date(event.end_date)
    eventEndDateTime.setHours(
        new Date(event.end_hour).getHours(),
        new Date(event.end_hour).getMinutes()
    )

    return eventEndDateTime < new Date()
})