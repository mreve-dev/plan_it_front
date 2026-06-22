import { FaTrashCan } from "react-icons/fa6"
import type { IMissionSlot } from "../../types/mission.type"
import { useMissionSlotMutation } from "../../hook/mutation/use-missionSlot.service"


interface IDeleteMissionSlotViewProps {
    slot: IMissionSlot
    eventId: string | undefined
    onBack: () => void
}

const DeleteMissionSlotView = ({ slot, eventId, onBack }: IDeleteMissionSlotViewProps) => {


    const {remove} =  useMissionSlotMutation(eventId)

    return (
        <div className="dark:bg-[#1e2433] flex flex-col gap-4 items-center">
            <div className="bg-[#e6dabb] dark:bg-[#1e2433] flex flex-col gap-8 justify-between items-center rounded-lg p-6 h-full">


                <div className="flex-1 flex items-center">
                    <div className="rounded-full h-fit bg-[#ece3e3] dark:bg-[#2a3142] p-7">
                        <FaTrashCan color="#751C0D" size={30} />
                    </div>
                </div>


                <div className="flex flex-col gap-3 text-center text-[#104e64] dark:text-[#e6dabb]">
                    <p className="text-xl font-semibold">Supprimer ce créneau ?</p>
                    <p className="text-red-900 dark:text-red-400">
                        Cette action est irréversible.
                    </p>
                    <div className="font-semibold">
                        <p>
                            Le créneau :
                        </p>
                        <p className="text-lg font-bold">Le {
                    new Date(slot.date).toLocaleDateString('fr-FR', {
                        weekday:"long",
                        day:"2-digit",
                        month:"long",
                        year:"numeric"
                    })} de {
                    new Date(slot.start_hour).toLocaleTimeString('fr-FR', {
                        hour:"2-digit",
                        minute:"2-digit"
                    })} à {
                    new Date(slot.end_hour).toLocaleTimeString('fr-FR', {
                        hour:"2-digit",
                        minute:"2-digit"
                    })}
                    </p>
                        <p>sera définitivement supprimé.</p>

                    </div>

                </div>

                <div className="flex items-center w-full gap-2">
                    <button onClick={() => onBack()} className="flex-1 rounded-xl px-3 py-2 border-2 border-zinc-400/30 dark:border-zinc-600 cursor-pointer text-[#104e64] dark:text-[#e6dabb] transition-transform active:scale-95">
                        Annuler
                    </button>
                    <button 
                    onClick={async () => {
                        try {
                            await remove.mutateAsync(slot.id)
                            onBack()
                        } catch (error) {
                            console.log("Erreur lors de la suppression du créneau", error);
                            
                        }
                    }}
                    disabled={remove.isPending} 
                    className="flex-1 px-3 py-2 rounded-xl font-semibold bg-red-900 text-white transition-transform active:scale-95">
                        {remove.isPending ? "Suppression..." : "Supprimer"}
                    </button>
                </div>
            </div>

        </div>

    )
}

export default DeleteMissionSlotView