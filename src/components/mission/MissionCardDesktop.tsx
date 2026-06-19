import { FaPenToSquare, FaTrashCan } from "react-icons/fa6"
import type { IMission } from "../../types/mission.type"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { useApi } from "../../hook/useApi"
import UpdateMissionModal from "./UpdateMissionModal"
import DeleteMissionModal from "./DeleteMissionModal"

interface IMissionCardProps {
    mission: IMission
    isAdmin: boolean
    onSuccess: () => void
    onClose: () => void
}

const MissionCardDesktop = ({ mission, isAdmin, onClose, onSuccess }: IMissionCardProps) => {

    const api = useApi()

    const { id } = useParams()

    const queryClient = useQueryClient()


    return (
        <div className="bg-[#e6dabb] flex flex-col rounded-xl p-3">

            <div className="flex flex-col gap-3 justify-between items-center">

                {/* Ne s'affiche que si l'utilisateur à le rôle administrateur !*/}
                {isAdmin && (
                    <div className="flex w-full justify-end items-center gap-2">



                        <button onClick={() => (document.getElementById(`update_mission_modal_${mission.id}`) as HTMLDialogElement).showModal()} className="flex items-center justify-center w-10 h-10 lg:w-40 lg:h-10 text-white gap-2 rounded-full bg-[#4f9288] transition-transform cursor-pointer active:scale-95">
                            <FaPenToSquare />
                            <p className="hidden lg:block">Modifier</p>
                        </button>

                        <UpdateMissionModal
                            mission={mission}
                            eventId={id}
                            onClose={() => (document.getElementById(`update_mission_modal_${mission.id}`) as HTMLDialogElement).close()}
                            onSuccess={() => queryClient.invalidateQueries({ queryKey: ['event', id] })}
                        />

                        <button onClick={() => (document.getElementById(`delete_mission_modal_${mission.id}`) as HTMLDialogElement).showModal()} className="flex items-center justify-center rounded-full w-10 h-10 lg:w-40 lg:h-10 gap-2 text-red-900 dark:text-red-400 border-2 border-red-900 dark:border-red-400 cursor-pointer transition-transform active:scale-95">
                            <FaTrashCan />
                            <p className="hidden lg:block">Supprimer</p>
                        </button>

                        <DeleteMissionModal
                            missionId={mission.id}
                            missionName={mission.name}
                            onClose={() => (document.getElementById(`delete_mission_modal_${mission.id}`) as HTMLDialogElement).close()}
                            onSuccess={() => {
                                queryClient.invalidateQueries({ queryKey: ['event', id] })
                            }}
                        />

                    </div>
                )}

                <p className="text-[#104e64] text-xl font-bold">
                    {mission.name}
                </p>

                <p className="text-center">
                    {mission.description}
                </p>

                <p>
                    {mission.missionSlots.length} créneaux
                </p>

            </div>
        </div>
    )
}

export default MissionCardDesktop
