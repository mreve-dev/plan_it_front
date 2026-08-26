import { useNavigate } from "react-router-dom"
import { useApi } from "../../hook/useApi"
import { FaTrashCan } from "react-icons/fa6"
import { deleteEvent } from "../../services/api/event"


interface IDeleteEventModalProps {
    eventId: number
    eventName: string
    onSuccess: () => void
    onClose: () => void
}

const DeleteEventModal = ({ eventId, eventName, onClose, onSuccess }: IDeleteEventModalProps) => {
    const api = useApi()
    const navigate = useNavigate()

    return (
        <dialog id="delete_modal" className="modal">

            <div className="modal-box max-w-none rounded-none bg-[#e6dabb] dark:bg-[#1e2433] w-screen h-screen md:w-120 md:h-150 md:rounded-2xl flex flex-col items-center">

                <div className="dark:bg-[#1e2433] flex flex-col gap-5 justify-evenly p-4 md:p-7 h-full w-full items-center">


                    <div className="flex-1 flex items-center">
                        <div className="rounded-full h-fit bg-[#ece3e3] dark:bg-[#2a3142] p-7">
                            <FaTrashCan color="#751C0D" size={30} />
                        </div>
                    </div>


                    <div className="flex-1 flex flex-col gap-6 text-center text-[#104e64] dark:text-[#e6dabb]">
                        <p className="text-xl font-semibold">Supprimer cet évènement ?</p>
                        <p className="text-red-900 dark:text-red-400">
                            Cette action est irréversible.
                        </p>

                        <div className="font-semibold flex flex-col gap-2">
                            <p>
                                L'évènement :
                            </p>
                            <p className="text-lg font-bold">{eventName}</p>
                            <p>sera définitivement supprimé.</p>

                        </div>

                    </div>

                    <div className="flex items-center w-full gap-2">
                        <button onClick={() => {onClose()}} className="flex-1 rounded-xl px-3 py-2 border-2 border-zinc-400/30 dark:border-zinc-600 text-[#104e64] dark:text-[#e6dabb] transition-transform active:scale-95">
                            Annuler
                        </button>
                        <button onClick={async () => {
                            await deleteEvent(eventId, api)
                            onSuccess()
                            navigate('/event')
                        }} className="flex-1 px-3 py-2 rounded-xl font-semibold bg-red-900 text-white transition-transform active:scale-95">
                            Supprimer
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

export default DeleteEventModal