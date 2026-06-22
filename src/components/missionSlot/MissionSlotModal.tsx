import { useState } from "react"
import type { IMission } from "../../types/mission.type"
import ManageSlotView from "./ManageSlotView"
import CreateMissionSlotView from "./CreateMissionSlotView"

interface IMissionSlotsModalProps {
    mission: IMission
    eventId: string | undefined
    onClose: () => void
}

// Composant orchestrateur : une SEULE <dialog>, qui change de contenu selon "view".
// Ça évite d'avoir 2 <dialog> séparées qui se ferment/rouvrent (transition saccadée).
const MissionSlotsModal = ({ mission, eventId, onClose }: IMissionSlotsModalProps) => {

    // 'manage' = liste des créneaux existants, 'create' = formulaire d'ajout
    const [view, setView] = useState<'manage' | 'create'>('manage')

    const handleClose = () => {
        (document.getElementById(`mission_slots_modal_${mission.id}`) as HTMLDialogElement).close()
        setView('manage') // remet la vue par défaut pour la prochaine ouverture
        onClose()
    }

    return (
        <dialog id={`mission_slots_modal_${mission.id}`} className="modal">
            <div className="modal-box bg-[#e6dabb] dark:bg-[#1e2433] flex flex-col gap-8">

                {view === 'manage' ? (
                    <ManageSlotView
                        mission={mission}
                        onAddSlot={() => setView('create')}
                        onClose={handleClose}
                    />
                ) : (
                    <CreateMissionSlotView
                        missionId={mission.id}
                        eventId={eventId}
                        onBack={() => setView('manage')}
                    />
                )}

            </div>

            <form method="dialog" className="modal-backdrop">
                <button></button>
            </form>
        </dialog>
    )
}

export default MissionSlotsModal