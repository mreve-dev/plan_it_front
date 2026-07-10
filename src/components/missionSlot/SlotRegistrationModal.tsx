import { useSlotRegistration } from "../../hook/mutation/use-slot-register"
import { useAuthStore } from "../../stores/authStore"
import type { IMission } from "../../types/mission.type"
import { FaCheck } from "react-icons/fa"

interface ISlotRegistrationModalProps {
    mission: IMission
    eventId: string | undefined
    isEventPast: boolean
    onClose: () => void
}
const SlotRegistrationModal = ({ mission, eventId, isEventPast, onClose }: ISlotRegistrationModalProps) => {

    const { user: currentUser } = useAuthStore()
    const { register, unregister } = useSlotRegistration(eventId)


    return (
        <dialog id={`slot_registration_modal_${mission.id}`} className="modal">
            <div className="modal-box bg-[#e6dabb] dark:bg-[#1e2433] flex flex-col gap-4">

                <h3 className="text-lg font-bold text-[#104e64] dark:text-[#e6dabb]">
                    {mission.name}
                </h3>

                <div className="flex flex-col gap-3">
                    {/* Pas de async ici : calculs simples sur des données déjà chargées, pas d'appel réseau */}
                    {mission.missionSlots.map((slot) => {

                        // L'utilisateur connecté figure-t-il déjà dans les inscrits de ce slot ?
                        const isRegistered = slot.userHasMissions?.some(uhm => uhm.userId === currentUser?.id) ?? false

                        // Nombre d'inscrits actuels, et places encore disponibles
                        const registered = slot.userHasMissions?.length ?? 0
                        const placesLeft = slot.max_volunteers - registered
                        const isFull = placesLeft <= 0

                        // Couleur du statut, cohérente avec ManageSlotView
                        const statusColor = isFull
                            ? "text-red-800 dark:text-[#ff4757]" // vert : de la place
                            : placesLeft <= 2
                                ? "text-[#8a6a20] dark:text-[#ffb84d]"
                                : "text-[#49B048] dark:text-[#3ddc97]"

                        return (
                            <div key={slot.id} className={`border-2 ${isRegistered ? 'border-[#49B048] dark:border-[#3ddc97]' : 'border-[#dbd5b2] dark:border-[#3a4150]'} rounded-xl p-3 flex justify-between items-center text-[#104e64] dark:text-[#e6dabb] bg-[#ecece6] dark:bg-white/10`}>

                                <div className="flex items-center gap-3">
                                    {/* Pastille check, visible seulement si inscrit */}
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