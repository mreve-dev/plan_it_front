import { FaArrowDown, FaArrowLeft, FaArrowRight, FaChartBar, FaFile } from "react-icons/fa"
import { Link, useParams } from "react-router-dom"
import { colorsAvatar, getCategoryBorder, getCategoryColor } from "../../components/card.config"
import { FaPenToSquare, FaTrashCan } from "react-icons/fa6"
import { HiOutlineLocationMarker } from "react-icons/hi";
import { LuCalendar1 } from "react-icons/lu"
import type { IMission, IUserHasMission } from "../../types/mission.type"
import type { IEventHasDocument } from "../../types/document.type"
import DeleteEventModal from "../../components/event/DeleteEventModal"
import UpdateEventModal from "../../components/event/UpdateEventModal"
import CreateMissionModal from "../../components/mission/CreateMissionModal"
import { useAuthStore } from "../../stores/authStore"
import { useGetOneEvent } from "../../hook/mutation/use-event.service"
import { useQueryClient } from "@tanstack/react-query"
import { isEventPast } from "../../utils/EventPastDisableFunction";



const EventDetailPage = () => {

    const { user: currentUser } = useAuthStore()
    const isAdmin = currentUser?.role === 'admin'

    const { id } = useParams()

    const queryClient = useQueryClient()


    const { data: event } = useGetOneEvent(id)
    if (!event) return null

    const allRegistrations = event.missions.flatMap((mission: IMission) =>
        mission.missionSlots.flatMap(slot => slot.userHasMissions ?? [])
    )

    // Regroupe par utilisateur, en comptant le nombre d'inscriptions
    const volunteersMap = new Map<number, { user: IUserHasMission['user'], count: number }>()
    allRegistrations.forEach(uHm => {
        const existing = volunteersMap.get(uHm.userId)
        if (existing) {
            existing.count += 1
        } else {
            volunteersMap.set(uHm.userId, { user: uHm.user, count: 1 })
        }
    })


    const volunteers = Array.from(volunteersMap.values())

    const totalPlaces = event.missions.reduce((acc: number, mission: IMission) => acc + mission.missionSlots.reduce((a, slot) => a + slot.max_volunteers, 0), 0)

    const eventPast = event ? isEventPast(event) : false




    return (
        <div className="flex flex-col h-full gap-3 bg-[#ecece6] dark:bg-[#161b27] flex-1 ">

            {eventPast
                ? (
                    <div className="flex flex-col gap-1 text-center rounded-xl p-3 m-3 mb-0
                    bg-amber-500 text-amber-950 dark:bg-amber-600 dark:text-white">
                        <p className="font-semibold">
                            Cet évènement est déjà fini. Vous ne pouvez plus créer de nouvelles missions ni vous inscrire.
                        </p>
                        <p className="text-sm">
                            Vous pouvez toujours modifier ou supprimer les missions, les créneaux et l'évènement.
                        </p>

                    </div>
                )
                : null
            }



            <div className="m-1 min-h-0 flex-1 flex p-3 flex-col gap-4 text-[#104e64] dark:text-[#e6dabb]">

                <div className="flex justify-between ">

                    <Link to={'/event'} className="flex items-center gap-2 font-semibold">
                        <FaArrowLeft size={12} /> Evènements
                    </Link>

                    <div className="flex gap-2">

                        <div>
                            <button
                                onClick={() => (document.getElementById('stats_modal') as HTMLDialogElement).showModal()}
                                className="xl:hidden flex items-center justify-center cursor-pointer gap-2 bg-[#104e64] text-white w-12 md:w-full h-12 text-sm px-3 py-2 rounded-xl shadow-sm shadow-black/20 dark:shadow-black/40">
                                <FaChartBar size={14} /> <span className="hidden md:block">Statistiques</span>
                            </button>

                            <dialog id="stats_modal" className="modal xl:hidden">
                                <div className="modal-box bg-[#e6dabb] h-full w-full max-w-none rounded-none md:w-120 md:h-80 md:rounded-xl dark:bg-[#1e2433] flex flex-col justify-between  gap-5">

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
                                            className="btn btn-sm w-fit bg-[#104e64] text-white rounded-xl border-none text-lg px-7 py-5 lg:hidden shadow-sm shadow-black/20 dark:shadow-black/40">
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
                                className="btn flex items-center justify-center cursor-pointer gap-2 bg-[#104e64] text-white text-sm px-3 py-2 w-12 md:w-full h-12 rounded-xl shadow-sm shadow-black/20 dark:shadow-black/40 border-none">
                                <FaFile size={14} /> <span className="hidden md:block">Documents</span> {event.eventHasDocument.length > 0 ? `(${event.eventHasDocument.length})` : ''}
                            </button>

                            <dialog id="docs_modal" className="modal">
                                <div className="modal-box h-full w-full max-w-none md:h-80 md:w-100 rounded-none md:rounded-xl bg-[#e6dabb] dark:bg-[#1e2433] flex flex-col justify-between gap-5">
                                    <h3 className="text-lg font-bold text-[#104e64] dark:text-[#e6dabb] mb-4">Documents</h3>
                                    {event.eventHasDocument.length > 0 ? (
                                        <div className="flex flex-col gap-2">
                                            {event.eventHasDocument.map((eHd: IEventHasDocument) => (
                                                <a key={eHd.document.url} href={eHd.document.url} target="_blank" rel="noreferrer"
                                                    className="text-sm text-[#104e64] dark:text-[#e6dabb] flex items-center gap-2 bg-white/50 dark:bg-white/10 p-3 rounded-xl shadow-sm shadow-black/10 dark:shadow-black/30">
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
                                            className="btn btn-sm cursor-pointer w-fit bg-[#104e64] text-white border-none text-base px-7 py-5 mt-3 lg:hidden shadow-sm shadow-black/20 dark:shadow-black/40">
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




                <div className="min-h-0 flex flex-col gap-4 h-full overflow-y-auto md:overflow-y-hidden scrollbar-hide">


                    <section className={`bg-[#e6dabb] dark:bg-[#1e2433] flex gap-2 justify-between flex-col p-4 rounded-2xl font-bold border border-[#104e64]/10  dark:border-[#e6dabb]/10 border-l-4 ${getCategoryBorder(event.category.name)} md:flex-row `}>



                        <div className="flex flex-col gap-4 justify-between h-full md:flex-4 w-full">

                            <div className="flex items-center justify-between">
                                <p className={`${getCategoryColor(event.category.name)} rounded-full px-5 py-1 text-sm font-semibold text-center shadow-sm shadow-black/10 dark:shadow-black/30`}>
                                    {event.category.name}
                                </p>

                                {isAdmin && (
                                    <div className="flex items-center justify-center gap-3">
                                        <button onClick={() => (document.getElementById('update_event_modal') as HTMLDialogElement).showModal()} className="flex items-center justify-center  p-2 w-10 md:w-40 h-10 text-white gap-2 rounded-xl bg-[#4f9288] transition-transform active:scale-95 shadow-sm shadow-black/20 dark:shadow-black/40">
                                            <FaPenToSquare />
                                            <p className="hidden md:block">Modifier</p>
                                        </button>

                                        <UpdateEventModal
                                            event={event}
                                            onClose={() => (document.getElementById('update_event_modal') as HTMLDialogElement).close()}
                                            onSuccess={() => queryClient.refetchQueries({ queryKey: ['event', id] })}
                                        />

                                        <button onClick={() => (document.getElementById('delete_modal') as HTMLDialogElement).showModal()} className="flex items-center justify-center rounded-xl p-2 w-10 md:w-40 h-10 gap-2 text-red-900 dark:text-red-400 border-2 border-red-900 dark:border-red-400 transition-transform active:scale-95 shadow-sm shadow-black/10 dark:shadow-black/30">
                                            <FaTrashCan />
                                            <p className="hidden md:block">Supprimer</p>
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
                                )}
                            </div>

                            <h3 className="text-[#9b6581] text-lg md:text-2xl font-bold">
                                {event.name}
                            </h3>

                            <div className="flex flex-col gap-2">

                                {/* affichage des infos du tournoi: date, heures, nom, descriptions, catégorie */}

                                <div className="flex font-bold gap-2 items-center flex-wrap">

                                    <div className="flex md:hidden items-center gap-2 text-sm w-full">
                                        <div className="flex border border-[#c8c4a0] dark:border-[#3a4557] flex-col sm:flex-row rounded-lg px-2 py-1 justify-between items-center gap-2 w-full">
                                            <span className="bg-[#e6dabb] dark:bg-[#1e2433]">
                                                {new Date(event.start_date).toLocaleDateString('fr-FR', { day: "numeric", month: "numeric", year: "2-digit" })}
                                            </span>
                                            <span className="text-[#9b6581]">
                                                ({new Date(event.start_hour).toLocaleTimeString('fr-FR', { hour: "2-digit", minute: "2-digit" })})
                                            </span>
                                        </div>

                                        <span className="text-[#9b9b8a] dark:text-[#6b6f78]"><FaArrowRight /></span>

                                        <div className="flex border border-[#c8c4a0] dark:border-[#3a4557] flex-col rounded-lg px-2 py-1 justify-between items-center gap-2 sm:flex-row w-full">
                                            <span className="bg-[#e6dabb] dark:bg-[#1e2433]">
                                                {new Date(event.end_date).toLocaleDateString('fr-FR', { day: "numeric", month: "numeric", year: "2-digit" })}
                                            </span>
                                            <span className="text-[#9b6581]">
                                                ({new Date(event.end_hour).toLocaleTimeString('fr-FR', { hour: "2-digit", minute: "2-digit" })})
                                            </span>
                                        </div>
                                    </div>

                                    <div className="hidden md:flex md:items-center gap-2 text-sm">
                                        <div className="hidden md:flex items-center">
                                            <LuCalendar1 size={18} />

                                        </div>


                                        <div className="flex border border-[#c8c4a0] dark:border-[#3a4557] w-full rounded-lg px-2 py-1 justify-between items-center gap-2">
                                            <span className="bg-[#e6dabb] dark:bg-[#1e2433]">
                                                {new Date(event.start_date).toLocaleDateString('fr-FR', { day: "numeric", month: "long", year: "numeric" })}
                                            </span>
                                            <span className="text-[#9b6581]">
                                                ({new Date(event.start_hour).toLocaleTimeString('fr-FR', { hour: "2-digit", minute: "2-digit" })})
                                            </span>
                                        </div>

                                        <span className="hidden md:block text-[#9b9b8a] dark:text-[#6b6f78]">
                                            <FaArrowRight />
                                        </span>

                                        <span className="md:hidden text-[#9b9b8a] dark:text-[#6b6f78]">
                                            <FaArrowDown />
                                        </span>

                                        <div className="flex border border-[#c8c4a0] dark:border-[#3a4557] rounded-lg px-2 py-1 justify-between items-center gap-2 w-full">
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
                                        return diff > 1 ? <span className="hidden xl:block bg-[#E1F5EE] dark:bg-[#0d2e28] text-[#085041] dark:text-[#6ab5a8] text-xs px-2 py-1 rounded-lg shadow-sm shadow-black/10 dark:shadow-black/30">{diff} jours</span> : <span className="hidden xl:block bg-[#E1F5EE] dark:bg-[#0d2e28] text-[#085041] dark:text-[#6ab5a8] text-xs px-2 py-1 rounded-lg shadow-sm shadow-black/10 dark:shadow-black/30">1 journée</span>
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

                            <p className="font-normal text-center xl:text-left">
                                {event.description}
                            </p>

                        </div>





                    </section>






                    <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-3 md:min-h-0 xl:flex-1 h-full">
                        <section className="bg-[#e6dabb] dark:bg-[#1e2433] flex gap-4 justify-between flex-col p-4 rounded-2xl font-bold md:min-h-0">

                            <div className="flex flex-col justify-between items-center gap-5 w-full h-full min-h-0">

                                <div className="flex justify-between items-center w-full ">


                                    <h4 className="text-lg text-[#104e64] dark:text-[#e6dabb] font-bold">
                                        Missions(s)
                                    </h4>

                                    {isAdmin && (
                                        <div>
                                            <button
                                                disabled={eventPast}
                                                onClick={() => (document.getElementById('create_mission_modal') as HTMLDialogElement).showModal()}
                                                className="btn border-none text-white gap-2 rounded-xl bg-[#4f9288] transition-transform active:scale-95 shadow-sm shadow-black/20 dark:shadow-black/40">
                                                + Nouvelle mission
                                            </button>

                                            <CreateMissionModal
                                                eventId={event.id}
                                                onClose={() => (document.getElementById('create_mission_modal') as HTMLDialogElement).close}
                                                onSuccess={() => queryClient.refetchQueries({ queryKey: ['event', id] })} />
                                        </div>

                                    )}

                                </div>


                                <div className="flex-1 flex flex-col w-full min-h-0 md:overflow-y-auto ">
                                    {event.missions.length > 0 ? (
                                        <div className="flex flex-col gap-3">
                                            {event.missions.slice(0, 3).map((mission: IMission) => {
                                                const registered = mission.missionSlots.reduce((a, slot) => a + (slot.userHasMissions?.length ?? 0), 0)
                                                const total = mission.missionSlots.reduce((a, slot) => a + slot.max_volunteers, 0)

                                                // On rassemble les inscrits de TOUS les créneaux de cette mission
                                                const missionRegistrations = mission.missionSlots.flatMap(slot => slot.userHasMissions ?? [])

                                                // On déduplique : une personne inscrite sur plusieurs créneaux n'apparaît qu'une fois
                                                const uniqueVolunteers = Array.from(
                                                    new Map(missionRegistrations.map(uhm => [uhm.userId, uhm])).values()
                                                )


                                                return (
                                                    <div
                                                        key={mission.id}
                                                        className="bg-[#9b6581]/40 dark:bg-[#9b6581]/20 p-3 rounded-xl flex flex-col justify-between shadow-sm shadow-black/10 dark:shadow-black/30">

                                                        <div className="flex justify-between">
                                                            <div>
                                                                <p>{mission.name}</p>
                                                                <p>{mission.missionSlots.length} créneau(x)</p>
                                                            </div>
                                                            <p className="text-lg">{registered} / {total}</p>

                                                        </div>


                                                        {
                                                            uniqueVolunteers.length > 0 && (
                                                                <div className="flex flex-col gap-3 my-2">

                                                                    <div className="flex items-center">

                                                                        <div className="flex -space-x-3">
                                                                            {uniqueVolunteers.slice(0, 3).map(uhm => (
                                                                                <div
                                                                                    key={uhm.userId}
                                                                                    title={`${uhm.user.firstname}${uhm.user.lastname}`}
                                                                                    className={`w-8 h-8 p-4 rounded-full ${colorsAvatar(uhm.userId)} text-base font-bold flex items-center justify-center border-2 border-[#e6dabb] dark:border-[#1e2433]`}>
                                                                                    {uhm.user.firstname[0]}{uhm.user.lastname[0]}
                                                                                </div>
                                                                            ))}

                                                                        </div>



                                                                        {uniqueVolunteers.length > 3 && (
                                                                            <span>
                                                                                +{uniqueVolunteers.length - 3}
                                                                            </span>
                                                                        )}
                                                                    </div>





                                                                    <div className="flex gap-2 items-center flex-wrap">
                                                                        {uniqueVolunteers.slice(0, 3).map(uhm => (
                                                                            <div
                                                                                key={uhm.userId}
                                                                                title={`${uhm.user.firstname}${uhm.user.lastname}`}
                                                                                className="px-2 py-1 rounded-full bg-[#4f9288] text-white text-sm font-semibold flex items-center justify-center shadow-2xs shadow-[#]">
                                                                                {uhm.user.firstname} {uhm.user.lastname[0]}.
                                                                            </div>
                                                                        ))}
                                                                    </div>

                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                )
                                            })}
                                        </div>
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

                                <Link
                                    to={`/event/${id}/missions`}
                                    className="flex items-center gap-3 cursor-pointer border-dashed border-2 rounded-2xl px-4 py-2">
                                    Voir toutes les missions <FaArrowRight />
                                </Link>
                            </div>



                        </section>










                        <section className="hidden flex-1 bg-[#e6dabb] dark:bg-[#1e2433] md:flex md:gap-4 flex-col h-full p-4 rounded-2xl font-bold">
                            <h4 className="text-lg text-[#104e64] dark:text-[#e6dabb] font-bold">
                                Bénévole(s) inscrit(s)
                            </h4>

                            {volunteers.length > 0 ? (
                                volunteers.map(({ user, count }) => {
                                    const isUserAdmin = user.role === 'admin'

                                    // Avatar : couleurs vives qui changent selon le mode
                                    const avatarBg = isUserAdmin ? 'bg-[#534AB7] dark:bg-[#AFA9EC]' : 'bg-[#D85A30] dark:bg-[#F0997B]'
                                    const avatarText = isUserAdmin ? 'text-white dark:text-[#26215C]' : 'text-white dark:text-[#4A1B0C]'

                                    // Badge : pastels existants, inchangés
                                    const badgeBg = isUserAdmin ? 'bg-[#CECBF6] dark:bg-[#3C3489]' : 'bg-[#F5C4B3] dark:bg-[#712B13]'
                                    const badgeText = isUserAdmin ? 'text-[#3C3489] dark:text-[#CECBF6]' : 'text-[#712B13] dark:text-[#F5C4B3]'



                                    return (
                                        <div key={user.id} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white shrink-0 shadow-sm shadow-black/20 dark:shadow-black/40 ${avatarBg} ${avatarText}`}
                                                >
                                                    {user.firstname[0]}{user.lastname[0]}
                                                </div>

                                                <p className="flex-1 font-semibold text-[#104e64] dark:text-[#e6dabb]">
                                                    {user.firstname} {user.lastname}
                                                </p>
                                            </div>

                                            <p className={`text-sm font-bold px-3 py-1 rounded-full shadow-sm shadow-black/10 dark:shadow-black/30 ${badgeBg} ${badgeText}`}>
                                                {count} créneau{count > 1 ? 'x' : ''}
                                            </p>
                                        </div>
                                    )
                                })
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

                            <div className="bg-amber-100 dark:bg-[#2a3547] rounded-xl p-3 shadow-sm shadow-black/10 dark:shadow-black/30">
                                <p>Missions</p>
                                <p>{event.missions.length}</p>
                            </div>

                            <div className="bg-amber-100 dark:bg-[#2a3547] rounded-xl p-3 shadow-sm shadow-black/10 dark:shadow-black/30">
                                <p>Bénévoles inscrits</p>
                                <p>{volunteers.length} / {totalPlaces}</p>
                            </div>

                        </section>

                    </section>

                </div>





            </div>

        </div>
    )
}

export default EventDetailPage