import { useSlotRegistration } from "../../hook/mutation/use-slot-register"
import { useAuthStore } from "../../stores/authStore"
import type { IMission, IMissionSlot } from "../../types/mission.type"
import { FaCheck } from "react-icons/fa"
import { FaRegCalendarCheck } from "react-icons/fa6"

interface ISlotRegistrationModalProps {
    mission: IMission
    eventId: string | undefined
    isEventPast: boolean
    onClose: () => void
}
const SlotRegistrationModal = ({ mission, eventId, isEventPast, onClose }: ISlotRegistrationModalProps) => {

    const { user: currentUser } = useAuthStore()
    const { register, unregister } = useSlotRegistration(eventId)

    // On trie les créneaux par date/heure avant affichage, pour que le regroupement par jour fonctionne correctement
    const sortedSlots = [...mission.missionSlots].sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    // On regroupe les créneaux triés par jour : { "2026-07-14": [slot1, slot2], "2026-07-17": [slot3] }
    const groupedByDate = sortedSlots.reduce((groups, slot) => {
        const dateKey = new Date(slot.date).toDateString()
        if (!groups[dateKey]) {
            groups[dateKey] = []
        }
        groups[dateKey].push(slot)
        return groups
    }, {} as Record<string, IMissionSlot[]>)

    return (
        <dialog id={`slot_registration_modal_${mission.id}`} className="modal">
            <div className="modal-box bg-[#e6dabb] dark:bg-[#1e2433] flex flex-col gap-4">

                <h3 className="text-lg font-bold text-[#104e64] dark:text-[#e6dabb]">
                    {mission.name}
                </h3>

                <div className="flex flex-col gap-6 overflow-y-auto scrollbar-hide">


                    {Object.entries(groupedByDate).map(([dateKey, slotsForDay]) => (
                        <div key={dateKey} className="flex flex-col gap-2">

                            <p className="text-lg sm:text-xl font-semibold text-[#104e64] dark:text-[#e6dabb] capitalize flex items-center gap-2">
                                <FaRegCalendarCheck />
                                {new Date(dateKey).toLocaleDateString('fr-FR', {
                                    weekday: 'long',
                                    day: '2-digit',
                                    month: "long"
                                })}
                            </p>

                            <div className="flex flex-col gap-3">
                                {slotsForDay.map((slot) => {

                                    const isRegistered = slot.userHasMissions?.some(uhm => uhm.userId === currentUser?.id) ?? false
                                    const registered = slot.userHasMissions?.length ?? 0
                                    const placesLeft = slot.max_volunteers - registered
                                    const isFull = placesLeft <= 0

                                    const statusColor = isFull
                                        ? "text-red-800 dark:text-[#ff4757]"
                                        : placesLeft <= 2
                                            ? "text-[#8a6a20] dark:text-[#ffb84d]"
                                            : "text-[#49B048] dark:text-[#3ddc97]"

                                    return (
                                        <div key={slot.id} className={`border-2 ${isRegistered ? 'border-[#49B048] dark:border-[#3ddc97]' : 'border-[#dbd5b2] dark:border-[#3a4150]'} rounded-xl p-3 flex justify-between items-center text-[#104e64] dark:text-[#e6dabb] bg-[#ecece6] dark:bg-white/10`}>

                                            <div className="flex items-center gap-3">
                                                {isRegistered && (
                                                    <div className="w-7 h-7 rounded-full bg-[#49B048] dark:bg-[#3ddc97] flex items-center justify-center shrink-0">
                                                        <FaCheck size={12} className="text-white dark:text-[#1e2433]" />
                                                    </div>
                                                )}

                                                <div>
                                                    <p>
                                                        {new Date(slot.start_hour).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - {new Date(slot.end_hour).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                    <p className={`text-sm font-semibold ${isRegistered ? 'text-[#49B048] dark:text-[#3ddc97]' : statusColor}`}>
                                                        {isRegistered
                                                            ? "Tu es inscrit(e)"
                                                            : isFull
                                                                ? `Complet — ${registered} sur ${slot.max_volunteers}`
                                                                : `${placesLeft} place(s) restante(s) sur ${slot.max_volunteers}`
                                                        }
                                                    </p>
                                                </div>
                                            </div>

                                            {isRegistered ? (
                                                <button onClick={() => unregister.mutate({ slotId: slot.id, userId: currentUser!.id })} disabled={unregister.isPending} className="bg-red-800 dark:bg-red-700 text-white px-3 py-2 rounded-xl disabled:opacity-50">
                                                    Se désinscrire
                                                </button>
                                            ) : (
                                                <button onClick={() => register.mutate(slot.id)} disabled={isFull || register.isPending || isEventPast} className="bg-[#9b6581] dark:bg-[#7a4f63] text-white px-3 py-2 rounded-xl disabled:opacity-50">
                                                    {isFull ? "Complet" : "S'inscrire"}
                                                </button>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={onClose} className="btn btn-sm self-end bg-transparent text-base btn-ghost text-[#104e64] dark:text-[#e6dabb]">
                    Fermer
                </button>
            </div>

            <form method="dialog" className="modal-backdrop">
                <button></button>
            </form>
        </dialog>
    )
}

export default SlotRegistrationModal