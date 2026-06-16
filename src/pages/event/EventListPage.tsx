import EventCardDesktop from "../../components/event/EventCardDesktop"
import EventCardMobile from "../../components/event/EventCardMobile"
import type { IEvent } from "../../types/event.type"
import CreateEventModal from "../../components/event/CreateEventModal"
import { IoCloseCircleOutline } from "react-icons/io5"
import { useApi } from "../../hook/useApi"
import { useQuery } from "@tanstack/react-query"
import { getEvents } from "../../services/api/event"

const EventListPage = () => {

  const api = useApi()

  const { data: events } = useQuery<IEvent[]>({
    queryKey: ['events'],
    queryFn: () => getEvents(api)
  })

  const handleClose = () => {
    (document.getElementById('event_modal') as HTMLDialogElement).close()
  }

  return (
    <div className="flex flex-col p-3 h-full gap-3 bg-[#ecece6] dark:bg-[#161b27] flex-1 overflow-hidden">

      <section className="flex justify-between items-center shrink-0">
        <h3 className="text-[#104e64] dark:text-[#e6dabb] text-xl md:text-2xl font-bold">
          Evènements du club
        </h3>

        <div>
          <button
            onClick={() => (document.getElementById('event_modal') as HTMLDialogElement).showModal()}
            className="btn text-left text-xs md:text-sm flex items-center bg-[#e6dabb] gap-2 w-fit rounded-xl cursor-pointer text-[#9b6581] dark:text-[#5e2c45] font-bold">
            + Nouvel évènement
          </button>

          <dialog id="event_modal" className="modal">
            <div className="modal-box p-3 bg-[#e6dabb] dark:bg-[#1e2433] max-w-lg">

              <button onClick={handleClose} className="btn btn-sm btn-circle btn-ghost absolute text-[#104e64] dark:text-[#e6dabb] right-2 top-2 lg:hidden">
                <IoCloseCircleOutline size={30} />
              </button>
              <CreateEventModal
                onClose={() => (document.getElementById('event_modal') as HTMLDialogElement).close()}
                onSuccess={() => console.log('évènement créé')} />
            </div>

            <form method="dialog" className="modal-backdrop">
              <button className="text-cyan-700"></button>
            </form>
          </dialog>

        </div>

      </section>

      <div className="overflow-y-auto flex-1">
        <div className="md:hidden">
          {(events ?? []).map((event) => (
            <EventCardMobile key={event.id} event={event} />
          ))}
        </div>

        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3">
          {(events ?? []).map((event) => (
            <EventCardDesktop key={event.id} event={event} />
          ))}
        </div>
      </div>

    </div>
  )
}

export default EventListPage