import { FaPenToSquare, FaTrashCan } from "react-icons/fa6"
import type { IMission } from "../../types/mission.type"
import { useQueryClient } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import UpdateMissionModal from "./UpdateMissionModal"
import DeleteMissionModal from "./DeleteMissionModal"
import { FaRegCalendarCheck } from "react-icons/fa"
import MissionSlotsModal from "../missionSlot/MissionSlotModal"
import SlotRegistrationModal from "../missionSlot/SlotRegistrationModal"

interface IMissionCardProps {
    mission: IMission
    isAdmin: boolean
    onSuccess?: () => void
    onClose?: () => void
}

const MissionCard = ({ mission, isAdmin, onClose, onSuccess }: IMissionCardProps) => {


    const { id } = useParams()

    const queryClient = useQueryClient()

    // calcul pour la jauge circulaire

    const totalRegistered = mission.missionSlots.reduce((acc, slot) => acc + (slot.userHasMissions?.length ?? 0), 0)
    const totalPlaces = mission.missionSlots.reduce((acc, slot) => acc + slot.max_volunteers, 0)

    const percentage = totalPlaces > 0 ? (totalRegistered / totalPlaces) * 100 : 0
    const circumference = 2 * Math.PI * 26 // rayon de 26
    const offset = circumference - (percentage / 100) * circumference

    const gaugeColor = percentage >= 100
        ? "#ff4757" // complet
        : percentage >= 66
            ? "#ffb84d" // presque complet
            : "#4f9288" // de la place


    // Pour la barre de progression

    const maxDisplayedSlots = 3
    const visibleSlots = mission.missionSlots.slice(0, maxDisplayedSlots)
    const remainingCount = mission.missionSlots.length - maxDisplayedSlots

    return (
        <div className="bg-[#e6dabb] dark:bg-[#1e2433] flex flex-col justify-between rounded-xl p-5">

            <div className="flex flex-col h-full gap-5 justify-between items-center">
                <div className="w-full flex gap-3 items-center justify-between">
                    {
                        mission.missionSlots.length > 0
                            ? (<p className="text-[#104e64] flex-1 text-left dark:text-[#e6dabb] font-bold">
                                {mission.missionSlots.length} créneaux
                            </p>)
                            : null
                    }


                    {/* Ne s'affiche que si l'utilisateur à le rôle administrateur !*/}
                    {isAdmin && (

                        <div className="flex flex-1 w-full justify-end items-center gap-2">

                            <button onClick={() => (document.getElementById(`update_mission_modal_${mission.id}`) as HTMLDialogElement).showModal()} className="flex items-center justify-center w-10 h-10 text-white gap-2 rounded-full bg-[#4f9288] transition-transform cursor-pointer active:scale-95">
                                <FaPenToSquare />
                            </button>

                            <UpdateMissionModal
                                mission={mission}
                                eventId={id}
                                onClose={() => (document.getElementById(`update_mission_modal_${mission.id}`) as HTMLDialogElement).close()}
                                onSuccess={() => queryClient.invalidateQueries({ queryKey: ['event', id] })}
                            />

                            <button onClick={() => (document.getElementById(`delete_mission_modal_${mission.id}`) as HTMLDialogElement).showModal()} className="flex items-center justify-center rounded-full w-10 h-10 gap-2 text-red-900 dark:text-red-400 border-2 border-red-900 dark:border-red-400 cursor-pointer transition-transform active:scale-95">
                                <FaTrashCan />
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

                </div>


                <p className="text-[#104e64] dark:text-[#e6dabb] text-xl font-bold">
                    {mission.name}
                </p>

                <p className="text-center text-[#104e64] dark:text-[#e6dabb]">
                    {mission.description}
                </p>

                {/* Jauge circulaire */}

                <div className="relative w-16 h-16">
                    <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
                        <circle cx="32" cy="32" r="26" fill="none" stroke="#c8c4a0" strokeWidth="6" />
                        <circle
                            cx="32" cy="32" r="26" fill="none"
                            stroke={gaugeColor}
                            strokeWidth="6"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                        />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-[#104e64] dark:text-[#e6dabb]">
                        {totalRegistered}/{totalPlaces}
                    </span>
                </div>

                {
                    mission.missionSlots.length > 0
                        ? (
                            <div className="flex flex-col gap-2 items-center w-full">
                                {visibleSlots.map(slot => {
                                    const registered = slot.userHasMissions?.length ?? 0
                                    const placesLeft = slot.max_volunteers - registered
                                    const percentage = Math.min((registered / slot.max_volunteers) * 100, 100)

                                    const barColor = placesLeft > 0
                                        ? "bg-[#49B048] dark:bg-[#3ddc97]"
                                        : placesLeft === 0
                                            ? "bg-[#8a6a20] dark:bg-[#ffb84d]"
                                            : "bg-red-800 dark:bg-[#ff4757]"

                                    return (
                                        <div key={slot.id} className="flex flex-col gap-1 w-full">
                                            <div className="flex justify-between text-[#104e64] dark:text-[#e6dabb]">
                                                <span>
                                                    {new Date(slot.start_hour).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - {new Date(slot.end_hour).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                <span>{registered}/{slot.max_volunteers}</span>
                                            </div>

                                            <div className="w-full h-2 bg-[#c8c4a0] dark:bg-[#3a4150] rounded-full overflow-hidden">
                                                <div className={`h-full ${barColor} rounded-full transition-all`} style={{ width: `${percentage}%` }} />
                                            </div>
                                        </div>
                                    )
                                })}

                                {remainingCount > 0 && (
                                    <button
                                        onClick={() => (document.getElementById(`mission_slots_modal_${mission.id}`) as HTMLDialogElement).showModal()}
                                        className="text-xs text-[#9b6581] dark:text-[#c48aaa] font-semibold self-center hover:underline">
                                        + {remainingCount} autre(s) créneau(x)
                                    </button>
                                )}

                            </div>

                        )
                        : (<p className="text-xs text-[#5a7070] dark:text-[#a0a8a8]">
                            Aucun créneau pour le moment
                        </p>)
                }





                {isAdmin && (
                    <div className="w-full">

                        <button onClick={() => (document.getElementById(`mission_slots_modal_${mission.id}`) as HTMLDialogElement).showModal()} className="btn w-full flex items-center justify-center gap-2 rounded-xl border-none bg-[#4f9288] text-white transition-transform active:scale-95">
                            <FaRegCalendarCheck /> Gérer les créneaux
                        </button>

                        <MissionSlotsModal
                            mission={mission}
                            eventId={id}
                            onClose={() => { }}
                        />

                    </div>
                )}

                {mission.missionSlots.length > 0
                    ? (
                        <div className="w-full">
                            <button onClick={() => (document.getElementById(`slot_registration_modal_${mission.id}`) as HTMLDialogElement).showModal()} className="btn w-full flex items-center justify-center gap-2 rounded-xl border-none bg-[#9b6581] text-white transition-transform active:scale-95">
                            <FaRegCalendarCheck /> Je participe
                        </button>


                        <SlotRegistrationModal 
                        mission={mission}
                        eventId={id}
                        onClose={() => (document.getElementById(`slot_registration_modal_${mission.id}`) as HTMLDialogElement).close()}/>

                        </div>
                        
                    )
                    : (null)}
            </div>
        </div>
    )
}

export default MissionCard