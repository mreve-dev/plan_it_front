import EventCardDesktop from "../../components/event/EventCardDesktop"
import EventCardMobile from "../../components/event/EventCardMobile"
import type { IEvent } from "../../types/event.type"
import CreateEventModal from "../../components/event/CreateEventModal"
import { IoCloseCircleOutline } from "react-icons/io5"

const EventListPage = () => {

  const events: IEvent[] = [
    {
      id: 1,
      name: "Le petit tournoi des familles",
      description: "Premier tournoi où petits et grands peuvent venir s'amuser en famille",
      date: new Date("2026-06-15"),
      start_hour: new Date("1970-01-01T09:00:00"),
      end_hour: new Date("1970-01-01T18:00:00"),
      location: "Gymnase Leclerc",
      categoryId: 1,
      category: { id: 1, name: "Compétition", createdAt: new Date() },
      creatorId: 1,
      documentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      missions: []
    },
    {
      id: 2,
      name: "Gala de fin de saison",
      description: "Premier tournoi où petits et grands peuvent venir s'amuser en famille",
      date: new Date("2026-06-28"),
      start_hour: new Date("1970-01-01T19:00:00"),
      end_hour: new Date("1970-01-01T23:00:00"),
      location: "Salle des fêtes",
      categoryId: 2,
      category: { id: 2, name: "Cérémonie", createdAt: new Date() },
      creatorId: 1,
      documentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      missions: []
    },

    {
      id: 1,
      name: "Le petit tournoi des amis",
      description: "Premier tournoi où petits et grands peuvent venir s'amuser en famille",
      date: new Date("2026-06-15"),
      start_hour: new Date("1970-01-01T09:00:00"),
      end_hour: new Date("1970-01-01T18:00:00"),
      location: "Gymnase Leclerc",
      categoryId: 1,
      category: { id: 1, name: "Compétition", createdAt: new Date() },
      creatorId: 1,
      documentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      missions: []
    },
    {
      id: 2,
      name: "Gala de fin de saison 2",
      description: "Premier tournoi où petits et grands peuvent venir s'amuser en famille",
      date: new Date("2026-06-28"),
      start_hour: new Date("1970-01-01T19:00:00"),
      end_hour: new Date("1970-01-01T23:00:00"),
      location: "Salle des fêtes",
      categoryId: 2,
      category: { id: 2, name: "Cérémonie", createdAt: new Date() },
      creatorId: 1,
      documentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      missions: []
    }
  ]

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
          {events.map((events) => (
            <EventCardMobile key={events.name} event={events} />
          ))}
        </div>

        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3">
          {events.map((events) => (
            <EventCardDesktop key={events.name} event={events} />
          ))}
        </div>

      </div>

    </div>
  )
}

export default EventListPage
