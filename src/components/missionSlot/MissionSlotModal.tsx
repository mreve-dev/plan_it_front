import { useState } from "react"
import type { IMission, IMissionSlot } from "../../types/mission.type"
import ManageSlotView from "./ManageSlotView"
import CreateMissionSlotView from "./CreateMissionSlotView"
import UpdateMissionSlotView from "./UpdateMissionSlotView"
import DeleteMissionSlotView from "./DeleteMissionSlotView"

interface IMissionSlotsModalProps {
    mission: IMission
    eventId: string | undefined
    onClose: () => void
}

const MissionSlotsModal = ({ mission, eventId, onClose }: IMissionSlotsModalProps) => {

    const [view, setView] = useState<'manage' | 'create' | 'update' | 'delete'>('manage')
    const [selectedSlot, setSelectedSlot] = useState<IMissionSlot | null>(null) // ✅ ajouté

    const handleClose = () => {
        (document.getElementById(`mission_slots_modal_${mission.id}`) as HTMLDialogElement).close()
        setView('manage')
        setSelectedSlot(null) // ✅ remet aussi le slot sélectionné à zéro
        onClose()
    }

    return (
        <dialog id={`mission_slots_modal_${mission.id}`} className="modal">
            <div className="modal-box bg-[#e6dabb] dark:bg-[#1e2433] flex flex-col gap-8">

                {view === 'manage' ? (
                    <ManageSlotView
                        mission={mission}
                        onAddSlot={() => setView('create')}
                        onUpdateSlot={(slot) => {
                            setSelectedSlot(slot)
                            setView('update')
                        }}
                        onDeleteSlot={(slot) => {
                            setSelectedSlot(slot)
                            setView('delete')
                        }}
                        onClose={handleClose}
                    />
                ) : view === 'create' ? (
                    <CreateMissionSlotView
                        missionId={mission.id}
                        eventId={eventId}
                        onBack={() => setView('manage')}
                    />
                ) : view === 'update' ? (
                    selectedSlot && (
                        <UpdateMissionSlotView
                            slot={selectedSlot}
                            eventId={eventId}
                            onBack={() => setView('manage')}
                        />
                    )
                )
             : (
                selectedSlot && (
                        <DeleteMissionSlotView
                            slot={selectedSlot}
                            eventId={eventId}
                            onBack={() => setView('manage')}
                        />
                    )
             )}

            </div>

            <form method="dialog" className="modal-backdrop">
                <button></button>
            </form>
        </dialog>
    )
}

export default MissionSlotsModal