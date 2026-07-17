import EventCardDesktop from "../../components/event/EventCardDesktop"
import EventCardMobile from "../../components/event/EventCardMobile"
import CreateEventModal from "../../components/event/CreateEventModal"
import { IoCloseCircleOutline } from "react-icons/io5"
import { useAuthStore } from "../../stores/authStore"
import { useGetEvents } from "../../hook/mutation/use-event.service"
import { useState } from "react"
import { isEventPast } from "../../utils/EventPastDisableFunction"
import type { IMission } from "../../types/mission.type"

const EventUserPage = () => {

    const { user: currentUser } = useAuthStore()

    const { data: events } = useGetEvents()

    const [filter, setFilter] = useState<'upcoming' | 'past'>('upcoming')

    const filteredEvents = (events ?? []).filter(event => {
        const past = isEventPast(event)
        return filter === 'upcoming' ? !past : past
    })

    const myFilteredEvents = filteredEvents.filter(event => 
        event.missions?.some((mission : IMission) => 
        mission.missionSlots?.some(slot => 
            slot.userHasMissions?.some
        ))
    )






    const handleClose = () => {
        (document.getElementById('event_modal') as HTMLDialogElement).close()
    }






    return (
        <div className="flex flex-col px-3 py-5 h-full gap-6 bg-[#ecece6] dark:bg-[#161b27] flex-1">

            <section className="flex justify-between items-center">
                <h3 className="text-[#104e64] dark:text-[#e6dabb] text-xl md:text-2xl font-bold">
                    Mes évènements
                </h3>

                


                <div className="flex gap-2">
                    <button
                    onClick={() => setFilter('upcoming')}
                    className={`text-sm font-semibold px-3 py-1 rounded-full ${filter === 'upcoming' ? 'bg-[#4f9288] text-white' : 'bg-[#e6dabb] dark:bg-[#1e2433] text-[#5a7070] dark:text-[#8b93a7]'}`}>
                        A venir
                    </button>

                    <button
                    onClick={() => setFilter('past')}
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${filter === 'past' ? 'bg-[#4f9288] text-white' : 'bg-[#e6dabb] dark:bg-[#1e2433] text-[#5a7070] dark:text-[#8b93a7]'}`}>
                        Passés
                    </button>
                </div>

            </section>




            <div className="overflow-y-auto flex-1">
                <div className="md:hidden">
                    {myFilteredEvents.map((event) => (
                        <EventCardMobile key={event.id} event={event} />
                    ))}
                </div>

                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6">
                    {myFilteredEvents.map((event) => (
                        <EventCardDesktop key={event.id} event={event} />
                    ))}
                </div>
            </div>

        </div>
    )
}

export default EventUserPage