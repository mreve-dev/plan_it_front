import EventCardDesktop from "../../components/event/EventCardDesktop"
import EventCardMobile from "../../components/event/EventCardMobile"
import CreateEventModal from "../../components/event/CreateEventModal"
import { IoCloseCircleOutline } from "react-icons/io5"
import { useAuthStore } from "../../stores/authStore"
import { useGetEvents } from "../../hook/mutation/use-event.service"

const EventListPage = () => {

  const { user: currentUser } = useAuthStore()
  const isAdmin = currentUser?.role === 'admin' //Booleen pour savoir si le role de l'utilisateur est admin ou non

  const { data: events } = useGetEvents()


  const handleClose = () => {
    (document.getElementById('event_modal') as HTMLDialogElement).close()
  }

  return (
    <div className="flex flex-col px-3 py-5 h-full gap-6 bg-[#ecece6] dark:bg-[#161b27] flex-1">

      <section className="flex justify-between items-center">
        <h3 className="text-[#104e64] dark:text-[#e6dabb] text-xl md:text-2xl font-bold">
          Evènements du club
        </h3>

        {isAdmin && (
          <div>
            <button
              onClick={() => (document.getElementById('event_modal') as HTMLDialogElement).showModal()}
              className="btn text-left text-sm md:text-sm flex items-center bg-[#e6dabb] gap-2 w-fit rounded-xl cursor-pointer text-[#9b6581] dark:text-[#5e2c45] font-bold">
              + Nouveau
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

        )}


      </section>

      <div className="overflow-y-auto flex-1">
        <div className="md:hidden">
          {(events ?? []).map((event) => (
            <EventCardMobile key={event.id} event={event} />
          ))}
        </div>

        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6">
          {(events ?? []).map((event) => (
            <EventCardDesktop key={event.id} event={event} />
          ))}
        </div>
      </div>

    </div>
  )
}

export default EventListPage