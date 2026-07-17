import { FaPenToSquare, FaTrashCan } from "react-icons/fa6"
import type { IMission } from "../../types/mission.type"
import { useQueryClient } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import UpdateMissionModal from "./UpdateMissionModal"
import DeleteMissionModal from "./DeleteMissionModal"
import { FaRegCalendarCheck } from "react-icons/fa"
import MissionSlotsModal from "../missionSlot/MissionSlotModal"
import SlotRegistrationModal from "../missionSlot/SlotRegistrationModal"
import { colorsAvatar } from "../card.config"
import { capitalize, isFirstSlotOfDay } from "../../utils/slots"
import VolunteersOnSlotModal from "../missionSlot/VolunteersOnSlotModal"

interface IMissionCardProps {
    mission: IMission
    isAdmin: boolean
    isEventPast: boolean
}

const MissionCard = ({ mission, isAdmin, isEventPast }: IMissionCardProps) => {


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

            <div className="flex flex-col h-full gap-3 justify-between items-center">

                <div className="w-full flex flex-col justify-between gap-5 items-center">

                    <div className="w-full flex gap-3 items-center ">
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

                    <div className="flex flex-col gap-2 items-center">

                        <p className="text-[#104e64] dark:text-[#e6dabb] text-xl font-bold">
                            {mission.name}
                        </p>

                        <p className="text-center text-[#104e64] dark:text-[#e6dabb]">
                            {mission.description}
                        </p>

                    </div>




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
                                    {visibleSlots.map((slot, index) => {
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

                                                {isFirstSlotOfDay(visibleSlots, index) && (
                                                    <p className="text-xl font-semibold text-[#104e64] dark:text-[#e6dabb] capitalize">
                                                        {new Date(slot.date).toLocaleDateString('fr-FR', {
                                                            weekday: 'long',
                                                            day: '2-digit',
                                                            month: "long"
                                                        })}
                                                    </p>
                                                )}

                                                <div className="flex flex-col justify-between text-[#104e64] dark:text-[#e6dabb]">

                                                    <div className="flex justify-between text-[#104e64] dark:text-[#e6dabb]">
                                                        <p>
                                                            {new Date(slot.start_hour).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - {new Date(slot.end_hour).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                        <p>
                                                            {registered}/{slot.max_volunteers}
                                                        </p>

                                                    </div>

                                                </div>

                                                <div className="w-full h-2 bg-[#c8c4a0] dark:bg-[#3a4150] rounded-full overflow-hidden">
                                                    <div className={`h-full ${barColor} rounded-full transition-all`} style={{ width: `${percentage}%` }} />
                                                </div>



                                                {
                                                    slot.userHasMissions && slot.userHasMissions.length > 0 && (
                                                        <div
                                                            onClick={() => (document.getElementById(`volunteers_on_slot_modal_${slot.id}`) as HTMLDialogElement).showModal()}
                                                            className="flex flex-col gap-3 my-2 bg-[#9b6581]/60 py-2 px-3 rounded-xl cursor-pointer shadow-md shadow-[#8b506f]">


                                                            <div className="flex -space-x-3">
                                                                {slot.userHasMissions.slice(0, 3).map(uhm => (
                                                                    <div
                                                                        key={uhm.userId}
                                                                        title={`${uhm.user.firstname}${uhm.user.lastname}`}
                                                                        className={`w-8 h-8 p-4 rounded-full ${colorsAvatar(uhm.userId)} text-base font-bold flex items-center justify-center border-2 border-[#e6dabb] dark:border-[#1e2433]`}>
                                                                        {uhm.user.firstname[0]}{uhm.user.lastname[0]}
                                                                    </div>
                                                                ))}
                                                            </div>

                                                            {slot.userHasMissions.length > 3 && (
                                                                <span>
                                                                    +{slot.userHasMissions.length - 3}
                                                                </span>
                                                            )}


                                                            <div className="flex gap-2">
                                                                {slot.userHasMissions.slice(0, 3).map(uhm => (
                                                                    <div
                                                                        key={uhm.userId}
                                                                        title={`${uhm.user.firstname}${uhm.user.lastname}`}
                                                                        className="px-2 py-1 rounded-full bg-[#4f9288] text-white text-sm font-semibold flex items-center justify-center border-2 border-[#39756c] dark:border-[#1e2433]">
                                                                        {uhm.user.firstname} {uhm.user.lastname[0]}.
                                                                    </div>
                                                                ))}
                                                            </div>

                                                            <VolunteersOnSlotModal
                                                                slot={slot}
                                                                onClose={() => (document.getElementById(`volunteers_on_slot_modal_${slot.id}`) as HTMLDialogElement).close()}
                                                            />

                                                        </div>
                                                    )
                                                }

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

                </div>



                <div className="w-full flex flex-col gap-4">

                    {isAdmin && (
                        <div className="w-full">

                            <button onClick={() => (document.getElementById(`mission_slots_modal_${mission.id}`) as HTMLDialogElement).showModal()} className="btn w-full flex items-center justify-center gap-2 rounded-xl border-none bg-[#4f9288] text-white transition-transform active:scale-95">
                                <FaRegCalendarCheck /> Gérer les créneaux
                            </button>

                            <MissionSlotsModal
                                mission={mission}
                                eventId={id}
                                isEventPast={isEventPast}
                                onClose={() => { }}
                            />

                        </div>
                    )}

                    {mission.missionSlots.length > 0
                        ? (
                            <div className="w-full">
                                <button
                                    disabled={isEventPast}
                                    onClick={() => (document.getElementById(`slot_registration_modal_${mission.id}`) as HTMLDialogElement).showModal()}
                                    className="btn w-full flex items-center justify-center gap-2 rounded-xl border-none bg-[#9b6581] text-white transition-transform active:scale-95">
                                    <FaRegCalendarCheck /> Je participe
                                </button>


                                <SlotRegistrationModal
                                    mission={mission}
                                    eventId={id}
                                    isEventPast={isEventPast}
                                    onClose={() => (document.getElementById(`slot_registration_modal_${mission.id}`) as HTMLDialogElement).close()} />

                            </div>

                        )
                        : (null)}

                </div>


            </div>
        </div>
    )
}

export default MissionCard