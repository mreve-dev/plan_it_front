import EventCardDesktop from "../../components/event/EventCardDesktop"
import EventCardMobile from "../../components/event/EventCardMobile"
import type { IEvent } from "../../types/event.type"
import CreateEventModal from "../../components/event/CreateEventModal"
import { IoCloseCircleOutline } from "react-icons/io5"
import { useApi } from "../../hook/useApi"
import { useQuery } from "@tanstack/react-query"
import { getEvents } from "../../services/api/event"
import { Link } from "react-router-dom"

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
    <div className="flex flex-col p-3 gap-3 bg-[#ecece6] flex-1">
      <div>

        <section className="flex justify-between items-center ">
          <h3 className="text-[#104e64] text-2xl font-bold" >
            Evènements du club
          </h3>

          <div>
            <button onClick={() => (document.getElementById('event_modal') as HTMLDialogElement).showModal()} className="btn w-fit rounded-lg md:text-lg bg-[#104e64]">
              + Créer
            </button>

            <dialog id="event_modal" className="modal">
              <div className="modal-box p-3 bg-[#e6dabb] max-w-lg">

                <button onClick={handleClose} className="btn btn-sm btn-circle btn-ghost absolute text-[#104e64] right-2 top-2 lg:hidden">
                  <IoCloseCircleOutline size={30} />
                </button>
                <CreateEventModal
                  onClose={() => (document.getElementById('event_modal') as HTMLDialogElement).close()}

                  onSuccess={() => console.log('évènement créé')
                  } />
              </div>

              <form method="dialog" className="modal-backdrop">

                <button className="text-cyan-700"></button>
              </form>
            </dialog>

          </div>



        </section>

        <div className="md:hidden">
          {(events ?? []).map((event) => (

            <Link key={event.id} to={`/event/${event.id}`}>
              <EventCardMobile event={event} />
            </Link>

          ))}
        </div>

        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3">
          {(events ?? []).map((event) => (

            <Link key={event.id} to={`/event/${event.id}`}>
              <EventCardDesktop event={event} />
            </Link>


          ))}
        </div>

      </div>

    </div>
  )
}

export default EventListPage
