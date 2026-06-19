import { FaArrowDown, FaArrowLeft, FaArrowRight, FaChartBar, FaFile } from "react-icons/fa"
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
import { useAuthStore } from "../../stores/authStore"



const EventDetailPage = () => {

    const api = useApi()
    const { user: currentUser } = useAuthStore()
    const isAdmin = currentUser?.role === 'admin'

    const { id } = useParams()

    const queryClient = useQueryClient()


    const { data: event } = useQuery({
        queryKey: ['event', id],
        queryFn: () => getOneEvent(api, +id!)
    })

    if (!event) return null

    const volunteers = event.missions.flatMap((mission: IMission) => mission.missionSlots.flatMap(slot => slot.userHasMissions ?? []))

    const totalPlaces = event.missions.reduce((acc: number, mission: IMission) => acc + mission.missionSlots.reduce((a, slot) => a + slot.max_volunteers, 0), 0)

    return (
        <div className="flex flex-col h-full p-3 gap-3 bg-[#ecece6] dark:bg-[#161b27] flex-1">
            <div className="m-1 h-full flex flex-col gap-4 text-[#104e64] dark:text-[#e6dabb]">

                <div className="flex justify-between">
                    <Link to={'/event'} className="flex items-center gap-2 font-semibold">
                        <FaArrowLeft size={12} /> Retour aux évènements
                    </Link>

                    <div className="flex gap-2">

                        <div>
                            <button
                                onClick={() => (document.getElementById('stats_modal') as HTMLDialogElement).showModal()}
                                className="xl:hidden flex items-center cursor-pointer gap-2 bg-[#104e64] text-white text-sm px-3 py-2 rounded-xl">
                                <FaChartBar size={14} /> Statistiques
                            </button>

                            <dialog id="stats_modal" className="modal xl:hidden">
                                <div className="modal-box bg-[#e6dabb] dark:bg-[#1e2433] flex flex-col gap-5">

                                    <div>
                                        <h3 className="text-lg font-bold text-[#104e64] dark:text-[#e6dabb] mb-4">Statistiques</h3>

                                        <div className="flex flex-col gap-3">
                                            <div className="bg-white/50 dark:bg-white/10 rounded-xl p-3">
                                                <p className="text-sm text-[#5a7a85] dark:text-[#a0a8a8]">Missions</p>
                                                <p className="text-2xl font-bold text-[#104e64] dark:text-[#e6dabb]">{event.missions.length}</p>
                                            </div>
                                            <div className="bg-white/50 dark:bg-white/10 rounded-xl p-3">
                                                <p className="text-sm text-[#5a7a85] dark:text-[#a0a8a8]">Bénévoles inscrits</p>
                                                <p className="text-2xl font-bold text-[#104e64] dark:text-[#e6dabb]">{volunteers.length} / {totalPlaces}</p>
                                            </div>
                                        </div>

                                    </div>

                                    <div className="flex justify-center">
                                        <button
                                            onClick={() => (document.getElementById('stats_modal') as HTMLDialogElement).close()}
                                            className="btn btn-sm w-fit bg-[#104e64] text-white rounded-xl border-none lg:hidden">
                                            Fermer
                                        </button>
                                    </div>
                                </div>
                                <form method="dialog" className="modal-backdrop">
                                    <button></button>
                                </form>
                            </dialog>
                        </div>

                        <div>
                            <button
                                onClick={() => (document.getElementById('docs_modal') as HTMLDialogElement).showModal()}
                                className="flex items-center cursor-pointer gap-2 bg-[#104e64] text-white text-sm px-3 py-2 rounded-xl">
                                <FaFile size={14} /> Documents {event.eventHasDocument.length > 0 ? `(${event.eventHasDocument.length})` : ''}
                            </button>

                            <dialog id="docs_modal" className="modal">
                                <div className="modal-box bg-[#e6dabb] dark:bg-[#1e2433] flex flex-col gap-5">
                                    <h3 className="text-lg font-bold text-[#104e64] dark:text-[#e6dabb] mb-4">Documents</h3>
                                    {event.eventHasDocument.length > 0 ? (
                                        <div className="flex flex-col gap-2">
                                            {event.eventHasDocument.map((eHd: IEventHasDocument) => (
                                                <a key={eHd.document.url} href={eHd.document.url} target="_blank" rel="noreferrer"
                                                    className="text-sm text-[#104e64] dark:text-[#e6dabb] flex items-center gap-2 bg-white/50 dark:bg-white/10 p-3 rounded-xl">
                                                    <FaFile size={14} /> {eHd.document.name}
                                                </a>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-[#4f9288] font-semibold text-center">Aucun document pour le moment</p>
                                    )}
                                    <div className="flex justify-center">
                                        <button
                                            onClick={() => (document.getElementById('docs_modal') as HTMLDialogElement).close()}
                                            className="btn btn-sm cursor-pointer w-fit bg-[#104e64] text-white border-none mt-3 lg:hidden">
                                            Fermer
                                        </button>
                                    </div>
                                </div>
                                <form method="dialog" className="modal-backdrop">
                                    <button></button>
                                </form>
                            </dialog>
                        </div>

                    </div>
                </div>

                <section className={`bg-[#e6dabb] dark:bg-[#1e2433] flex gap-2 justify-between flex-col p-4 rounded-2xl font-bold border border-[#104e64]/10 dark:border-[#e6dabb]/10 border-l-4 ${getCategoryBorder(event.category.name)}`}>

                    <div className="flex flex-col gap-3 justify-between">
                        <div className="flex justify-between gap-3">

                            <div className="flex flex-col gap-2">

                                <div className="flex">
                                    <p className={`${getCategoryColor(event.category.name)} rounded-full px-5 py-1 text-sm font-semibold text-center`}>
                                        {event.category.name}
                                    </p>
                                </div>

                                <h3 className="text-[#9b6581] text-lg md:text-2xl font-bold">
                                    {event.name}
                                </h3>

                                <div className="flex flex-col gap-2">

                                    {/* affichage des infos du tournoi: date, heures, nom, descriptions, catégorie */}

                                    <div className="flex font-bold gap-2 items-center flex-wrap">

                                        <div className="flex md:hidden items-center gap-2 text-sm">
                                            <div className="flex border border-[#c8c4a0] dark:border-[#3a4557] flex-col sm:flex-row rounded-lg px-2 py-1 justify-between items-center gap-2">
                                                <span className="bg-[#e6dabb] dark:bg-[#1e2433]">
                                                    {new Date(event.start_date).toLocaleDateString('fr-FR', { day: "numeric", month: "numeric", year: "2-digit" })}
                                                </span>
                                                <span className="text-[#9b6581]">
                                                    ({new Date(event.start_hour).toLocaleTimeString('fr-FR', { hour: "2-digit", minute: "2-digit" })})
                                                </span>
                                            </div>

                                            <span className="text-[#9b9b8a]"><FaArrowRight /></span>

                                            <div className="flex border border-[#c8c4a0] dark:border-[#3a4557] flex-col rounded-lg px-2 py-1 justify-between items-center gap-2 sm:flex-row">
                                                <span className="bg-[#e6dabb] dark:bg-[#1e2433]">
                                                    {new Date(event.end_date).toLocaleDateString('fr-FR', { day: "numeric", month: "numeric", year: "2-digit" })}
                                                </span>
                                                <span className="text-[#9b6581]">
                                                    ({new Date(event.end_hour).toLocaleTimeString('fr-FR', { hour: "2-digit", minute: "2-digit" })})
                                                </span>
                                            </div>
                                        </div>

                                        <div className="hidden md:flex md:items-center gap-2 text-sm">
                                            <LuCalendar1 size={18} className="hidden md:block" />

                                            <div className="flex border border-[#c8c4a0] dark:border-[#3a4557] rounded-lg px-2 py-1 justify-between items-center gap-2">
                                                <span className="bg-[#e6dabb] dark:bg-[#1e2433]">
                                                    {new Date(event.start_date).toLocaleDateString('fr-FR', { day: "numeric", month: "long", year: "numeric" })}
                                                </span>
                                                <span className="text-[#9b6581]">
                                                    ({new Date(event.start_hour).toLocaleTimeString('fr-FR', { hour: "2-digit", minute: "2-digit" })})
                                                </span>
                                            </div>

                                            <span className="hidden md:block text-[#9b9b8a]"><FaArrowRight /></span>
                                            <span className="md:hidden text-[#9b9b8a]"><FaArrowDown /></span>

                                            <div className="flex border border-[#c8c4a0] dark:border-[#3a4557] rounded-lg px-2 py-1 justify-between items-center gap-2">
                                                <span className="bg-[#e6dabb] dark:bg-[#1e2433]">
                                                    {new Date(event.end_date).toLocaleDateString('fr-FR', { day: "numeric", month: "long", year: "numeric" })}
                                                </span>
                                                <span className="text-[#9b6581]">
                                                    ({new Date(event.end_hour).toLocaleTimeString('fr-FR', { hour: "2-digit", minute: "2-digit" })})
                                                </span>
                                            </div>
                                        </div>

                                        {(() => {
                                            const diff = Math.round((new Date(event.end_date).getTime() - new Date(event.start_date).getTime()) / (1000 * 60 * 60 * 24)) + 1
                                            return diff > 1 ? <span className="hidden xl:block bg-[#E1F5EE] dark:bg-[#0d2e28] text-[#085041] dark:text-[#6ab5a8] text-xs px-2 py-1 rounded-lg">{diff} jours</span> : <span className="hidden xl:block bg-[#E1F5EE] dark:bg-[#0d2e28] text-[#085041] dark:text-[#6ab5a8] text-xs px-2 py-1 rounded-lg">1 journée</span>
                                        })()}

                                    </div>

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
                            </div>


                            {isAdmin && (
                                <div>
                                    <div className="flex gap-3">
                                        <button onClick={() => (document.getElementById('update_modal') as HTMLDialogElement).showModal()} className="flex items-center justify-center w-15 p-4 lg:w-40 lg:h-10 text-white gap-2 rounded-xl bg-[#4f9288] transition-transform active:scale-95">
                                            <FaPenToSquare />
                                            <p className="hidden lg:block">Modifier</p>
                                        </button>

                                        <UpdateEventModal
                                            event={event}
                                            onClose={() => (document.getElementById('update_event_modal') as HTMLDialogElement).close()}
                                            onSuccess={() => queryClient.refetchQueries({ queryKey: ['event', id] })}
                                        />

                                        <button onClick={() => (document.getElementById('delete_modal') as HTMLDialogElement).showModal()} className="flex items-center justify-center rounded-xl w-15 p-4 lg:w-40 lg:h-10 gap-2 text-red-900 dark:text-red-400 border-2 border-red-900 dark:border-red-400 transition-transform active:scale-95">
                                            <FaTrashCan />
                                            <p className="hidden lg:block">Supprimer</p>
                                        </button>

                                        <DeleteEventModal
                                            eventId={event.id}
                                            eventName={event.name}
                                            onClose={() => (document.getElementById('delete_modal') as HTMLDialogElement).close()}
                                            onSuccess={() => {
                                                queryClient.invalidateQueries({ queryKey: ['events'] })
                                            }}
                                        />

                                    </div>

                                </div>
                            )}



                        </div>
                        <p className="font-normal text-center xl:text-left">
                            {event.description}
                        </p>
                    </div>

                </section>

                <section className="h-[80%] grid md:grid-cols-2 xl:grid-cols-3 gap-3">
                    <section className="bg-[#e6dabb] dark:bg-[#1e2433] flex gap-4 justify-between flex-col h-full p-4 rounded-2xl font-bold">

                        <div className="flex justify-between items-center">
                            <Link to={`/event/${id}/missions`}>
                                <h4 className="text-lg text-[#104e64] dark:text-[#e6dabb] font-bold">
                                    Missions(s)
                                </h4>
                            </Link>

                            {isAdmin && (
                                <div>
                                    <button onClick={() => (document.getElementById('create_mission_modal') as HTMLDialogElement).showModal()} className="btn border-none text-white gap-2 rounded-xl bg-[#4f9288] transition-transform active:scale-95">
                                        + Nouvelle mission
                                    </button>

                                    <CreateMissionModal
                                        eventId={event.id}
                                        onClose={() => (document.getElementById('create_mission_modal') as HTMLDialogElement).close}
                                        onSuccess={() => queryClient.refetchQueries({ queryKey: ['event', id] })} />
                                </div>

                            )}


                        </div>

                        <div className="flex-1 flex flex-col gap-3">
                            {event.missions.length > 0 ? (
                                <>
                                    {event.missions.slice(0, 3).map((mission: IMission) => {
                                        const registered = mission.missionSlots.reduce((a, slot) => a + (slot.userHasMissions?.length ?? 0), 0)
                                        const total = mission.missionSlots.reduce((a, slot) => a + slot.max_volunteers, 0)
                                        return (
                                            <div key={mission.id} className="bg-[#9b6581]/40 dark:bg-[#9b6581]/20 p-2 rounded-xl flex justify-between items-center">
                                                <div>
                                                    <p>{mission.name}</p>
                                                    <p>{mission.missionSlots.length} créneau(x)</p>
                                                </div>
                                                <p className="text-lg">{registered} / {total}</p>
                                            </div>
                                        )
                                    })}
                                </>
                            ) : (
                                <div className="flex justify-center items-center h-full">
                                    <div>
                                        <p className="text-xs text-[#4f9288] font-bold pt-2 mt-auto cursor-pointer">
                                            Aucune mission pour le moment
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                    </section>

                    <section className="hidden flex-1 bg-[#e6dabb] dark:bg-[#1e2433] md:flex md:gap-2 justify-between flex-col h-full p-4 rounded-2xl font-bold">
                        <h4 className="text-lg text-[#104e64] dark:text-[#e6dabb] font-bold">
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
                                    <p className="text-xs text-[#4f9288] font-bold pt-2 mt-auto cursor-pointer">
                                        Aucun bénévole pour le moment
                                    </p>
                                </div>
                            </div>
                        )}
                    </section>

                    <section className="hidden xl:flex-1 xl:bg-[#e6dabb] dark:xl:bg-[#1e2433] xl:flex lg:gap-4 xl:justify-start xl:flex-col xl:h-full lg:p-4 xl:rounded-2xl xl:font-bold">
                        <h4 className="text-lg text-[#104e64] dark:text-[#e6dabb] font-bold">
                            Statistiques
                        </h4>

                        <div className="bg-amber-100 dark:bg-[#2a3547] rounded-xl p-3">
                            <p>Missions</p>
                            <p>{event.missions.length}</p>
                        </div>

                        <div className="bg-amber-100 dark:bg-[#2a3547] rounded-xl p-3">
                            <p>Bénévoles inscrits</p>
                            <p>{volunteers.length} / {totalPlaces}</p>
                        </div>

                    </section>

                </section>

            </div>

        </div>
    )
}

export default EventDetailPage