import { useState } from "react"
import type { IMission, IMissionSlot } from "../../types/mission.type"
import ManageSlotView from "./ManageSlotView"
import UpdateMissionSlotView from "./UpdateMissionSlotView"
import DeleteMissionSlotView from "./DeleteMissionSlotView"
import CreateOrDuplicateMissionSlotView from "./CreateOrDuplicateMissionSlotView"

interface IMissionSlotsModalProps {
    mission: IMission
    eventId: string | undefined
    isEventPast: boolean
    onClose: () => void
}

const MissionSlotsModal = ({ mission, eventId, isEventPast, onClose }: IMissionSlotsModalProps) => {

    const [view, setView] = useState<'manage' | 'create' | 'update' | 'delete'>('manage')
    const [selectedSlot, setSelectedSlot] = useState<IMissionSlot | null>(null) // ✅ ajouté

    const [duplicateValues, setDuplicateValues] = useState<{
        date: Date
        start_hour: string
        end_hour: string
        max_volunteers: number
    } | null>(null)


    //Créer un handler onDuplicateSlot qui reçoit le créneau depuis ManageSlotView, convertit les heures (Date → "HH:mm")
    const handleDuplicateSlot = (slot: IMissionSlot) => {
        const toHHmm = (d: Date | string) => {
            const date = new Date(d)
            const hh = date.getHours().toString().padStart(2, '0')
            const mm = date.getMinutes().toString().padStart(2, '0')
            return `${hh}:${mm}`
        }

        setDuplicateValues({
            date: new Date(slot.date),
            start_hour: toHHmm(slot.start_hour),
            end_hour: toHHmm(slot.end_hour),
            max_volunteers: slot.max_volunteers
        })
        setView('create')
    }

    const handleClose = () => {
        (document.getElementById(`mission_slots_modal_${mission.id}`) as HTMLDialogElement).close()
        setView('manage')
        setSelectedSlot(null) // ✅ remet aussi le slot sélectionné à zéro
        setDuplicateValues(null)
        onClose()
    }


    return (
        <dialog id={`mission_slots_modal_${mission.id}`} className="modal">
            <div className="modal-box max-w-none w-full h-full rounded-none md:w-120 md:h-fit md:rounded-xl bg-[#e6dabb] dark:bg-[#1e2433] p-7 flex flex-col gap-8">

                {view === 'manage' ? (
                    <ManageSlotView
                        mission={mission}
                        isEventPast={isEventPast}
                        onAddSlot={() => setView('create')}
                        onUpdateSlot={(slot) => {
                            setSelectedSlot(slot)
                            setView('update')
                        }}
                        onDuplicateSlot={handleDuplicateSlot}
                        onDeleteSlot={(slot) => {
                            setSelectedSlot(slot)
                            setView('delete')
                        }}
                        onClose={handleClose}
                    />
                ) : view === 'create' ? (
                    <CreateOrDuplicateMissionSlotView
                        missionId={mission.id}
                        eventId={eventId}
                        initialValues={duplicateValues ?? undefined}
                        onBack={() => {
                            setDuplicateValues(null)
                            setView('manage')
                        }}
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
                <button onClick={handleClose}></button>
            </form>
            
        </dialog>
    )
}

export default MissionSlotsModal