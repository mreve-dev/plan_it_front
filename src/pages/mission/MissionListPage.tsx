import { FaArrowLeft } from "react-icons/fa"
import { Link, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { useApi } from "../../hook/useApi"
import { useAuthStore } from "../../stores/authStore"
import { getOneEvent } from "../../services/api/event"
import type { IMission } from "../../types/mission.type"
import MissionCard from "../../components/mission/MissionCard"

const MissionListPage = () => {

    const api = useApi()

    const { id } = useParams()
    const { user: currentUser } = useAuthStore()

    const isAdmin = currentUser?.role === "admin"

    const { data: event } = useQuery({
        queryKey: ['event', id],
        queryFn: () => getOneEvent(api, +id!)
    })

    return (
        <div className="h-full py-4 pl-4 bg-[#ecece6] dark:bg-[#161b27] flex-1 flex flex-col gap-5">
            <Link to={`/event/${id}`} className="flex items-center gap-2 font-semibold text-[#104e64] dark:text-[#e6dabb] shrink-0">
                    <FaArrowLeft size={12} /> Retour à l'évènement
                </Link>


            <div className="flex-1 overflow-y-auto">
                

                <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
                    {(event?.missions ?? []).map((mission: IMission) => (
                        <MissionCard key={mission.id} mission={mission} isAdmin={isAdmin} />
                    ))}
                </div>


            </div>

        </div>
    )
}

export default MissionListPage
