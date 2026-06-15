import { FaArrowLeft, FaRegClock } from "react-icons/fa"
import { Link, useParams } from "react-router-dom"
import { useApi } from "../../hook/useApi"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { getOneEvent } from "../../services/api/event"
import { getCategoryBorder, getCategoryColor } from "../../components/event/eventcard.config"
import { FaPenToSquare, FaTrashCan } from "react-icons/fa6"
import { HiOutlineLocationMarker } from "react-icons/hi";
import { LuCalendar1 } from "react-icons/lu"
import type { IMission, IUserHasMission } from "../../types/mission.type"
import type { IEventHasDocument } from "../../types/document.type"
import DeleteEventModal from "../../components/event/DeleteEventModal"
import UpdateEventModal from "../../components/event/UpdateEventModal"
import CreateMissionModal from "../../components/mission/CreateMissionModal"



const EventDetailPage = () => {

    const api = useApi()

    // hook de React Router qui lit les paramètres dans l'URL. ex : pour la route /event/:id et que l'utilisateur va sur /event/3, useParams donne { id: "3" }
    const { id } = useParams()

    const queryClient = useQueryClient()


    const { data: event } = useQuery({
        queryKey: ['event', id],
        queryFn: () => getOneEvent(api, +id!)
    })

    if (!event) return null

    const volunteers = event.missions.flatMap((mission: IMission) => mission.userHasMission ?? [])

    const totalPlaces = event.missions.reduce((acc: number, mission: IMission) => acc + mission.max_volunteers, 0)

    return (
        <div className="flex flex-col h-full p-3 gap-3 bg-[#ecece6] flex-1">
            <div className="m-1 h-full flex flex-col gap-4 text-[#104e64]">

                <Link to={'/event'} className="flex items-center gap-2  font-semibold">
                    <FaArrowLeft size={12} /> Retour aux évènements
                </Link>

                <section className={`bg-[#e6dabb] flex gap-2 justify-between flex-col p-4 rounded-2xl font-bold border border-[#104e64]/10 border-l-4 ${getCategoryBorder(event.category.name)} `}>

                    <div className="flex justify-between">
                        <div className="flex flex-col gap-2">

                            <div className="flex">
                                <p className={` ${getCategoryColor(event.category.name)} rounded-full px-5 py-1 text-sm font-semibold text-center`}>
                                    {event.category.name}
                                </p>

                            </div>



                            <h3 className="text-[#9b6581] text-lg md:text-2xl font-bold">
                                {event.name}
                            </h3>

                            <div className="flex flex-col gap-2 xl:flex-row">
                                <p className="flex items-center gap-2">
                                    <LuCalendar1 size={18} />


                                    {new Date(event.date).toLocaleDateString('fr-FR',
                                        {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric"
                                        }
                                    )}
                                </p>

                                <p className="flex items-center gap-2">
                                    <FaRegClock size={18} />

                                    {new Date(event.start_hour).toLocaleTimeString('fr-FR', {
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })} - {new Date(event.end_hour).toLocaleTimeString('fr-FR', {
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })}
                                </p>

                                {event.location ? (
                                    <p className="flex items-center gap-2">
                                        <HiOutlineLocationMarker size={18} />
                                        {event.location}
                                    </p>
                                ) : (
                                    <p className="flex items-center gap-2">
                                        <HiOutlineLocationMarker size={18} />Lieu non défini
                                    </p>
                                )}

                            </div>

                            <p className="font-normal hidden lg:block">
                                {event.description}
                            </p>
                        </div>

                        <div className="flex items-start gap-2">


                            <UpdateEventModal event={event} onClose={() => (document.getElementById('update_modal') as HTMLDialogElement).close()} onSuccess={() => console.log('évènement modifié')
                            } />


                            <button onClick={() => (document.getElementById('update_modal') as HTMLDialogElement).showModal()} className="flex items-center justify-center w-15 p-4 lg:w-40 lg:h-10 text-white gap-2 rounded-xl bg-[#4f9288] transition-transform active:scale-95">
                                <FaPenToSquare />

                                <p className="hidden lg:block">
                                    Modifier
                                </p>
                            </button>


                            <button onClick={() => (document.getElementById('delete_modal') as HTMLDialogElement).showModal()} className=" flex items-center justify-center rounded-xl w-15 p-4 lg:w-40 lg:h-10 gap-2 text-red-900 border-2 border-red-900 transition-transform active:scale-95">
                                <FaTrashCan />
                                <p className="hidden lg:block">
                                    Supprimer
                                </p>
                            </button>

                            <div>
                                <DeleteEventModal eventId={event.id} eventName={event.name} />
                            </div>
                        </div>
                    </div>

                </section>

                {/* Si length > 0 la section s'affichera et sinon rien ne s'affiche */}

                {event.eventHasDocument.length > 0 && (
                    <section>
                        <div className={`bg-[#e6dabb] flex gap-2 justify-between flex-col h-full p-4 rounded-2xl font-bold`}>
                            <h4 className="text-lg text-[#104e64] font-bold">
                                Document(s)
                            </h4>
                            {event.eventHasDocument.map((eHd: IEventHasDocument) => (
                                <a href={eHd.document.url} target="_blank" rel="noreferrer" className="text-sm font-normal text-[#104e64]">
                                    {eHd.document.name}
                                </a>

                            ))}
                        </div>
                    </section>

                )}


                <section className="h-[80%] grid md:grid-cols-2 xl:grid-cols-3 gap-3">
                    <section className={`bg-[#e6dabb] flex gap-4 justify-between flex-col h-full p-4 rounded-2xl font-bold`}>

                        <div className="flex justify-between items-center">

                            <h4 className="text-lg text-[#104e64] font-bold">
                                Missions(s)
                            </h4>

                            <button onClick={() => (document.getElementById('create_mission_modal') as HTMLDialogElement).showModal()} className="btn border-none text-white gap-2 rounded-xl bg-[#4f9288] transition-transform active:scale-95">
                                + Nouvelle mission
                            </button>

                            <CreateMissionModal
                                eventId={event.id}
                                onClose={() => (document.getElementById('create_mission_modal') as HTMLDialogElement).close}
                                onSuccess={() => queryClient.refetchQueries({ queryKey: ['event', id] })} />

                        </div>



                        <div className="flex-1 flex flex-col gap-3">
                            {event.missions.length > 0 ? (

                                <>
                                    {
                                        event.missions.slice(0, 3).map((mission: IMission) => (
                                            <div className="bg-[#9b6581]/40 p-2 rounded-xl flex justify-between items-center">

                                                <div>
                                                    <p>{mission.name}</p>

                                                    <p className="text-sm text-[#104e64]/65">
                                                        {new Date(mission.start_hour).toLocaleTimeString('fr-FR', {
                                                            hour: "2-digit",
                                                            minute: "2-digit"
                                                        })} - {new Date(mission.end_hour).toLocaleTimeString('fr-FR', {
                                                            hour: "2-digit",
                                                            minute: "2-digit"
                                                        })}
                                                    </p>
                                                </div>

                                                <p className="text-lg">
                                                    {mission.userHasMission?.length} / {mission.max_volunteers}
                                                </p>

                                            </div>
                                        ))
                                    }

                                </>

                            ) : (

                                <div className="flex justify-center items-center h-full">
                                    <div>
                                        <p className=" text-xs text-[#4f9288] font-bold pt-2 mt-auto cursor-pointer">
                                            Aucune mission pour le moment
                                        </p>
                                    </div>
                                </div>

                            )}

                        </div>



                    </section>

                    <section className="hidden flex-1 bg-[#e6dabb] md:flex md:gap-2 justify-between flex-col h-full p-4 rounded-2xl font-bold">
                        <h4 className="text-lg text-[#104e64] font-bold">
                            Bénévole(s) inscrit(s)
                        </h4>

                        {volunteers.length > 0 ? (
                            volunteers.map((uHm: IUserHasMission) => (
                                <div key={uHm.userId}>
                                    <div>
                                        {uHm.user.firstname[0]}{uHm.user.lastname[0]}
                                    </div>
                                    <p>{uHm.user.firstname} {uHm.user.lastname}</p>
                                </div>
                            ))
                        ) : (
                            <div className="flex justify-center items-center h-full">
                                <div>
                                    <p className=" text-xs text-[#4f9288] font-bold pt-2 mt-auto cursor-pointer">
                                        Aucun bénévole pour le moment
                                    </p>
                                </div>
                            </div>
                        )}

                    </section>

                    <section className="hidden xl:flex-1 xl:bg-[#e6dabb] xl:flex lg:gap-4 xl:justify-start xl:flex-col xl:h-full lg:p-4 xl:rounded-2xl xl:font-bold">
                        <h4 className="text-lg text-[#104e64] font-bold">
                            Statistiques
                        </h4>

                        <div className="bg-amber-100 rounded-xl p-3">
                            <p>
                                Missions
                            </p>
                            <p>
                                {event.missions.length}
                            </p>
                        </div>

                        <div className="bg-amber-100 rounded-xl p-3">
                            <p>
                                Bénévoles inscrits
                            </p>
                            <p>
                                {volunteers.length} / {totalPlaces}
                            </p>
                        </div>

                    </section>

                </section>

            </div>

        </div>
    )
}

export default EventDetailPage
