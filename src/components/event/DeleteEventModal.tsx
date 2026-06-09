import { useNavigate } from "react-router-dom"
import { useApi } from "../../hook/useApi"
import { FaTrashCan } from "react-icons/fa6"
import { deleteEvent } from "../../services/api/event"


interface IDeleteEventModalProps {
    eventId: number
    eventName: string
}

const DeleteEventModal = ({ eventId, eventName }: IDeleteEventModalProps) => {
    const api = useApi()
    const navigate = useNavigate()

    return (
        <dialog id="delete_modal" className="modal">
            <div className="modal-box bg-[#e6dabb] w-100 flex flex-col gap-4 items-center">
                <div className="bg-[#e6dabb] flex flex-col gap-8 justify-between items-center rounded-lg p-6 h-full">

                    <div className="flex-1 flex items-center">
                        <div className="rounded-full h-fit bg-[#ece3e3] p-7">
                            <FaTrashCan color="#751C0D" size={30} />
                        </div>

                    </div>


                    <div className="flex flex-col gap-3 text-center text-[#104e64]">
                        <p className="text-xl font-semibold">Supprimer cet évènement ?</p>
                        <p className="text-red-900">
                            Cette action est irréversible.
                        </p>
                        <div className="font-semibold">
                            <p>
                                L'évènement :
                            </p>
                            <p className="text-lg font-bold">{eventName}</p>
                            <p>sera définitivement supprimé.</p>

                        </div>

                    </div>

                    <div className="flex items-center w-full gap-2">
                        <button onClick={() => {
                           (document.getElementById('delete_modal') as HTMLDialogElement).close()

                        }} className="flex-1 rounded-xl px-3 py-2 border-2 border-zinc-400/30 text-[#104e64] transition-transform active:scale-95">
                            Annuler
                        </button>
                        <button onClick={async () => {
                            await deleteEvent(eventId, api)
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
