import { useNavigate, useParams } from "react-router-dom"
import { useApi } from "../../hook/useApi"
import { FaTrashCan } from "react-icons/fa6"
import { deleteMission } from "../../services/api/mission"


interface IDeleteMissionModalProps {
    missionId: number
    missionName: string
    onSuccess: () => void
    onClose: () => void
}

const DeleteMissionModal = ({ missionId, missionName, onClose, onSuccess }: IDeleteMissionModalProps) => {

    const {id} = useParams()
    const api = useApi()
    const navigate = useNavigate()

    return (
        <dialog id={`delete_mission_modal_${missionId}`} className="modal">
            <div className="modal-box max-w-none w-full h-full rounded-none bg-[#e6dabb] dark:bg-[#1e2433] md:w-110 md:h-fit md:rounded-xl flex flex-col gap-4 items-center">

                <div className="bg-[#e6dabb] dark:bg-[#1e2433] flex flex-col gap-8 justify-between items-center rounded-lg p-4 h-full w-full">


                    <div className="flex-1 flex items-end">
                        <div className="rounded-full h-fit bg-[#ece3e3] dark:bg-[#2a3142] p-7">
                            <FaTrashCan color="#751C0D" size={30} />
                        </div>
                    </div>


                    <div className="flex-2 flex flex-col gap-3 items-center justify-center text-center text-[#104e64] dark:text-[#e6dabb]">

                        <p className="text-xl font-semibold">Supprimer cet évènement ?</p>

                        <p className="text-red-900 dark:text-red-400">
                            Cette action est irréversible.
                        </p>

                        <div className="font-semibold">
                            <p>
                                La mission :
                            </p>
                            <p className="text-lg font-bold">{missionName}</p>
                            <p>sera définitivement supprimée.</p>
                        </div>

                    </div>

                    <div className="flex items-center w-full gap-2">
                        <button onClick={() => {onClose()}} className="flex-1 rounded-xl px-3 py-2 border-2 border-zinc-400/30 dark:border-zinc-600 cursor-pointer text-[#104e64] dark:text-[#e6dabb] transition-transform active:scale-95 w-full">
                            Annuler
                        </button>
                        <button onClick={async () => {
                            await deleteMission(api, missionId)
                            onSuccess()
                            navigate(`/event/${id}/missions`)
                        }} className="flex-1 px-3 py-2 rounded-xl font-semibold bg-red-900 text-white transition-transform active:scale-95 w-full">
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

export default DeleteMissionModal