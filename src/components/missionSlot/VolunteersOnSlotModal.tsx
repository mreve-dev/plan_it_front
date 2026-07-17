import { colorsAvatar } from "../card.config"
import type { IMissionSlot } from "../../types/mission.type"

interface IVolunteersOnSlotModalProps {
    slot: IMissionSlot
    onClose: () => void
}

const VolunteersOnSlotModal = ({ slot, onClose }: IVolunteersOnSlotModalProps) => {

    const volunteers = slot.userHasMissions ?? []

    return (
        <dialog id={`volunteers_on_slot_modal_${slot.id}`} className="modal">
            <div className="modal-box bg-[#e6dabb] dark:bg-[#1e2433] flex flex-col gap-4">

                <div>
                    <h3 className="text-lg font-bold text-[#104e64] dark:text-[#e6dabb]">
                        Bénévoles inscrits
                    </h3>
                    <p className="text-sm text-[#5a7070] dark:text-[#8b93a7]">
                        {new Date(slot.start_hour).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - {new Date(slot.end_hour).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} · {volunteers.length}/{slot.max_volunteers}
                    </p>
                </div>

                <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
                    {volunteers.length > 0 ? (
                        volunteers.map(uhm => (
                            <div key={uhm.user.id} className="flex items-center gap-3 bg-white/50 dark:bg-white/5 rounded-xl p-3">
                                <div className={`w-9 h-9 rounded-full ${colorsAvatar(uhm.user.id)} text-sm font-bold flex items-center justify-center shrink-0`}>
                                    {uhm.user.firstname[0]}{uhm.user.lastname[0]}
                                </div>
                                <p className="font-semibold text-[#104e64] dark:text-[#e6dabb]">
                                    {uhm.user.firstname} {uhm.user.lastname}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-[#5a7070] dark:text-[#8b93a7] text-center py-4">
                            Aucun bénévole inscrit pour le moment
                        </p>
                    )}
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        onClose()
                    }} className="btn btn-sm border-none self-end bg-transparent shadow-none text-base text-[#104e64] dark:text-[#e6dabb] focus:outline-none">
                    Fermer
                </button>
            </div>

            <form method="dialog" className="modal-backdrop">
                <button></button>
            </form>
        </dialog>
    )
}

export default VolunteersOnSlotModal