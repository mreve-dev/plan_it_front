import { FaArrowLeft } from "react-icons/fa"
import { Link, useParams } from "react-router-dom"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useApi } from "../../hook/useApi"
import { useAuthStore } from "../../stores/authStore"
import { getOneEvent } from "../../services/api/event"
import type { IMission } from "../../types/mission.type"
import MissionCard from "../../components/mission/MissionCard"
import { isEventPast } from "../../utils/EventPastDisableFunction"
import CreateMissionModal from "../../components/mission/CreateMissionModal"

const MissionListPage = () => {

    const api = useApi()

    const { id } = useParams()
    const { user: currentUser } = useAuthStore()

    const isAdmin = currentUser?.role === "admin"

    const { data: event } = useQuery({
        queryKey: ['event', id],
        queryFn: () => getOneEvent(api, +id!)
    })

    const queryClient = useQueryClient()

    const eventPast = event ? isEventPast(event) : false


    return (
        <div className="h-full py-4 pl-4 bg-[#ecece6] dark:bg-[#161b27] flex-1 flex flex-col gap-5">

            {eventPast && (
                <div className="flex flex-col gap-1 text-center rounded-xl p-3 shrink-0
                    bg-amber-500 text-amber-950
                    dark:bg-amber-600 dark:text-white">
                    <p className="font-bold">
                        Cet évènement est déjà fini. Vous ne pouvez plus vous inscrire aux créneaux.
                    </p>
                </div>
            )}

            <div className="flex items-center justify-between pr-2">
                <Link to={`/event/${id}`} className="flex items-center gap-2 font-semibold text-[#104e64] dark:text-[#e6dabb] shrink-0">
                    <FaArrowLeft size={12} /> Retour à l'évènement
                </Link>
                {isAdmin && (
                    <div>
                        <button
                            disabled={eventPast}
                            onClick={() => (document.getElementById('create_mission_modal') as HTMLDialogElement).showModal()}
                            className="btn border-none text-white gap-2 rounded-xl bg-[#9b6581] transition-transform active:scale-95">
                            + Nouvelle mission
                        </button>

                        <CreateMissionModal
                            eventId={event?.id}
                            onClose={() => (document.getElementById('create_mission_modal') as HTMLDialogElement).close()}
                            onSuccess={() => queryClient.refetchQueries({ queryKey: ['event', id] })} />
                    </div>

                )}
            </div>




            <div className="flex-1 overflow-y-auto scrollbar-hide">


                <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
                    {(event?.missions ?? []).map((mission: IMission) => (
                        <MissionCard
                            key={mission.id}
                            mission={mission}
                            isAdmin={isAdmin}
                            isEventPast={eventPast} />
                    ))}
                </div>


            </div>

        </div>
    )
}

export default MissionListPage
