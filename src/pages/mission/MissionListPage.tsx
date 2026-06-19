import { FaArrowLeft } from "react-icons/fa"
import { Link, useParams } from "react-router-dom"
import MissionCardDesktop from "../../components/mission/MissionCardDesktop"
import { useQuery } from "@tanstack/react-query"
import { useApi } from "../../hook/useApi"
import { useAuthStore } from "../../stores/authStore"
import { getOneEvent } from "../../services/api/event"
import type { IMission } from "../../types/mission.type"
import { FaPenToSquare, FaTrashCan } from "react-icons/fa6"

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
        <div className="h-full p-4 bg-[#ecece6] dark:bg-[#161b27] flex-1">


            <div className="flex flex-col gap-5 justify-between">
                <Link to={`/event/${id}`} className="flex items-center gap-2 font-semibold text-[#104e64] dark:text-[#e6dabb]">
                    <FaArrowLeft size={12} /> Retour à l'évènement
                </Link>

                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6">
                    {(event?.missions ?? []).map((mission: IMission) => (
                        <MissionCardDesktop key={mission.id} mission={mission} isAdmin={isAdmin} />
                    ))}
                </div>


            </div>

        </div>
    )
}

export default MissionListPage
