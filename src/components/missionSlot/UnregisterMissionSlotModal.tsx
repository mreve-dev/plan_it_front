import { FaSignOutAlt } from "react-icons/fa"


interface IUnregisterMissionSlotModalProps {
    missionName: string | undefined
    eventName: string | undefined
    date: string | undefined
    startHour: string | undefined
    endHour: string | undefined
    onConfirm: () => void
    onClose: () => void
}

const UnregisterMissionSlotModal = ({ missionName, eventName, date, startHour, endHour, onClose, onConfirm }: IUnregisterMissionSlotModalProps) => {


    return (
        <dialog id={`unregister_mission_slot`} className="modal">
            <div className="modal-box bg-[#e6dabb] dark:bg-[#1e2433] max-w-100 flex flex-col gap-4 items-center">
                <div className="bg-[#e6dabb] dark:bg-[#1e2433] flex flex-col gap-8 justify-between items-center rounded-lg h-full">

                    <p className="text-xl font-semibold text-[#0f6e56] dark:text-[#75cabd]">
                        Evenement : {eventName}
                    </p>

                    <div className="flex-1 flex items-center">
                        <div className="rounded-full h-fit bg-[#ece3e3] dark:bg-[#2a3142] p-4">
                            <FaSignOutAlt className="text-[#993556] dark:text-[#d99cb7]" size={25} />
                        </div>
                    </div>


                    <div className="flex flex-col gap-3 text-center text-[#104e64] dark:text-[#e6dabb]">
                        <p className="text-xl font-semibold">Te désinscrire de ce créneau ?</p>
                        <p className="text-[#993556] dark:text-[#d99cb7]">
                            Cette place sera libérée pour un autre bénévole.
                        </p>


                        <div className="font-semibold">
                            <p className="text-lg font-bold">{missionName}</p>
                            {date && startHour && endHour && (
                                <p className="text-sm font-normal text-[#5a7070] dark:text-[#8b93a7]">
                                    {new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long' })} · {new Date(startHour).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - {new Date(endHour).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center w-full gap-2">
                        <button onClick={onClose} className="flex-1 rounded-xl px-3 py-2 border-2 border-[#104e64]/20 dark:border-[#e6dabb]/20 cursor-pointer text-[#104e64] dark:text-[#e6dabb] transition-transform active:scale-95">
                            Annuler
                        </button>

                        <button onClick={onConfirm} className="flex-1 px-3 py-2 rounded-xl font-semibold bg-[#993556] dark:bg-[#d99cb7] text-white dark:text-[#4b1528] transition-transform active:scale-95">
                            Me désinscrire
                        </button>
                    </div>
                </div>

            </div>

            <form method="dialog" className="modal-backdrop">
                <button></button>
            </form>

        </dialog>
    )
}

export default UnregisterMissionSlotModal